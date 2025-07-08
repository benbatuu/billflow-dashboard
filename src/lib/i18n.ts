export type Locale = "tr" | "en"

const loadedLocales: Record<Locale, any> = {
    tr: {},
    en: {},
}

export async function loadLocale(lang: Locale) {
    if (Object.keys(loadedLocales[lang]).length > 0) return loadedLocales[lang]
    if (lang === "tr") {
        loadedLocales.tr = (await import("@/locales/tr.json")).default
        return loadedLocales.tr
    } else {
        loadedLocales.en = (await import("@/locales/en.json")).default
        return loadedLocales.en
    }
}

export function getCurrentLang(): Locale {
    if (typeof window !== "undefined") {
        return (localStorage.getItem("lang") as Locale) || "tr"
    }
    return "tr"
}

export async function t(key: string): Promise<string> {
    const lang = getCurrentLang()
    const dict = await loadLocale(lang)
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), dict) || key
} 