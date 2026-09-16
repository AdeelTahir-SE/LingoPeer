import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  showArrow = true,
  className = "",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full bg-[#5B52F9] active:bg-[#4B42E8] py-4 rounded-2xl flex-row items-center justify-center shadow-md shadow-indigo-300 ${
        disabled ? "opacity-60" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          <Text className="text-white text-[16px] font-semibold text-center mr-2">
            {title}
          </Text>
          {showArrow ? (
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};
