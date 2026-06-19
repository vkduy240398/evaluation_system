"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailerConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.nodeMailerConfig = {
    service: process.env.DOMAIN,
    host: process.env.HOST,
    port: process.env.NODEMAILER,
    secure: process.env.NODE_MAILER_SECURE === 'true',
    tls: {
        rejectUnauthorized: process.env.NODE_MAILER_SECURE === 'true',
    },
};
//# sourceMappingURL=node.mailer.key.js.map