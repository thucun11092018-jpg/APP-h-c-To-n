export type Difficulty = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';

export type QuestionType = 'Trắc nghiệm nhiều lựa chọn' | 'Trắc nghiệm đúng sai' | 'Trắc nghiệm trả lời ngắn';

export type ZoneType = 'text' | 'checkbox' | 'dropzone';

export interface InteractiveZone {
  id: string;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  type: ZoneType;
  correctAnswer: string;
}

export interface Question {
  id: string;
  text: string;
  type?: QuestionType; // optional to avoid breaking anything else temporarily
  options: string[]; // For short answer, this might be empty, or correctAnswerIndex might be ignored
  shortAnswerText?: string; // For short answer type
  trueFalseAnswers?: boolean[]; // For true/false (usually 4 statements)
  correctAnswerIndex: number;
  difficulty: Difficulty;
  explanation: string;
}

export interface StudentAccount {
  id: string;
  username: string;
  name: string;
  password?: string;
}

export interface GameItem {
  id: string;
  text: string;
  isProposition: boolean;
  explanation: string;
}
