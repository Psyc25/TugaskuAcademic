export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export type CategoryType = 'akademik' | 'tugas akhir' | 'digital';

export interface ServiceItem {
  id: string;
  name: string;
  priceFrom: string;
  category: CategoryType;
  estimation: string;
  complexity?: number; // percentage value from 0 to 100
  difficultyLabel?: string; // e.g. "Sederhana", "Menengah", "Kompleks"
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface AcademicTip {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  author: string;
  readTime: string;
  date: string;
  likes: number;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  major: string;
  university: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount?: number;
}

export interface BookedTask {
  id: string;
  name: string;
  subject: string;
  status: "pending" | "processing" | "completed";
  grade?: string | null;
  deadline?: string;
}

