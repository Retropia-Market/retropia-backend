import { Request, request, RequestHandler } from 'express';
import sgMail from '@sendgrid/mail';
import { UserEntity } from 'src/models/db-entities';

sgMail.setApiKey(process.env.SENDGRID_KEY);

export interface CustomReq extends Request {
  user: UserEntity;
  passwordToken?: string;
}

const accountVerification: RequestHandler = async (
  req: CustomReq,
  res,
  next
) => {
  try {
    const msg = {
      to: req.user.email,
      from: 'retropiamarket@gmail.com',
      subject: 'Retropia Market - email verification',
      text: `Welcome to Retropia Market ${req.user.firstname} ${req.user.lastname}! 
        Please copy and paste the following address into your browser address bar to verify your account:
        http://${req.headers.host}/verify-email/${req.user.email_code}
        `,
      html: `
      <html> 
      
        <body>
          <h1>Welcome to Retropia Market ${req.user.firstname} ${req.user.lastname}!</h1>
          <p>Thanks for registering in our site.</p>
          <p>Please click on the link below to verify your account:</p>
          <a href="${process.env.CLIENT_URL}/verify-email/${req.user.email_code}">Verify your account</a>
        </body>
      </html>
      `,
    };
    await sgMail.send(msg);
    res.send({
      status: 'OK',
      message: 'Email sent',
    });
  } catch (error) {
    next(error);
  }
};

const passwordRecovery: RequestHandler = async (req: CustomReq, res, next) => {
  try {
    const { email } = req.user;
    const { passwordToken } = req;
    const msg = {
      to: email,
      from: 'retropiamarket@gmail.com',
      subject: 'Retropia Market - password recovery',
      text: `Please copy and paste the following link into your browser address bar to recover your password:
        ${process.env.CLIENT_URL}/reset-password/${passwordToken}
      `,
      html: `
        <html> 
          <body> 
            <h1>Password Recovery</h1>
            <p>If you have not requested a password recovery, please disregard this message</p>
            <p>Please clink on the link below to recover your password:</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${passwordToken}">Reset your password</a>
          </body>
        </html>
      `,
    };
    await sgMail.send(msg);
    res.send({
      status: 'OK',
      message: 'Email sent',
    });
  } catch (error) {
    next(error);
  }
};

export { accountVerification, passwordRecovery };
