
var stopped = false;
var santa = document.getElementById('santa');
var santaTop = 0;
var santaLeft = 0;
var stepNr = 0; //for animation 
var lastPosition ='';

function stop(e){
    document.body.setAttribute('onkeydown','move(event)')
    document.body.setAttribute('onkeyup','stop(event)')
    console.log(document.body);
    stopped = true;
    stepNr = 0;
    santa.className=''; 
    if(lastPosition =='right'){
        santa.className='santa'; 
    }else if(lastPosition =='left'){
        santa.className='santa stopLeft'; 
    } 
    
   if(e.code == 'ArrowUp'){
        startMove('up');
   }else if(e.code == 'ArrowDown'){
        startMove('down');
    } 
}

function move(e){
    document.body.removeAttribute('onkeydown','move(event)');
    stopped = false;
    //santa.className ='santa';
    santaTop = santa.offsetTop;
    santaLeft = santa.offsetLeft;
    if(e.code == 'ArrowRight'){
        lastPosition ='right';
        santa.className='santa'; 
        startMove('right');
    }else if(e.code == 'ArrowLeft'){
        lastPosition ='left';
        startMove('left');
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
            if(stopped != true){
                santaLeft<=0 ? santaLeft=745 : santaLeft -=5;
                santa.classList.remove(`l_${stepNr}`);
                stepNr > 9 ? stepNr=1 : stepNr++;
                santa.classList.add(`l_${stepNr}`);
                santa.style.marginLeft = `${santaLeft}px`;
                startMove(nav);
            }
        },80);
    }else if(nav == 'up'){
        document.body.removeAttribute('onkeyup','stop(event)');
        if(lastPosition=='right'){
             setTimeout(function(){
                   santaLeft>=745 ? santaLeft=0 : '';
                   santa.className='santa';
                 stepNr++
                    if(stepNr>0 && stepNr <=2){
                        santa.classList.add(`j_r1`);
                    }else if(stepNr==3){
                        santa.classList.add(`j_r2`);
                    }else if(stepNr>3 && stepNr <=5){
                        santa.classList.add(`j_r3`);
                        santaLeft +=22;
                        santaTop -=14;
                        santa.style.marginLeft = `${santaLeft}px`;
                        santa.style.marginTop = `${santaTop}px`;
                    }else if(stepNr>5 && stepNr <=7 ){
                        santa.classList.add(`j_r4`);
                        santaLeft +=20;
                        santaTop +=13.5;
                        santa.style.marginLeft = `${santaLeft}px`;
                        santa.style.marginTop = `${santaTop}px`;
                    }else if(stepNr==8){
                        santa.classList.add(`j_r4`);
                    }
                    stepNr!=8 ? startMove(nav) : stop();
                    
                   },100);
        }else if(lastPosition=='left'){
                setTimeout(function(){
                    santaLeft<=0 ? santaLeft=745 : '';
                   santa.className='santa';
                 stepNr++
                    if(stepNr>0 && stepNr <=2){
                        santa.classList.add(`j_l1`);
                        startMove(nav);
                    }else if(stepNr==3){
                        santa.classList.add(`j_l2`);
                        startMove(nav);
                    }else if(stepNr>3 && stepNr <=5){
                        santa.classList.add(`j_l3`);
                        santaLeft -=22;
                        santaTop -=14;
                        santa.style.marginLeft = `${santaLeft}px`;
                        santa.style.marginTop = `${santaTop}px`;
                        startMove(nav);
                    }else if(stepNr>5 && stepNr <=7 ){
                        santa.classList.add(`j_l4`);
                        santaLeft -=20;
                        santaTop +=13.5;
                        santa.style.marginLeft = `${santaLeft}px`;
                        santa.style.marginTop = `${santaTop}px`;
                        startMove(nav);
                    }else if(stepNr==8){
                        santa.classList.add(`j_l4`);
                         stop();
                    }
                   },100);
        }
       
    }
    
    console.log(santa);
}

