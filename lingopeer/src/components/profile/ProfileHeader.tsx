import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ProfileHeaderProps {
  onSettingsPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSettingsPress,
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

      {/* Settings Action Icon */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onSettingsPress}
        className="w-9 h-9 rounded-full items-center justify-center bg-slate-50 border border-slate-100"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="settings" size={19} color="#475569" />
      </TouchableOpacity>
    </View>
  );
};
