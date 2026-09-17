import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export interface InputProps extends TextInputProps {
  label?: string;
  innerLabel?: string;
  iconName?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  innerLabel,
  iconName,
  isPassword = false,
  error,
  containerClassName = "",
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  autoCapitalize,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getBorderColor = () => {
    if (error) return "#F87171";
    if (isFocused) return "#5B52F9";
    return "#E2E8F0";
  };

  const getBackgroundColor = () => {
    if (error) return "#FEF2F2";
    return "#FFFFFF";
  };

  return (
    <View className={`w-full mb-3.5 ${containerClassName}`}>
      {label ? (
        <Text className="text-xs font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </Text>
      ) : null}

      <View
        className="flex-row items-center rounded-md px-4 py-3"
        style={{
          borderWidth: 1,
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        }}
      >
        {iconName ? (
          <Feather
            name={iconName}
            size={20}
            color={isFocused ? "#5B52F9" : "#64748B"}
            style={{ marginRight: 12 }}
          />
        ) : null}

        {innerLabel ? (
          <View className="flex-1 justify-center py-0.5">
            <Text className="text-[12px] font-semibold text-slate-800 leading-tight mb-0.5">
              {innerLabel}
            </Text>
            <TextInput
              className="text-slate-900 text-[14px] p-0 font-normal"
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={isPassword && !showPassword}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              autoCapitalize={isPassword ? "none" : autoCapitalize}
              style={Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : undefined}
              {...rest}
            />
          </View>
        ) : (
          <TextInput
            className="flex-1 text-slate-900 text-[15px] p-0 font-normal"
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !showPassword}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            autoCapitalize={isPassword ? "none" : autoCapitalize}
            style={Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : undefined}
            {...rest}
          />
        )}

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
