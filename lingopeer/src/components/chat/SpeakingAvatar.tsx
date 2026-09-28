import React, { useEffect } from "react";
import { View, Text, Image, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export type PersonaStatus = "idle" | "speaking" | "thinking" | "recording";

interface SpeakingAvatarProps {
  agentId: string;
  agentName: string;
  language: string;
  flag: string;
  status: PersonaStatus;
  accentColor?: string;
  size?: number;
}

const AGENT_ASSETS: Record<string, any> = {
  sofia: require("../../../assets/images/user-avatar.png"),
  diego: require("../../../assets/images/agent-diego.png"),
  lucia: require("../../../assets/images/agent-lucia.png"),
  mateo: require("../../../assets/images/agent-mateo.png"),
};

const AGENT_COLORS: Record<string, { bg: string; ring: string; gradient: string }> = {
  sofia: { bg: "#EDE9FE", ring: "#8B5CF6", gradient: "#C4B5FD" },
  diego: { bg: "#E0F2FE", ring: "#0284C7", gradient: "#7DD3FC" },
  lucia: { bg: "#FCE7F3", ring: "#DB2777", gradient: "#F472B6" },
  mateo: { bg: "#FEF3C7", ring: "#D97706", gradient: "#FCD34D" },
};

export const SpeakingAvatar: React.FC<SpeakingAvatarProps> = ({
  agentId = "sofia",
  agentName = "Sofia",
  language = "Spanish",
  flag = "🇪🇸",
  status = "idle",
  size = 140,
}) => {
  const normalizedId = agentId.toLowerCase();
  const theme = AGENT_COLORS[normalizedId] || AGENT_COLORS.sofia;
  const avatarSource = AGENT_ASSETS[normalizedId] || AGENT_ASSETS.sofia;

  // Animation values
  const floatAnim = useSharedValue(0);
  const breathScale = useSharedValue(1);
  const waveScale1 = useSharedValue(1);
  const waveOpacity1 = useSharedValue(0);
  const waveScale2 = useSharedValue(1);
  const waveOpacity2 = useSharedValue(0);
  const mouthScaleY = useSharedValue(1);

  // Equalizer bar heights
  const bar1 = useSharedValue(8);
  const bar2 = useSharedValue(14);
  const bar3 = useSharedValue(22);
  const bar4 = useSharedValue(16);
  const bar5 = useSharedValue(10);

  // Idle breathing / floating effect
  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(floatAnim);
      cancelAnimation(breathScale);
    };
  }, []);

  // Status reactive animations (speaking soundwave & equalizer)
  useEffect(() => {
    if (status === "speaking") {
      // Ring 1 pulse
      waveScale1.value = withRepeat(
        withTiming(1.4, { duration: 1200, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      waveOpacity1.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 200 }),
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );

      // Ring 2 pulse (offset)
      waveScale2.value = withDelay(
        400,
        withRepeat(
          withTiming(1.65, { duration: 1400, easing: Easing.out(Easing.ease) }),
          -1,
          false
        )
      );
      waveOpacity2.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(0.5, { duration: 200 }),
            withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) })
          ),
          -1,
          false
        )
      );

      // Mouth / voice height animation
      mouthScaleY.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 150 }),
          withTiming(0.97, { duration: 150 })
        ),
        -1,
        true
      );

      // Equalizer bars bouncing
      bar1.value = withRepeat(
        withSequence(withTiming(18, { duration: 180 }), withTiming(6, { duration: 180 })),
        -1,
        true
      );
      bar2.value = withRepeat(
        withSequence(withTiming(26, { duration: 220 }), withTiming(8, { duration: 220 })),
        -1,
        true
      );
      bar3.value = withRepeat(
        withSequence(withTiming(32, { duration: 160 }), withTiming(10, { duration: 160 })),
        -1,
        true
      );
      bar4.value = withRepeat(
        withSequence(withTiming(24, { duration: 240 }), withTiming(8, { duration: 240 })),
        -1,
        true
      );
      bar5.value = withRepeat(
        withSequence(withTiming(16, { duration: 190 }), withTiming(6, { duration: 190 })),
        -1,
        true
      );
    } else {
      waveScale1.value = withTiming(1);
      waveOpacity1.value = withTiming(0);
      waveScale2.value = withTiming(1);
      waveOpacity2.value = withTiming(0);
      mouthScaleY.value = withTiming(1);

      bar1.value = withTiming(4);
      bar2.value = withTiming(4);
      bar3.value = withTiming(4);
      bar4.value = withTiming(4);
      bar5.value = withTiming(4);
    }
  }, [status]);

  // Animated styles
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }, { scale: breathScale.value * mouthScaleY.value }],
  }));

  const waveStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale1.value }],
    opacity: waveOpacity1.value,
  }));

  const waveStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale2.value }],
    opacity: waveOpacity2.value,
  }));

  const barStyle1 = useAnimatedStyle(() => ({ height: bar1.value }));
  const barStyle2 = useAnimatedStyle(() => ({ height: bar2.value }));
  const barStyle3 = useAnimatedStyle(() => ({ height: bar3.value }));
  const barStyle4 = useAnimatedStyle(() => ({ height: bar4.value }));
  const barStyle5 = useAnimatedStyle(() => ({ height: bar5.value }));

  // Status Badge Label & Color
  const getStatusBadge = () => {
    switch (status) {
      case "speaking":
        return {
          text: `${agentName} is speaking...`,
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          textColor: "text-emerald-700",
          dotColor: "bg-emerald-500",
        };
      case "recording":
        return {
          text: "Listening to you...",
          bg: "bg-rose-50",
          border: "border-rose-200",
          textColor: "text-rose-700",
          dotColor: "bg-rose-500",
        };
      case "thinking":
        return {
          text: `${agentName} is thinking...`,
          bg: "bg-amber-50",
          border: "border-amber-200",
          textColor: "text-amber-700",
          dotColor: "bg-amber-500",
        };
      case "idle":
      default:
        return {
          text: `Ready to practice in ${language}`,
          bg: "bg-slate-50",
          border: "border-slate-200",
          textColor: "text-slate-600",
          dotColor: "bg-indigo-500",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <View className="items-center justify-center my-3">
      {/* Radiating Soundwave Rings (when speaking or recording) */}
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: status === "recording" ? "#F43F5E" : theme.ring,
            },
            waveStyle2,
          ]}
        />
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: status === "recording" ? "#FB7185" : theme.gradient,
            },
            waveStyle1,
          ]}
        />

        {/* Center Animated Avatar Figure */}
        <Animated.View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.bg,
              borderWidth: 4,
              borderColor: status === "speaking" ? theme.ring : status === "recording" ? "#F43F5E" : "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              shadowColor: theme.ring,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            },
            floatStyle,
          ]}
        >
          <Image
            source={avatarSource}
            style={{ width: "95%", height: "95%" }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Floating Language Flag Badge */}
        <View
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderWidth: 1.5,
            borderColor: "#F1F5F9",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16 }}>{flag}</Text>
        </View>
      </View>

      {/* Voice Equalizer Waves (Visible when speaking) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          height: 36,
          marginTop: 8,
        }}
      >
        <Animated.View
          style={[
            {
              width: 3.5,
              backgroundColor: theme.ring,
              borderRadius: 2,
            },
            barStyle1,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 3.5,
              backgroundColor: theme.ring,
              borderRadius: 2,
            },
            barStyle2,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 3.5,
              backgroundColor: theme.ring,
              borderRadius: 2,
            },
            barStyle3,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 3.5,
              backgroundColor: theme.ring,
              borderRadius: 2,
            },
            barStyle4,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 3.5,
              backgroundColor: theme.ring,
              borderRadius: 2,
            },
            barStyle5,
          ]}
        />
      </View>

      {/* Status Pill Badge */}
      <View
        className={`flex-row items-center px-3.5 py-1.5 rounded-full border ${badge.bg} ${badge.border} shadow-sm`}
      >
        <View className={`w-2 h-2 rounded-full mr-2 ${badge.dotColor}`} />
        <Text className={`text-[12.5px] font-semibold ${badge.textColor}`}>
          {badge.text}
        </Text>
      </View>
    </View>
  );
};
