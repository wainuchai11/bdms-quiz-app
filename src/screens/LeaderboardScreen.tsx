import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import {
  getLeaderboard,
  clearLeaderboard,
  LeaderboardEntry,
} from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";

type LeaderboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Leaderboard">;
};

const getMedalEmoji = (index: number): string => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}`;
};

const getRankColor = (index: number): string => {
  if (index === 0) return "#F59E0B";
  if (index === 1) return "#9CA3AF";
  if (index === 2) return "#CD7C2F";
  return "#4B5563";
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  navigation,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard();
    setEntries(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard();
    }, []),
  );

  const handleClear = () => {
    Alert.alert(
      "Clear Leaderboard?",
      "All scores will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearLeaderboard();
            setEntries([]);
          },
        },
      ],
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => {
    const isMedal = index < 3;
    return (
      <View style={[styles.entryCard, index === 0 && styles.topEntry]}>
        <View
          style={[
            styles.rankBadge,
            { backgroundColor: isMedal ? "transparent" : "#1E1E30" },
          ]}
        >
          <Text
            style={[
              styles.rankText,
              { color: getRankColor(index), fontSize: isMedal ? 22 : 15 },
            ]}
          >
            {getMedalEmoji(index)}
          </Text>
        </View>

        <View style={styles.entryInfo}>
          <Text style={styles.entryName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.entryDate}>{item.date}</Text>
        </View>

        <View style={styles.entryScore}>
          <Text
            style={[styles.percentageValue, { color: getRankColor(index) }]}
          >
            {item.percentage}%
          </Text>
          <Text style={styles.rawScore}>
            {item.score}/{item.total}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        {entries.length > 0 ? (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={styles.emptyTitle}>No scores yet</Text>
          <Text style={styles.emptySubtext}>
            Complete a quiz to appear here!
          </Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate("NameEntry")}
          >
            <Text style={styles.playButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.listHeader}>Top {entries.length} Scores</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    color: "#7C3AED",
    fontSize: 15,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  clearText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  listHeader: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
    marginTop: 4,
  },
  entryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#13131F",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E1E30",
    gap: 14,
  },
  topEntry: {
    borderColor: "#F59E0B",
    backgroundColor: "#1A1408",
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rankText: {
    fontWeight: "800",
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 11,
    color: "#6B7280",
  },
  entryScore: {
    alignItems: "flex-end",
  },
  percentageValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  rawScore: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
});

export default LeaderboardScreen;
