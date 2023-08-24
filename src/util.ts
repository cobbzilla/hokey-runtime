export const ALL_LANGS =
    "af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,zh,co,hr,cs,da,nl,en,eo,et,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,he,iw,hi,hmn,hu,is,ig,id,ga,it,ja,jv,kn,kk,km,rw,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,or,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tl,tg,ta,tt,te,th,tr,tk,uk,ur,ug,uz,vi,cy,xh,yi,yo,zu";
export const ALL_LANGS_ARRAY = ALL_LANGS.split(",");

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

export const normalizeMsg = (errMsg: string) => errMsg.replace(/\./g, "_");

export const errMatch = (f: string) => (e: string) => normalizeMsg(e) === normalizeMsg(f);

export const errMatchStart = (objPath: string) => (e: string) =>
    normalizeMsg(e).startsWith(`${normalizeMsg(objPath)}_`);
