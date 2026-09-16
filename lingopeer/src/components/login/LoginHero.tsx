import React from "react";
import { View, Text, Image } from "react-native";

export const LoginHero: React.FC = () => {
  return (
    <View className="w-full pt-4 pb-2">
      {/* Brand Header */}
      <View className="px-6 mb-3">
        {/* Logo and App Title */}
        <View className="flex-row items-center mb-2">
          <Image
            source={require("../../../assets/logo-with-text.png")}
            style={{ width: 155, height: 42 }}
            resizeMode="contain"
          />
        </View>

        {/* Tagline */}
        <Text className="text-slate-800 text-[14px] font-semibold tracking-tight leading-5">
          Real People. Real Conversations.
        </Text>
        <Text className="text-slate-600 text-[14px] font-medium tracking-tight leading-5">
          In Every Language.
        </Text>
      </View>

      {/* Hero Illustration */}
      <View className="w-full items-center justify-center mt-1">
        <Image
          source={require("../../../assets/images/login-hero.png")}
          style={{ width: "100%", height: 210 }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};
