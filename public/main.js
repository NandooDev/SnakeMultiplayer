const socket = io('http://192.168.0.11:3333/');

// CODIGO DA SALA QUE FOR CRIADA
function gerarStringAleatoria(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
    }
    return resultado;
}

document.getElementById("criarcodigo").addEventListener('click', () => {
    let stringAle = gerarStringAleatoria(5);
    document.getElementById("iniciarjogo").classList.add("sumir");
    document.getElementById("salacriada").style.display = "block";
    document.querySelector("#salacriada #cd").innerHTML = stringAle;
    socket.emit('codSala', stringAle);
})

// USUARIO USOU CÓDIGO
let codigoCriadoInimigo = [];
socket.on('codSala', (cod) => {
    codigoCriadoInimigo.push(cod);
    console.log(cod);
})

document.getElementById('play').addEventListener('click', () => {
    let codigoDigi = document.getElementById('entrarsala').value;
    
    if(codigoDigi === codigoCriadoInimigo[codigoCriadoInimigo.length - 1]) {
        socket.emit('go');
    }
})

socket.on('go', () => {
    play();
    document.getElementById('salacriada').style.display = 'none';
    document.querySelector('canvas').style.display = 'block';
})

socket.on('stop', (msg) => {
    alert(msg);
    clearInterval(jogo);
})


var corCabeca = document.querySelector("#corcabeca");
var corCorpo = document.querySelector("#corcorpo");

function play() {
    document.getElementById("iniciarjogo").classList.add("sumir");
    document.querySelector("canvas").style.display = "block";

    if(corCabeca.value == "#000000") {
        corCabeca = corCabeca.value = "#FFFFFF";
    } else {
        corCabeca = corCabeca.value;
    }
    if(corCorpo.value == "#000000") {
        corCorpo = corCorpo.value = "#FFFFFF";
    } else {
        corCorpo = corCorpo.value;
    }
};

const canvas = document.querySelector("canvas");
var ctx = canvas.getContext('2d');

var dire;
var direAnterior;

var comida = {
    x: Math.floor(Math.random() * 10) * 30,
    y: Math.floor(Math.random() * 10) * 10
};

var listaComidas = ["img/maca.png", "img/banana.png"];
var comidaAleatoria = Math.floor(Math.random() * listaComidas.length);

var cobra = [];
cobra[0] = {
    x: 0,
    y: 0
}

document.addEventListener("keydown", seta);

function seta(e) {

    switch (e.key) {
        case "ArrowLeft":            
            dire = "E"
            break
        case "ArrowRight":        
            dire = "D"
            break
        case "ArrowUp":
            dire = "C"
            break
        case "ArrowDown":
            dire = "B"
            break
    }

}

function game() {
    
    let comidaAlea = new Image()
    comidaAlea.src = listaComidas[comidaAleatoria];
    comidaAlea.onload = () => {
        ctx.drawImage(comidaAlea, comida.x, comida.y, 10, 10);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < cobra.length; i++) {
        if(i == 0) {
            ctx.fillStyle = `${corCabeca}`;
            ctx.fillRect(cobra[i].x, cobra[i].y, 10, 10); 
        } else {
            ctx.fillStyle = `${corCorpo}`;
            ctx.fillRect(cobra[i].x, cobra[i].y, 10, 10); 
        }
    }    

    var x = cobra[0].x;
    var y = cobra[0].y;

    if(cobra.length == 1) {
        if (dire == "D") x += 10; 
        if (dire == "E") x -= 10; 
        if (dire == "C") y -= 10; 
        if (dire == "B") y += 10;  
    } else {
        if (dire == "D" && direAnterior != "E") x += 10; 
        if (dire == "E" && direAnterior != "D") x -= 10; 
        if (dire == "C" && direAnterior != "B") y -= 10; 
        if (dire == "B" && direAnterior != "C") y += 10;
    }
    direAnterior = dire;
    
    if(x == comida.x && y == comida.y) {
        comida = {
            x: Math.floor(Math.random() * 10) * 30,
            y: Math.floor(Math.random() * 10) * 10
        };
        comidaAleatoria = Math.floor(Math.random() * listaComidas.length);
    } else {
        cobra.pop();
    }
    
    let novaCabeca = {
        x: x,
        y: y
    }
    cobra.unshift(novaCabeca);

    if(x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        socket.emit('stop');
    }

    for(let i = 1; i < cobra.length; i++) {        
        if(x === cobra[i].x && y === cobra[i].y) {
            socket.emit('stop');
        }
    }

}

const jogo = setInterval(game, 100);