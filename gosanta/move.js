
var stopped = false;
var santa = document.getElementById('santa');
var playarena = document.getElementById('playarena');
var santaTop = 0;
var santaLeft = 0;
var fireStep= 0;
var stepNr = 0; //for animation 
var lastPosition ='';
var hidden = false;//is santa hidden ?
var santaPosition ='';
var bars = '';
var jump = false;
var obstacle =false;
var fire_active = false;
var obstacles = [
    {name: '3 level Bar', enable: false}, 
    {name: '2 level Bar', enable: false}
    ];

function stop(e){
    if(obstacle==false){
        document.body.setAttribute('onkeydown','move(event)');
    }
    document.body.setAttribute('onkeyup','stop(event)')
    stopped = true;
    jump = false;
    stepNr = 0;
    obstacle=false;
    if(hidden==true){
        if(lastPosition=='right'){
            santa.classList.add(`h_r4`);
        }else if(lastPosition=='left'){
            santa.classList.add(`h_l4`)
        }
        
    }else{
        santa.className=''; 
         if(lastPosition =='right'){
        santa.className='santa'; 
        }else if(lastPosition =='left'){
            santa.className='santa stopLeft'; 
        } 
    } 
   if(e.code == 'ArrowUp'){
        startMove('up');
   }else if(e.code == 'ArrowDown'){
        hidden = true;
        startMove('down');
    }else if(e.code=='KeyF'){
        if(fire_active==false){
            startMove('fire');
        }
    }
   
}

function move(e){
    
    document.body.removeAttribute('onkeydown','move(event)');
    stopped = false;
    santaTop = santa.offsetTop;
    santaLeft = santa.offsetLeft;
    
    if(hidden==false){
         if(e.code == 'ArrowRight'){
            lastPosition ='right';
            santa.className='santa'; 
            startMove('right');
        }else if(e.code == 'ArrowLeft'){
            lastPosition ='left';
            startMove('left');
        } 
    }
   
}



