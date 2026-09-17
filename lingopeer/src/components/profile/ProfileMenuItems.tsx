import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  iconType: "feather" | "ionicons";
  iconColor: string;
  iconBgColor: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "learning_plan",
    title: "My Learning Plan",
    subtitle: "View your goals and schedule",
    iconName: "calendar",
    iconType: "feather",
    iconColor: "#5B52F9",
    iconBgColor: "#F5F3FF",
  },
  {
    id: "achievements",
    title: "Achievements",
    subtitle: "Badges and milestones",
    iconName: "trophy-outline",
    iconType: "ionicons",
    iconColor: "#8B5CF6",
    iconBgColor: "#F3E8FF",
  },
  {
    id: "saved_phrases",
    title: "Saved Phrases",
    subtitle: "Your favorite phrases",
    iconName: "bookmark",
    iconType: "feather",
    iconColor: "#0EA5E9",
    iconBgColor: "#E0F2FE",
  },
  {
    id: "settings",
    title: "Settings",
    subtitle: "App preferences",
    iconName: "settings",
    iconType: "feather",
    iconColor: "#64748B",
    iconBgColor: "#F1F5F9",
  },
];

interface ProfileMenuItemsProps {
  items?: MenuItem[];
  onItemPress?: (item: MenuItem) => void;
}

export const ProfileMenuItems: React.FC<ProfileMenuItemsProps> = ({
  items = DEFAULT_MENU_ITEMS,
  onItemPress,
}) => {
  const renderIcon = (item: MenuItem) => {
    if (item.iconType === "ionicons") {
      return (
        <Ionicons
          name={item.iconName as any}
          size={19}
          color={item.iconColor}
        />
      );
    }
    return (
      <Feather
        name={item.iconName as any}
        size={19}
        color={item.iconColor}
      />
    );
  };

  return (
    <View className="px-5 mb-6">
      <View className="gap-2.5">
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => onItemPress?.(item)}
            className="w-full bg-white rounded-2xl p-3.5 flex-row items-center justify-between border border-slate-100 shadow-xs"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            {/* Left Icon Container */}
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3.5"
              style={{ backgroundColor: item.iconBgColor }}
            >
              {renderIcon(item)}
            </View>

            {/* Middle: Title & Subtitle */}
            <View className="flex-1 pr-2">
              <Text className="text-[14px] font-bold text-slate-900 mb-0.5">
                {item.title}
              </Text>
              <Text className="text-[11.5px] font-medium text-slate-400">
                {item.subtitle}
              </Text>
            </View>

            {/* Right Chevron */}
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
