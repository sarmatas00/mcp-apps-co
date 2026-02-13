export interface AppAuthor {
  name: string;
  avatarUrl?: string;
  github?: string;
  website?: string;
  bio?: string;
}

export interface ClientCompatibility {
  claude: boolean;
  chatgpt: boolean;
  vscode: boolean;
  goose: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  content: string;
  clientUsed: keyof ClientCompatibility;
}

export interface RelatedApp {
  id: string;
  slug: string;
  name: string;
  screenshotUrl: string;
  category: string;
  rating: number;
}

export interface AppDetailData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  screenshots: string[];
  category: string;
  rating: number;
  reviewCount: number;
  installCount: number;
  author: AppAuthor;
  compatibility: ClientCompatibility;
  githubUrl?: string;
  websiteUrl?: string;
  reviews: Review[];
  relatedApps: RelatedApp[];
}
