import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SignupHeader } from "../components/signup/SignupHeader";
import { Input } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SocialButton } from "../components/ui/SocialButton";
import { DecorativeBlobs } from "../components/ui/DecorativeBlobs";

export default function SignupScreen() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToggleLanguage = (id: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (selectedLanguages.length === 0) {
      newErrors.languages = "Please select at least one language";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Account created successfully:", {
        fullName,
        email,
        selectedLanguages,
      });
      Alert.alert(
        "Account Created! 🎉",
        `Welcome to LingoPeer, ${fullName}! Your account has been created.`,
        [
          {
            text: "Get Started",
            onPress: () => {
              // Navigate to home / next onboarding step
              try {
                router.replace("/" as any);
              } catch {
                console.log("Navigate to home");
              }
            },
          },
        ]
      );
    }, 1000);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup triggered with languages:", selectedLanguages);
    Alert.alert(
      "Google Sign-Up",
      "Connecting with Google to create your account..."
    );
  };

  const handleNavigateToLogin = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/" as any);
    }
  };

  const handleTermsPress = () => {
    Alert.alert("Terms & Conditions", "LingoPeer Terms and Conditions.");
  };

  const handlePrivacyPress = () => {
    Alert.alert("Privacy Policy", "LingoPeer Privacy Policy.");
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
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header with Back Arrow and Blob */}
          <SignupHeader onBackPress={handleNavigateToLogin} />

          {/* Main Card Container */}
          <View className="flex-1 px-6 pt-2">
            {/* Title & Subtitle */}
            <View className="mb-6">
              <Text className="text-[26px] font-bold text-slate-900 tracking-tight leading-8">
                Create Your{"\n"}Account
              </Text>
              <Text className="text-[14px] text-slate-500 mt-2 font-normal leading-5">
                Join LingoPeer and start learning{"\n"}with real people and AI
                tutors.
              </Text>
            </View>

            {/* Form Fields */}
            <View className="mb-2">
              <Input
                innerLabel="Full Name"
                iconName="user"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors((e) => ({ ...e, fullName: "" }));
                }}
                autoCapitalize="words"
                error={errors.fullName}
              />

              <Input
                innerLabel="Email address"
                iconName="mail"
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
              />

              <Input
                innerLabel="Password"
                iconName="lock"
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: "" }));
                }}
                isPassword
                error={errors.password}
              />

              <Input
                innerLabel="Confirm Password"
                iconName="lock"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors((e) => ({ ...e, confirmPassword: "" }));
                }}
                isPassword
                error={errors.confirmPassword}
              />
            </View>

           

            {errors.languages ? (
              <Text className="text-xs text-red-500 -mt-4 mb-4 ml-1 font-medium">
                {errors.languages}
              </Text>
            ) : null}

            {/* Create Account Primary Button */}
            <View className="mt-1 mb-3">
              <PrimaryButton
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                showArrow
              />
            </View>

            {/* OR Divider */}
            <View className="flex-row items-center justify-center my-3">
              <View className="flex-1 h-[1px] bg-slate-200" />
              <Text className="px-4 text-[13px] font-medium text-slate-400">
                OR
              </Text>
              <View className="flex-1 h-[1px] bg-slate-200" />
            </View>

            {/* Continue with Google */}
            <SocialButton
              title="Continue with Google"
              onPress={handleGoogleSignup}
              icon="google"
              className="mb-5"
            />

            {/* Terms and Privacy Footer */}
            <View className="items-center justify-center px-4 mb-3">
              <Text className="text-[12px] text-slate-500 text-center leading-5">
                By signing up, you agree to our{" "}
                <Text
                  onPress={handleTermsPress}
                  className="text-[#5B52F9] underline font-medium"
                >
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text
                  onPress={handlePrivacyPress}
                  className="text-[#5B52F9] underline font-medium"
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>

            {/* Already have an account link */}
            <View className="flex-row items-center justify-center pt-2 pb-6">
              <Text className="text-[14px] text-slate-500">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleNavigateToLogin}
              >
                <Text className="text-[14px] font-semibold text-[#5B52F9]">
                  Log In
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
