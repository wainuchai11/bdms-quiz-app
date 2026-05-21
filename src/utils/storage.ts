import AsyncStorage from "@react-native-async-storage/async-storage";

const LEADERBOARD_KEY = "quiz_leaderboard";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export const saveScore = async (
  entry: Omit<LeaderboardEntry, "id" | "date">,
): Promise<void> => {
  try {
    const existing = await getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [...existing, newEntry]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 20);
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save score:", error);
  }
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    return [];
  }
};

export const clearLeaderboard = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error("Failed to clear leaderboard:", error);
  }
};
