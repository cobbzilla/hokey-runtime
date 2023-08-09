export declare const unknownMessage: (msg: string) => string;
export declare const isUnknownMessage: (msg: string) => boolean;
export declare const messageExists: (msgKey: string, messages: HokeyLocaleMessages) => boolean;
export type HokeyLocaleMessages = Record<string, string>;
export type HokeyAllMessages = Record<string, HokeyLocaleMessages>;
export declare const localeLang: (locale: string) => string;
export declare const wrapMessages: (messages: HokeyLocaleMessages) => HokeyLocaleMessages;
