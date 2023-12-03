const express = require('express');
const socket  = require('socket.io');
const http = require('http');
const { connect } = require('http2');

const PORT = process.env.PORT || 3333;
const app = express();
app.use(express.static(__dirname + '/../public'));

const httpServer = http.createServer(app);
const io = socket(httpServer, {
    path: '/socket.io'
});

const users = [];
const codigos = [];

io.on('connection', (client) => {
    console.log(`Usuário conectado - ID = ${client.id}`);
    users.push(client);

    client.on('codSala', (stringAle) => {
        console.log(stringAle);
        codigos.push(stringAle);
        io.emit('codSala', stringAle);
    }) 

    client.on('go', () => {
        io.emit('go');
    })

    client.on('stop', () => {
        for(let i = 0; i < users.length; i++) {
            if(client != users[i]) {
                users[i].emit('stop', "Você ganhou");
            } else {
                users[i].emit('stop', "Você perdeu");                
            }
        }
    })

    client.on('comida', (comida) => {
        if(comida == "macaco") {
            users.forEach(user => {
                user.emit('comida', comida);
            });
        }else if(comida == "anao" || comida == "gigante") {
            users.forEach(user => {
                if(user == client) {
                    console.log("nao é esse");
                } else {
                    user.emit('comida', comida);
                }
            });
        }else if(comida == "cores") {
            client.emit('comida', comida);
        }else if(comida == "troca") {
            users.forEach(user => {
                if(user == client) {
                    console.log("nao é esse");
                } else {
                    user.emit('comida', comida);
                }
            });
        }
    })

    client.on('disconnect', () => {
        users.splice(users.indexOf(client), 1);
        console.log(`Usuário desconectado - ID = ${client.id}`);
    })
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Conexao feita com sucesso na porta ${PORT}`);
});