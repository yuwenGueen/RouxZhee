/**
 * 构建 Pagefind 索引
 * 搜索结果 URL 会在运行时通过 withBase 自动拼接 DEPLOY_BASE 前缀
 */
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const siteDir = resolve(process.cwd(), 'dist');
const args = ['--site', siteDir];
const isWindows = process.platform === 'win32';
const executable = isWindows ? 'cmd' : 'pagefind';
const executableArgs = isWindows ? ['/c', 'pagefind.cmd', ...args] : args;

const child = spawn(executable, executableArgs, {
  stdio: 'inherit',
  shell: false,
});

child.on('error', (error) => {
  console.error('[pagefind] 启动失败:', error.message);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`[pagefind] 退出码: ${code}`);
    process.exit(code);
  }
  process.exit(0);
});
