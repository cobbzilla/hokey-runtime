import { HokeyAllMessages, HokeyLocaleMessages } from "./util.js";
export type AccountWithLocale = {
    locale?: string;
};
export declare class Hokey {
    readonly ALL_MESSAGES: HokeyAllMessages;
    readonly FALLBACK_DEFAULT_LANG: string;
    STOP_WORDS: string[] | null;
    constructor(ALL_MESSAGES: HokeyAllMessages, FALLBACK_DEFAULT_LANG: string);
    localesForAccount(account: AccountWithLocale, browserLocale?: string | null, anonLocale?: string | null, defaultLocale?: string | null): string[];
    localesList(account: AccountWithLocale, browserLocale: string | null, anonLocale: string | null): HokeyLocaleMessages[];
    findFirstLocaleNameMatch(locales: string[], defaultLocale?: string): string;
    findFirstLocaleMatch(locales: string[]): HokeyLocaleMessages;
    accountLocale(account: AccountWithLocale, browserLocale: string | null, anonLocale: string | null): HokeyLocaleMessages;
    currentLocaleForAccount(account: AccountWithLocale, browserLocale: string | null, anonLocale: string | null): string;
    localeMessagesForAccount(account: AccountWithLocale, browserLocale: string | null, anonLocale: string | null): HokeyLocaleMessages;
    localeEmoji(locale: string): string | undefined;
    stopWords: (ALL_MESSAGES: HokeyAllMessages) => string[];
}
