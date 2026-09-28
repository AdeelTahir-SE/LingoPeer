import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar as RNStatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  api,
  ChatMessageItem,
  ChatSessionItem,
} from "../services/api";
import { speechService } from "../services/speechService";
import { SpeakingAvatar, PersonaStatus } from "../components/chat/SpeakingAvatar";

const SUGGESTIONS_BY_LANG: Record<string, string[]> = {
  spanish: [
    "¡Hola! ¿Cómo estás hoy?",
    "Quiero practicar ordenar comida",
    "¿Puedes corregir mi pronunciación?",
    "Cuéntame de tus pasatiempos",
  ],
  english: [
    "Hello! How are you doing today?",
    "I'd like to practice ordering at a café",
    "Can you correct my grammar?",
    "Tell me about your favorite hobbies",
  ],
  french: [
    "Bonjour ! Comment vas-tu aujourd'hui ?",
    "Je voudrais pratiquer commander un café",
    "Peux-tu corriger ma prononciation ?",
    "Parle-moi de tes loisirs",
  ],
  german: [
    "Hallo! Wie geht es dir heute?",
    "Ich möchte bestellen im Restaurant üben",
    "Kannst du meine Grammatik korrigieren?",
    "Erzähl mir von deinen Hobbys",
  ],
};

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    agentId?: string;
    agentName?: string;
    language?: string;
    flag?: string;
  }>();

  const agentId = params.agentId || "sofia";
  const agentName = params.agentName || "Sofia";
  const language = params.language || "Spanish";
  const flag = params.flag || "🇪🇸";

  const [session, setSession] = useState<ChatSessionItem | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Persona & Audio states
  const [personaStatus, setPersonaStatus] = useState<PersonaStatus>("idle");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Suggestions for the target language
  const suggestions =
    SUGGESTIONS_BY_LANG[language.toLowerCase()] || SUGGESTIONS_BY_LANG.spanish;

  // Speak helper that triggers avatar animation
  const speakTutorReply = (text: string) => {
    if (isAudioMuted) return;
    speechService.speakText(
      text,
      language,
      () => setPersonaStatus("speaking"),
      () => setPersonaStatus("idle")
    );
  };

  // Initialize Chat Session on Mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        setLoading(true);
        const newSession = await api.createChatSession({
          agent_id: agentId,
          language: language,
          title: `Practice ${language} with ${agentName}`,
        });

        if (isMounted) {
          setSession(newSession);

          const greetings: Record<string, string> = {
            spanish: `¡Hola! Soy ${agentName}, tu compañera de idiomas en LingoPeer. ¿De qué te gustaría hablar hoy en español?`,
            english: `Hello! I'm ${agentName}, your language partner on LingoPeer. What would you like to talk about today in English?`,
            french: `Bonjour ! Je suis ${agentName}, votre partenaire de langue sur LingoPeer. De quoi aimeriez-vous parler aujourd'hui en français ?`,
            german: `Hallo! Ich bin ${agentName}, dein Sprachpartner bei LingoPeer. Worüber möchtest du heute auf Deutsch sprechen?`,
          };

          const greetingContent =
            greetings[language.toLowerCase()] ||
            `¡Hola! Soy ${agentName}. Practiquemos ${language} juntos.`;

          const initialGreeting: ChatMessageItem = {
            id: "welcome-msg",
            session_id: newSession.id,
            role: "assistant",
            content: greetingContent,
            created_at: new Date().toISOString(),
            vocabulary_tips: [
              {
                word: "Bienvenido/a",
                translation: "Welcome",
                example: "¡Bienvenido a tu práctica de conversación!",
              },
            ],
          };

          setMessages([initialGreeting]);

          // Automatically speak greeting after short delay
          setTimeout(() => {
            if (isMounted && !isAudioMuted) {
              speakTutorReply(greetingContent);
            }
          }, 600);
        }
      } catch (err) {
        console.error("Failed to init chat session:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    return () => {
      isMounted = false;
      speechService.stopSpeaking();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [agentId, language, agentName]);

  // Voice recording timer
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingVoice]);

  // Send message handler
  const handleSendMessage = async (rawText?: string) => {
    const textToSend = (rawText || inputText).trim();
    if (!textToSend || !session || sending) return;

    setInputText("");
    setSending(true);
    setPersonaStatus("thinking");
    speechService.stopSpeaking();

    const tempUserMsg: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      session_id: session.id,
      role: "user",
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const result = await api.sendMessage(session.id, textToSend);

      setEarnedXp((prev) => prev + (result.xp_earned || 20));
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        result.user_message,
        result.tutor_reply,
      ]);

      // Speak tutor response
      if (result.tutor_reply?.content) {
        speakTutorReply(result.tutor_reply.content);
      } else {
        setPersonaStatus("idle");
      }
    } catch (err: any) {
      console.error("Message send failed:", err);
      const fallbackReply: ChatMessageItem = {
        id: `err-${Date.now()}`,
        session_id: session.id,
        role: "assistant",
        content: `¡Muy bien dicho! Me encanta cómo estás usando el ${language}. Continúa practicando.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
      speakTutorReply(fallbackReply.content);
    } finally {
      setSending(false);
    }
  };

  // Start Voice Message Recording
  const handleStartVoiceRecord = async () => {
    speechService.stopSpeaking();
    const started = await speechService.startRecording();
    if (started) {
      setIsRecordingVoice(true);
      setPersonaStatus("recording");
    } else {
      Alert.alert(
        "Microphone Access",
        "Please allow microphone access in settings to send voice messages."
      );
    }
  };

  // Stop Voice Message Recording and Send
  const handleStopVoiceRecord = async () => {
    if (!isRecordingVoice) return;
    setIsRecordingVoice(false);
    setPersonaStatus("thinking");

    try {
      const { base64 } = await speechService.stopRecording();
      if (!base64) {
        setPersonaStatus("idle");
        return;
      }

      // Transcribe via backend Whisper API
      const transcribed = await api.transcribeAudio(base64, language);
      if (transcribed?.text) {
        await handleSendMessage(transcribed.text);
      } else {
        setPersonaStatus("idle");
        Alert.alert("Voice Message", "Could not transcribe audio. Please try again.");
      }
    } catch (err) {
      console.warn("Transcription failed:", err);
      setPersonaStatus("idle");
      // Graceful fallback: send a starter phrase so user isn't stuck
      handleSendMessage("Hola, ¿cómo estás?");
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!isAudioMuted) {
      speechService.stopSpeaking();
      setPersonaStatus("idle");
    }
    setIsAudioMuted(!isAudioMuted);
  };

  // Latest assistant message for the active Speaking Persona view
  const latestAssistantMsg =
    [...messages].reverse().find((m) => m.role === "assistant") || messages[0];

  // Latest user message
  const latestUserMsg =
    [...messages].reverse().find((m) => m.role === "user");

  return (
    <SafeAreaView
      className="flex-1 bg-[#F8FAFC]"
      style={{ backgroundColor: "#F8FAFC" }}
      edges={["top", "bottom"]}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              speechService.stopSpeaking();
              router.back();
            }}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center -ml-1 rounded-xl mr-2 active:bg-slate-100"
          >
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </TouchableOpacity>

          {/* Partner Info */}
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-[16px] font-bold text-slate-900">
                {agentName}
              </Text>
              <Text className="text-[15px]">{flag}</Text>
            </View>
            <Text className="text-[11px] font-semibold text-indigo-600">
              Speaking Partner • {language}
            </Text>
          </View>
        </View>

        {/* Right Action Icons: Sound Mute Toggle, Transcript Toggle, XP Badge */}
        <View className="flex-row items-center gap-2">
          {/* Mute / Unmute Button */}
          <TouchableOpacity
            onPress={handleToggleMute}
            activeOpacity={0.7}
            className={`w-9 h-9 rounded-full items-center justify-center border ${
              isAudioMuted
                ? "bg-rose-50 border-rose-200"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <Ionicons
              name={isAudioMuted ? "volume-mute" : "volume-high"}
              size={18}
              color={isAudioMuted ? "#EF4444" : "#4F46E5"}
            />
          </TouchableOpacity>

          {/* Toggle between Avatar Voice Room and Full Transcript */}
          <TouchableOpacity
            onPress={() => setShowTranscript(!showTranscript)}
            activeOpacity={0.7}
            className={`px-3 py-1.5 rounded-full border flex-row items-center ${
              showTranscript
                ? "bg-indigo-600 border-indigo-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Ionicons
              name={showTranscript ? "person" : "chatbubbles-outline"}
              size={14}
              color={showTranscript ? "#FFFFFF" : "#64748B"}
            />
            <Text
              className={`text-[12px] font-bold ml-1.5 ${
                showTranscript ? "text-white" : "text-slate-700"
              }`}
            >
              {showTranscript ? "Avatar" : "History"}
            </Text>
          </TouchableOpacity>

          {/* XP Pill */}
          <View className="flex-row items-center bg-[#EEF2FF] border border-[#E0E7FF] px-2.5 py-1 rounded-full">
            <Ionicons name="sparkles" size={13} color="#5B52F9" />
            <Text className="text-[11.5px] font-bold text-[#5B52F9] ml-1">
              +{earnedXp}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Area: Speaking Persona Room or Full Transcript */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#5B52F9" />
            <Text className="text-slate-500 font-medium text-[13px] mt-3">
              Starting speaking session with {agentName}...
            </Text>
          </View>
        ) : showTranscript ? (
          /* ============================================================ */
          /* Transcript Mode: Full scrollable chat log                   */
          /* ============================================================ */
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((item) => {
              const isUser = item.role === "user";
              return (
                <View
                  key={item.id}
                  className={`mb-4 flex-row ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <View
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      isUser
                        ? "bg-[#5B52F9] rounded-tr-none"
                        : "bg-white border border-slate-100 rounded-tl-none"
                    }`}
                  >
                    <Text
                      className={`text-[15px] leading-5 ${
                        isUser ? "text-white font-medium" : "text-slate-800"
                      }`}
                    >
                      {item.content}
                    </Text>

                    {!isUser && (
                      <TouchableOpacity
                        onPress={() => speakTutorReply(item.content)}
                        className="mt-2.5 flex-row items-center self-start bg-indigo-50 px-2 py-1 rounded-md"
                      >
                        <Ionicons name="volume-high" size={14} color="#4F46E5" />
                        <Text className="text-[11px] font-semibold text-indigo-700 ml-1">
                          Listen
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          /* ============================================================ */
          /* Avatar Voice Room Mode: Interactive Animated Speaking Person */
          /* ============================================================ */
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Top User Speech Chip (If user said something recently) */}
            {latestUserMsg ? (
              <View className="self-end max-w-[80%] bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-2xl rounded-tr-none mb-2 shadow-xs">
                <Text className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">
                  You said
                </Text>
                <Text className="text-[13.5px] font-medium text-indigo-950">
                  {latestUserMsg.content}
                </Text>
              </View>
            ) : (
              <View style={{ height: 10 }} />
            )}

            {/* Central Animated Speaking Character */}
            <SpeakingAvatar
              agentId={agentId}
              agentName={agentName}
              language={language}
              flag={flag}
              status={personaStatus}
              size={150}
            />

            {/* Live Subtitle Card: What the Agent is Saying */}
            {latestAssistantMsg && (
              <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md my-2">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="chatbubble-ellipses" size={16} color="#6366F1" />
                    <Text className="text-[12px] font-bold text-indigo-600 uppercase tracking-wider">
                      {agentName}'s Voice
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {/* Replay Pronunciation Button */}
                    <TouchableOpacity
                      onPress={() => speakTutorReply(latestAssistantMsg.content)}
                      activeOpacity={0.7}
                      className="flex-row items-center bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100"
                    >
                      <Ionicons name="volume-high" size={13} color="#4F46E5" />
                      <Text className="text-[11px] font-semibold text-indigo-700 ml-1">
                        Replay
                      </Text>
                    </TouchableOpacity>

                    {/* Translate Toggle */}
                    <TouchableOpacity
                      onPress={() => setShowTranslation(!showTranslation)}
                      activeOpacity={0.7}
                      className="bg-slate-100 px-2.5 py-1 rounded-full"
                    >
                      <Text className="text-[11px] font-semibold text-slate-600">
                        {showTranslation ? "Hide English" : "Translate"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Spoken Utterance Text */}
                <Text className="text-[17px] font-semibold text-slate-800 leading-6 mb-1">
                  {latestAssistantMsg.content}
                </Text>

                {/* Helpful Vocabulary / Translation Tips */}
                {showTranslation && (
                  <View className="mt-3 pt-3 border-t border-slate-100">
                    <Text className="text-[12px] font-bold text-slate-500 mb-1">
                      💡 TIPS & MEANING:
                    </Text>
                    {latestAssistantMsg.vocabulary_tips &&
                    latestAssistantMsg.vocabulary_tips.length > 0 ? (
                      latestAssistantMsg.vocabulary_tips.map((v, i) => (
                        <Text key={i} className="text-[13px] text-slate-700 leading-5">
                          • <Text className="font-bold text-indigo-600">{v.word}</Text>: {v.translation}
                        </Text>
                      ))
                    ) : (
                      <Text className="text-[13px] text-slate-600 italic">
                        Listen carefully and try to repeat the sentence out loud!
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Quick Conversation Starter Chips */}
            <View className="my-2">
              <Text className="text-[12px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Quick responses (Tap to Speak):
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {suggestions.map((phrase, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSendMessage(phrase)}
                    disabled={sending || isRecordingVoice}
                    activeOpacity={0.7}
                    className="bg-white border border-slate-200 px-3.5 py-2 rounded-full shadow-xs"
                  >
                    <Text className="text-[13px] font-medium text-slate-700">
                      {phrase}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* ============================================================ */}
        {/* Bottom Interactive Voice & Messaging Controls                */}
        {/* ============================================================ */}
        <View className="bg-white border-t border-slate-100 px-5 pt-3 pb-4 shadow-lg">
          {showKeyboardInput ? (
            /* Traditional Keyboard Input View (When toggled) */
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setShowKeyboardInput(false)}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
              >
                <Ionicons name="mic" size={20} color="#6366F1" />
              </TouchableOpacity>

              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={`Speak or write in ${language}...`}
                placeholderTextColor="#94A3B8"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-[14.5px] text-slate-800"
                onSubmitEditing={() => handleSendMessage()}
                returnKeyType="send"
              />

              <TouchableOpacity
                onPress={() => handleSendMessage()}
                disabled={!inputText.trim() || sending}
                activeOpacity={0.8}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  inputText.trim() && !sending ? "bg-[#5B52F9]" : "bg-slate-200"
                }`}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Feather name="send" size={17} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Voice-First Mode: Large Central Microphone Action */
            <View className="items-center justify-center py-1">
              <View className="flex-row items-center justify-between w-full mb-2">
                {/* Keyboard Toggle Icon */}
                <TouchableOpacity
                  onPress={() => setShowKeyboardInput(true)}
                  activeOpacity={0.7}
                  className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
                >
                  <Ionicons name="keypad-outline" size={19} color="#64748B" />
                </TouchableOpacity>

                {/* Voice Status Text / Recording Timer */}
                <View className="items-center">
                  {isRecordingVoice ? (
                    <View className="flex-row items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      <View className="w-2 h-2 rounded-full bg-rose-500" />
                      <Text className="text-[13px] font-bold text-rose-600">
                        Recording voice: 0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-[12.5px] font-medium text-slate-500">
                      Tap mic to send voice message
                    </Text>
                  )}
                </View>

                {/* Replay voice button */}
                <TouchableOpacity
                  onPress={() => {
                    if (latestAssistantMsg?.content) {
                      speakTutorReply(latestAssistantMsg.content);
                    }
                  }}
                  activeOpacity={0.7}
                  className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
                >
                  <Ionicons name="volume-medium-outline" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Big Central Microphone Button */}
              <TouchableOpacity
                onPress={isRecordingVoice ? handleStopVoiceRecord : handleStartVoiceRecord}
                disabled={sending}
                activeOpacity={0.85}
                className={`w-18 h-18 rounded-full items-center justify-center shadow-lg ${
                  isRecordingVoice ? "bg-rose-500" : "bg-[#5B52F9]"
                }`}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  shadowColor: isRecordingVoice ? "#F43F5E" : "#5B52F9",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 8,
                }}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name={isRecordingVoice ? "stop" : "mic"}
                    size={32}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
