import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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
  onViewAll?: () => void;
  onSelectLanguage?: (lang: UserLanguage) => void;
}

export const MyLanguagesSection: React.FC<MyLanguagesSectionProps> = ({
  languages = DEFAULT_LANGUAGES,
  onViewAll,
  onSelectLanguage,
}) => {
  return (
    <View className="mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between px-5 mb-3">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          My Languages
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

      {/* Horizontal Language Cards Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            activeOpacity={0.8}
            onPress={() => onSelectLanguage?.(lang)}
            className="w-[84px] bg-white rounded-2xl p-2.5 items-center border border-slate-100 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {/* Flag Circle / Emoji */}
            <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mb-1.5 border border-slate-100">
              <Text className="text-[20px] leading-none">{lang.flag}</Text>
            </View>

            {/* Language Name */}
            <Text
              className="text-[12.5px] font-bold text-slate-800 text-center mb-0.5"
              numberOfLines={1}
            >
              {lang.name}
            </Text>

            {/* Level Label */}
            <Text className="text-[10.5px] font-medium text-slate-400 text-center mb-2">
              {lang.level}
            </Text>

            {/* Progress Bar & Percent */}
            <View className="w-full">
              <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${lang.progress}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </View>
              <Text
                className="text-[9.5px] font-semibold text-right"
                style={{ color: lang.color }}
              >
                {lang.progress}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