function startMove(nav){
    console.log(santaLeft);
    
    //find on which level is santa
    if(santaTop<=0){
        santaPosition = "3 level";
    }else if(santaTop>10 && santaTop<280){
        santaPosition = "2 level";
    }else if(santaTop>280){
        santaPosition = "1 level";
    }
    
    //find obstacles
    if(nav=='right'){
        if(santaLeft>295 && santaLeft<330 && santaPosition=='3 level'){
            obstacles[0].enable = true;
        }else if(santaLeft>168 && santaLeft<180 && santaPosition=='2 level'){
            obstacles[1].enable = true;
        }else{
            obstacles[0].enable = false;
            obstacles[1].enable = false;
        }
    }else if(nav=='left'){
        if(santaLeft>360 && santaLeft<390 && santaPosition=='3 level'){
            obstacles[0].enable = true;
        }else if(santaLeft>235 && santaLeft<250 && santaPosition=='2 level'){
            obstacles[1].enable = true;
        }else{
            obstacles[0].enable = false;
            obstacles[1].enable = false;
        }
    }
    
    
    //move santa to Right
    if(nav == 'right'){    
        setTimeout(function(){
                if(stopped != true){
                    if(obstacles[0].enable==true || obstacles[1].enable==true){
                        obstacle=true;
                        stop();  
                    }
                    santaLeft>=710 ? santaLeft=-25 : santaLeft +=5;
                    santa.classList.remove(`r_${stepNr}`);
                    stepNr > 9 ? stepNr=1 : stepNr++;   
                    santa.classList.add(`r_${stepNr}`);
                    santa.style.marginLeft = `${santaLeft}px`;
                    
                    startMove(nav);
                }
        },80);
    }
    //### END moveRight ###//
    
    //move santa to Left
    if(nav == 'left'){
        setTimeout(function(){
            if(stopped != true){
                if(obstacles[0].enable==true|| obstacles[1].enable==true){
                        obstacle=true;
                        stop();  
                    }
                if(santaPosition=='1 level' && santaLeft<=-25){
                //go back to 3 level
                    santaTop=0;
                    santaLeft=710;
                    santa.style.marginLeft = `${santaLeft}px`;
                    santa.style.marginTop = `${santaTop}px`;
                    
                    
                    
                }
                santaLeft<=-25 && (santaPosition=='3 level'|| santaPosition=='2 level') ? santaLeft=710 : santaLeft -=5;
                santa.classList.remove(`l_${stepNr}`);
                stepNr > 9 ? stepNr=1 : stepNr++;
                santa.classList.add(`l_${stepNr}`);
                santa.style.marginLeft = `${santaLeft}px`;
                startMove(nav);
            }
        },80);
    }
    //### END moveLeft ###//
    
    //Jump to left&right or exit from hide.
    if(nav == 'up'){
        document.body.removeAttribute('onkeyup','stop(event)');
        document.body.removeAttribute('onkeydown','move(event)');
        
        if(hidden==false){
            jump = true;
            if(lastPosition=='right'){
             setTimeout(function(){
                   santaLeft>=705 ? santaLeft=0 : '';
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
                        santaTop +=14;
                        santa.style.marginLeft = `${santaLeft}px`;
                        santa.style.marginTop = `${santaTop}px`;
                    }else if(stepNr==8){
                        santa.classList.add(`j_r4`);
                    }
                    stepNr!=8 ? startMove(nav) : stop();
                    
                   },80);
            }else if(lastPosition=='left'){
                setTimeout(function(){
                    santaLeft<=0 ? santaLeft=710 : '';
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
                        santaTop +=14;
                        santa.style.marginLeft = `${santaLeft}px`;
                        santa.style.marginTop = `${santaTop}px`;
                        startMove(nav);
                    }else if(stepNr==8){
                        santa.classList.add(`j_l4`);
                         stop();
                    }
                   },80);
            }
        }else{ // exit from hide:
            setTimeout(function(){
                        if(stepNr<1){stepNr=5};
                if(lastPosition=='right'){
                    santa.classList.remove(`h_r${stepNr}`); 
                    stepNr--; 
                    santa.classList.add(`h_r${stepNr}`);
                }else if(lastPosition=='left'){
                        santa.classList.remove(`h_l${stepNr}`); 
                        stepNr--; 
                        santa.classList.add(`h_l${stepNr}`);
                }
                        
                        if(stepNr!=1){
                            startMove(nav)
                        }else{
                            hidden=false;
                            stop();
                        }
                },80);
              
        }
        
    }
    //### END Jump ###//
    
    //hide or go down:
    if(nav == 'down'){
        //if bar, go down
        if(obstacles[0].enable== true || obstacles[1].enable== true){
            hidden=false;
            document.body.removeAttribute('onkeyup','stop(event)');
            document.body.removeAttribute('onkeydown','move(event)');
            setTimeout(function(){
                stepNr > 17 ? stepNr =1 : stepNr++;
                
                if(stepNr>=1 && stepNr<4){
                   santaTop+=1;
                   santa.classList.add(`sl_1`);
                }else if(stepNr>=3 && stepNr <=12){
                    santaTop +=10;
                    santa.classList.add(`sl_2`);
                }else if(stepNr>12){
                    santaTop +=10;
                    santa.classList.add(`sl_3`);  
                }
                
                
                
                if(obstacles[0].enable== true ){
                    santa.style.marginLeft = '338px';
                    if(santaTop>145){
                        obstacles[0].enable = false;
                        stop();
                    }else{
                        startMove(nav);
                    };
                    
                }else if(obstacles[1].enable== true){
                    santa.style.marginLeft = '205px';
                    if(santaTop>287){
                        obstacles[1].enable = false;
                        stop();
                    }else{
                        startMove(nav);
                    };
                }
                
                
                /*else if(obstacles[1].enable== true){
                    
                    
                }*/
                
                santa.style.marginTop = `${santaTop}px`;
        
            },80);
        }else{ // hide
            document.body.removeAttribute('onkeyup','stop(event)');
            setTimeout(function(){
                if(lastPosition=='right'){
                     santa.classList.remove(`h_r${stepNr}`);
                     stepNr > 4 ? stepNr=1 : stepNr++;
                     santa.classList.add(`h_r${stepNr}`);
                }else if(lastPosition=='left'){
                    santa.classList.remove(`h_l${stepNr}`);
                    stepNr > 4 ? stepNr=1 : stepNr++;
                    santa.classList.add(`h_l${stepNr}`);
                }else{
                    santa.classList.add(`h_r${stepNr}`);
                }

                stepNr!=5 ? startMove(nav) : stop();
            },80);
        }
    }
    
    if(nav=='fire'){
        if(hidden != true){
            fire_active = true;
            var snowball = document.createElement('div');
            var sBallPosition =  santaLeft;
            var shootDirection = lastPosition;
            snowball.className= 'snowball';
            
                if(shootDirection=='right'){
                    sBallPosition+=35;
                            
                }
            
            snowball.style.marginTop=`${santaTop+107}px`;
            function fire(){
                setTimeout(function(){
                    if(sBallPosition > -5 && sBallPosition < 740){
                       fireStep++;
                        if(shootDirection=='right'){
                            if(fireStep <= 2){
                                santa.classList.add('fire_1_r');
                            }else if(fireStep>2 && fireStep<5){
                                santa.classList.remove('fire_1_r');  
                                santa.classList.add('fire_2_r');  
                            }else{
                                santa.classList.remove('fire_2_r');  
                                
                            }
                            sBallPosition+=20;// move snowball to right
                        }else if(shootDirection=='left'){
                            if(fireStep <= 2){
                                santa.classList.add('fire_3_l');
                            }else if(fireStep>2 && fireStep<5){
                                santa.classList.remove('fire_3_l');  
                                santa.classList.add('fire_4_l');
                                     
                            }else{
                                santa.classList.remove('fire_4_l');  
                            }
                             sBallPosition-=20;// move snowball to left
                        }
                       
                        fire();
                    }else{
                        for(var i=0;i<=4;i++){
                            santa.classList.remove(`fire_${i}_l`);
                            santa.classList.remove(`fire_${i}_r`);
                        } 
                        playarena.removeChild(snowball);
                        fire_active = false;
                        fireStep =0;
                    }
                    
                },50);
                snowball.style.marginLeft=`${sBallPosition}px`;
                
            }
            fire();
            playarena.appendChild(snowball);
            stop();
        }
        
    }
    
}

