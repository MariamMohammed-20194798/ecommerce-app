"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashOpaqueToken = hashOpaqueToken;
exports.generateOpaqueToken = generateOpaqueToken;
const crypto_1 = require("crypto");
function hashOpaqueToken(token) {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
}
function generateOpaqueToken() {
    return (0, crypto_1.randomBytes)(32).toString('base64url');
}
//# sourceMappingURL=auth.utils.js.map