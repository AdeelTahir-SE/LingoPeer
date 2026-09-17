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
import {
  MyLanguagesSection,
  UserLanguage,
} from "../components/home/MyLanguagesSection";
import { TodaysPracticeSection } from "../components/home/TodaysPracticeSection";
import { QuickActionsSection } from "../components/home/QuickActionsSection";
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

  const handleViewAllLanguages = () => {
    Alert.alert(
      "All Languages",
      "Explore 50+ languages available on LingoPeer."
    );
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

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "speaking":
        Alert.alert("Speaking Practice", "Opening Voice & Pronunciation Studio...");
        break;
      case "vocabulary":
        Alert.alert(
          "Vocabulary Builder",
          "Reviewing your daily flashcards and vocabulary sets."
        );
        break;
      case "grammar":
        Alert.alert(
          "Grammar Helper",
          "Get instant explanations and practice exercises."
        );
        break;
      case "ai-tutor":
        Alert.alert(
          "AI Tutor",
          "Connecting with your AI language companion..."
        );
        break;
      default:
        break;
    }
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

        {/* My Languages Section */}
        <MyLanguagesSection
          onViewAll={handleViewAllLanguages}
          onSelectLanguage={handleSelectLanguage}
        />

        {/* Today's Practice Section */}
        <TodaysPracticeSection onPracticePress={handlePracticePress} />

        {/* Quick Actions Section */}
        <QuickActionsSection onActionPress={handleQuickAction} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
