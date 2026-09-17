import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface UserProfileCardProps {
  name?: string;
  email?: string;
  level?: string;
  onEditPress?: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name = "Alex Carter",
  email = "alex.carter@example.com",
  level = "Level 2",
  onEditPress,
}) => {
  return (
    <View className="px-5 mb-5">
      <View className="w-full flex-row items-center justify-between">
        {/* Left: Avatar with Circular Ring */}
        <View className="flex-row items-center flex-1">
          <View className="w-20 h-20 rounded-full bg-[#EDE9FE] p-1 items-center justify-center mr-4">
            <Image
              source={require("../../../assets/images/user-avatar.png")}
              style={{ width: 72, height: 72, borderRadius: 36 }}
              resizeMode="cover"
            />
          </View>

          {/* Center Details */}
          <View className="flex-1 pr-2">
            <Text className="text-[19px] font-extrabold text-slate-900 leading-tight">
              {name}
            </Text>
            <Text className="text-[12px] font-medium text-slate-400 mt-0.5 mb-2">
              {email}
            </Text>

            {/* Level Pill Badge */}
            <View className="self-start bg-[#5B52F9] px-3.5 py-1 rounded-full shadow-xs">
              <Text className="text-white text-[11px] font-bold tracking-wide">
                {level}
              </Text>
            </View>
          </View>
        </View>

        {/* Right: Edit Profile Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onEditPress}
          className="w-9 h-9 rounded-full bg-[#F5F3FF] items-center justify-center border border-[#EDE9FE]"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="edit-2" size={16} color="#5B52F9" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
