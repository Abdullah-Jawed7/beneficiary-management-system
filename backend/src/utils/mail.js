import nodemailer from 'nodemailer';

const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
};

const detail = {
    subject:'Email From BMS',
    text:`We were warm welcoming you in our Beneficiary Management System`,
}
export const sendEmail = async (mail,subject = detail.subject,text= detail.text )  => {
    const transporter = nodemailer.createTransport(emailConfig);


    const mailOptions = {
        from: process.env.NODEMAILER_MAIL,
        to: mail,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        return `message is send on ${mail}`;
    } catch (error) {
        throw `Error sending OTP to ${mail} via email: ${error}`;
    }
}

