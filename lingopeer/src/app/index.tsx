import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar as RNStatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LoginHero } from "../components/login/LoginHero";
import { Input } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SocialButton } from "../components/ui/SocialButton";
import { DecorativeBlobs } from "../components/ui/DecorativeBlobs";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { api } from "../services/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter both your email and password.");
      return;
    }

    try {
      setLoading(true);
      await api.login({ email: email.trim(), password });
      router.replace("/home" as any);
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Could not log in with provided credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectUri = Linking.createURL("auth/callback");
      const res = await api.getGoogleAuthUrl(redirectUri);
      if (!res?.url) {
        throw new Error("Did not receive a valid authorization URL from the server.");
      }
      const result = await WebBrowser.openAuthSessionAsync(res.url, redirectUri);
      if (result.type === "success") {
        if (result.url) {
          await api.handleOAuthCallbackUrl(result.url, redirectUri);
        }
        router.replace("/home" as any);
      }
    } catch (err: any) {
      Alert.alert("Google Sign-In", err.message || "Failed to start Google sign-in.");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Please contact support or check your email to reset your password."
    );
  };

  const handleNavigateToSignup = () => {
    router.push("/signup" as any);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F4F7FB]"
      style={{ backgroundColor: "#F4F7FB" }}
      edges={["top", "bottom"]}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#F4F7FB" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header & Character Hero */}
          <LoginHero />

          {/* Main Card Container */}
          <View
            className="flex-1 bg-white px-6 pt-6 pb-12 -mt-6"
            style={{
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
            }}
          >
            {/* Title & Subtitle */}
            <View className="mb-6">
              <Text className="text-[24px] font-bold text-slate-900 tracking-tight">
                Welcome Back
              </Text>
              <Text className="text-[14px] text-slate-500 mt-1 font-normal">
                Log in to continue your language journey
              </Text>
            </View>

            {/* Form Fields */}
            <View className="mb-2">
              <Input
                iconName="mail"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                iconName="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                isPassword
              />
            </View>

            {/* Log In Button */}
            <View className="mt-2 mb-4">
              <PrimaryButton
                title="Log In"
                onPress={handleLogin}
                loading={loading}
                showArrow
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleForgotPassword}
              className="items-center justify-center py-1 mb-5"
            >
              <Text className="text-[#5B52F9] text-[14px] font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View className="flex-row items-center justify-center my-2 mb-5">
              <View className="flex-1 h-[1px] bg-slate-200" />
              <Text className="px-4 text-[13px] font-medium text-slate-400">
                OR
              </Text>
              <View className="flex-1 h-[1px] bg-slate-200" />
            </View>

            {/* Continue with Google */}
            <SocialButton
              title="Continue with Google"
              onPress={handleGoogleLogin}
              icon="google"
              className="mb-6"
            />

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center pt-1 pb-4">
              <Text className="text-[14px] text-slate-500">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleNavigateToSignup}
              >
                <Text className="text-[14px] font-semibold text-[#5B52F9]">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Decorative Bottom Blobs Artwork */}
      <DecorativeBlobs />
    </SafeAreaView>
  );
}
