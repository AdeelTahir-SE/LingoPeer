import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface ProfileLanguageItem {
  id: string;
  name: string;
  flag: string;
  level: string;
  progressPercent: number;
  color: string;
}

const DEFAULT_LEARNING_LANGUAGES: ProfileLanguageItem[] = [
  {
    id: "es",
    name: "Spanish",
    flag: "🇪🇸",
    level: "Level 2",
    progressPercent: 65,
    color: "#8B5CF6",
  },
  {
    id: "fr",
    name: "French",
    flag: "🇫🇷",
    level: "Level 1",
    progressPercent: 35,
    color: "#3B82F6",
  },
  {
    id: "de",
    name: "German",
    flag: "🇩🇪",
    level: "Level 1",
    progressPercent: 25,
    color: "#F59E0B",
  },
  {
    id: "en",
    name: "English",
    flag: "🇬🇧",
    level: "Beginner",
    progressPercent: 85,
    color: "#10B981",
  },
];

interface LearningLanguagesSectionProps {
  languages?: ProfileLanguageItem[];
  onViewAll?: () => void;
  onSelectLanguage?: (lang: ProfileLanguageItem) => void;
}

export const LearningLanguagesSection: React.FC<LearningLanguagesSectionProps> = ({
  languages = DEFAULT_LEARNING_LANGUAGES,
  onViewAll,
  onSelectLanguage,
}) => {
  return (
    <View className="mb-5">
      {/* Section Header */}
      <View className="flex-row items-center justify-between px-5 mb-3">
        <Text className="text-[16px] font-bold text-slate-900 tracking-tight">
          Languages You're Learning
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewAll}
          className="flex-row items-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-[12.5px] font-semibold text-[#5B52F9] mr-1">
            View All
          </Text>
          <Feather name="arrow-right" size={13} color="#5B52F9" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {languages.map((lang, index) => (
          <TouchableOpacity
            key={lang.id}
            activeOpacity={0.8}
            onPress={() => onSelectLanguage?.(lang)}
            className="w-[78px] bg-white rounded-2xl p-2.5 items-center border border-slate-100 shadow-xs mr-2.5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {/* Flag Circle */}
            <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mb-1.5 border border-slate-100">
              <Text className="text-[20px] leading-none">{lang.flag}</Text>
            </View>

            {/* Language Name */}
            <Text
              className="text-[12.5px] font-bold text-slate-900 mb-0.5 text-center"
              numberOfLines={1}
            >
              {lang.name}
            </Text>

            {/* Level */}
            <Text
              className="text-[10px] font-medium text-slate-400 mb-2 text-center"
              numberOfLines={1}
            >
              {lang.level}
            </Text>

            {/* Mini Progress Bar Indicator */}
            <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${lang.progressPercent}%`,
                  backgroundColor: lang.color,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
