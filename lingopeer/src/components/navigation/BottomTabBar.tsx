import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export type TabKey = "home" | "learn" | "progress" | "profile";

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

interface TabItem {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const TABS: TabItem[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "learn", label: "Learn", icon: "book-open" },
  { key: "progress", label: "Progress", icon: "bar-chart-2" },
  { key: "profile", label: "Profile", icon: "user" },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View
      className="w-full bg-white border-t border-slate-100 px-6 pt-2.5 pb-6 flex-row items-center justify-between"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? "#5B52F9" : "#94A3B8";

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.key)}
            className="items-center justify-center flex-1 py-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name={tab.icon} size={22} color={color} />
            <Text
              className={`text-[11.5px] mt-1 ${
                isActive
                  ? "font-bold text-[#5B52F9]"
                  : "font-medium text-slate-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
