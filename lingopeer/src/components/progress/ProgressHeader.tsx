import React from "react";
import { View, Image } from "react-native";



export const ProgressHeader: React.FC = () => {
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
