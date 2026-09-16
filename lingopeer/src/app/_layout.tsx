import "../../global.css";
import React, { useEffect } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor("#F4F7FB");
      RNStatusBar.setBarStyle("dark-content");
    }
    SystemUI.setBackgroundColorAsync("#F4F7FB").catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F4F7FB" },
        }}
      />
    </>
  );
}
