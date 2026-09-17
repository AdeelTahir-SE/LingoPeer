import React, { useState } from "react";
import {
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProgressHeader } from "../components/progress/ProgressHeader";
import { OverallProgressCard } from "../components/progress/OverallProgressCard";
import {
  StatsCardsGrid,
  StatItem,
} from "../components/progress/StatsCardsGrid";
import {
  SkillBreakdownSection,
  SkillItem,
} from "../components/progress/SkillBreakdownSection";
import {
  BottomTabBar,
  TabKey,
} from "../components/navigation/BottomTabBar";

export default function ProgressScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("progress");

  const handleSearchPress = () => {
    Alert.alert("Search", "Search learning stats and milestones");
  };

  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "You're on a 7-day streak! Keep up the momentum!");
  };

  const handleStatPress = (stat: StatItem) => {
    Alert.alert(stat.label, `${stat.value} reached so far.`);
  };

  const handleSelectSkill = (skill: SkillItem) => {
    Alert.alert(skill.name, `Current proficiency: ${skill.percentage}%`);
  };

  const handleViewDetails = () => {
    Alert.alert("Skill Details", "Detailed breakdown for Speaking, Listening, Reading, and Writing.");
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
    } else if (tab === "profile") {
      try {
        router.push("/profile" as any);
      } catch {
        console.log("Navigate to profile");
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

      {/* Top Header with Brand & Actions */}
      <ProgressHeader
        onSearchPress={handleSearchPress}
        onNotificationsPress={handleNotificationsPress}
      />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress Donut Card */}
        <OverallProgressCard
          percentage={42}
          level="Level 2"
          subtitle="Keep going! You're doing great!"
        />

        {/* 2x2 Stats Grid (Streak, Time, Lessons, XP) */}
        <StatsCardsGrid onStatPress={handleStatPress} />

        {/* Skill Breakdown (Speaking, Listening, Reading, Writing) */}
        <SkillBreakdownSection
          onViewDetails={handleViewDetails}
          onSelectSkill={handleSelectSkill}
        />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
