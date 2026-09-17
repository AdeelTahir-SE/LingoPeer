import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export interface StatItem {
  id: string;
  value: string;
  label: string;
  iconType: "flame" | "clock" | "check" | "star";
  iconColor: string;
  iconBgColor: string;
}

const DEFAULT_STATS: StatItem[] = [
  {
    id: "streak",
    value: "7",
    label: "Day Streak",
    iconType: "flame",
    iconColor: "#F97316",
    iconBgColor: "#FFF7ED",
  },
  {
    id: "time",
    value: "12h 30m",
    label: "Learning Time",
    iconType: "clock",
    iconColor: "#3B82F6",
    iconBgColor: "#EFF6FF",
  },
  {
    id: "lessons",
    value: "28",
    label: "Lessons Completed",
    iconType: "check",
    iconColor: "#10B981",
    iconBgColor: "#ECFDF5",
  },
  {
    id: "xp",
    value: "165",
    label: "XP Points",
    iconType: "star",
    iconColor: "#F59E0B",
    iconBgColor: "#FFFBEB",
  },
];

interface StatsCardsGridProps {
  stats?: StatItem[];
  onStatPress?: (stat: StatItem) => void;
}

export const StatsCardsGrid: React.FC<StatsCardsGridProps> = ({
  stats = DEFAULT_STATS,
  onStatPress,
}) => {
  const renderIcon = (type: StatItem["iconType"], color: string) => {
    switch (type) {
      case "flame":
        return <Ionicons name="flame" size={20} color={color} />;
      case "clock":
        return <Ionicons name="time" size={20} color={color} />;
      case "check":
        return <Ionicons name="checkmark-circle" size={20} color={color} />;
      case "star":
        return <Ionicons name="star" size={20} color={color} />;
      default:
        return <Feather name="activity" size={18} color={color} />;
    }
  };

  return (
    <View className="px-5 mb-5">
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {stats.map((stat) => (
          <TouchableOpacity
            key={stat.id}
            activeOpacity={0.75}
            onPress={() => onStatPress?.(stat)}
            className="w-[48.2%] bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            {/* Top Row: Icon + Chevron */}
            <View className="flex-row items-center justify-between mb-2.5">
              <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: stat.iconBgColor }}
              >
                {renderIcon(stat.iconType, stat.iconColor)}
              </View>
              <Feather name="chevron-right" size={16} color="#CBD5E1" />
            </View>

            {/* Bottom Content: Big Value + Subtitle */}
            <View>
              <Text
                className="text-[19px] font-extrabold text-slate-900 leading-6 mb-0.5"
                numberOfLines={1}
              >
                {stat.value}
              </Text>
              <Text
                className="text-[11.5px] font-medium text-slate-400"
                numberOfLines={1}
              >
                {stat.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
