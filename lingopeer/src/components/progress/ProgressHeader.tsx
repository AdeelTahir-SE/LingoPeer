import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ProgressHeaderProps {
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  onSearchPress,
  onNotificationsPress,
}) => {
  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-3">
      {/* Brand Logo & Name */}
      <View className="flex-row items-center">
        <Image
          source={require("../../../assets/logo-with-text.png")}
          style={{ width: 155, height: 42 }}
          resizeMode="cover"
        />
      </View>

      {/* Right Action Icons */}
      <View className="flex-row items-center gap-2.5">
        {/* Search Icon */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSearchPress}
          className="w-9 h-9 rounded-full items-center justify-center bg-slate-50 border border-slate-100"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="search" size={18} color="#475569" />
        </TouchableOpacity>

        {/* Notifications Icon with Red Dot */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onNotificationsPress}
          className="w-9 h-9 rounded-full items-center justify-center bg-slate-50 border border-slate-100 relative"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="bell" size={18} color="#475569" />
          {/* Notification Badge Dot */}
          <View
            className="w-2 h-2 rounded-full absolute top-1.5 right-1.5"
            style={{ backgroundColor: "#EF4444" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
