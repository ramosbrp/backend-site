const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mysql = require('mysql');

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

app.post('/submit-comment', (req, res) => {
    console.log('ok')


    const connection =  mysql.createConnection({
        host: process.env.BD_HOST, 
        user: process.env.BD_USER, 
        password: process.env.BD_PASS, 
        database: process.env.BD_DATABASE 
    });

    connection.connect(err => {
        if (err) {
            console.error('Erro ao conectar: ' + err.stack);
            return;
        }

        console.log('Conectado como ID ' + connection.threadId);
    });

    // Usar 'connection' para interagir com o banco de dados

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
