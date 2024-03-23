const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mysql = require('mysql');

app.use(cors({
    origin: ['https://ramos-dev.com', 'http://127.0.0.1:5500'], // Ou um array de domínios permitidos
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'] // Headers permitidos
}));
app.use(bodyParser.json());




app.post('/send-email', (req, res) => {
    const { email, name, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Substitua pelo host SMTP.
        port: process.env.EMAIL_PORT, // Use 465 para SSL ou 587 para TLS.
        secure: true, // true para 465, false para outras portas.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

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
    const { name, comment } = req.body;

    const connection = mysql.createConnection({
        host: process.env.BD_HOST,
        user: process.env.BD_USER,
        password: process.env.BD_PASS,
        database: process.env.BD_DATABASE
    });

    connection.connect(err => {
        if (err) {
            console.error('Erro ao conectar: ' + err.stack);
            res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
            return;
        }

        console.log('Conectado como ID ' + connection.threadId);
    });

    const data = new Date();
    const post_id = 1;

    const query = `INSERT INTO comentarios (comentario, data, nome, post_id) VALUES (?, ?, ?, ?)`;

    connection.query(query, [comment, data, name, post_id], (error, results) => {
        if (error) throw error;
        console.log('Comentario adicionado com sucesso. ID:', results.insertId);
    })

    connection.end();
    // Usar 'connection' para interagir com o banco de dados

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
