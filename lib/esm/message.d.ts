import { HokeyLocaleMessages } from "./util.js";
export declare const fieldErrorMessage: (field: string | {
    name: string;
    label?: string;
}, error: string | string[], messages: HokeyLocaleMessages, labelPrefixes?: string | string[]) => string;
export declare const findMessageKey: (key: string, messages: HokeyLocaleMessages, labelPrefixes?: string | string[]) => string | null;
export declare const findMessage: (key: string, messages: HokeyLocaleMessages, labelPrefixes?: string | string[]) => string;
