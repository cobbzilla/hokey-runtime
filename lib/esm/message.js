import { parseMessage } from "./parse.js";
import { isUnknownMessage } from "./util.js";
const findBaseErrorMessage = (err, messages) => {
    const msg = "error_field_" + err;
    if (!isUnknownMessage(messages[msg]))
        return msg;
    const idx = err.lastIndexOf("_");
    const baseMsg = idx === -1 || idx === err.length - 1 ? null : "error_field_" + err.substring(idx + 1);
    if (!baseMsg || isUnknownMessage(messages[baseMsg]))
        return "?!!" + err;
    return baseMsg;
};
export const fieldErrorMessage = (field, error, messages, labelPrefixes = ["", "label_"]) => {
    let fieldObject = null;
    if (typeof field === "object") {
        fieldObject = field;
        field = field.name;
    }
    else {
        // remove any embedded indexes
        field = field.replace(/\[\d+]/, "");
    }
    if (typeof labelPrefixes === "string") {
        labelPrefixes = [labelPrefixes];
    }
    let fieldMessage = null;
    if (fieldObject && fieldObject.label && !isUnknownMessage(messages[fieldObject.label])) {
        fieldMessage = messages[fieldObject.label];
    }
    else {
        let searchField = field;
        while (fieldMessage == null) {
            fieldMessage = findMessage(searchField, messages, labelPrefixes);
            if (fieldMessage == null) {
                const underscore = searchField.indexOf("_");
                if (underscore === -1 || underscore === searchField.length - 1)
                    break;
                searchField = searchField.substring(underscore + 1);
            }
        }
        if (fieldMessage == null) {
            fieldMessage = "??!" + field;
        }
    }
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
    }
    else {
        return parseMessage(findBaseErrorMessage(error, messages), messages, {
            field: fieldMessage,
        });
    }
};
export const findMessageKey = (key, messages, labelPrefixes = ["", "label_"]) => {
    if (typeof labelPrefixes === "string") {
        labelPrefixes = [labelPrefixes];
    }
    if (!Array.isArray(labelPrefixes)) {
        throw new TypeError(`findMessage: unexpected type for labelPrefixes param, expected a string or array. typeof(labelPrefixes)=${typeof labelPrefixes}, Array.isArray(labelPrefixes)=${Array.isArray(labelPrefixes)}`);
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
export const findMessage = (key, messages, labelPrefixes = ["", "label_"]) => {
    if (typeof labelPrefixes === "string") {
        labelPrefixes = [labelPrefixes];
    }
    if (!Array.isArray(labelPrefixes)) {
        throw new TypeError(`findMessage: unexpected type for labelPrefixes param, expected a string or array. typeof(labelPrefixes)=${typeof labelPrefixes}, Array.isArray(labelPrefixes)=${Array.isArray(labelPrefixes)}`);
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
//# sourceMappingURL=message.js.map