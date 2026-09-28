import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { Platform } from "react-native";

// Language name to BCP-47 speech code mapping
const LANGUAGE_CODES: Record<string, string> = {
  spanish: "es-ES",
  english: "en-US",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  portuguese: "pt-BR",
  japanese: "ja-JP",
  chinese: "zh-CN",
  mandarin: "zh-CN",
  russian: "ru-RU",
  arabic: "ar-SA",
  korean: "ko-KR",
};

export const getLanguageSpeechCode = (languageName?: string): string => {
  if (!languageName) return "es-ES";
  const normalized = languageName.trim().toLowerCase();
  return LANGUAGE_CODES[normalized] || "es-ES";
};

// Clean text for natural speech (remove emojis, markdown brackets)
export const sanitizeTextForSpeech = (text: string): string => {
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[*_#`~[\]]/g, "")
    .trim();
};

let currentRecording: Audio.Recording | null = null;

export const speechService = {
  /**
   * Speak text in the target language with event callbacks for avatar animation.
   */
  speakText: async (
    text: string,
    language: string = "Spanish",
    onStart?: () => void,
    onDone?: () => void
  ) => {
    try {
      await Speech.stop();
      const clean = sanitizeTextForSpeech(text);
      if (!clean) {
        onDone?.();
        return;
      }

      const langCode = getLanguageSpeechCode(language);

      onStart?.();

      Speech.speak(clean, {
        language: langCode,
        pitch: 1.0,
        rate: 0.9,
        onStart: () => {
          onStart?.();
        },
        onDone: () => {
          onDone?.();
        },
        onStopped: () => {
          onDone?.();
        },
        onError: (err) => {
          console.warn("Speech error:", err);
          onDone?.();
        },
      });
    } catch (e) {
      console.warn("Failed to invoke speech:", e);
      onDone?.();
    }
  },

  /**
   * Stop any current speech playback.
   */
  stopSpeaking: async () => {
    try {
      await Speech.stop();
    } catch (e) {
      console.warn("Error stopping speech:", e);
    }
  },

  /**
   * Check if speech is currently playing.
   */
  isSpeaking: async (): Promise<boolean> => {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  },

  /**
   * Start recording user voice message via microphone.
   */
  startRecording: async (): Promise<boolean> => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (currentRecording) {
        try {
          await currentRecording.stopAndUnloadAsync();
        } catch {}
        currentRecording = null;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      currentRecording = recording;
      return true;
    } catch (err) {
      console.error("Failed to start audio recording:", err);
      return false;
    }
  },

  /**
   * Stop recording and get recorded audio URI & base64 for transcription.
   */
  stopRecording: async (): Promise<{ uri: string | null; base64: string | null }> => {
    try {
      if (!currentRecording) {
        return { uri: null, base64: null };
      }

      await currentRecording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const uri = currentRecording.getURI();
      currentRecording = null;

      if (!uri) {
        return { uri: null, base64: null };
      }

      let base64: string | null = null;
      try {
        if (Platform.OS === "web") {
          const res = await fetch(uri);
          const blob = await res.blob();
          base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const resStr = (reader.result as string).split(",")[1];
              resolve(resStr);
            };
            reader.readAsDataURL(blob);
          });
        } else {
          // Native React Native / Expo: fetch blob or read
          const res = await fetch(uri);
          const blob = await res.blob();
          base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = (reader.result as string)?.split(",")[1] || "";
              resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      } catch (err) {
        console.warn("Could not encode recorded audio to base64:", err);
      }

      return { uri, base64 };
    } catch (err) {
      console.error("Failed to stop recording:", err);
      return { uri: null, base64: null };
    }
  },
};
