import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export interface UserLanguage {
  id: string;
  name: string;
  flag: string;
  level: string;
  progress: number; // 0 to 100
  color: string;
  totalXp?: number;
  streakDays?: number;
}

export const DEFAULT_LANGUAGES: UserLanguage[] = [
  {
    id: "es",
    name: "Spanish",
    flag: "🇪🇸",
    level: "Level 1",
    progress: 35,
    color: "#10B981",
  },
  {
    id: "en",
    name: "English",
    flag: "🇬🇧",
    level: "Level 2",
    progress: 50,
    color: "#5B52F9",
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
  selectedLanguageId?: string;
  onSelectLanguage?: (lang: UserLanguage) => void;
}

export const MyLanguagesSection: React.FC<MyLanguagesSectionProps> = ({
  languages = DEFAULT_LANGUAGES,
  selectedLanguageId = "es",
  onSelectLanguage,
}) => {
  return (
    <View className="px-5 mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          My Languages
        </Text>
        <Text className="text-[12px] font-semibold text-slate-400">
          Tap to switch active language
        </Text>
      </View>

      {/* Vertical Column List of Language Cards */}
      <View className="gap-2.5">
        {languages.map((lang) => {
          const isSelected =
            selectedLanguageId.toLowerCase() === lang.id.toLowerCase() ||
            selectedLanguageId.toLowerCase() === lang.name.toLowerCase();

          return (
            <TouchableOpacity
              key={lang.id}
              activeOpacity={0.8}
              onPress={() => onSelectLanguage?.(lang)}
              className={`w-full bg-white rounded-xl p-3.5 flex-row items-center justify-between border ${
                isSelected
                  ? "border-[#5B52F9] bg-[#FAF5FF]"
                  : "border-slate-100"
              } shadow-sm`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 3,
                elevation: isSelected ? 3 : 1,
              }}
            >
              {/* Flag Badge */}
              <View className="w-11 h-11 rounded-xl bg-slate-50 items-center justify-center mr-3.5 border border-slate-100">
                <Text className="text-[22px] leading-none">{lang.flag}</Text>
              </View>

              {/* Language Details & Progress Bar */}
              <View className="flex-1 pr-3">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-[15px] font-bold text-slate-900">
                      {lang.name}
                    </Text>
                    {isSelected && (
                      <View className="bg-[#EDE9FE] px-2 py-0.5 rounded-full">
                        <Text className="text-[10px] font-bold text-[#5B52F9]">
                          Active
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-[12px] font-medium text-slate-500">
                    {lang.level}
                  </Text>
                </View>

                {/* Progress Track */}
                <View className="flex-row items-center">
                  <View className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mr-2.5">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(Math.max(lang.progress, 5), 100)}%`,
                        backgroundColor: lang.color || "#5B52F9",
                      }}
                    />
                  </View>
                  <Text className="text-[11px] font-semibold text-slate-400">
                    {lang.progress}%
                  </Text>
                </View>
              </View>

              {/* Selection Checkmark / Action */}
              <View className="items-center justify-center pl-1">
                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-[#5B52F9] items-center justify-center">
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <Feather name="chevron-right" size={18} color="#CBD5E1" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
