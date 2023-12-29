import { HokeyAllMessages, HokeyLocaleMessages, isUnknownMessage } from "./util.js";

export type AccountWithLocale = {
    locale?: string;
};

export const getLang = (loc: string): string => (loc.includes("_") ? loc.substring(0, loc.indexOf("_")) : loc);

export class Hokey {
    readonly ALL_MESSAGES: HokeyAllMessages;
    readonly FALLBACK_DEFAULT_LOCALE: string;
    readonly SELECTABLE_LOCALES: string[];
    STOP_WORDS: string[] | null;

    constructor(ALL_MESSAGES: HokeyAllMessages, FALLBACK_DEFAULT_LOCALE: string, SELECTABLE_LOCALES: string[]) {
        this.ALL_MESSAGES = ALL_MESSAGES;
        this.FALLBACK_DEFAULT_LOCALE = FALLBACK_DEFAULT_LOCALE;
        this.SELECTABLE_LOCALES = SELECTABLE_LOCALES;
        this.STOP_WORDS = null;
    }

    localesForAccount(
        account: AccountWithLocale,
        browserLocale: string | null = null,
        anonLocale: string | null = null,
        defaultLocale: string | null = null,
    ): string[] {
        const locales: string[] = [];
        if (account && account.locale && !locales.includes(account.locale)) {
            locales.push(account.locale);
        }
        if (anonLocale && !locales.includes(anonLocale)) {
            locales.push(anonLocale);
        }

        if (browserLocale && !locales.includes(browserLocale)) {
            locales.push(browserLocale);
        }
        if (defaultLocale && !locales.includes(defaultLocale)) {
            locales.push(defaultLocale);
        }
        // console.log(`localesForAccount returning: ${JSON.stringify(locales)}`)
        return locales;
    }

    localesList(
        account: AccountWithLocale,
        browserLocale: string | null,
        anonLocale: string | null,
    ): HokeyLocaleMessages[] {
        const messages = this.findFirstLocaleMatch(this.localesForAccount(account, browserLocale, anonLocale));
        return this.SELECTABLE_LOCALES.map((loc: string) => {
            const localeDescription = messages["locale_" + loc];
            const sameLang = getLang(loc) === getLang(messages.id);
            const description =
                this.ALL_MESSAGES[loc] && this.ALL_MESSAGES[loc]["locale_" + loc]
                    ? this.ALL_MESSAGES[loc]["locale_" + loc] + (sameLang ? "" : ` (${localeDescription})`)
                    : localeDescription;
            return {
                name: loc,
                value: description,
            };
        });
    }

    findFirstLocaleNameMatch(locales: string[], defaultLocale?: string): string {
        for (const loc of locales) {
            if (typeof this.ALL_MESSAGES[loc] !== "undefined") {
                // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning MESSAGES[${loc}]`)
                return loc;
            }
        }
        // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning DEFAULT_LOCALE [${DEFAULT_LOCALE}]`)
        if (defaultLocale && this.ALL_MESSAGES[defaultLocale]) return defaultLocale;
        if (this.ALL_MESSAGES[this.FALLBACK_DEFAULT_LOCALE]) return this.FALLBACK_DEFAULT_LOCALE;

        const all = Object.keys(this.ALL_MESSAGES);
        if (all.length > 0) {
            return all[0]; // just return something valid
        }
        throw new Error("findFirstLocaleNameMatch: no languages defined!");
    }

    findFirstLocaleMatch(locales: string[]): HokeyLocaleMessages {
        return this.ALL_MESSAGES[this.findFirstLocaleNameMatch(locales)];
    }

    accountLocale(
        account: AccountWithLocale,
        browserLocale: string | null,
        anonLocale: string | null,
    ): HokeyLocaleMessages {
        const locales = this.localesForAccount(account, browserLocale, anonLocale);
        const match = this.findFirstLocaleMatch(locales);
        return {
            name: match.id,
            description: match["locale_" + match.id],
        };
    }

    currentLocaleForAccount(
        account: AccountWithLocale,
        browserLocale: string | null,
        anonLocale: string | null,
    ): string {
        const locales = this.localesForAccount(account, browserLocale, anonLocale);
        return this.findFirstLocaleNameMatch(locales);
    }

    localeMessagesForAccount(
        account: AccountWithLocale,
        browserLocale: string | null,
        anonLocale: string | null,
    ): HokeyLocaleMessages {
        // console.log(`localeMessagesForAccount(account=${account ? account.locale : null}, browser=${browserLocale}, anon=${anonLocale}} RETURNING: ${match.id || 'default'}`)
        const locales = this.localesForAccount(account, browserLocale, anonLocale);
        return this.findFirstLocaleMatch(locales);
    }

    localeEmoji(locale: string): string | undefined {
        return this.ALL_MESSAGES[locale] && this.ALL_MESSAGES[locale].emoji
            ? this.ALL_MESSAGES[locale].emoji
            : undefined;
    }

    stopWords = (): string[] => {
        if (this.STOP_WORDS != null) {
            return this.STOP_WORDS;
        }
        const stops: string[] = [];
        for (const locale of Object.keys(this.ALL_MESSAGES)) {
            if (
                this.ALL_MESSAGES[locale] &&
                this.ALL_MESSAGES[locale].search_stop_words &&
                !isUnknownMessage(this.ALL_MESSAGES[locale].search_stop_words)
            ) {
                stops.push(...this.ALL_MESSAGES[locale].search_stop_words.split(","));
            }
        }
        const allStops: string[] = [];
        allStops.push(...stops);
        this.STOP_WORDS = allStops;
        return this.STOP_WORDS;
    };
}
