import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface ProfileGoalCardProps {
  goalText?: string;
  onPress?: () => void;
}

export const ProfileGoalCard: React.FC<ProfileGoalCardProps> = ({
  goalText = "Become fluent in 3 languages",
  onPress,
}) => {
  return (
    <View className="px-5 mb-5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="w-full bg-white rounded-2xl p-4 border border-slate-100 flex-row items-center justify-between shadow-xs"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        {/* Left Bullseye Icon Container */}
        <View className="w-11 h-11 rounded-xl bg-[#F5F3FF] items-center justify-center mr-3.5 border border-[#EDE9FE]">
          <Ionicons name="disc-outline" size={24} color="#5B52F9" />
        </View>

        {/* Center Goal Details */}
        <View className="flex-1 pr-2">
          <Text className="text-[11.5px] font-medium text-slate-400">
            Your Goal
          </Text>
          <Text className="text-[14px] font-bold text-slate-800 mt-0.5" numberOfLines={1}>
            {goalText}
          </Text>
        </View>

        {/* Right Arrow */}
        <Feather name="chevron-right" size={18} color="#CBD5E1" />
      </TouchableOpacity>
    </View>
  );
};
