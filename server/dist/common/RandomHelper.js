"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomHelper = void 0;
class RandomHelper {
    static randomString(length, charSet) {
        charSet =
            charSet ||
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            result += charSet.substring(randomPoz, randomPoz + 1);
        }
        return result;
    }
    static getCurrentTimeStamp() {
        return Date.now();
    }
}
exports.RandomHelper = RandomHelper;
//# sourceMappingURL=RandomHelper.js.map