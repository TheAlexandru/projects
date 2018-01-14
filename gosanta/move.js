
var stopped = false;
var skipped = false;
var santa = ''
var playarena = document.getElementById('playarena');
var santaTop = santaLeft = fireStep = stepNr =0;

/*var santaTop = 0;
var santaLeft = 0;
var fireStep= 0;
var stepNr = 0;*/ //for animation 
var lastPosition ='';
var hidden = false;//is santa hidden ?
var santaPosition ='';
var bars = '';
var jump = false;
var obstacle =false;
var fire_active = false;
var gift_aduio = new Audio('/sounds/coin.wav');
var ice_break = new Audio('/sounds/ice_break.wav');
var ice_broken = new Audio('/sounds/ice_broken.wav');
var jump_breathing = new Audio('/sounds/breathing-jumping.wav');
var snow_landing = new Audio('/sounds/snow-land.wav');
var slide = new Audio('/sounds/slide2.wav');
var obstacles = [
    {name: '3 level Bar', enable: false}, 
    {name: '2 level Bar', enable: false},
    {name: 'House', enable: false},
    {name: 'iceb_l', enable: false},
    {name: 'iceb_t', enable: false},
    {name: 'iceb_r', enable: false},
    
    ];

var gifts ='';//gifts position and number (is added in createmap func )
var gifts_nr = 0;
var ice_blocks = '';//ice blocks position and number (is added in createmap func )




var block ='';




var gift = document.getElementsByClassName('gift');//3 level gifts
var gift_other = document.getElementsByClassName('gift g_2level');//other levels
//animated gift
function giftAnimate(){

    setTimeout(function(){
        if(gifts[0].enabled==true){ gift[0].classList.add('gift_second') };
       
        if(gifts[1].enabled==true){ gift_other[0].classList.add('gift_other_second')};
        /*gift[0].className= 'gift_second';*/  
    },500) 
    setTimeout(function(){
       
       if(gifts[1].enabled==true){ gift_other[0].className='gift g_2level'};
       if(gifts[0].enabled==true){gift[0].className='gift'};
        giftAnimate();
    },1500)
}

window.onload=createmap(); //create and show Game menu when page is loaded
function createmap(){
//add gifts && ice blocks
    gifts_nr =0;
    document.getElementById('gifts').firstElementChild.children[1].innerHTML = `${gifts_nr}`;
    for(var i=0;i<4;i++){
        var gift = document.createElement('div');
        gift.className='gift';
        if(i==0){playarena.children[3].appendChild(gift);}
        if(i==1){playarena.children[20].appendChild(gift); gift.className='gift g_2level';}
        
    //adding ice-blocks to map
        var ice_block = document.createElement('div');
        ice_block.className='ice-block';
        var border_field = document.createElement('div');
        border_field.className='field_r_border';
       
        if(i==0){playarena.children[19].appendChild(ice_block);}
        if(i==1){playarena.children[21].appendChild(border_field);}
        if(i==2){playarena.children[21].appendChild(ice_block); ice_block.className='ice-block top_block';}
        if(i==3){playarena.children[21].appendChild(ice_block); ice_block.className='ice-block right_block';}
    }
    gifts= [
      {gift_nr: playarena.children[3].firstElementChild, enabled:true , found:false, position_1:190, position_2:220},
      {gift_nr: playarena.children[20].firstElementChild, enabled:true , found:false, position_1:583, position_2:618},
    ]; 
    
    ice_blocks = [
      {ice_nr: playarena.children[19].firstElementChild, enabled:true , found:false, position_1:551, position_2:602, broken: 0},//left block
      {ice_nr: playarena.children[21].firstElementChild, enabled:true , found:false, position_1:570, position_2:628, broken: 0},//top block
      {ice_nr: playarena.children[21].firstElementChild, enabled:true , found:false, position_1:593, position_2:644, broken: 0},//right block
     //position_1 is for santa go right
     //position_2 is for santa go left
    ];
     block= [
    playarena.children[19].children[0],
    playarena.children[21].children[1],
    playarena.children[21].children[2],

            ];
//end gifts && blocks
    
 
    giftAnimate();
    var dialog = document.createElement('div');
    dialog.setAttribute('id','text_area');
    playarena.appendChild(dialog);
    
    var preload = document.createElement('div');
    preload.setAttribute('id','preload');
    preload.className = 'load';
    
    var pre_menu = document.createElement('div');
    pre_menu.className = 'pre_menu';
    
    var label = document.createElement('label');
    label.innerHTML='Your name:';
    var input = document.createElement('input');
    input.setAttribute('type','text');
    input.setAttribute('id','name');
    
    var btn = document.createElement('div');
    btn.className = 'newG-btn';
    btn.setAttribute('onclick','startGame()');
    
    var span = document.createElement('span');
    span.innerHTML='New Game';
    
    var img = document.createElement('div');
    
    btn.appendChild(span);
    btn.appendChild(img);
    
    pre_menu.appendChild(label);
    pre_menu.appendChild(input);
    pre_menu.appendChild(btn);
    
    preload.appendChild(pre_menu);
    
    playarena.appendChild(preload);
}



