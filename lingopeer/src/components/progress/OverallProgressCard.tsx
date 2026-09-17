import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

interface OverallProgressCardProps {
  percentage?: number;
  level?: string;
  subtitle?: string;
}

export const OverallProgressCard: React.FC<OverallProgressCardProps> = ({
  percentage = 42,
  level = "Level 2",
  subtitle = "Keep going! You're doing great!",
}) => {
  // Circular progress calculations
  const size = 96;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View className="px-5 mb-5">
      {/* Title & Subtitle */}
      <View className="mb-3.5">
        <Text className="text-[22px] font-extrabold text-slate-900 tracking-tight">
          Your Progress
        </Text>
        <Text className="text-[13px] text-slate-400 font-medium mt-0.5">
          Small steps. Big fluency.
        </Text>
      </View>

      {/* Main Card Container */}
      <View
        className="w-full bg-[#F5F3FF] rounded-2xl p-4.5 border border-[#EDE9FE] relative overflow-hidden flex-row items-center"
        style={{
          shadowColor: "#6366F1",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Left: Circular Progress Ring */}
        <View className="relative items-center justify-center mr-4.5">
          <Svg width={size} height={size}>
            {/* Background Track Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#EDE9FE"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Progress Arc */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>

          {/* Center Percentage Label */}
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-[20px] font-extrabold text-slate-900">
              {percentage}%
            </Text>
          </View>
        </View>

        {/* Right: Info Text */}
        <View className="flex-1 pr-2 z-10">
          <Text className="text-[12.5px] font-medium text-slate-500 mb-1">
            Overall Progress
          </Text>

          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text className="text-[15px] font-bold text-slate-900 ml-1.5">
              {level}
            </Text>
          </View>

          <Text className="text-[11.5px] text-slate-400 font-medium mt-2 leading-4">
            {subtitle}
          </Text>
        </View>

        {/* Bottom Right Decorative Plant / Organic Shapes */}
        <View
          pointerEvents="none"
          className="absolute bottom-0 right-0"
          style={{ width: 85, height: 75 }}
        >
          <Svg width="100%" height="100%" viewBox="0 0 85 75">
            {/* Lavender soft shape */}
            <Path
              d="M30,75 C25,50 45,30 65,35 C78,38 85,45 85,75 Z"
              fill="#DDD6FE"
              fillOpacity={0.6}
            />
            {/* Mint back leaf */}
            <Path
              d="M50,75 C45,40 60,18 78,20 C83,32 85,55 85,75 Z"
              fill="#6EE7B7"
              fillOpacity={0.7}
            />
            {/* Mint foreground leaf */}
            <Path
              d="M60,75 C55,48 70,30 85,28 C85,50 85,65 85,75 Z"
              fill="#10B981"
              fillOpacity={0.8}
            />
            {/* Floating dots/bubbles */}
            <Circle cx="20" cy="30" r="4" fill="#C4B5FD" fillOpacity={0.5} />
            <Circle cx="35" cy="18" r="3" fill="#A7F3D0" fillOpacity={0.7} />
          </Svg>
        </View>
      </View>
    </View>
  );
};
