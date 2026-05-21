import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      <View style={styles.header}>
        <Text style={styles.badge}>REACT NATIVE</Text>
        <Text style={styles.title}>QUIZ</Text>
        <Text style={styles.subtitle}>TypeScript Edition</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📋</Text>
          <Text style={styles.infoText}>20 Questions per round</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🔀</Text>
          <Text style={styles.infoText}>Randomized every session</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🏆</Text>
          <Text style={styles.infoText}>Global leaderboard</Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("NameEntry")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>START QUIZ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Leaderboard")}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>🏆 LEADERBOARD</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Built with React Native + TypeScript</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    paddingHorizontal: 28,
    justifyContent: "space-between",
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
    color: "#7C3AED",
    marginBottom: 12,
    backgroundColor: "#1A0D2E",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#7C3AED",
  },
  title: {
    fontSize: 72,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -2,
    lineHeight: 72,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    letterSpacing: 2,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#13131F",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: "#1E1E30",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  infoIcon: {
    fontSize: 22,
  },
  infoText: {
    fontSize: 15,
    color: "#D1D5DB",
    fontWeight: "500",
  },
  buttonGroup: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2D2D45",
  },
  secondaryButtonText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
  },
  footer: {
    textAlign: "center",
    color: "#374151",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
