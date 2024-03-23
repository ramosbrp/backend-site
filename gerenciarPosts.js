const mysql = require('mysql2');
const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_DATABASE
});

connection.connect();

const caminhoPadrao = `D:/Documents/dev/site/site/frontend/blog/posts/`;

const inserirPost = () => {
    const titulo = prompt('Digite o título do post: \n');
    const nomeDoArquivo = prompt('Digite o nome do arquivo: \n');
    const caminhoCompleto = `${caminhoPadrao}${nomeDoArquivo}`;

    //Lê o conteúdo do arquivo
    var conteudo = "";
    try {
        conteudo = fs.readFileSync(caminhoCompleto, 'utf8');
    } catch (error){
        console.error('Erro ao ler o arquivo:', error.message);
    }

    const query = `INSERT INTO posts (titulo, conteudo) VALUES (?, ?)`;

    connection.query(query, [titulo, conteudo], (error, results) => {
        if (error) throw error;
        console.log('Post inserido com sucesso. ID:', results.insertId);
    })
}

const atualizarPost = () => {
    const id = prompt('Digite o ID do post a ser atualizado');
    const titulo = prompt('Digite o novo titulo do post: ');
    const arquivo = prompt('Digite o caimnho do arquivo de conteúdo: ');

    //Lê o conteúdo do arquivo
    const conteudo = fs.readFileSync(arquivo, 'utf-8');

    const query = `UPDATE posts SET titulo = ?, conteudo = ? WHERE id = ?`;

    connection.query(query, [titulo, conteudo, id], (error, results) => {
        if (error) throw error;
        console.log('Post atualizado com sucesso.');
    });
}

// const testarConexao = () => {
//     connection.connect(err => {
//         if (err) {
//             console.error('Erro ao conectar ao banco de dados:', err);
//             process.exit(1); // Sai do script com um código de erro
//         } else {
//             console.log('Conexão estabelecida com sucesso.');
//             // Executar uma query simples para testar
//             connection.query('SELECT 1 + 1 AS solution', (err, results) => {
//                 if (err) throw err;
//                 console.log('Resultado da query:', results[0].solution);
//                 connection.end(); // Encerrar a conexão
//             });
//         }
//     });
// }
// testarConexao();

const acao = prompt('Você deseja inserir (i) ou atualizaar (a) um post? (i/a): ');


if (acao === 'i') {
    inserirPost();
} else if (acao === 'a') {
    atualizarPost();
} else
    console.log('Ação não reconhecida.');

connection.end();