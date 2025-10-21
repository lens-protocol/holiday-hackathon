export type SearchResultType = 'user' | 'pill' | 'path' | 'feed' | 'article';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  handle?: string;
  avatar?: string;
  techScore?: number;
  tags?: string[];
  createdAt: string;
  author?: {
    handle: string;
    name: string;
    avatar: string;
  };
}
