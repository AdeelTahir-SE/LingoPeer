import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface UserLanguage {
  id: string;
  name: string;
  flag: string;
  level: string;
  progress: number; // 0 to 100
  color: string;
}

const DEFAULT_LANGUAGES: UserLanguage[] = [
  {
    id: "en",
    name: "English",
    flag: "🇬🇧",
    level: "Level 2",
    progress: 45,
    color: "#5B52F9",
  },
  {
    id: "es",
    name: "Spanish",
    flag: "🇪🇸",
    level: "Level 1",
    progress: 20,
    color: "#10B981",
  },
  {
    id: "fr",
    name: "French",
    flag: "🇫🇷",
    level: "Level 1",
    progress: 15,
    color: "#3B82F6",
  },
  {
    id: "de",
    name: "German",
    flag: "🇩🇪",
    level: "Level 1",
    progress: 10,
    color: "#F59E0B",
  },
];

interface MyLanguagesSectionProps {
  languages?: UserLanguage[];
  onSelectLanguage?: (lang: UserLanguage) => void;
}

export const MyLanguagesSection: React.FC<MyLanguagesSectionProps> = ({
  languages = DEFAULT_LANGUAGES,
  onSelectLanguage,
}) => {
  return (
    <View className="px-5 mb-6">
      {/* Section Header */}
      <View className="mb-3">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          My Languages
        </Text>
      </View>

      {/* Vertical Column List of Language Cards */}
      <View className="gap-2.5">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            activeOpacity={0.8}
            onPress={() => onSelectLanguage?.(lang)}
            className="w-full bg-white rounded-md p-3.5 flex-row items-center justify-between border border-slate-100 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            {/* Flag Badge */}
            <View className="w-11 h-11 rounded-md bg-slate-50 items-center justify-center mr-3.5 border border-slate-100">
              <Text className="text-[22px] leading-none">{lang.flag}</Text>
            </View>

            {/* Language Details & Progress Bar */}
            <View className="flex-1 pr-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[14.5px] font-bold text-slate-900">
                  {lang.name}
                </Text>
                <Text className="text-[12px] font-medium text-slate-400">
                  {lang.level}
                </Text>
              </View>

              {/* Progress Track */}
              <View className="flex-row items-center">
                <View className="flex-1 h-2 bg-slate-100 rounded-md overflow-hidden mr-2.5">
                  <View
                    className="h-full rounded-md"
                    style={{
                      width: `${lang.progress}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </View>
                <Text
                  className="text-[11.5px] font-bold min-w-[32px] text-right"
                  style={{ color: lang.color }}
                >
                  {lang.progress}%
                </Text>
              </View>
            </View>

            {/* Chevron Arrow */}
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
