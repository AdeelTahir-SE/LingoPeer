import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export const DecorativeBlobs: React.FC = () => {
  return (
    <View
      pointerEvents="none"
      className="absolute bottom-0 left-0 right-0 w-full overflow-hidden"
      style={{ height: 100 }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 375 100"
        preserveAspectRatio="none"
      >
        {/* Left Warm Yellow Blob */}
        <Path
          d="M-20,100 C-10,60 30,50 60,75 C85,95 100,100 120,100 Z"
          fill="#FBBF24"
          fillOpacity={0.9}
        />
        {/* Mint / Emerald Accent */}
        <Path
          d="M65,100 C75,85 100,80 120,95 C130,102 140,100 150,100 Z"
          fill="#34D399"
          fillOpacity={0.8}
        />
        {/* Right Lavender Blob */}
        <Path
          d="M260,100 C280,70 320,60 395,75 C400,85 400,100 400,100 Z"
          fill="#C4B5FD"
          fillOpacity={0.7}
        />
      </Svg>
    </View>
  );
};
