
export type MessageRole = 'user' | 'model';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  image?: string; // Base64 string hoặc URL của ảnh
}

export interface Shortcut {
  key: string;
  command: string;
  description: string;
}

export interface CommonError {
  title: string;
  solutions: string[];
}
