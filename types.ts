export interface User {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Poem {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: 'published' | 'draft';
  date: string;
  category?: string;
  author: User;
  readCount?: string; // e.g. "1.2k"
  imageUrl?: string;
  featured?: boolean;
}

export interface NavItem {
  icon: string;
  label: string;
  path: string;
}