//#### Start new game ####

var temp = document.createElement('div');
function startGame(){
    var dialog = document.getElementById('text_area');
    dialog.className = 'status_bar';
    temp.className = 'hide_game';
    var name = document.getElementById('name').value;
    /*playarena.removeChild(document.getElementById('preload'));*/
    playarena.removeChild(playarena.lastElementChild);
    
    dialog.innerHTML=`<div class="santa_dialog"></div><p class="line-1 anim-typewriter">HOHOHO,Hello dear ${name}!! I need your help! </p><div class="skip" onclick='beginGame()'></div> `;
   playarena.appendChild(temp);
   setTimeout(function(){
       if(skipped==false){
           dialog.innerHTML=`<div class="santa_dialog"></div> <p class="line-1 anim-typewriter">Collect all the presents and get them to my house.</p><div class="skip" onclick='beginGame()'></div>`;
       }
       
   },6500);  
    setTimeout(function(){
        if(skipped==false){
           dialog.innerHTML=`<div class="santa_dialog"></div><p class="line-1 anim-typewriter">Good luck ${name}!</p><div class="skip" onclick='beginGame()'></div> `; 
        }
   },11500);
    
    
        
    setTimeout(function(){
        if(skipped==false){
            beginGame()
        }
    },16000);
    
}
function beginGame(){
    var dialog = document.getElementById('text_area');
    skipped=true;
        setTimeout(function(){
            lastPosition = 'right';
            document.body.setAttribute('onkeyup','stop(event)');
            document.body.setAttribute('onkeydown','move(event)');
            var div = document.createElement('div');
            div.setAttribute('id','santa');
            div.className= 'santa';
            playarena.children[0].appendChild(div);
            santa = document.getElementById('santa');
            dialog.innerHTML=``;
            playarena.removeChild(playarena.lastElementChild);
            playarena.removeChild(dialog);
            
        },100);
    }
//#### END start new game ####


//#### Finish the game ####
function finish(){
    for(var i = 0; i < playarena.children.length;i++){
        if(i==0||i==3||i==19||i==20||i==21){
            playarena.children[i].innerHTML='';  
        }
    }
 
    document.body.removeAttribute('onkeydown','move(event)');
    document.body.removeAttribute('onkeyup','stop(event)');
    stopped = true;
    jump = false;
    stepNr = 0;
    obstacle=false;
    skipped=false;
    createmap();
}
//#### end finish game ####


