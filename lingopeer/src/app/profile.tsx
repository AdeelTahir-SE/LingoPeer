import React, { useState } from "react";
import {
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { UserProfileCard } from "../components/profile/UserProfileCard";
import { ProfileGoalCard } from "../components/profile/ProfileGoalCard";
import {
  LearningLanguagesSection,
  ProfileLanguageItem,
} from "../components/profile/LearningLanguagesSection";
import {
  ProfileMenuItems,
  MenuItem,
} from "../components/profile/ProfileMenuItems";
import {
  BottomTabBar,
  TabKey,
} from "../components/navigation/BottomTabBar";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const handleSettingsPress = () => {
    Alert.alert("Settings", "Account and application preferences");
  };

  const handleEditPress = () => {
    Alert.alert("Edit Profile", "Update your personal information and avatar.");
  };

  const handleGoalPress = () => {
    Alert.alert("Your Goal", "Current Goal: Become fluent in 3 languages. Target completion: 6 months.");
  };

  const handleViewAllLanguages = () => {
    try {
      router.push("/learn" as any);
    } catch {
      console.log("Navigate to learn");
    }
  };

  const handleSelectLanguage = (lang: ProfileLanguageItem) => {
    Alert.alert(lang.name, `Current proficiency: ${lang.level} (${lang.progressPercent}% completed).`);
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.id === "settings") {
      handleSettingsPress();
    } else {
      Alert.alert(item.title, item.subtitle);
    }
  };

  const handleTabPress = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "home") {
      try {
        router.push("/home" as any);
      } catch {
        console.log("Navigate to home");
      }
    } else if (tab === "learn") {
      try {
        router.push("/learn" as any);
      } catch {
        console.log("Navigate to learn");
      }
    } else if (tab === "progress") {
      try {
        router.push("/progress" as any);
      } catch {
        console.log("Navigate to progress");
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

      {/* Top Header with Brand & Settings */}
      <ProfileHeader onSettingsPress={handleSettingsPress} />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card (Avatar, Name, Email, Level, Edit) */}
        <UserProfileCard
          name="Alex Carter"
          email="alex.carter@example.com"
          level="Level 2"
          onEditPress={handleEditPress}
        />

        {/* Goal Card */}
        <ProfileGoalCard
          goalText="Become fluent in 3 languages"
          onPress={handleGoalPress}
        />

        {/* Languages You're Learning Horizontal Section */}
        <LearningLanguagesSection
          onViewAll={handleViewAllLanguages}
          onSelectLanguage={handleSelectLanguage}
        />

        {/* Profile Menu Items (Plan, Achievements, Saved, Settings) */}
        <ProfileMenuItems onItemPress={handleMenuItemPress} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
