const UNKNOWN_MESSAGE_PREFIX = "???";
export const unknownMessage = (msg) => UNKNOWN_MESSAGE_PREFIX + msg;
export const isUnknownMessage = (msg) => !msg || msg.startsWith(UNKNOWN_MESSAGE_PREFIX);
export const messageExists = (msgKey, messages) => !isUnknownMessage(messages[msgKey]);
export const localeLang = (locale) => locale.includes("_") ? locale.substring(0, locale.indexOf("_")) : locale;
const messageNotFoundHandler = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(target, name) {
        if (typeof name === "undefined")
            return unknownMessage("undefined");
        if (name === null)
            return unknownMessage("null");
        if (name === "")
            return unknownMessage("empty");
        const checkExists = name.toString().startsWith("!");
        const index = checkExists ? name.toString().substring(1) : name;
        /* eslint-disable no-prototype-builtins */
        if (target.hasOwnProperty(index))
            return checkExists ? true : target[index];
        const altName = index.toString().replace(/\./g, "_");
        if (target.hasOwnProperty(altName))
            return checkExists ? true : target[altName];
        /* eslint-enable no-prototype-builtins */
        return checkExists ? false : unknownMessage(name.toString());
    },
};
export const wrapMessages = (messages) => new Proxy(Object.assign({}, messages), messageNotFoundHandler);
export const normalizeMsg = (errMsg) => errMsg.replace(/\[\d+]/, "").replace(/\./g, "_");
export const errMatch = (f) => (e) => normalizeMsg(e) === normalizeMsg(f);
export const errMatchStart = (objPath) => (e) => normalizeMsg(e).startsWith(`${normalizeMsg(objPath)}_`);
//# sourceMappingURL=util.js.map