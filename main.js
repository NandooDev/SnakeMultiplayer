let select = document.getElementById('tipo');

function play() {
    document.getElementById("iniciarjogo").classList.add("sumir");
    document.querySelector("canvas").style.display = "block";
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

var x = y = 0;

var dire;

var comida = {
    x: Math.floor(Math.random() * 10) * 30,
    y: Math.floor(Math.random() * 10) * 10
};

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

    ctx.fillStyle = "blue";
    ctx.fillRect(comida.x, comida.y, 10, 10);
    
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 10, 10); 

    if (dire == "D") x += 10; 
    if (dire == "E") x -= 10; 
    if (dire == "C") y -= 10; 
    if (dire == "B") y += 10;    

    if(x == comida.x && y == comida.y) {
        comida = {
            x: Math.floor(Math.random() * 10) * 30,
            y: Math.floor(Math.random() * 10) * 10
        };
    }
    
    if(x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        alert("game over")
        clearInterval(jogo);
    }

}

const jogo = setInterval(game, 100)