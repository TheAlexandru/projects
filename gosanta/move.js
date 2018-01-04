
var stopped = false;
var santa = document.getElementById('santa');
var santaTop = 0;
var santaLeft = 0;
var stepNr = 0; //for animation 
var lastPosition ='';

function stop(e){
    document.body.setAttribute('onkeydown','move(event)')
    console.log(document.body);
    stopped = true;
    stepNr = 0;
    santa.className=''; 
    if(lastPosition =='right'){
        santa.className='santa'; 
    }else if(lastPosition =='left'){
        santa.className='santa stopLeft'; 
    } 
}

function move(e){
    document.body.removeAttribute('onkeydown','move(event)');
    stopped = false;
    santa.className ='santa';
    santaTop = santa.offsetTop;
    santaLeft = santa.offsetLeft;
    if(e.code == 'ArrowRight'){
        lastPosition ='right';
        startMove('right');
    }else if(e.code == 'ArrowLeft'){
        lastPosition ='left';
        startMove('left');
       
    }else if(e.code == 'ArrowUp'){
        startMove('up');
    }else if(e.code == 'ArrowDown'){
        startMove('down');
    }
    
    
}

function startMove(nav){
    if(nav == 'right'){     
        setTimeout(function(){
                if(stopped != true){
                    santaLeft>=745 ? santaLeft=0 : santaLeft +=5;
                    santa.classList.remove(`r_${stepNr}`);
                    stepNr > 9 ? stepNr=1 : stepNr++;   
                    santa.classList.add(`r_${stepNr}`);
                    santa.style.marginLeft = `${santaLeft}px`;
                    startMove(nav);
                }
        },80);
    }else if(nav == 'left'){
        setTimeout(function(){
            if(stepNr > 9){
                santa.classList.remove(`l_${stepNr}`);
                stepNr=0;
            }
            if(stopped != true){
                santaLeft<=0 ? santaLeft=745 : "";
                santa.classList.remove(`l_${stepNr}`);
                stepNr++;
                santaLeft -=5;
                santa.classList.add(`l_${stepNr}`);
                santa.style.marginLeft = `${santaLeft}px`;
                console.log(santaLeft);
                startMove(nav);
            }
        },80);
    }else if(nav == 'up'){
        console.log('up');
    }
    
    console.log(santa);
}