import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface LearnLanguageItem {
  id: string;
  name: string;
  flag: string;
  level: string;
  category: "popular" | "european" | "asian" | "other";
}

export const POPULAR_LANGUAGES: LearnLanguageItem[] = [
  {
    id: "en",
    name: "English",
    flag: "🇬🇧",
    level: "Beginner - Advanced",
    category: "popular",
  },
  {
    id: "es",
    name: "Spanish",
    flag: "🇪🇸",
    level: "Beginner - Advanced",
    category: "popular",
  },
  {
    id: "fr",
    name: "French",
    flag: "🇫🇷",
    level: "Beginner - Advanced",
    category: "popular",
  },
  {
    id: "de",
    name: "German",
    flag: "🇩🇪",
    level: "Beginner - Advanced",
    category: "popular",
  },
];

interface PopularLanguagesGridProps {
  onSelectLanguage: (lang: LearnLanguageItem) => void;
  onViewAll?: () => void;
}

export const PopularLanguagesGrid: React.FC<PopularLanguagesGridProps> = ({
  onSelectLanguage,
  onViewAll,
}) => {
  return (
    <View className="px-5 mb-5">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[16.5px] font-bold text-slate-900 tracking-tight">
          Popular Languages
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewAll}
          className="flex-row items-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-[13px] font-semibold text-[#5B52F9] mr-1">
            View All
          </Text>
          <Feather name="arrow-right" size={13} color="#5B52F9" />
        </TouchableOpacity>
      </View>

      {/* 2x2 Grid */}
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {POPULAR_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            activeOpacity={0.8}
            onPress={() => onSelectLanguage(lang)}
            className="w-[48.5%] bg-white rounded-md p-3.5 border border-slate-100 shadow-xs flex-row items-center justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {/* Flag Badge */}
            <View className="w-10 h-10 rounded-md bg-slate-50 items-center justify-center mr-2.5 border border-slate-100">
              <Text className="text-[20px] leading-none">{lang.flag}</Text>
            </View>

            {/* Language Text Info */}
            <View className="flex-1 pr-1">
              <Text
                className="text-[13.5px] font-bold text-slate-900 mb-0.5"
                numberOfLines={1}
              >
                {lang.name}
              </Text>
              <Text
                className="text-[10px] font-medium text-slate-400"
                numberOfLines={1}
              >
                {lang.level}
              </Text>
            </View>

            {/* Chevron */}
            <Feather name="chevron-right" size={15} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
