// 🕊️白木 原创开发 🔗gl.baimu.live
// 将字符串拆分为普通文本与 emoji 片段，用于渐变标题等场景

export type TextSegment = {
  type: 'text' | 'emoji';
  content: string;
};

const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

/**
 * 按 grapheme 拆分字符串，合并相邻的同类型片段。
 * emoji 片段保持原生彩色渲染，文本片段可单独应用渐变色。
 */
export function splitTextAndEmoji(input: string): TextSegment[] {
  if (!input) return [];

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const segments: TextSegment[] = [];

  for (const { segment } of segmenter.segment(input)) {
    const type: TextSegment['type'] = EMOJI_PATTERN.test(segment) ? 'emoji' : 'text';
    const last = segments.at(-1);

    if (last?.type === type) {
      last.content += segment;
      continue;
    }

    segments.push({ type, content: segment });
  }

  return segments;
}
