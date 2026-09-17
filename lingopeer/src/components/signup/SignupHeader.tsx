import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

interface SignupHeaderProps {
  onBackPress?: () => void;
}

export const SignupHeader: React.FC<SignupHeaderProps> = ({ onBackPress }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/" as any);
    }
  };

  return (
    <View className="w-full relative pt-2 pb-4">
      {/* Top Right Decorative Organic Blobs */}
      <View
        pointerEvents="none"
        className="absolute top-0 right-0 overflow-hidden"
        style={{ width: 140, height: 110 }}
      >
        <Svg width="140" height="110" viewBox="0 0 140 110" fill="none">
          {/* Yellow pill blob */}
          <Path
            d="M50 15 C45 8 50 0 60 0 L75 0 C85 0 90 8 85 20 C80 32 75 40 65 40 C55 40 45 35 50 15 Z"
            fill="#FBBF24"
          />
          {/* Mint/Teal curved corner blob */}
          <Path
            d="M95 0 C110 0 140 0 140 0 L140 85 C140 95 125 90 120 75 C112 55 100 50 92 35 C85 20 85 0 95 0 Z"
            fill="#34D399"
          />
        </Svg>
      </View>

      {/* Navigation & Brand Row */}
      <View className="flex-row items-center justify-between px-5">
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-slate-200/50"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>

        {/* Centered Brand Logo */}
        <View className="flex-1 items-center justify-center pr-8">
          <Image
            source={require("../../../assets/logo-with-text.png")}
            style={{ width: 155, height: 42 }}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};
