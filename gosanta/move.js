
var stopped = false;
var santa = document.getElementById('santa');
var santaTop = 0;
var santaLeft = 0;

function stop(e){
    document.body.setAttribute('onkeydown','move(event)')
    console.log(document.body);
    stopped = true;
}

function move(e){
    document.body.removeAttribute('onkeydown','move(event)');
    stopped = false;
    santaTop = santa.offsetTop;
    santaLeft = santa.offsetLeft;
    if(e.code == 'ArrowRight'){
        startMove('right');
    }else if(e.code == 'ArrowLeft'){
        startMove('left');
       
    }else if(e.code == 'ArrowUp'){
        starMove('up');
    }else if(e.code == 'ArrowDown'){
        starMove('down');
        
    }
    console.log(document.body);
    
}

function startMove(nav){
    if(nav == 'right'){
        setTimeout(function(){
            if(stopped != true){
                if(santaLeft>=745){
                    santaLeft=0;
                }
                santaLeft +=3;
                santa.style.marginLeft = `${santaLeft}px`;
                console.log(santa);
                startMove(nav);
            }
        },100);
    }else if(nav == 'left'){
        setTimeout(function(){
            if(stopped != true){
                if(santaLeft<=0){
                    santaLeft=745;
                }
                santaLeft -=3;
                santa.style.marginLeft = `${santaLeft}px`;
                console.log(santaLeft);
                startMove(nav);
            }
        },100);
    }
    
}