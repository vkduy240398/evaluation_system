import { nodeMailerConfig } from 'src/config/node.mailer.key';
import * as nodemailer from 'nodemailer';
import { mailNotificateCronjobFailed } from './mailTemplates';
export const sendEmailsWith = async (
  toEmails: any,
  ccEmails: any,
  titleEmail: string,
  infoEmail: string,
  isRetry = true,
): Promise<any> => {
  if (toEmails.length > 0) {
    let error = '';
    const htmlFormattedInfo = infoEmail.replace(/\n/g, '<br>');
    for (let i = 0; i < 5; i++) {
      try {
        const transporter = nodemailer.createTransport(nodeMailerConfig);
        return transporter.sendMail({
          from: process.env.SYSTEM_MAID_FROM || 'vietnam.system@geonet.co.jp',
          to: toEmails,
          cc: ccEmails,
          subject: titleEmail,
          html: htmlFormattedInfo,
        });
      } catch (err) {
        error = err?.message;
        console.error(err);
        if (!isRetry) {
          return { error };
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    let content = ``;
    content = mailNotificateCronjobFailed().body;
    content = content.replace('{title}', titleEmail);
    content = content.replace('{emailTo}', toEmails);
    content = content.replace('{contentMail}', infoEmail);
    content = content.replace('{error}', error);
    return await sendEmailsWith(
      ['gsol.system-alert@geonet.co.jp'],
      null,
      mailNotificateCronjobFailed().title,
      content,
      false,
    );
  }
};

export const extractContentAfterCC = (text: string) => {
  const ccIndex =
    text.indexOf('CC：') !== -1
      ? text.indexOf('CC：')
      : text.indexOf('CC:') !== -1
      ? text.indexOf('CC:')
      : text.indexOf('CC :');
  if (ccIndex === -1) {
    return text; // Không tìm thấy "CC:", trả về nguyên văn
  }
  const contentAfterCC = text
    .slice(ccIndex + (text.indexOf('CC :') !== -1 ? 4 : 3))
    .trim();
  const endOfCCIndex = contentAfterCC.indexOf('<br>');
  if (endOfCCIndex === -1) {
    return contentAfterCC; // Không tìm thấy "<br>", trả về nội dung sau "CC:"
  }

  return contentAfterCC
    .slice(endOfCCIndex + 4)
    .replace(/^<br>\s*/, '')
    .trim(); // Lấy nội dung sau "<br>"
};
