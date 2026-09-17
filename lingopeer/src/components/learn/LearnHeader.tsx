import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface LearnHeaderProps {
  hasNotifications?: boolean;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
}

export const LearnHeader: React.FC<LearnHeaderProps> = ({
  hasNotifications = true,
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

    </View>
  );
};
