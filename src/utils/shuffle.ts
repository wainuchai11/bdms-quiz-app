import { Question, ALL_QUESTIONS } from "../data/questions";

export interface ShuffledQuestion {
  id: number;
  question: string;
  answers: string[];
  correctIndex: number;
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const getShuffledQuestions = (): ShuffledQuestion[] => {
  const shuffledQuestions = shuffleArray(ALL_QUESTIONS);

  return shuffledQuestions.map((q: Question) => {
    const correctAnswer = q.answers[q.correctIndex];
    const shuffledAnswers = shuffleArray(q.answers);
    const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer);

    return {
      id: q.id,
      question: q.question,
      answers: shuffledAnswers,
      correctIndex: newCorrectIndex,
    };
  });
};
