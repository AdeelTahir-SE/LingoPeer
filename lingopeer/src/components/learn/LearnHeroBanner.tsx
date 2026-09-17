import React from "react";
import { View, Text, Image } from "react-native";

export const LearnHeroBanner: React.FC = () => {
  return (
    <View className="px-5 mb-4 h-fit py-2">
      <View
        className="w-full bg-[#EEF2FF] rounded-md px-4 pt-4.5  relative overflow-hidden border border-[#E0E7FF] flex-row items-center justify-between"
        style={{
          shadowColor: "#6366F1",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Left Content */}
        <View className="flex-1 pr-2 z-10 max-w-fit">
          <Text className="text-[19px] font-extrabold text-[#000000] leading-6 tracking-tight mb-1.5">
            Choose Your{"\n"}Language
          </Text>
          <Text className="text-[12px] font-medium text-slate-500 leading-4">
            Explore 50+ languages and start your learning journey today.
          </Text>
        </View>

        {/* Right Character Image */}
        <View className="w-[155px] h-[165px]  items-center justify-end -mr-36 -mb-2">
          <Image
            source={require("../../../assets/images/home-hero-character.png")}
            style={{ width: 155, height: 165 }}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};
