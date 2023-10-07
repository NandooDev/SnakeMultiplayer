let select = document.getElementById('tipo');

function play() {
    document.getElementById("iniciarjogo").classList.add("sumir");
};

function clickButtonCriar() {
    document.getElementById("iniciarjogo").classList.add("sumir");
};


select.addEventListener('change', function(){
    
    if(select.value == "single") {
        document.getElementById('vs').style.display = "none";
    } else {
        document.getElementById('vs').style.display = "flex";
    }

});