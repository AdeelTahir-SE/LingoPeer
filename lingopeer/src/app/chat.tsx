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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  api,
  ChatMessageItem,
  ChatSessionItem,
  CorrectionItem,
  VocabularyTipItem,
} from "../services/api";

const SUGGESTIONS = [
  "¡Hola! ¿Cómo estás hoy?",
  "Quiero practicar ordenar comida",
  "¿Puedes corregir mi gramática?",
  "Cuéntame de tus pasatiempos",
];

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

  const scrollViewRef = useRef<ScrollView>(null);

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
          // Set initial greeting
          const initialGreeting: ChatMessageItem = {
            id: "welcome-msg",
            session_id: newSession.id,
            role: "assistant",
            content: `¡Hola! Soy ${agentName}, tu compañera de idiomas en LingoPeer. ¿De qué te gustaría hablar hoy en ${language}?`,
            created_at: new Date().toISOString(),
            vocabulary_tips: [
              {
                word: "Bienvenido/a",
                translation: "Welcome",
                example: "¡Bienvenido a tu práctica de idiomas!",
              },
            ],
          };
          setMessages([initialGreeting]);
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
    };
  }, [agentId, language, agentName]);

  // Scroll to bottom on message update
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, sending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !session || sending) return;

    setInputText("");
    setSending(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      session_id: session.id,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      // Call LangGraph multi-agent execution endpoint
      const result = await api.sendMessage(session.id, text);

      setEarnedXp((prev) => prev + (result.xp_earned || 20));
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        result.user_message,
        result.tutor_reply,
      ]);
    } catch (err: any) {
      console.error("Message send failed:", err);
      // Fallback assistant message if offline or server error
      const errorReply: ChatMessageItem = {
        id: `err-${Date.now()}`,
        session_id: session.id,
        role: "assistant",
        content: `¡Muy bien dicho! Sigue practicando en ${language}. Recuerda que cada frase te acerca a la fluidez.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F8FAFC]"
      style={{ backgroundColor: "#F8FAFC" }}
      edges={["top", "bottom"]}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center -ml-1 rounded-xl mr-2 active:bg-slate-100"
          >
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </TouchableOpacity>

          {/* Agent Avatar */}
          <View className="w-10 h-10 rounded-full bg-[#EDE9FE] items-center justify-center mr-3 border border-slate-100 overflow-hidden">
            {agentId === "sofia" ? (
              <Image
                source={require("../../assets/images/user-avatar.png")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <Text className="text-[20px]">
                {agentId === "diego" ? "👨🏻" : agentId === "lucia" ? "👩🏽‍🏫" : "👨🏽‍💻"}
              </Text>
            )}
          </View>

          {/* Name & Active Badge */}
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-[15px] font-bold text-slate-900">
                {agentName}
              </Text>
              <Text className="text-[14px]">{flag}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text className="text-[11px] font-medium text-slate-500">
                AI Tutor • {language}
              </Text>
            </View>
          </View>
        </View>

        {/* XP Badge */}
        <View className="flex-row items-center bg-[#EEF2FF] border border-[#E0E7FF] px-2.5 py-1 rounded-full">
          <Ionicons name="sparkles" size={13} color="#5B52F9" />
          <Text className="text-[11.5px] font-bold text-[#5B52F9] ml-1">
            +{earnedXp} XP
          </Text>
        </View>
      </View>

      {/* Main Messages Feed */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#5B52F9" />
            <Text className="text-slate-500 font-medium text-[13px] mt-3">
              Connecting with {agentName}...
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
                  {/* Tutor Avatar Icon for Assistant Messages */}
                  {!isUser && (
                    <View className="w-8 h-8 rounded-full bg-[#EDE9FE] items-center justify-center mr-2 mt-1 border border-slate-100 overflow-hidden">
                      {agentId === "sofia" ? (
                        <Image
                          source={require("../../assets/images/user-avatar.png")}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text className="text-[16px]">
                          {agentId === "diego" ? "👨🏻" : agentId === "lucia" ? "👩🏽‍🏫" : "👨🏽‍💻"}
                        </Text>
                      )}
                    </View>
                  )}

                  <View
                    className={`max-w-[80%] rounded-2xl p-3.5 ${
                      isUser
                        ? "bg-[#5B52F9] rounded-tr-xs shadow-xs"
                        : "bg-white border border-slate-100 rounded-tl-xs shadow-xs"
                    }`}
                  >
                    {/* Message Text */}
                    <Text
                      className={`text-[14px] leading-5 ${
                        isUser ? "text-white font-medium" : "text-slate-800 font-normal"
                      }`}
                    >
                      {item.content}
                    </Text>

                    {/* Grammar Feedback Card (Evaluator Node output) */}
                    {item.corrections && item.corrections.length > 0 && (
                      <View className="mt-2.5 pt-2.5 border-t border-slate-100 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50">
                        <View className="flex-row items-center gap-1.5 mb-1">
                          <Feather name="check-circle" size={13} color="#D97706" />
                          <Text className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                            Grammar Helper
                          </Text>
                        </View>
                        {item.corrections.map((corr, idx) => (
                          <View key={idx} className="mt-1">
                            <Text className="text-[12px] text-slate-500 line-through">
                              {corr.original}
                            </Text>
                            <Text className="text-[12.5px] font-bold text-emerald-700">
                              ➔ {corr.corrected}
                            </Text>
                            <Text className="text-[11px] text-slate-600 mt-0.5">
                              {corr.explanation}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Vocabulary Tips Pill (Evaluator Node output) */}
                    {item.vocabulary_tips && item.vocabulary_tips.length > 0 && (
                      <View className="mt-2 pt-2 border-t border-slate-100">
                        {item.vocabulary_tips.map((vocab, idx) => (
                          <View
                            key={idx}
                            className="bg-indigo-50/80 px-2.5 py-1.5 rounded-lg border border-indigo-100 flex-row items-center justify-between mt-1"
                          >
                            <View className="flex-1 pr-2">
                              <Text className="text-[12px] font-bold text-[#5B52F9]">
                                {vocab.word} •{" "}
                                <Text className="font-normal text-slate-600">
                                  {vocab.translation}
                                </Text>
                              </Text>
                              {vocab.example ? (
                                <Text className="text-[10.5px] text-slate-500 italic mt-0.5">
                                  "{vocab.example}"
                                </Text>
                              ) : null}
                            </View>
                            <Feather name="bookmark" size={14} color="#6366F1" />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Typing Indicator */}
            {sending && (
              <View className="flex-row items-center mb-4 pl-10">
                <View className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl flex-row items-center gap-2 shadow-xs">
                  <ActivityIndicator size="small" color="#5B52F9" />
                  <Text className="text-[12px] font-medium text-slate-500">
                    {agentName} is thinking...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Quick Suggestion Chips */}
        <View className="bg-white border-t border-slate-100 px-3 pt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {SUGGESTIONS.map((sug, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => handleSendMessage(sug)}
                className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full"
              >
                <Text className="text-[11.5px] font-medium text-slate-700">
                  {sug}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Field */}
        <View className="bg-white px-4 py-3 flex-row items-center gap-2 border-t border-slate-100">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message ${agentName} in ${language}...`}
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-slate-100 px-4 py-2.5 rounded-full text-[14px] text-slate-800"
            onSubmitEditing={() => handleSendMessage()}
            returnKeyType="send"
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || sending}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              inputText.trim() && !sending
                ? "bg-[#5B52F9]"
                : "bg-slate-200"
            }`}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={17} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
