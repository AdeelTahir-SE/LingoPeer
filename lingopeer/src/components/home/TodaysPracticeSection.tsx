import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface TodaysPracticeSectionProps {
  language?: string;
  agentName?: string;
  flag?: string;
  topic?: string;
  description?: string;
  level?: string;
  duration?: string;
  onPracticePress?: () => void;
}

export const TodaysPracticeSection: React.FC<TodaysPracticeSectionProps> = ({
  language = "Spanish",
  agentName = "Sofia",
  flag = "🇪🇸",
  topic = "Daily Conversation",
  description = "Practice speaking naturally about hobbies and daily routines.",
  level = "Beginner",
  duration = "10 min",
  onPracticePress,
}) => {
  return (
    <View className="px-5 mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          Today's Practice
        </Text>
        <View className="flex-row items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          <Text className="text-[12px]">{flag}</Text>
          <Text className="text-[11px] font-bold text-indigo-700">
            {language}
          </Text>
        </View>
      </View>

      {/* Practice Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPracticePress}
        className="w-full bg-white rounded-xl p-4 border border-slate-100 flex-row items-center justify-between shadow-sm"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        {/* Left Icon Container */}
        <View className="w-12 h-12 rounded-xl bg-[#5B52F9] items-center justify-center mr-3.5 shadow-sm">
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
        </View>

        {/* Center Text Details */}
        <View className="flex-1 pr-2">
          <Text className="text-[15px] font-bold text-slate-900 mb-0.5">
            {topic}
          </Text>
          <Text className="text-[12px] text-slate-500 font-normal leading-4 mb-2">
            Speak with {agentName} in {language}. {description}
          </Text>

          {/* Badges Row */}
          <View className="flex-row items-center gap-2">
            {/* Duration Badge */}
            <View className="flex-row items-center bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <Feather
                name="clock"
                size={11}
                color="#6366F1"
                style={{ marginRight: 4 }}
              />
              <Text className="text-[11px] font-medium text-slate-600">
                {duration}
              </Text>
            </View>

            {/* Difficulty Badge */}
            <View className="flex-row items-center bg-[#EEF2FF] px-2.5 py-1 rounded-md border border-[#E0E7FF]">
              <Feather
                name="shield"
                size={11}
                color="#5B52F9"
                style={{ marginRight: 4 }}
              />
              <Text className="text-[11px] font-semibold text-[#5B52F9]">
                {level}
              </Text>
            </View>

            {/* Partner Badge */}
            <View className="flex-row items-center bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
              <Text className="text-[11px] font-semibold text-emerald-700">
                {agentName}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Arrow */}
        <View className="items-center justify-center pl-1">
          <Feather name="chevron-right" size={20} color="#94A3B8" />
        </View>
      </TouchableOpacity>
    </View>
  );
};
