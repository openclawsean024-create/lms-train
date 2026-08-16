export type Question = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  createdAt: number;
  questions: Question[];
};

export type Submission = {
  id: string;
  courseId: string;
  email: string;
  answers: number[];
  score: number;
  perQuestion: { qid: string; correct: boolean }[];
  at: number;
};

export type Stats = {
  total: number;
  avg: number;
  perQuestion: { qid: string; prompt: string; correctRate: number; totalAnswers: number }[];
};
