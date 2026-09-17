import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LearnHeader } from "../components/learn/LearnHeader";
import { LearnHeroBanner } from "../components/learn/LearnHeroBanner";
import { LanguageSearchBar } from "../components/learn/LanguageSearchBar";
import {
  CategoryTabs,
  LanguageCategory,
} from "../components/learn/CategoryTabs";
import {
  PopularLanguagesGrid,
  LearnLanguageItem,
  POPULAR_LANGUAGES,
} from "../components/learn/PopularLanguagesGrid";
import {
  AllLanguagesList,
  ALL_LANGUAGES,
} from "../components/learn/AllLanguagesList";
import {
  AgentSelectionView,
  AIAgent,
} from "../components/learn/AgentSelectionView";
import {
  BottomTabBar,
  TabKey,
} from "../components/navigation/BottomTabBar";

export default function LearnScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("learn");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<LanguageCategory>("all");
  
  // Two-step flow: step 1 = language selection, step 2 = agent selection
  const [selectedLanguage, setSelectedLanguage] = useState<LearnLanguageItem | null>(null);

  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "Explore popular languages and practice partners!");
  };

  const handleSelectLanguage = (lang: LearnLanguageItem) => {
    setSelectedLanguage(lang);
  };

  const handleBackToLanguages = () => {
    setSelectedLanguage(null);
  };

  const handleContinueWithAgent = (agent: AIAgent) => {
    Alert.alert(
      "Tutor Selected! 🚀",
      `You're all set to practice ${selectedLanguage?.name} with ${agent.name} (${agent.style}).`,
      [
        {
          text: "Start Conversation",
          onPress: () => {
            try {
              router.push("/home" as any);
            } catch {
              console.log("Navigate back");
            }
          },
        },
      ]
    );
  };

  const handleTabPress = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "home") {
      try {
        router.push("/home" as any);
      } catch {
        console.log("Navigate to home");
      }
    }
  };

  // Filter languages based on search query and category
  const filteredPopular = useMemo(() => {
    if (!searchQuery.trim()) {
      if (activeCategory === "all" || activeCategory === "popular") {
        return POPULAR_LANGUAGES;
      }
      return [];
    }
    return POPULAR_LANGUAGES.filter((lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeCategory]);

  const filteredAll = useMemo(() => {
    let list = ALL_LANGUAGES;
    if (activeCategory !== "all") {
      list = list.filter((lang) => lang.category === activeCategory);
    }
    if (searchQuery.trim()) {
      list = list.filter((lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [searchQuery, activeCategory]);

  // If language is selected, show Screen 2: Choose Your AI Tutor
  if (selectedLanguage) {
    return (
      <AgentSelectionView
        selectedLanguage={selectedLanguage}
        onBack={handleBackToLanguages}
        onContinue={handleContinueWithAgent}
      />
    );
  }

  // Screen 1: Choose Your Language
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: "#FFFFFF" }}
      edges={["top"]}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Learn Screen Header */}
      <LearnHeader
        hasNotifications={true}
        onNotificationsPress={handleNotificationsPress}
      />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Banner with Character */}
        <LearnHeroBanner />

        {/* Search Bar */}
        <LanguageSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Category Filter Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Popular Languages Grid */}
        {filteredPopular.length > 0 ? (
          <PopularLanguagesGrid
            onSelectLanguage={handleSelectLanguage}
            onViewAll={() => setActiveCategory("all")}
          />
        ) : null}

        {/* All Languages List */}
        <AllLanguagesList
          languages={filteredAll}
          onSelectLanguage={handleSelectLanguage}
        />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
