import React from "react";
import { View, Text, Image } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

export const LoginHero: React.FC = () => {
  return (
    <View className="w-full pt-4 pb-0">
      {/* Brand Header */}
      <View className="px-6 mb-2">
        {/* Logo and App Title */}
        <View className="flex-row items-center mb-2.5 -ml-2.5">
          <Image
            source={require("../../../assets/logo-with-text.png")}
            style={{ width: 195, height: 52 }}
            resizeMode="contain"
          />
        </View>

        {/* Tagline */}
        <Text className="text-[#5B52F9] text-[17px] font-bold tracking-tight leading-6">
          Real People. Real Conversations.
        </Text>
        <Text className="text-[#7C73FC] text-[15px] font-semibold tracking-tight leading-5 mt-0.5">
          In Every Language.
        </Text>
      </View>

      {/* Hero Illustration */}
      <View className="w-full items-center justify-center mt-2 relative overflow-hidden">
        <Image
          source={require("../../../assets/images/login-hero.png")}
          style={{ width: "100%", height: 240 }}
          resizeMode="cover"
        />
        {/* Top gradient overlay to reduce opacity as it moves above */}
        <View
          pointerEvents="none"
          className="absolute top-0 left-0 right-0 w-full"
          style={{ height: 85 }}
        >
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="heroTopFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F4F7FB" stopOpacity="1" />
                <Stop offset="45%" stopColor="#F4F7FB" stopOpacity="0.65" />
                <Stop offset="100%" stopColor="#F4F7FB" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#heroTopFade)" />
          </Svg>
        </View>
      </View>
    </View>
  );
};

