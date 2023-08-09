
const UNKNOWN_MESSAGE_PREFIX = "???";

export const unknownMessage = (msg: string): string => UNKNOWN_MESSAGE_PREFIX + msg;
export const isUnknownMessage = (msg: string): boolean => !msg || msg.startsWith(UNKNOWN_MESSAGE_PREFIX);

export type HokeyLocaleMessages = Record<string, string>;
export type HokeyAllMessages = Record<string, HokeyLocaleMessages>;

export const messageExists = (msgKey: string, messages: HokeyLocaleMessages): boolean => {
    return !isUnknownMessage(messages[msgKey]);
};

export const localeLang = (locale: string): string =>
    locale.includes("_") ? locale.substring(0, locale.indexOf("_")) : locale;

