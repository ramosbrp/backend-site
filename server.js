const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const path = require('path');

app.use(cors({ origin: ['http://localhost:4200', process.env.FRONTEND] }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '../site-v2.0/landing-ramos-dev-angular/src/')))


app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});


app.get('/api/dados', (req, res) => {
    res.json({ message: 'Backend conectado ao Angular!' });
    // res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
});

// app.get('*', (req, res) => {
// res.sendFile(path.join(__dirname, '../site-v2.0/landing-ramos-dev-angular/src/', 'index.html'));
// });

app.post('/api/send-email', (req, res) => {
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
        to: process.env.EMAIL_USER, // O destinatário do e-mail.
        subject: `Ramos Dev Contato - Mensagem de ${name}`,
        replyTo: email, // O e-mail do remetente.
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.', error });
        } else {
            console.log('Email enviado: ' + info.response);
            return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso.' });
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
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao salvar comentário.');
        } else {

            const ComentarioInserido = {
                id: results.insertID,
                comentario: comment,
                nome: name,
                post_id: post_id
            }
            console.log('Comentario adicionado com sucesso. ID:', results.insertID);
            res.status(200).send({ ComentarioInserido, message: 'Comentário adicionado com sucesso!' });

        }
    })

    connection.end();
});

app.get('/get-comments', (req, res) => {

    const post_id = req.query.post_id;
    parseInt(post_id);
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

    const query = `SELECT * FROM comentarios WHERE post_id = ?`;

    connection.query(query, [post_id], (error, results) => {
        if (error) {
            console.error('Erro ao buscar comentários:', error);
            res.status(500).json({ message: 'Erro ao buscar comentário.' });
            return;
        }
        console.log('Comentários recuperados com sucesso.');
        res.status(200).json({ results, message: 'Comentários recuperados com sucesso!' });
    });

    connection.end();



});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
