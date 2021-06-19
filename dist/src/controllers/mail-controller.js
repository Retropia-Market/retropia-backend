"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecovery = exports.accountVerification = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_KEY);
const accountVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield mail_1.default.send(msg);
        res.send({
            status: 'OK',
            message: 'Email sent',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.accountVerification = accountVerification;
const passwordRecovery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield mail_1.default.send(msg);
        res.send({
            status: 'OK',
            message: 'Email sent',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.passwordRecovery = passwordRecovery;
//# sourceMappingURL=mail-controller.js.map