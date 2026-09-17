import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LearnLanguageItem } from "./PopularLanguagesGrid";

export const ALL_LANGUAGES: LearnLanguageItem[] = [
  {
    id: "it",
    name: "Italian",
    flag: "🇮🇹",
    level: "Beginner - Advanced",
    category: "european",
  },
  {
    id: "ja",
    name: "Japanese",
    flag: "🇯🇵",
    level: "Beginner - Advanced",
    category: "asian",
  },
  {
    id: "zh",
    name: "Chinese",
    flag: "🇨🇳",
    level: "Beginner - Advanced",
    category: "asian",
  },
  {
    id: "ar",
    name: "Arabic",
    flag: "🇸🇦",
    level: "Beginner - Advanced",
    category: "other",
  },
  {
    id: "pt",
    name: "Portuguese",
    flag: "🇧🇷",
    level: "Beginner - Advanced",
    category: "european",
  },
  {
    id: "ko",
    name: "Korean",
    flag: "🇰🇷",
    level: "Beginner - Advanced",
    category: "asian",
  },
  {
    id: "ru",
    name: "Russian",
    flag: "🇷🇺",
    level: "Beginner - Advanced",
    category: "european",
  },
  {
    id: "tr",
    name: "Turkish",
    flag: "🇹🇷",
    level: "Beginner - Advanced",
    category: "other",
  },
];

interface AllLanguagesListProps {
  languages?: LearnLanguageItem[];
  onSelectLanguage: (lang: LearnLanguageItem) => void;
}

export const AllLanguagesList: React.FC<AllLanguagesListProps> = ({
  languages = ALL_LANGUAGES,
  onSelectLanguage,
}) => {
  return (
    <View className="px-5 mb-6">
      {/* Section Header */}
      <View className="mb-3">
        <Text className="text-[16.5px] font-bold text-slate-900 tracking-tight">
          All Languages
        </Text>
      </View>

      {/* Languages Column */}
      <View className="gap-2.5">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            activeOpacity={0.8}
            onPress={() => onSelectLanguage(lang)}
            className="w-full bg-white rounded-md p-3.5 flex-row items-center justify-between border border-slate-100 shadow-xs"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {/* Flag Badge */}
            <View className="w-11 h-11 rounded-md bg-slate-50 items-center justify-center mr-3.5 border border-slate-100">
              <Text className="text-[22px] leading-none">{lang.flag}</Text>
            </View>

            {/* Language Text Info */}
            <View className="flex-1 pr-2">
              <Text className="text-[14.5px] font-bold text-slate-900 mb-0.5">
                {lang.name}
              </Text>
              <Text className="text-[11.5px] font-medium text-slate-400">
                {lang.level}
              </Text>
            </View>

            {/* Chevron Right */}
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
