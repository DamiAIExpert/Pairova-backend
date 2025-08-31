"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIso = toIso;
exports.addMinutes = addMinutes;
function toIso(input) {
    if (!input)
        return new Date().toISOString();
    return new Date(input).toISOString();
}
function addMinutes(minutes, date = new Date()) {
    return new Date(date.getTime() + minutes * 60000);
}
//# sourceMappingURL=date.utils.js.map