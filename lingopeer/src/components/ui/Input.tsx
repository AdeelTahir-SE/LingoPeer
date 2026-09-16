import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export interface InputProps extends TextInputProps {
  label?: string;
  iconName?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  iconName,
  isPassword = false,
  error,
  containerClassName = "",
  value,
  onChangeText,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`w-full mb-3.5 ${containerClassName}`}>
      {label ? (
        <Text className="text-xs font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center bg-slate-50/70 border rounded-md px-4 py-3.5 transition-all ${
          error
            ? "border-red-400 bg-red-50/30"
            : isFocused
            ? "border-indigo-500 bg-white shadow-sm"
            : "border-slate-200"
        }`}
      >
        {iconName ? (
          <Feather
            name={iconName}
            size={19}
            color={isFocused ? "#5B52F9" : "#94A3B8"}
            style={{ marginRight: 12 }}
          />
        ) : null}

        <TextInput
          className="flex-1 text-slate-900 text-[15px] p-0 font-normal"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={isPassword ? "none" : rest.autoCapitalize}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={18}
              color="#94A3B8"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text className="text-xs text-red-500 mt-1 ml-1.5 font-medium">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
