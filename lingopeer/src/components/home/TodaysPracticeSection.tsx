import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface TodaysPracticeSectionProps {
  onPracticePress?: () => void;
}

export const TodaysPracticeSection: React.FC<TodaysPracticeSectionProps> = ({
  onPracticePress,
}) => {
  return (
    <View className="px-5 mb-6">
      {/* Section Header */}
      <View className="mb-3">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          Today's Practice
        </Text>
      </View>

      {/* Practice Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPracticePress}
        className="w-full bg-white rounded-md p-4 border border-slate-100 flex-row items-center justify-between shadow-sm"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        {/* Left Icon Container */}
        <View className="w-12 h-12 rounded-md bg-[#5B52F9] items-center justify-center mr-3.5 shadow-sm">
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
        </View>

        {/* Center Text Details */}
        <View className="flex-1 pr-2">
          <Text className="text-[15px] font-bold text-slate-900 mb-0.5">
            Daily Conversation
          </Text>
          <Text className="text-[12px] text-slate-500 font-normal leading-4 mb-2">
            Talk about your hobbies and interests in English.
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
                10 min
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
                Beginner
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
