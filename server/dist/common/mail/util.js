"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractContentAfterCC = exports.sendEmailsWith = void 0;
const node_mailer_key_1 = require("../../config/node.mailer.key");
const nodemailer = require("nodemailer");
const mailTemplates_1 = require("./mailTemplates");
const sendEmailsWith = async (toEmails, ccEmails, titleEmail, infoEmail, isRetry = true) => {
    if (toEmails.length > 0) {
        let error = '';
        const htmlFormattedInfo = infoEmail.replace(/\n/g, '<br>');
        for (let i = 0; i < 5; i++) {
            try {
                const transporter = nodemailer.createTransport(node_mailer_key_1.nodeMailerConfig);
                return transporter.sendMail({
                    from: process.env.SYSTEM_MAID_FROM || 'vietnam.system@geonet.co.jp',
                    to: toEmails,
                    cc: ccEmails,
                    subject: titleEmail,
                    html: htmlFormattedInfo,
                });
            }
            catch (err) {
                error = err === null || err === void 0 ? void 0 : err.message;
                console.error(err);
                if (!isRetry) {
                    return { error };
                }
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }
        }
        let content = ``;
        content = (0, mailTemplates_1.mailNotificateCronjobFailed)().body;
        content = content.replace('{title}', titleEmail);
        content = content.replace('{emailTo}', toEmails);
        content = content.replace('{contentMail}', infoEmail);
        content = content.replace('{error}', error);
        return await (0, exports.sendEmailsWith)(['gsol.system-alert@geonet.co.jp'], null, (0, mailTemplates_1.mailNotificateCronjobFailed)().title, content, false);
    }
};
exports.sendEmailsWith = sendEmailsWith;
const extractContentAfterCC = (text) => {
    const ccIndex = text.indexOf('CC：') !== -1
        ? text.indexOf('CC：')
        : text.indexOf('CC:') !== -1
            ? text.indexOf('CC:')
            : text.indexOf('CC :');
    if (ccIndex === -1) {
        return text;
    }
    const contentAfterCC = text
        .slice(ccIndex + (text.indexOf('CC :') !== -1 ? 4 : 3))
        .trim();
    const endOfCCIndex = contentAfterCC.indexOf('<br>');
    if (endOfCCIndex === -1) {
        return contentAfterCC;
    }
    return contentAfterCC
        .slice(endOfCCIndex + 4)
        .replace(/^<br>\s*/, '')
        .trim();
};
exports.extractContentAfterCC = extractContentAfterCC;
//# sourceMappingURL=util.js.map