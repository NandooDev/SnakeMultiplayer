const socket = io('http://10.0.0.107:3333/');

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
    location.reload();
})

socket.on('comida', (comida) => {
    if(comida == "macaco") {
        alert("Hehe, alguém comeu o Macaco não foi kkkkk GAME OVER para ambos!");
        clearInterval(jogo);
        location.reload();
    }
    if(comida == "anao") {
        document.querySelector("canvas").style.width = "600px";
        document.querySelector("canvas").style.height = "300px";
    }
    if(comida == "gigante") {
        document.querySelector("canvas").style.width = "1200px";
        document.querySelector("canvas").style.height = "600px";
    }
    if(comida == "cores") {
        let listaCores = [
            "#8a2be2", "#008b8b", "#ffa500", "#08ff85", "#00ff00", 
            "#120a8f", "#000000", "#ebc83a", "#1b66ff", "#5e2f46", "#9dffff"
        ];
        let corAle = Math.floor(Math.random() * listaCores.length);
        corCabeca = corCabeca.value = listaCores[corAle];
        corCorpo = corCorpo.value = listaCores[corAle];
    }
    if(comida == "troca") {
        es = "D";
        di = "E";
        ci = "B";
        ba = "C";
    }
})

const canvas = document.querySelector("canvas");
var ctx = canvas.getContext('2d');

var crescimento = 1;
var cont = 0;
var corCabeca = document.querySelector("#corcabeca");
var corCorpo = document.querySelector("#corcorpo");

var dire;
var direAnterior;
var es = "E";
var di = "D";
var ci = "C";
var ba = "B";

var comida = {
    x: Math.floor(Math.random() * 10) * 30,
    y: Math.floor(Math.random() * 10) * 10
};

var listaComidas = [
    "img/maca.png", "img/banana.png", "img/laranja.png", 
    "img/laranja.png", "img/melancia.png", "img/morango.png", 
    "img/pera.png", "img/uvas.png"
];
var comidaAleatoria = Math.floor(Math.random() * listaComidas.length);

var cobra = [];
cobra[0] = {
    x: 0,
    y: 0
}

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

document.addEventListener("keydown", seta);

function seta(e) {

    switch (e.key) {
        case "ArrowLeft":  
            if(dire != "D") {
                dire = es;
            }     
            break
        case "ArrowRight":        
            if(dire != "E") {
                dire = di;
            }     
            break
        case "ArrowUp":
            if(dire != "B") {
                dire = ci;
            }     
            break
        case "ArrowDown":
            if(dire != "C") {
                dire = ba;
            }     
            break
    }

}

function game() {
    
    cont++;

    switch (cont) {
        case 500: 
            listaComidas.push("img/macaco.jpg");
            break
        case 50:
            listaComidas.push("img/javali.png");
            break
        case 200:
            listaComidas.push("img/anao.png");
            listaComidas.push("img/gigante.png");
            break
        case 150:
            listaComidas.push("img/troca.png");
            break
        case 100:
            listaComidas.push("img/cores.png");
            break
    }
    
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

    if (dire == "D") x += 10; 
    if (dire == "E") x -= 10; 
    if (dire == "C") y -= 10; 
    if (dire == "B") y += 10; 
    
    if(x == comida.x && y == comida.y) {
        switch (listaComidas[comidaAleatoria]) {
            case "img/macaco.jpg":
                socket.emit('comida', "macaco");
                cobra.pop();
                break
            case "img/anao.png":
                socket.emit('comida', "anao");
                cobra.pop();
                break
            case "img/gigante.png":
                socket.emit('comida', "gigante");
                cobra.pop();
                break
            case "img/cores.png":
                socket.emit('comida', "cores");
                cobra.pop();
                break
            case "img/troca.png":
                socket.emit('comida', "troca");
                cobra.pop();
                break                
        }

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

var vel = 120;

const jogo = setInterval(game, vel);