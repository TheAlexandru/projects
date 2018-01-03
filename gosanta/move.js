
var stopped = false;
var santa = document.getElementById('santa');
var santaTop = 0;
var santaLeft = 0;
var stepNr = 0;

function stop(e){
    document.body.setAttribute('onkeydown','move(event)')
    console.log(document.body);
    stopped = true;
    stepNr = 0;
    santa.className='';
    santa.className='santa';
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
    
    
}

function startMove(nav){
    if(nav == 'right'){     
        setTimeout(function(){
            if(stepNr > 9){
                santa.classList.remove(`r_${stepNr}`);
                stepNr=0;
            }
                if(stopped != true){
                    if(santaLeft>=745){
                        santaLeft=0;
                    }
                    santa.classList.remove(`r_${stepNr}`);
                    stepNr++;
                    santaLeft +=5;
                    santa.classList.add(`r_${stepNr}`);
                    santa.style.marginLeft = `${santaLeft}px`;

                    console.log("alo",santa);
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
    
    
    
    console.log(santa);
}