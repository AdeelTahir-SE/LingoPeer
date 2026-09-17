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
    Alert.alert("Start Learning", "Starting your personalized AI lesson...");
  };

  const handleSelectLanguage = (lang: UserLanguage) => {
    Alert.alert(
      `${lang.name} (${lang.level})`,
      `Progress: ${lang.progress}%. Ready to continue practice?`
    );
  };

  const handlePracticePress = () => {
    Alert.alert(
      "Daily Conversation",
      "Topic: Hobbies and interests\nDuration: 10 mins\nLevel: Beginner"
    );
  };

  const handleTabPress = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab !== "home") {
      console.log(`Navigated to tab: ${tab}`);
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
      <HomeHeader
        hasNotifications={true}
        onNotificationsPress={handleNotificationsPress}
        onProfilePress={handleProfilePress}
      />

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
