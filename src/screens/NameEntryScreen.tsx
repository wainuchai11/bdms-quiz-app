import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type NameEntryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "NameEntry">;
};

const NameEntryScreen: React.FC<NameEntryScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }
    if (trimmed.length < 2) {
      Alert.alert("Name Too Short", "Name must be at least 2 characters.");
      return;
    }
    navigation.navigate("Quiz", { playerName: trimmed });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.emoji}>👤</Text>
          <Text style={styles.title}>Enter Your Name</Text>
          <Text style={styles.subtitle}>
            Your name will appear on the leaderboard
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. QuizMaster99"
            placeholderTextColor="#4B5563"
            value={name}
            onChangeText={setName}
            maxLength={20}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
          <Text style={styles.charCount}>{name.length}/20</Text>

          <TouchableOpacity
            style={[
              styles.startButton,
              !name.trim() && styles.startButtonDisabled,
            ]}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.startButtonText}>BEGIN QUIZ →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#7C3AED",
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 36,
  },
  input: {
    width: "100%",
    backgroundColor: "#13131F",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    borderWidth: 1.5,
    borderColor: "#2D2D45",
    textAlign: "center",
    marginBottom: 6,
  },
  charCount: {
    color: "#4B5563",
    fontSize: 12,
    textAlign: "right",
    width: "100%",
    marginBottom: 28,
  },
  startButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 48,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: "#3D2060",
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
});

export default NameEntryScreen;
