import { isUnknownMessage } from "./util.js";
export class Hokey {
    constructor(ALL_MESSAGES, FALLBACK_DEFAULT_LANG) {
        this.stopWords = () => {
            if (this.STOP_WORDS != null) {
                return this.STOP_WORDS;
            }
            const stops = [];
            for (const locale of Object.keys(this.ALL_MESSAGES)) {
                if (this.ALL_MESSAGES[locale] &&
                    this.ALL_MESSAGES[locale].search_stop_words &&
                    !isUnknownMessage(this.ALL_MESSAGES[locale].search_stop_words)) {
                    stops.push(...this.ALL_MESSAGES[locale].search_stop_words.split(","));
                }
            }
            const allStops = [];
            allStops.push(...stops);
            this.STOP_WORDS = allStops;
            return this.STOP_WORDS;
        };
        this.ALL_MESSAGES = ALL_MESSAGES;
        this.FALLBACK_DEFAULT_LANG = FALLBACK_DEFAULT_LANG;
        this.STOP_WORDS = null;
    }
    localesForAccount(account, browserLocale = null, anonLocale = null, defaultLocale = null) {
        const locales = [];
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
    localesList(account, browserLocale, anonLocale) {
        const messages = this.findFirstLocaleMatch(this.localesForAccount(account, browserLocale, anonLocale));
        return Object.keys(this.ALL_MESSAGES).map((loc) => {
            const localeDescription = messages["locale_" + loc];
            const description = this.ALL_MESSAGES[loc] && this.ALL_MESSAGES[loc]["locale_" + loc]
                ? `${this.ALL_MESSAGES[loc]["locale_" + loc]} (${localeDescription})`
                : localeDescription;
            return {
                name: loc,
                value: description,
            };
        });
    }
    findFirstLocaleNameMatch(locales, defaultLocale) {
        for (const loc of locales) {
            if (typeof this.ALL_MESSAGES[loc] !== "undefined") {
                // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning MESSAGES[${loc}]`)
                return loc;
            }
        }
        // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning DEFAULT_LOCALE [${DEFAULT_LOCALE}]`)
        if (defaultLocale && this.ALL_MESSAGES[defaultLocale])
            return defaultLocale;
        if (this.ALL_MESSAGES[this.FALLBACK_DEFAULT_LANG])
            return this.FALLBACK_DEFAULT_LANG;
        const all = Object.keys(this.ALL_MESSAGES);
        if (all.length > 0) {
            return all[0]; // just return something valid
        }
        throw new Error("findFirstLocaleNameMatch: no languages defined!");
    }
    findFirstLocaleMatch(locales) {
        return this.ALL_MESSAGES[this.findFirstLocaleNameMatch(locales)];
    }
    accountLocale(account, browserLocale, anonLocale) {
        const locales = this.localesForAccount(account, browserLocale, anonLocale);
        const match = this.findFirstLocaleMatch(locales);
        return {
            name: match.id,
            description: match["locale_" + match.id],
        };
    }
    currentLocaleForAccount(account, browserLocale, anonLocale) {
        const locales = this.localesForAccount(account, browserLocale, anonLocale);
        return this.findFirstLocaleNameMatch(locales);
    }
    localeMessagesForAccount(account, browserLocale, anonLocale) {
        // console.log(`localeMessagesForAccount(account=${account ? account.locale : null}, browser=${browserLocale}, anon=${anonLocale}} RETURNING: ${match.id || 'default'}`)
        const locales = this.localesForAccount(account, browserLocale, anonLocale);
        return this.findFirstLocaleMatch(locales);
    }
    localeEmoji(locale) {
        return this.ALL_MESSAGES[locale] && this.ALL_MESSAGES[locale].emoji
            ? this.ALL_MESSAGES[locale].emoji
            : undefined;
    }
}
