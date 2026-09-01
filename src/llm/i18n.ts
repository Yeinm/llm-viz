// Minimal bilingual (English / Simplified Chinese) support for the LLM visualization.
//
// The walkthrough phases re-evaluate their commentary text every frame, and the
// 3D labels are drawn every frame, so switching the language takes effect on the
// very next frame. `L()` is resolved at call time from the current language.

export type Language = 'en' | 'zh';

const STORAGE_KEY = 'llm-viz-language';

let language: Language = 'en';

try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'zh' || saved === 'en') {
        language = saved;
    }
} catch { /* ignore */ }

export function getLanguage(): Language {
    return language;
}

export function setLanguage(lang: Language): void {
    language = lang;
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch { /* ignore */ }
}

export function isZh(): boolean {
    return language === 'zh';
}

/** Pick the string for the current language: L('English', '中文'). */
export function L(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
}

/**
 * Bilingual value that is resolved lazily at read time, used for 3D block labels
 * so that they update live when the language is switched.
 */
export function LB(en: string, zh: string): () => string {
    return () => L(en, zh);
}

export function resolveName(name: string | (() => string)): string {
    return typeof name === 'function' ? name() : name;
}
