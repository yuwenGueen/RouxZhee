import type {
  BeautifyPluginRuntime,
  BeautifyPluginSettings,
  BeautifyPost,
  BeautifyPostMetrics,
  BeautifyPostRulesOptions,
  BeautifySortBy,
  BeautifySortOrder,
} from '../types/plugins';

export const beautifyPluginId = 'rouxzhee-plugins-beautify' as const;

export const defaultBeautifySettings: BeautifyPluginSettings = {
  documentBackground: {
    enabled: true,
    preset: 'paper-light',
    imageUrl: '',
    opacity: 0.34,
  },
  kanban: {
    enabled: false,
    imageUrl: '',
    position: 'right-bottom',
    width: 180,
  },
  imagePlaceholder: {
    enabled: false,
    imageUrl: '',
    maxBytes: 100 * 1024,
  },
  home: {
    categories: [],
    sortBy: 'date',
    sortOrder: 'desc',
  },
  lists: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  comments: {
    enabled: false,
    apiBase: '',
  },
  friendLinks: {
    enabled: false,
    submitEnabled: false,
    apiBase: '',
  },
  share: {
    enabled: true,
    channels: ['wechat', 'qq', 'copy'],
  },
  analytics: {
    provider: 'none',
    apiBase: '',
    websiteId: '',
    publicScriptUrl: '',
  },
  customRequests: {
    enabled: false,
    endpoints: [],
  },
  metrics: {
    posts: {},
  },
};

export const disabledBeautifyRuntime: BeautifyPluginRuntime = {
  pluginId: beautifyPluginId,
  enabled: false,
  settings: defaultBeautifySettings,
};

export function normalizeBeautifyRuntime(input: unknown): BeautifyPluginRuntime {
  const candidate = input as Partial<BeautifyPluginRuntime> | null;
  return {
    pluginId: beautifyPluginId,
    enabled: Boolean(candidate?.enabled),
    version: typeof candidate?.version === 'string' ? candidate.version : undefined,
    settings: mergeBeautifySettings(defaultBeautifySettings, candidate?.settings),
  };
}

export function applyBeautifyPostRules(posts: BeautifyPost[], options: BeautifyPostRulesOptions): BeautifyPost[] {
  const { runtime, scope } = options;
  if (!runtime.enabled) {
    return sortPosts(posts, 'date', 'desc', {});
  }

  const listConfig = scope === 'home' ? runtime.settings.home : runtime.settings.lists;
  const categories = scope === 'home' ? (listConfig.categories ?? []).map((item) => item.trim()).filter(Boolean) : [];
  const filtered = categories.length > 0
    ? posts.filter((post) => post.category && categories.includes(post.category))
    : posts;

  return sortPosts(
    filtered,
    listConfig.sortBy,
    listConfig.sortOrder,
    runtime.settings.metrics.posts,
  );
}

function sortPosts(
  posts: BeautifyPost[],
  sortBy: BeautifySortBy,
  sortOrder: BeautifySortOrder,
  metrics: Record<string, BeautifyPostMetrics>,
): BeautifyPost[] {
  const direction = sortOrder === 'asc' ? 1 : -1;
  return [...posts].sort((left, right) => {
    if (sortBy === 'name') {
      return direction * String(left.title || left.slug).localeCompare(String(right.title || right.slug), 'zh-CN');
    }
    if (sortBy === 'views') {
      return direction * (postViews(left, metrics) - postViews(right, metrics));
    }
    return direction * (postTime(left) - postTime(right));
  });
}

function postTime(post: BeautifyPost): number {
  const value = new Date(post.date || '').getTime();
  return Number.isFinite(value) ? value : 0;
}

function postViews(post: BeautifyPost, metrics: Record<string, BeautifyPostMetrics>): number {
  const keys = [
    post.url,
    stripBasePath(post.url),
    post.slug,
    `/${post.slug}`,
  ].filter(Boolean);
  for (const key of keys) {
    const value = metrics[key]?.views;
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return post.readCount || 0;
}

function stripBasePath(value: string): string {
  try {
    const url = new URL(value, 'https://rouxzhee.local');
    return url.pathname;
  } catch {
    return value;
  }
}

function mergeBeautifySettings(defaults: BeautifyPluginSettings, overrides: unknown): BeautifyPluginSettings {
  const raw = isRecord(overrides) ? overrides : {};
  return {
    documentBackground: {
      ...defaults.documentBackground,
      ...recordValue(raw.documentBackground),
    },
    kanban: {
      ...defaults.kanban,
      ...recordValue(raw.kanban),
    },
    imagePlaceholder: {
      ...defaults.imagePlaceholder,
      ...recordValue(raw.imagePlaceholder),
    },
    home: {
      ...defaults.home,
      ...recordValue(raw.home),
      categories: stringArrayValue(recordValue(raw.home).categories ?? defaults.home.categories),
    },
    lists: {
      ...defaults.lists,
      ...recordValue(raw.lists),
    },
    comments: {
      ...defaults.comments,
      ...recordValue(raw.comments),
    },
    friendLinks: {
      ...defaults.friendLinks,
      ...recordValue(raw.friendLinks),
    },
    share: {
      ...defaults.share,
      ...recordValue(raw.share),
      channels: stringArrayValue(recordValue(raw.share).channels ?? defaults.share.channels),
    },
    analytics: {
      ...defaults.analytics,
      ...recordValue(raw.analytics),
    },
    customRequests: {
      ...defaults.customRequests,
      ...recordValue(raw.customRequests),
      endpoints: endpointArrayValue(recordValue(raw.customRequests).endpoints ?? defaults.customRequests.endpoints),
    },
    metrics: {
      posts: normalizePostMetrics(recordValue(recordValue(raw.metrics).posts)),
    },
  };
}

function endpointArrayValue(value: unknown): BeautifyPluginSettings['customRequests']['endpoints'] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => recordValue(item))
    .map((item) => {
      const method = String(item.method || 'GET').toUpperCase();
      return {
        key: String(item.key || '').trim(),
        method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
          ? method as BeautifyPluginSettings['customRequests']['endpoints'][number]['method']
          : 'GET',
        url: String(item.url || '').trim(),
        description: String(item.description || '').trim(),
      };
    })
    .filter((item) => item.key && item.url);
}

function normalizePostMetrics(value: Record<string, unknown>): Record<string, BeautifyPostMetrics> {
  const metrics: Record<string, BeautifyPostMetrics> = {};
  for (const [key, item] of Object.entries(value)) {
    const record = recordValue(item);
    const views = Number(record.views ?? 0);
    metrics[key] = { views: Number.isFinite(views) ? views : 0 };
  }
  return metrics;
}

function recordValue(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function stringArrayValue(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
