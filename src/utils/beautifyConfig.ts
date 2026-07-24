import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import {
  beautifyPluginId,
  disabledBeautifyRuntime,
  normalizeBeautifyRuntime,
} from './beautifyRuntime';
import type { BeautifyPluginRuntime } from '../types/plugins';

export function readBeautifyPluginRuntime(projectRoot = process.cwd()): BeautifyPluginRuntime {
  const pluginFile = resolve(projectRoot, '.site-data/plugins/rouxzhee-plugins-beautify.json');
  const pluginRuntime = readPluginFile(pluginFile);
  if (pluginRuntime) {
    return pluginRuntime;
  }

  const pluginsFile = resolve(projectRoot, '.site-data/plugins.json');
  const allPlugins = readJSON(pluginsFile);
  if (isRecord(allPlugins) && isRecord(allPlugins.plugins)) {
    return normalizeBeautifyRuntime(allPlugins.plugins[beautifyPluginId]);
  }

  return disabledBeautifyRuntime;
}

function readPluginFile(filePath: string): BeautifyPluginRuntime | null {
  const payload = readJSON(filePath);
  if (!isRecord(payload)) {
    return null;
  }
  if (isRecord(payload.plugin)) {
    return normalizeBeautifyRuntime(payload.plugin);
  }
  return normalizeBeautifyRuntime(payload);
}

function readJSON(filePath: string): unknown {
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.warn(`[beautify] 读取插件配置失败: ${filePath}`, error);
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
