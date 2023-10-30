const express = require('express');
const socket  = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 3333;
const app = express();
app.use(express.static(__dirname + '/../public'));

const httpServer = http.createServer(app);
const io = socket(httpServer, {
    path: '/socket.io'
});

const users = [];

io.on('connection', (client) => {
    console.log(`Usuário conectado - ID = ${client.id}`);
    users.push(client);

    client.on('disconnect', () => {
        users.splice(users.indexOf(client), 1);
        console.log(`Usuário desconectado - ID = ${client.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Conexao feita com sucesso na porta ${PORT}`);
});