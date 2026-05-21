import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { getShuffledQuestions, ShuffledQuestion } from "../utils/shuffle";

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Quiz">;
  route: RouteProp<RootStackParamList, "Quiz">;
};

const ANSWER_LABELS = ["A", "B", "C", "D"];

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const { playerName } = route.params;
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    setQuestions(getShuffledQuestions());
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? (currentIndex + 1) / questions.length : 0;

  const handleAnswer = useCallback(
    (index: number) => {
      if (answered || !currentQuestion) return;

      setSelectedAnswer(index);
      setAnswered(true);

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      if (index === currentQuestion.correctIndex) {
        setScore((prev) => prev + 1);
      }
    },
    [answered, currentQuestion, scaleAnim],
  );

  const handleNext = useCallback(() => {
    if (currentIndex === questions.length - 1) {
      navigation.replace("Result", {
        playerName,
        score,
        total: questions.length,
      });
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [currentIndex, questions.length, fadeAnim, navigation, playerName, score]);

  const handleQuit = () => {
    Alert.alert("Quit Quiz?", "Your progress will be lost.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Quit",
        style: "destructive",
        onPress: () => navigation.navigate("Home"),
      },
    ]);
  };

  const getAnswerStyle = (index: number) => {
    if (!answered) return styles.answerButton;
    if (index === currentQuestion.correctIndex)
      return [styles.answerButton, styles.correctAnswer];
    if (index === selectedAnswer && index !== currentQuestion.correctIndex)
      return [styles.answerButton, styles.wrongAnswer];
    return [styles.answerButton, styles.dimmedAnswer];
  };

  const getAnswerTextStyle = (index: number) => {
    if (!answered) return styles.answerText;
    if (index === currentQuestion.correctIndex)
      return [styles.answerText, styles.correctText];
    if (index === selectedAnswer && index !== currentQuestion.correctIndex)
      return [styles.answerText, styles.wrongText];
    return [styles.answerText, styles.dimmedText];
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitButton}>
          <Text style={styles.quitText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.scoreChip}>
          <Text style={styles.scoreText}>
            {score}/{currentIndex + (answered ? 1 : 0)}
          </Text>
        </View>
        <Text style={styles.questionCount}>
          {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>
              Question {currentIndex + 1}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <View style={styles.answersContainer}>
            {currentQuestion.answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={getAnswerStyle(index)}
                onPress={() => handleAnswer(index)}
                activeOpacity={answered ? 1 : 0.8}
                disabled={answered}
              >
                <View style={styles.answerLabelBox}>
                  <Text style={styles.answerLabel}>{ANSWER_LABELS[index]}</Text>
                </View>
                <Text style={getAnswerTextStyle(index)}>{answer}</Text>
                {answered && index === currentQuestion.correctIndex && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
                {answered &&
                  index === selectedAnswer &&
                  index !== currentQuestion.correctIndex && (
                    <Text style={styles.crossMark}>✗</Text>
                  )}
              </TouchableOpacity>
            ))}
          </View>

          {answered && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === questions.length - 1
                  ? "SEE RESULTS →"
                  : "NEXT QUESTION →"}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  quitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1E1E30",
    alignItems: "center",
    justifyContent: "center",
  },
  quitText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "700",
  },
  scoreChip: {
    backgroundColor: "#1A0D2E",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#7C3AED",
  },
  scoreText: {
    color: "#A78BFA",
    fontSize: 14,
    fontWeight: "700",
  },
  questionCount: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
    width: 50,
    textAlign: "right",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#1E1E30",
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7C3AED",
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  questionCard: {
    backgroundColor: "#13131F",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E1E30",
    minHeight: 140,
    justifyContent: "center",
  },
  questionLabel: {
    fontSize: 11,
    color: "#7C3AED",
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
    lineHeight: 30,
  },
  answersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  answerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#13131F",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#1E1E30",
    gap: 14,
  },
  correctAnswer: {
    backgroundColor: "#052E16",
    borderColor: "#16A34A",
  },
  wrongAnswer: {
    backgroundColor: "#2D0A0A",
    borderColor: "#DC2626",
  },
  dimmedAnswer: {
    opacity: 0.4,
  },
  answerLabelBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#1E1E30",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  answerLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "700",
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    color: "#D1D5DB",
    fontWeight: "500",
    lineHeight: 22,
  },
  correctText: {
    color: "#4ADE80",
  },
  wrongText: {
    color: "#F87171",
  },
  dimmedText: {
    color: "#6B7280",
  },
  checkMark: {
    color: "#4ADE80",
    fontSize: 18,
    fontWeight: "900",
  },
  crossMark: {
    color: "#F87171",
    fontSize: 18,
    fontWeight: "900",
  },
  nextButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
});

export default QuizScreen;
