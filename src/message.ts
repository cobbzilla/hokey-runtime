import { parseMessage } from "./parse.js";
import { HokeyAllMessages, HokeyLocaleMessages, isUnknownMessage, unknownMessage } from "./util.js";

const messageNotFoundHandler = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(target: any, name: any): string | boolean {
        if (typeof name === "undefined") return unknownMessage("undefined");
        if (name === null) return unknownMessage("null");
        if (name === "") return unknownMessage("empty");
        const checkExists = name.toString().startsWith("!");
        const index = checkExists ? name.toString().substring(1) : name;
        /* eslint-disable no-prototype-builtins */
        if (target.hasOwnProperty(index)) return checkExists ? true : target[index];
        const altName = index.toString().replace(/\./g, "_");
        if (target.hasOwnProperty(altName)) return checkExists ? true : target[altName];
        /* eslint-enable no-prototype-builtins */
        return checkExists ? false : unknownMessage(name.toString());
    },
};

export const wrapMessages = (messages: HokeyLocaleMessages): HokeyLocaleMessages =>
    new Proxy(Object.assign({}, messages), messageNotFoundHandler);

export type AccountWithLocale = {
    locale?: string;
};

export class hokey {
    readonly ALL_MESSAGES: HokeyAllMessages;
    readonly FALLBACK_DEFAULT_LANG: string;
    STOP_WORDS: string[] | null;
    constructor(ALL_MESSAGES: HokeyAllMessages, FALLBACK_DEFAULT_LANG: string) {
        this.ALL_MESSAGES = ALL_MESSAGES;
        this.FALLBACK_DEFAULT_LANG = FALLBACK_DEFAULT_LANG;
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
        return Object.keys(this.ALL_MESSAGES).map((loc: string) => {
            const localeDescription = messages["locale_" + loc];
            const description =
                this.ALL_MESSAGES[loc] && this.ALL_MESSAGES[loc]["locale_" + loc]
                    ? `${this.ALL_MESSAGES[loc]["locale_" + loc]} (${localeDescription})`
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
        if (defaultLocale) return defaultLocale;
        if (this.ALL_MESSAGES[this.FALLBACK_DEFAULT_LANG]) return this.FALLBACK_DEFAULT_LANG;

        const all = Object.keys(this.ALL_MESSAGES);
        if (all.length > 0) {
            return all[0]; // just return something valid
        }
        throw new Error("findFirstLocaleMatch: no languages defined in MESSAGES!");
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

    stopWords = (ALL_MESSAGES: HokeyAllMessages): string[] => {
        if (this.STOP_WORDS != null) {
            return this.STOP_WORDS;
        }
        const stops: string[] = [];
        for (const locale of Object.keys(ALL_MESSAGES)) {
            if (
                ALL_MESSAGES[locale] &&
                ALL_MESSAGES[locale].search_stop_words &&
                !isUnknownMessage(ALL_MESSAGES[locale].search_stop_words)
            ) {
                stops.push(...ALL_MESSAGES[locale].search_stop_words.split(","));
            }
        }
        const allStops: string[] = [];
        allStops.push(...stops);
        this.STOP_WORDS = allStops;
        return this.STOP_WORDS;
    };
}

const findBaseErrorMessage = (err: string, messages: HokeyLocaleMessages) => {
    const msg = "error_field_" + err;
    if (!isUnknownMessage(messages[msg])) return msg;
    const idx = err.lastIndexOf("_");
    const baseMsg = idx === -1 || idx === err.length - 1 ? null : "error_field_" + err.substring(idx + 1);
    if (!baseMsg || isUnknownMessage(messages[baseMsg])) return "?!!" + err;
    return baseMsg;
};

export const fieldErrorMessage = (
    field: string | { name: string; label?: string },
    error: string | string[],
    messages: HokeyLocaleMessages,
    labelPrefixes: string | string[] = ["", "label_"],
) => {
    let fieldObject = null;
    if (typeof field === "object") {
        fieldObject = field;
        field = field.name;
    }
    if (typeof labelPrefixes === "string") {
        labelPrefixes = [labelPrefixes];
    }
    const fieldMessage =
        fieldObject && fieldObject.label && !isUnknownMessage(messages[fieldObject.label])
            ? messages[fieldObject.label]
            : findMessage(field, messages, labelPrefixes);
    if (Array.isArray(error)) {
        let message = "";
        for (const e of error) {
            if (message.length > 0) {
                message += ", ";
            }
            message += parseMessage(findBaseErrorMessage(e, messages), messages, {
                field: fieldMessage,
            });
        }
        return message;
    } else {
        return parseMessage(findBaseErrorMessage(error, messages), messages, {
            field: fieldMessage,
        });
    }
};

export const findMessageKey = (
    key: string,
    messages: HokeyLocaleMessages,
    labelPrefixes: string | string[] = ["", "label_"],
): string | null => {
    if (typeof labelPrefixes === "string") {
        labelPrefixes = [labelPrefixes];
    }
    if (!Array.isArray(labelPrefixes)) {
        throw new TypeError(
            `findMessage: unexpected type for labelPrefixes param, expected a string or array. typeof(labelPrefixes)=${typeof labelPrefixes}, Array.isArray(labelPrefixes)=${Array.isArray(
                labelPrefixes,
            )}`,
        );
    }
    for (const prefix of labelPrefixes) {
        const msgKey = prefix + key;
        const msg = messages[msgKey];
        if (!isUnknownMessage(msg)) {
            return msgKey;
        }
    }
    return null;
};

export const findMessage = (
    key: string,
    messages: HokeyLocaleMessages,
    labelPrefixes: string | string[] = ["", "label_"],
): string => {
    if (typeof labelPrefixes === "string") {
        labelPrefixes = [labelPrefixes];
    }
    if (!Array.isArray(labelPrefixes)) {
        throw new TypeError(
            `findMessage: unexpected type for labelPrefixes param, expected a string or array. typeof(labelPrefixes)=${typeof labelPrefixes}, Array.isArray(labelPrefixes)=${Array.isArray(
                labelPrefixes,
            )}`,
        );
    }
    for (const prefix of labelPrefixes) {
        const msgKey = prefix + key;
        const msg = messages[msgKey];
        if (!isUnknownMessage(msg)) {
            return msg;
        }
    }
    // It's unknown by all prefixes, punt and return the first message as an unknown message
    return messages[labelPrefixes[0] + key];
};
