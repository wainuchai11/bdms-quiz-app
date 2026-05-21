import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { saveScore } from "../utils/storage";

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Result">;
  route: RouteProp<RootStackParamList, "Result">;
};

const getGrade = (
  percentage: number,
): { label: string; emoji: string; color: string } => {
  if (percentage >= 90)
    return { label: "EXCELLENT!", emoji: "🏆", color: "#F59E0B" };
  if (percentage >= 75)
    return { label: "GREAT JOB!", emoji: "🎉", color: "#10B981" };
  if (percentage >= 60)
    return { label: "GOOD WORK", emoji: "👍", color: "#3B82F6" };
  if (percentage >= 40)
    return { label: "KEEP TRYING", emoji: "💪", color: "#F97316" };
  return { label: "PRACTICE MORE", emoji: "📚", color: "#EF4444" };
};

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { playerName, score, total } = route.params;
  const percentage = Math.round((score / total) * 100);
  const grade = getGrade(percentage);
  const [saved, setSaved] = useState(false);

  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!saved) {
      saveScore({ name: playerName, score, total, percentage });
      setSaved(true);
    }

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.scoreCircle, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.emojiLarge}>{grade.emoji}</Text>
          <Text style={[styles.percentageText, { color: grade.color }]}>
            {percentage}%
          </Text>
          <Text style={[styles.gradeLabel, { color: grade.color }]}>
            {grade.label}
          </Text>
        </Animated.View>

        <Text style={styles.playerName}>{playerName}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMiddle]}>
            <Text style={styles.statValue}>{total - score}</Text>
            <Text style={styles.statLabel}>Wrong</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.savedText}>✓ Score saved to leaderboard</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.replace("Quiz", { playerName })}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Leaderboard")}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>🏆 VIEW LEADERBOARD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.85}
          >
            <Text style={styles.ghostButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  scoreCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#13131F",
    borderWidth: 3,
    borderColor: "#1E1E30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emojiLarge: {
    fontSize: 36,
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 44,
  },
  gradeLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 2,
  },
  playerName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#13131F",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E1E30",
  },
  statBoxMiddle: {
    borderColor: "#2D2D45",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  savedText: {
    color: "#4ADE80",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonGroup: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2D2D45",
  },
  secondaryButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  ghostButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  ghostButtonText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ResultScreen;
