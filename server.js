const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Substitua pelo host SMTP da Hostinger.
    port: process.env.EMAIL_PORT, // Use 465 para SSL ou 587 para TLS.
    secure: true, // true para 465, false para outras portas.
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail Hostinger.
        pass: process.env.EMAIL_PASS // Sua senha do e-mail Hostinger.
    }
});


app.post('/send-email', (req, res) => {
    const { email, name, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        replyTo: email, // O e-mail do remetente.
        to: process.env.EMAIL_USER, // O destinatário do e-mail.
        subject: `Mensage de ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao enviar e-mail.');
        } else {
            console.log('Email enviado: ' + info.response);
            res.status(200).send('E-mail enviado com sucesso.');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
