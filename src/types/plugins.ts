import type { Post } from './post';

export type BeautifySortBy = 'date' | 'name' | 'views';
export type BeautifySortOrder = 'asc' | 'desc';

export interface BeautifyDocumentBackgroundConfig {
  enabled: boolean;
  preset: 'paper-light' | 'custom' | 'none';
  imageUrl: string;
  opacity: number;
}

export interface BeautifyKanbanConfig {
  enabled: boolean;
  imageUrl: string;
  position: 'left-bottom' | 'right-bottom' | 'left-top' | 'right-top';
  width: number;
}

export interface BeautifyImagePlaceholderConfig {
  enabled: boolean;
  imageUrl: string;
  maxBytes: number;
}

export interface BeautifyPostListConfig {
  categories?: string[];
  sortBy: BeautifySortBy;
  sortOrder: BeautifySortOrder;
}

export interface BeautifyShareConfig {
  enabled: boolean;
  channels: string[];
}

export interface BeautifyPostMetrics {
  views?: number;
}

export interface BeautifyCustomRequestEndpoint {
  key: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  description?: string;
}

export interface BeautifyPluginSettings {
  documentBackground: BeautifyDocumentBackgroundConfig;
  kanban: BeautifyKanbanConfig;
  imagePlaceholder: BeautifyImagePlaceholderConfig;
  home: BeautifyPostListConfig;
  lists: BeautifyPostListConfig;
  comments: {
    enabled: boolean;
    apiBase: string;
  };
  friendLinks: {
    enabled: boolean;
    submitEnabled: boolean;
    apiBase: string;
  };
  share: BeautifyShareConfig;
  analytics: {
    provider: 'none' | 'rouxzhee-cloud' | 'umami' | 'custom';
    apiBase: string;
    websiteId: string;
    publicScriptUrl: string;
  };
  customRequests: {
    enabled: boolean;
    endpoints: BeautifyCustomRequestEndpoint[];
  };
  metrics: {
    posts: Record<string, BeautifyPostMetrics>;
  };
}

export interface BeautifyPluginRuntime {
  pluginId: 'rouxzhee-plugins-beautify';
  enabled: boolean;
  version?: string;
  settings: BeautifyPluginSettings;
}

export interface BeautifyPostRulesOptions {
  scope: 'home' | 'list';
  runtime: BeautifyPluginRuntime;
}

export type BeautifyPost = Post & {
  readCount?: number;
};
