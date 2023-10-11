let select = document.getElementById('tipo');
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

select.addEventListener('change', function(){
    
    if(select.value == "single") {
        document.getElementById('vs').style.display = "none";
    } else {
        document.getElementById('vs').style.display = "flex";
    }

});

const canvas = document.querySelector("canvas");
var ctx = canvas.getContext('2d');

var dire;

var comida = {
    x: Math.floor(Math.random() * 10) * 30,
    y: Math.floor(Math.random() * 10) * 10
};

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
    
    ctx.fillStyle = "blue";
    ctx.fillRect(comida.x, comida.y, 10, 10);

    var x = cobra[0].x;
    var y = cobra[0].y;
    
    if (dire == "D") x += 10; 
    if (dire == "E") x -= 10; 
    if (dire == "C") y -= 10; 
    if (dire == "B") y += 10;    

    if(x == comida.x && y == comida.y) {
        comida = {
            x: Math.floor(Math.random() * 10) * 30,
            y: Math.floor(Math.random() * 10) * 10
        };
    } else {
        cobra.pop();
    }
    
    let novaCabeca = {
        x: x,
        y: y
    }
    cobra.unshift(novaCabeca);

    if(x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        alert("Bateu Na Parede! Game Over!");
        clearInterval(jogo);
    }

    for(let i = 1; i < cobra.length; i++) {        
        if(x === cobra[i].x && y === cobra[i].y) {
            alert("Você bateu no seu corpo! Game Over!");
            clearInterval(jogo);
        }
    }

}

const jogo = setInterval(game, 100)