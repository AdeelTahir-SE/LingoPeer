import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export interface QuickActionItem {
  id: string;
  title: string;
  iconType: "feather" | "ionicons" | "material";
  iconName: any;
  bgColor: string;
  iconColor: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "speaking",
    title: "Speaking\nPractice",
    iconType: "feather",
    iconName: "mic",
    bgColor: "#FCE7F3",
    iconColor: "#EC4899",
  },
  {
    id: "vocabulary",
    title: "Vocabulary\nBuilder",
    iconType: "feather",
    iconName: "book-open",
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    id: "grammar",
    title: "Grammar\nHelper",
    iconType: "ionicons",
    iconName: "school-outline",
    bgColor: "#D1FAE5",
    iconColor: "#059669",
  },
  {
    id: "ai-tutor",
    title: "AI\nTutor",
    iconType: "material",
    iconName: "robot-outline",
    bgColor: "#E0E7FF",
    iconColor: "#4F46E5",
  },
];

interface QuickActionsSectionProps {
  onActionPress?: (actionId: string) => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onActionPress,
}) => {
  const renderIcon = (action: QuickActionItem) => {
    if (action.iconType === "feather") {
      return (
        <Feather name={action.iconName} size={22} color={action.iconColor} />
      );
    }
    if (action.iconType === "ionicons") {
      return (
        <Ionicons name={action.iconName} size={22} color={action.iconColor} />
      );
    }
    return (
      <MaterialCommunityIcons
        name={action.iconName}
        size={22}
        color={action.iconColor}
      />
    );
  };

  return (
    <View className="px-5 mb-8">
      {/* Section Header */}
      <View className="mb-3">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          Quick Actions
        </Text>
      </View>

      {/* 4-Item Grid Row */}
      <View className="flex-row items-start justify-between">
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.8}
            onPress={() => onActionPress?.(action.id)}
            className="items-center w-[22%]"
          >
            {/* Action Icon Box */}
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-2 shadow-xs border border-slate-100/60"
              style={{ backgroundColor: action.bgColor }}
            >
              {renderIcon(action)}
            </View>

            {/* Action Title */}
            <Text className="text-[11.5px] font-semibold text-slate-700 text-center leading-tight">
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
