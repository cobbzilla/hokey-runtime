import { describe, it } from "mocha";
import { expect } from "chai";

import * as msg from "../lib/esm/index.js";

describe("template message test", async () => {
    it("properly renders a message with a templated value", async () => {
        const m = { error_field_required: "{{ field }} is required" };
        const rendered = msg.parseMessage("error_field_required", m, { field: "TEST" });
        expect(rendered).eq("TEST is required");
    });
    it("properly renders a message with a missing template value", async () => {
        const m = { error_field_required: "{{ field }} is required" };
        const rendered = msg.parseMessage("error_field_required", m, {});
        expect(rendered).eq("?!field is required");
    });
    it("fieldErrorMessage properly renders an error message", async () => {
        const m = {
            error_field_required: "{{ field }} is required",
            label_usernameOrEmail: "Username or email",
        };
        const err = msg.fieldErrorMessage("usernameOrEmail", "required", m);
        expect(err).eq("Username or email is required");
    });
    it("fieldErrorMessage properly renders a nested error message", async () => {
        const m = {
            error_field_required: "{{ field }} is required",
            label_width: "Width",
        };
        const fld = "options[0]_display_width";
        const errMsg = "options[0]_display_width_required";
        const err = msg.fieldErrorMessage(fld, errMsg, m);
        expect(err).eq("Width is required");
    });
});
