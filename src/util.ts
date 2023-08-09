const UNKNOWN_MESSAGE_PREFIX = "???";

export const unknownMessage = (msg: string): string => UNKNOWN_MESSAGE_PREFIX + msg;
export const isUnknownMessage = (msg: string): boolean => !msg || msg.startsWith(UNKNOWN_MESSAGE_PREFIX);

export const messageExists = (msgKey: string, messages: HokeyLocaleMessages): boolean =>
    !isUnknownMessage(messages[msgKey]);

export type HokeyLocaleMessages = Record<string, string>;
export type HokeyAllMessages = Record<string, HokeyLocaleMessages>;

export const localeLang = (locale: string): string =>
    locale.includes("_") ? locale.substring(0, locale.indexOf("_")) : locale;

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
