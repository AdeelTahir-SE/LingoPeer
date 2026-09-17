import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export interface SkillItem {
  id: string;
  name: string;
  percentage: number;
  iconName: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBgColor: string;
  barColor: string;
}

const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: "speaking",
    name: "Speaking",
    percentage: 70,
    iconName: "mic",
    iconColor: "#10B981",
    iconBgColor: "#ECFDF5",
    barColor: "#10B981",
  },
  {
    id: "listening",
    name: "Listening",
    percentage: 60,
    iconName: "headphones",
    iconColor: "#8B5CF6",
    iconBgColor: "#F3E8FF",
    barColor: "#8B5CF6",
  },
  {
    id: "reading",
    name: "Reading",
    percentage: 50,
    iconName: "book-open",
    iconColor: "#0EA5E9",
    iconBgColor: "#E0F2FE",
    barColor: "#0EA5E9",
  },
  {
    id: "writing",
    name: "Writing",
    percentage: 45,
    iconName: "edit-2",
    iconColor: "#F97316",
    iconBgColor: "#FFEDD5",
    barColor: "#F97316",
  },
];

interface SkillBreakdownSectionProps {
  skills?: SkillItem[];
  onViewDetails?: () => void;
  onSelectSkill?: (skill: SkillItem) => void;
}

export const SkillBreakdownSection: React.FC<SkillBreakdownSectionProps> = ({
  skills = DEFAULT_SKILLS,
  onViewDetails,
  onSelectSkill,
}) => {
  return (
    <View className="px-5 mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <Text className="text-[17px] font-bold text-slate-900 tracking-tight">
          Skill Breakdown
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewDetails}
          className="flex-row items-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-[13px] font-semibold text-[#5B52F9] mr-1">
            View Details
          </Text>
          <Feather name="arrow-right" size={13} color="#5B52F9" />
        </TouchableOpacity>
      </View>

      {/* Skills List */}
      <View className="gap-3">
        {skills.map((skill) => (
          <TouchableOpacity
            key={skill.id}
            activeOpacity={0.8}
            onPress={() => onSelectSkill?.(skill)}
            className="w-full bg-white rounded-2xl p-3.5 flex-row items-center justify-between border border-slate-100 shadow-xs"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            {/* Left Circular Icon */}
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3.5"
              style={{ backgroundColor: skill.iconBgColor }}
            >
              <Feather name={skill.iconName} size={18} color={skill.iconColor} />
            </View>

            {/* Middle: Label & Progress Bar */}
            <View className="flex-1 mr-3.5">
              <Text className="text-[13.5px] font-bold text-slate-900 mb-1.5">
                {skill.name}
              </Text>

              {/* Progress Track */}
              <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.percentage}%`,
                    backgroundColor: skill.barColor,
                  }}
                />
              </View>
            </View>

            {/* Right: Percentage Value */}
            <View className="min-w-[36px] items-end">
              <Text className="text-[13px] font-bold text-slate-700">
                {skill.percentage}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
