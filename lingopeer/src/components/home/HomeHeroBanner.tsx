import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface HomeHeroBannerProps {
  onStartLearning?: () => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({
  onStartLearning,
}) => {
  return (
    <View className="px-5 mb-6">
      <View
        className="w-full  bg-[#EEF2FF] rounded-md  relative overflow-hidden border p-4.5 pt-5  border-[#f5f1f1] flex-row items-center justify-between"
        style={{
          shadowColor: "#6366F1",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        {/* Left Content */}
        <View className="flex-1 p-4 z-10 ">
          {/* Subtitle / Category */}
          <Text className="text-[11px] font-semibold text-[#6366F1] uppercase tracking-wider mb-1">
            Your Personal AI Language Tutor
          </Text>

          {/* Heading */}
          <Text className="text-[19px] font-extrabold text-slate-900 leading-6 tracking-tight mb-1.5">
            Learn Languages{"\n"}with Real People
          </Text>

          {/* Bullet Subtitle */}
          <Text className="text-[11.5px] font-medium text-slate-500 mb-3.5">
            Speak &bull; Practice &bull; Get Feedback
          </Text>

          {/* CTA Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onStartLearning}
            className="self-start bg-[#5B52F9] active:bg-[#4B42E8] px-4 py-2 rounded-md flex-row items-center shadow-sm"
          >
            <Text className="text-white text-[12.5px] font-semibold mr-1.5">
              Start Learning
            </Text>
            <Feather name="arrow-right" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Right Character Image */}
        <View className=" w-[125px] h-fit items-center justify-end pr-16 ">
          <Image
            source={require("../../../assets/images/home-hero-character.png")}
            style={{ width: 185, height: 175 }}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};
