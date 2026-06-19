import * as dotenv from 'dotenv';
dotenv.config();

export const nodeMailerConfig: any = {
  /* for network within geo system */
  service: process.env.DOMAIN,
  host: process.env.HOST,
  port: process.env.NODEMAILER,
  secure: process.env.NODE_MAILER_SECURE === 'true',
  tls: {
    /* do not fail on invalid certs */
    rejectUnauthorized: process.env.NODE_MAILER_SECURE === 'true',
  },
};
