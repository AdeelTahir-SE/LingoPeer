import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { GoogleIcon } from "./GoogleIcon";

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  icon?: "google";
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  onPress,
  icon = "google",
  className = "",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`w-full bg-white border border-slate-200 py-3.5 px-4 rounded-md flex-row items-center justify-center shadow-sm ${className}`}
    >
      <View className="mr-3">
        {icon === "google" ? <GoogleIcon size={20} /> : null}
      </View>
      <Text className="text-slate-700 text-[15px] font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};
