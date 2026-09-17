import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "../ui/PrimaryButton";
import { LearnLanguageItem } from "./PopularLanguagesGrid";

export interface AIAgent {
  id: string;
  name: string;
  avatarBg: string;
  avatarEmoji: string;
  style: string;
  vibe: string;
  levelRange: string;
  isFormal?: boolean;
}

export const AI_AGENTS: AIAgent[] = [
  {
    id: "sofia",
    name: "Sofia",
    avatarBg: "#EDE9FE",
    avatarEmoji: "👩🏻‍💼",
    style: "Friendly & Encouraging",
    vibe: "Casual",
    levelRange: "Beginner - Advanced",
  },
  {
    id: "diego",
    name: "Diego",
    avatarBg: "#E0F2FE",
    avatarEmoji: "👨🏻",
    style: "Patient & Supportive",
    vibe: "Casual",
    levelRange: "Beginner - Advanced",
  },
  {
    id: "lucia",
    name: "Lucia",
    avatarBg: "#FCE7F3",
    avatarEmoji: "👩🏽‍🏫",
    style: "Professional & Focused",
    vibe: "Formal",
    levelRange: "Intermediate - Advanced",
    isFormal: true,
  },
  {
    id: "mateo",
    name: "Mateo",
    avatarBg: "#FEF3C7",
    avatarEmoji: "👨🏽‍💻",
    style: "Energetic & Fun",
    vibe: "Casual",
    levelRange: "Beginner - Advanced",
  },
];

interface AgentSelectionViewProps {
  selectedLanguage: LearnLanguageItem;
  onBack: () => void;
  onContinue: (agent: AIAgent) => void;
}

export const AgentSelectionView: React.FC<AgentSelectionViewProps> = ({
  selectedLanguage,
  onBack,
  onContinue,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("sofia");
  const [loading, setLoading] = useState(false);

  const selectedAgent =
    AI_AGENTS.find((a) => a.id === selectedAgentId) || AI_AGENTS[0];

  const handleContinuePress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onContinue(selectedAgent);
    }, 600);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: "#FFFFFF" }}
      edges={["top", "bottom"]}
    >
      {/* Top Header */}
      <View className="flex-row items-center px-4 pt-2 pb-3 border-b border-slate-50">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          className="w-10 h-10 items-center justify-center -ml-1 rounded-md active:bg-slate-100"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-slate-900 text-[17px] pr-9">
          Choose Your AI Tutor
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View
          className="w-full bg-[#EEF2FF] rounded-md px-4 pt-4  mb-4 relative overflow-hidden border border-[#E0E7FF] flex-row items-center justify-between"
          style={{
            shadowColor: "#6366F1",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-1 pr-2 z-10">
            <Text className="text-[17px] font-extrabold text-slate-900 leading-tight mb-1">
              Meet Your Language{"\n"}Companion
            </Text>
            <Text className="text-[11.5px] font-medium text-slate-500 leading-4">
              Pick an AI agent and start practicing with real conversations, feedback and support.
            </Text>
          </View>

          <View className="w-[150px] h-[145px] items-center justify-end -mr-26 -mb-2">
            <Image
              source={require("../../../assets/images/home-hero-character.png")}
              style={{ width: 150, height: 145 }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Selected Language Bar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBack}
          className="w-full bg-white rounded-md p-3.5 flex-row items-center justify-between border border-slate-100 shadow-xs mb-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-md bg-slate-50 items-center justify-center mr-3 border border-slate-100">
              <Text className="text-[20px] leading-none">{selectedLanguage.flag}</Text>
            </View>
            <View>
              <Text className="text-[14px] font-bold text-slate-900">
                {selectedLanguage.name}
              </Text>
              <Text className="text-[11px] font-medium text-slate-400">
                Selected Language
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Available AI Agents Header */}
        <View className="mb-3">
          <Text className="text-[16px] font-bold text-slate-900 tracking-tight">
            Available AI Agents
          </Text>
          <Text className="text-[12px] text-slate-500 mt-0.5">
            Choose a tutor that matches your style and goals.
          </Text>
        </View>

        {/* Agent Cards List */}
        <View className="gap-3 mb-6">
          {AI_AGENTS.map((agent) => {
            const isSelected = selectedAgentId === agent.id;

            return (
              <TouchableOpacity
                key={agent.id}
                activeOpacity={0.85}
                onPress={() => setSelectedAgentId(agent.id)}
                className={`w-full rounded-md p-3.5 flex-row items-center justify-between border transition-all ${
                  isSelected
                    ? "bg-[#F5F3FF]/70 border-[#5B52F9]"
                    : "bg-white border-slate-100 shadow-xs"
                }`}
                style={{
                  shadowColor: isSelected ? "#5B52F9" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isSelected ? 0.08 : 0.03,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                {/* Agent Avatar */}
                <View
                  className="w-13 h-13 rounded-md items-center justify-center mr-3.5 border border-slate-100 overflow-hidden"
                  style={{
                    backgroundColor: agent.avatarBg,
                    width: 50,
                    height: 50,
                  }}
                >
                  {agent.id === "sofia" ? (
                    <Image
                      source={require("../../../assets/images/user-avatar.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-[26px]">{agent.avatarEmoji}</Text>
                  )}
                </View>

                {/* Agent Details */}
                <View className="flex-1 pr-2">
                  <Text className="text-[14.5px] font-bold text-slate-900 mb-0.5">
                    {agent.name}
                  </Text>
                  <Text className="text-[11.5px] text-slate-500 font-medium mb-2">
                    {agent.style}
                  </Text>

                  {/* Badges */}
                  <View className="flex-row items-center gap-2">
                    {/* Vibe Badge */}
                    <View className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      <Text className="text-[10.5px] font-medium text-slate-600">
                        {agent.vibe}
                      </Text>
                    </View>

                    {/* Level Range Badge */}
                    <View className="bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#E0E7FF]">
                      <Text className="text-[10.5px] font-semibold text-[#5B52F9]">
                        {agent.levelRange}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Radio Button */}
                <View className="items-center justify-center pl-1">
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center ${
                      isSelected
                        ? "border-[#5B52F9] bg-[#5B52F9]"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected ? (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <View className="mt-2 mb-4">
          <PrimaryButton
            title="Continue"
            onPress={handleContinuePress}
            loading={loading}
            showArrow
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
