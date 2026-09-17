import React, { useState } from "react";
import {
  View,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { HomeHeader } from "../components/home/HomeHeader";
import { HomeHeroBanner } from "../components/home/HomeHeroBanner";
import { TodaysPracticeSection } from "../components/home/TodaysPracticeSection";
import {
  MyLanguagesSection,
  UserLanguage,
} from "../components/home/MyLanguagesSection";
import {
  BottomTabBar,
  TabKey,
} from "../components/navigation/BottomTabBar";

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "You have 1 new lesson recommendation!");
  };

  const handleProfilePress = () => {
    setActiveTab("profile");
    Alert.alert("Profile", "Alex Carter (Level 2)");
  };

  const handleStartLearning = () => {
    try {
      router.push("/learn" as any);
    } catch {
      console.log("Navigate to learn");
    }
  };

  const handleSelectLanguage = (lang: UserLanguage) => {
    try {
      router.push("/learn" as any);
    } catch {
      console.log("Navigate to learn");
    }
  };

  const handlePracticePress = () => {
    try {
      router.push("/learn" as any);
    } catch {
      console.log("Navigate to learn");
    }
  };

  const handleTabPress = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "learn") {
      try {
        router.push("/learn" as any);
      } catch {
        console.log("Navigate to learn");
      }
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: "#FFFFFF" }}
      edges={["top"]}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top App Header */}
      <HomeHeader />

      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner with Character */}
        <HomeHeroBanner onStartLearning={handleStartLearning} />

        {/* Today's Practice Section (Moved above My Languages) */}
        <TodaysPracticeSection onPracticePress={handlePracticePress} />

        {/* My Languages Section (Column Layout) */}
        <MyLanguagesSection
          onSelectLanguage={handleSelectLanguage}
        />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
