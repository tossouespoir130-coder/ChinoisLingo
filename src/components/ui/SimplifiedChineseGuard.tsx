'use client';

import { useEffect } from 'react';

/**
 * Paires de conversion Caractères Traditionnels -> Caractères Simplifiés
 */
const TRAD_TO_SIMP_ENTRIES: Array<[string, string]> = [
  ['鬆', '松'], ['門', '门'], ['國', '国'], ['學', '学'], ['點', '点'], ['個', '个'], ['會', '会'], ['這', '这'],
  ['說', '说'], ['們', '们'], ['來', '来'], ['時', '时'], ['對', '对'], ['發', '发'], ['經', '经'], ['樣', '样'],
  ['頭', '头'], ['見', '见'], ['邊', '边'], ['買', '买'], ['車', '车'], ['幾', '几'], ['錢', '钱'], ['謝', '谢'],
  ['歡', '欢'], ['條', '条'], ['話', '话'], ['飯', '饭'], ['聽', '听'], ['寫', '写'], ['讀', '读'], ['課', '课'],
  ['識', '识'], ['誰', '谁'], ['兒', '儿'], ['麼', '么'], ['號', '号'], ['飛', '飞'], ['機', '机'], ['電', '电'],
  ['視', '视'], ['腦', '脑'], ['語', '语'], ['漢', '汉'], ['筆', '笔'], ['網', '网'], ['貴', '贵'], ['師', '师'],
  ['總', '总'], ['產', '产'], ['品', '品'], ['錄', '录'], ['關', '关'], ['順', '顺'], ['雙', '双'], ['熱', '热'],
  ['進', '进'], ['長', '长'], ['過', '过'], ['還', '还'], ['為', '为'], ['後', '后'], ['體', '体'], ['開', '开'],
  ['動', '动'], ['問', '问'], ['題', '题'], ['實', '实'], ['現', '现'], ['從', '从'], ['無', '无'], ['義', '义'],
  ['認', '认'], ['選', '选'], ['難', '难'], ['幫', '帮'], ['帶', '带'], ['員', '员'], ['館', '馆'], ['廣', '广'],
  ['場', '场'], ['處', '处'], ['辦', '办'], ['讓', '让'], ['與', '与'], ['將', '将'], ['並', '并'], ['裏', '里'],
  ['裡', '里'], ['愛', '爱'], ['麵', '面'], ['魚', '鱼'], ['鳥', '鸟'], ['馬', '马'], ['書', '书'], ['東', '东'],
  ['西', '西'], ['南', '南'], ['北', '北'], ['戶', '户'], ['華', '华'], ['龍', '龙'], ['風', '风'], ['雲', '云'],
  ['氣', '气'], ['節', '节'], ['慶', '庆'], ['歲', '岁'], ['紅', '红'], ['綠', '绿'], ['藍', '蓝'], ['黃', '黄'],
  ['黑', '黑'], ['白', '白'], ['樂', '乐'], ['聲', '声'], ['音', '音'], ['親', '亲'], ['友', '友'], ['朋', '朋'],
];

const TRAD_TO_SIMP_MAP = new Map<string, string>(TRAD_TO_SIMP_ENTRIES);
const TRAD_CHARS_PATTERN = Array.from(TRAD_TO_SIMP_MAP.keys()).join('');
const TRAD_REGEX = new RegExp(`[${TRAD_CHARS_PATTERN}]`, 'g');

function sanitizeTextToSimplified(text: string): string {
  if (!text || !TRAD_REGEX.test(text)) return text;
  return text.replace(TRAD_REGEX, (match) => TRAD_TO_SIMP_MAP.get(match) || match);
}

/**
 * Composant de protection active contre toute mutation externe de caractères chinois simplifiés (简体字).
 * Intercepte et corrige en temps réel toute altération provoquée par les extensions de navigateur ou traducteurs.
 */
export function SimplifiedChineseGuard() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let isGuarding = false;

    function sanitizeNode(node: Node) {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        const sanitized = sanitizeTextToSimplified(node.nodeValue);
        if (sanitized !== node.nodeValue) {
          node.nodeValue = sanitized;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        for (let i = 0; i < el.childNodes.length; i++) {
          sanitizeNode(el.childNodes[i]);
        }
      }
    }

    // Initial pass on document body
    sanitizeNode(document.body);

    const observer = new MutationObserver((mutations) => {
      if (isGuarding) return;
      isGuarding = true;

      try {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData' && mutation.target) {
            sanitizeNode(mutation.target);
          } else if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => sanitizeNode(node));
          }
        }
      } finally {
        isGuarding = false;
      }
    });

    observer.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
