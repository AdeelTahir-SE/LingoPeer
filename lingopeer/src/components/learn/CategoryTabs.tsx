import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export type LanguageCategory = "all" | "popular" | "european" | "asian" | "other";

interface CategoryTabsProps {
  activeCategory: LanguageCategory;
  onSelectCategory: (cat: LanguageCategory) => void;
}

const CATEGORIES: { id: LanguageCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "european", label: "European" },
  { id: "asian", label: "Asian" },
  { id: "other", label: "Other" },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-[#5B52F9]"
                  : "bg-white border border-slate-200/80"
              }`}
            >
              <Text
                className={`text-[13px] ${
                  isActive
                    ? "font-bold text-white"
                    : "font-medium text-slate-600"
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
