export declare const ALL_LANGS = "af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,zh,co,hr,cs,da,nl,en,eo,et,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,he,iw,hi,hmn,hu,is,ig,id,ga,it,ja,jv,kn,kk,km,rw,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,or,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tl,tg,ta,tt,te,th,tr,tk,uk,ur,ug,uz,vi,cy,xh,yi,yo,zu";
export declare const ALL_LANGS_ARRAY: string[];
export declare const unknownMessage: (msg: string) => string;
export declare const isUnknownMessage: (msg: string) => boolean;
export declare const messageExists: (msgKey: string, messages: HokeyLocaleMessages) => boolean;
export type HokeyLocaleMessages = Record<string, string>;
export type HokeyAllMessages = Record<string, HokeyLocaleMessages>;
export declare const localeLang: (locale: string) => string;
export declare const wrapMessages: (messages: HokeyLocaleMessages) => HokeyLocaleMessages;
export declare const normalizeMsg: (errMsg: string) => string;
export declare const errMatch: (f: string) => (e: string) => boolean;
export declare const errMatchStart: (objPath: string) => (e: string) => boolean;