function stop(e){
    
   
    if(obstacle==false){
        document.body.setAttribute('onkeydown','move(event)');
    }
      
    
    document.body.setAttribute('onkeyup','stop(event)');
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
                            console.log(block[0]);
                            console.log(block[1]);
                            console.log(block[2]);
    
    console.log(santaLeft);
    
    //find on which level is santa
    if(santaTop<=0){
        santaPosition = "3 level";
    }else if(santaTop>10 && santaTop<280){
        santaPosition = "2 level";
    }else if(santaTop>280){
        santaPosition = "1 level";
    }
    
    
//find all gifts:
     for(var i = 0; i< gifts.length ; i++){
        
        if(santaLeft>gifts[i].position_1 && santaLeft<gifts[i].position_2  && gifts[i].enabled == true && jump == false){
            if((i==0 &&  santaPosition=='3 level') || (i==1 &&  santaPosition=='2 level') )  {
                     gifts_nr++;
                    document.getElementById('gifts').firstElementChild.children[1].innerHTML = `${gifts_nr}`;
                        gifts[i].found = true;
            }
       
        }
         if(gifts[i].found==true){
            gift_aduio.play();
            if(i==0){
                 playarena.children[3].removeChild(gifts[i].gift_nr);
            }else if(i==1){
                 playarena.children[20].removeChild(gifts[i].gift_nr);
                
            }
           
            gifts[i].enabled=false;
            gifts[i].found=false;
         }
        
    }
    
//find obstacles
    if(nav=='right'){
        if(santaLeft>295 && santaLeft<330 && santaPosition=='3 level'){
            obstacles[0].enable = true;
        }else if(santaLeft>168 && santaLeft<180 && santaPosition=='2 level'){
            obstacles[1].enable = true;
        }else if(santaLeft>530 && santaPosition =='1 level'){
            
            obstacles[2].enable = true;
        }else if(santaLeft>ice_blocks[0].position_1 && santaLeft< (ice_blocks[0].position_1+10) && ice_blocks[0].enabled==true && santaPosition=='2 level'){
            obstacles[3].enable = true;
            
        }else if(santaLeft>ice_blocks[1].position_1 && santaLeft< (ice_blocks[1].position_1+10) && ice_blocks[1].enabled==true && santaPosition=='2 level'){
            obstacles[4].enable = true;
            
        }else if(santaLeft>ice_blocks[2].position_1 && santaLeft< (ice_blocks[2].position_1+10) && ice_blocks[2].enabled==true && santaPosition=='2 level'){
            obstacles[5].enable = true;
            
        }else{
            for(var i=0; i<obstacles.length; i++){obstacles[i].enable = false;}
        }
    }else if(nav=='left'){
        if(santaLeft>360 && santaLeft<390 && santaPosition=='3 level'){
            obstacles[0].enable = true;
        }else if(santaLeft>235 && santaLeft<250 && santaPosition=='2 level'){
            obstacles[1].enable = true;
        }else if(santaLeft>ice_blocks[0].position_2 && santaLeft< (ice_blocks[0].position_2+10) && ice_blocks[0].enabled==true && santaPosition=='2 level'){
            obstacles[3].enable = true;
        }else if(santaLeft>ice_blocks[1].position_2 && santaLeft< (ice_blocks[1].position_2+10) && ice_blocks[1].enabled==true && santaPosition=='2 level'){
            obstacles[4].enable = true;  
        }else if(santaLeft>ice_blocks[2].position_2 && santaLeft< (ice_blocks[2].position_2+10) && ice_blocks[2].enabled==true && santaPosition=='2 level'){
            obstacles[4].enable = true;  
        }else{
             for(var i=0; i<obstacles.length; i++){ obstacles[i].enable = false;}
            
        }
    }
  
//move santa to Right
    if(nav == 'right'){   
        console.log('santa TOP',santaTop);
        setTimeout(function(){
                if(stopped != true){
                   
                    if((obstacles[0].enable||obstacles[1].enable||obstacles[3].enable||obstacles[4].enable||obstacles[5].enable)==true ){
                        obstacle=true;
                        stop();  
                    }else if(obstacles[2].enable==true ){
                        finish();      
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
                if((obstacles[0].enable || obstacles[1].enable|| obstacles[3].enable || obstacles[4].enable)==true){
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
        
        if(hidden==false && (obstacles[3].enable||obstacles[4].enable)==false){
            if(stepNr==0){
                jump_breathing.loop = false;
                jump_breathing.play();
            }else if(stepNr==5){
                snow_landing.play();
            };
            jump = true;
            if(lastPosition=='right'){
                
             setTimeout(function(){
                   santaLeft>=705 ? santaLeft=0 : '';
                   santa.className='santa';
                    stepNr++
            //stop jumping if ice
                 if(ice_blocks[0].enabled==true&&(santaLeft+10)>ice_blocks[0].position_1 && (santaLeft+10)<ice_blocks[0].position_2 && santaPosition=='2 level'){
                        stepNr=8;
                        santaTop=143;
                        santa.style.marginTop = `${santaTop}px`;
                 }
            //end stop jumping
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
        }else if((obstacles[3].enable||obstacles[4].enable)==true){
            document.body.removeAttribute('onkeyup','stop(event)');
            document.body.removeAttribute('onkeydown','move(event)');
            stop();
            
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
        //if ice block then don't jump!
        if(obstacles[3].enable==false && obstacles[4].enable==false && obstacles[5].enable==false){
            //if bar, go down
            hidden = true;
            if(obstacles[0].enable== true || obstacles[1].enable== true){
                hidden=false;
                document.body.removeAttribute('onkeyup','stop(event)');
                document.body.removeAttribute('onkeydown','move(event)');
                setTimeout(function(){
                    stepNr > 17 ? stepNr =1 : stepNr++;
                    if(stepNr==2){slide.play();}
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
            
        }else{
            console.log("I can't hide here!");
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
                    if(shootDirection=='right' && sBallPosition > -5 && sBallPosition < 740) {
                        
                       
                        fireStep++;
                        if(fireStep <= 2){
                            
                                santa.classList.add('fire_1_r');
                            }else if(fireStep>2 && fireStep<5){
                                santa.classList.remove('fire_1_r');  
                                santa.classList.add('fire_2_r');  
                            }else{
                                santa.classList.remove('fire_2_r');  
                                
                            }
                            sBallPosition+=10;// move snowball to right
                        
        //if ice then stop the ball,esle move one..

                            if(santaPosition=='2 level' && ice_blocks[0].enabled==true && sBallPosition > ice_blocks[0].position_1+40&&sBallPosition<ice_blocks[0].position_2){
                                if(ice_blocks[0].broken>=0 && ice_blocks[0].broken<5){
                                  ice_blocks[0].broken++;
                                }
                                breakIce(0,ice_blocks[0].broken);  
                            }else if(santaPosition=='2 level' && ice_blocks[1].enabled==true && sBallPosition > ice_blocks[1].position_1+40&&sBallPosition<ice_blocks[1].position_2){
                                if(ice_blocks[1].broken>=0 && ice_blocks[1].broken<5){
                                  ice_blocks[1].broken++;
                                }
                                breakIce(1,ice_blocks[1].broken);  
                            }else if(santaPosition=='2 level' && ice_blocks[2].enabled==true && sBallPosition > ice_blocks[2].position_1+40&&sBallPosition<ice_blocks[2].position_2){
                                if(ice_blocks[2].broken>=0 && ice_blocks[2].broken<5){
                                  ice_blocks[2].broken++;
                                }
                                breakIce(2,ice_blocks[2].broken);  
                                
                                
                            }else{
                                fire();
                            }
                        
                       
                    }else if(shootDirection=='left' && sBallPosition < 740 && sBallPosition > -5){
                            fireStep++;
                            if(fireStep <= 2){
                                
                                santa.classList.add('fire_3_l');
                            }else if(fireStep>2 && fireStep<5){
                                santa.classList.remove('fire_3_l');  
                                santa.classList.add('fire_4_l');
                                     
                            }else{
                                santa.classList.remove('fire_4_l');  
                            }
                             sBallPosition-=10;// move snowball to left
                    //if ice then stop the ball,esle move one..

                         if(santaPosition=='2 level' && ice_blocks[0].enabled==true && sBallPosition > ice_blocks[0].position_1+40&&sBallPosition<ice_blocks[0].position_2){
                                if(ice_blocks[0].broken>=0 && ice_blocks[0].broken<5){
                                  ice_blocks[0].broken++;
                                }
                                breakIce(0,ice_blocks[0].broken);  
                            }else if(santaPosition=='2 level' && ice_blocks[1].enabled==true && sBallPosition > ice_blocks[1].position_1+40&&sBallPosition<ice_blocks[1].position_2){
                                if(ice_blocks[1].broken>=0 && ice_blocks[1].broken<5){
                                  ice_blocks[1].broken++;
                                }
                                breakIce(1,ice_blocks[1].broken);  
                            }else if(santaPosition=='2 level' && ice_blocks[2].enabled==true && sBallPosition > ice_blocks[2].position_1+40&&sBallPosition<ice_blocks[2].position_2){
                                if(ice_blocks[2].broken>=0 && ice_blocks[2].broken<5){
                                  ice_blocks[2].broken++;
                                }
                                breakIce(2,ice_blocks[2].broken);  
                                
                                
                            }else{
                                fire();
                            }
                        
                        
                        }else{
                            stopBall();
                        }
                    function stopBall(){
                        for(var i=0;i<=4;i++){
                            santa.classList.remove(`fire_${i}_l`);
                            santa.classList.remove(`fire_${i}_r`);
                        } 
                        playarena.removeChild(snowball);
                        fire_active = false;
                        fireStep =0;
                    }
                    
                    // change ice style 
                    function breakIce(bl,nr){
                        var b_nr = bl;
                        
                        if(nr!=1){
                            block[b_nr].classList.remove(`break_ice_${nr-1}`);  
                          /*  if(ice_blocks[0].enabled==false && ice_blocks[1].enabled == false && ice_blocks[2].enabled==false){
                                  
                            }*/
                        }
                        
                        if(nr>0&& nr<4){
                            
                            ice_break.play();
                            block[b_nr].classList.add(`break_ice_${nr}`);
                            stopBall();
                        }else if(nr==4){
                            ice_broken.play();
                            if(b_nr==0){
                                playarena.children[19].removeChild(playarena.children[19].firstElementChild); 
                            }else if(b_nr==1){
                                playarena.children[21].removeChild(block[b_nr]); 
                            }else if(b_nr==2){
                                playarena.children[21].removeChild(block[b_nr]); 
                            }
                            ice_blocks[b_nr].broken=0;
                            ice_blocks[b_nr].enabled=false;
                            
                            
                            fire();
                        }   
                        
                    }
                    
                },20);
                snowball.style.marginLeft=`${sBallPosition}px`;
                
            }
            fire();
            playarena.appendChild(snowball);
            stop();
        }
        
    }
    
}

