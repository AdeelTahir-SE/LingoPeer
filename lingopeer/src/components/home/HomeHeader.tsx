import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface HomeHeaderProps {
  hasNotifications?: boolean;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  hasNotifications = true,
  onNotificationsPress,
  onProfilePress,
}) => {
  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
      {/* Brand Logo & Name */}
      <View className="flex-row items-center">
        <Image
          source={require("../../../assets/logo-with-text.png")}
          style={{ width: 155, height: 42 }}
          resizeMode="contain"
        />
      </View>

      {/* Right Actions: Notification Bell & Profile Avatar */}
      <View className="flex-row items-center space-x-3 gap-3">
        {/* Notification Bell */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onNotificationsPress}
          className="w-10 h-10 rounded-full bg-white border border-slate-100 items-center justify-center relative shadow-sm"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="bell" size={19} color="#334155" />
          {/* Notification Red Dot */}
          {hasNotifications ? (
            <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-white" />
          ) : null}
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onProfilePress}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5B52F9]/30 bg-[#EDE9FE] items-center justify-center shadow-sm"
          style={{
            shadowColor: "#5B52F9",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Image
            source={require("../../../assets/images/user-avatar.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
