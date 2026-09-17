import React from "react";
import { View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

interface LanguageSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export const LanguageSearchBar: React.FC<LanguageSearchBarProps> = ({
  value,
  onChangeText,
  onClear,
}) => {
  return (
    <View className="px-5 mb-3">
      <View
        className="w-full bg-white rounded-md px-3.5 py-2.5 flex-row items-center border border-slate-200/80 shadow-xs"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Feather
          name="search"
          size={18}
          color="#94A3B8"
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 text-slate-900 text-[14px] p-0 font-normal"
          placeholder="Search for a language..."
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          style={Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : undefined}
        />
        {value.length > 0 ? (
          <TouchableOpacity
            onPress={onClear || (() => onChangeText(""))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={16} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
