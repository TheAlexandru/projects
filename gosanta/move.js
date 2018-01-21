
var stopped = false;
var skipped = false;
var santa = ''
var playarena = document.getElementById('playarena');
var santaTop = santaLeft = fireStep = stepNr =0;
var lastPosition ='';
var hidden = false;//is santa hidden ?
var santaPosition ='';
var bars = '';
var jump = false;
var obstacle =false;
var fire_active = false;
var gift_aduio = new Audio('sounds/coin.wav');
var ice_break = new Audio('sounds/ice_break.wav');
var ice_broken = new Audio('sounds/ice_broken.wav');
var jump_breathing = new Audio('sounds/breathing-jumping.wav');
var snow_landing = new Audio('sounds/snow-land.wav');
var slide = new Audio('sounds/slide2.wav');
var damage = new Audio('sounds/damage.wav');
var santaHurt = new Audio('sounds/santa_hurt.mp3');
var loading = new Audio('sounds/ps_1.mp3');
var wasted = new Audio('sounds/wasted.mp3');
var obstacles = [
    {name: '3 level Bar', enable: false}, 
    {name: '2 level Bar', enable: false},
    {name: 'House', enable: false},
    {name: 'iceb_l', enable: false},
    {name: 'iceb_t', enable: false},
    {name: 'iceb_r', enable: false},
    {name: 'tree1', enable: true,position_1:-25,position_2:60},
    {name: 'snowman', alive: true,position_1:100,position_2:188,life:100,snowball:false},
    ];
console.log(obstacles[7].enable);
var win = lose = false;
var santalife = 60;

var gifts ='';//gifts position and number (is added in createmap func )
var gifts_nr = 0;
var ice_blocks = '';//ice blocks position and number (is added in createmap func )

var block ='';

//#### animated gift
var gift = document.getElementsByClassName('gift');
function giftAnimate(){
    setTimeout(function(){
        for(var i= 0; i<gift.length;i++){
            if(gift[i].className.indexOf("g_2level")==5){//gifts from 2level
                gift[i].classList.add('gift_other_second');
            }else{
                gift[i].classList.add('gift_second');
            }
        } 
    },500) 
    setTimeout(function(){
       for(var i= 0; i<gift.length;i++){
           if(gifts[0].enabled==true||gifts[1].enabled==true||gifts[2].enabled==true){
            if(gift[i].className=='gift g_2level gift_other_second'){
                gift[i].className= 'gift g_2level';
            }else{
                  gift[i].className='gift';
               }
           }
        }
        giftAnimate();
    },1500)
}
//END ANIMATED GIFT #####

//######## NEW MAP #########
function createmap(){
    loading.play();
    
    //create new snowman
    newSnowMan();
    snmAnimate()
    snowman_life = 100;
//add gifts && ice blocks
    gifts_nr =0;
    document.getElementById('gifts').firstElementChild.children[1].innerHTML = `${gifts_nr}`;
    for(var i=0;i<4;i++){
        var gift = document.createElement('div');
        gift.className='gift';
        if(i==0){playarena.children[3].appendChild(gift);}
        if(i==1){playarena.children[12].appendChild(gift);}
        if(i==2){playarena.children[20].appendChild(gift);}
        if(i==1||i==2){gift.className='gift g_2level';}//set diferent class for level 2
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
      {gift_nr: playarena.children[12].firstElementChild, enabled:true , found:false, position_1:49, position_2:99},
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
//######## end map #########

//######## SnowMan ############
    //generate new snowman
var snowman = '';
function newSnowMan(){
    var div=document.createElement('div');
    div.className='snowman';
    div.id='snowman';
    playarena.children[13].appendChild(div);
    snowman = document.getElementById('snowman');
}

    //animate snowman
    var snmfireNr =0;
function snmFire(){
    if(santaPosition=='2 level' && lose==false){
        if(obstacles[7].life>0){//snowman life 
            if(obstacles[7].snowball===false){
                var div = document.createElement('div');
                div.className='bigSnBall';
                div.id = 'bigSnowBall';
                setTimeout(function(){
                    snmfireNr>0&& snmfireNr<=6 ? snowman.classList.remove(`snowman_f${snmfireNr}`):'';
                    snmfireNr++;
                    snmfireNr<=6 ? snowman.classList.add(`snowman_f${snmfireNr}`):'';
                    snmfireNr>6 && snmfireNr<15 ? snowman.className= 'snowman' : '';
                    snmfireNr>=15 ? snmfireNr=0:'';
                    if(snmfireNr==4){
                        playarena.children[13].appendChild(div);
                    };
                    if(snmfireNr==6){
                        var snball = document.getElementById('bigSnowBall');
                        playarena.children[13].removeChild(snball);
                        div.style.marginLeft = "50px";
                        playarena.children[13].appendChild(div);
                        
                        trhowSnowball();
                       
                    }
                   /* if(snmfireNr==6){
                        
                    }*/
                    snmFire();
                    
                },110);
                
            }
            
        }
    }else{
       
        snowman.className='snowman';
        snmfireNr =0;
        snmAnimate();
    }
}
function trhowSnowball(){
    var snball = document.getElementById('bigSnowBall');
    var snballPosition = 50;
  
    throwIt();
    function throwIt(){
          var snballPosition_from0 = snball.offsetLeft;
          var santalifeBar = document.getElementById('life_bar');
            setTimeout(function(){
                if(snballPosition_from0 < santaLeft && santaPosition==='2 level' && hidden===false || hidden===true && snballPosition_from0<710){
                    snballPosition+=4;
                    obstacles[7].snowball=true;
                    snball.style.marginLeft=`${snballPosition}px`;
                    throwIt();
                }else{
                    if(snballPosition_from0 >= santaLeft && snballPosition_from0 <= santaLeft+40){
                        santaHurt.play();
                        if(santalife>=12){
                            santalife-=12;
                            santalifeBar.style.width=`${santalife}px`;
                        }else{
                            playarena.children[13].removeChild(snball);
                            santaPosition='1 level';
                            santa.className='';
                            lose=true;
                            finish();
                        }
                       
                    }
                    obstacles[7].snowball=false;
                    playarena.children[13].removeChild(snball);
                    snmfireNr =0;
                    if(santaPosition==='2 level'){
                       snmFire(); 
                    }else{
                        snmAnimate();
                    }
                    
                }
                
            },8);
    
    }
    
   
   
   
}
function snmAnimate(){
    if(santaPosition!='2 level' && obstacles[7].life>0){
        setTimeout(function(){
            snowman.classList.add('snowman_2');

        },1000);
        setTimeout(function(){
            snowman.classList.remove('snowman_2');
            snmAnimate();
        },2100);
    }else{
        snmFire();
        /*setTimeout(snmAnimate,500);*/
    }
}

//######## END SnowMan ########



//#### Start NEW GAME ####

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
    loading.pause();
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
   /* for(var i = 0; i < playarena.children.length;i++){
        if(i==0||i==3||i==12||i==13||i==19||i==20||i==21){
            playarena.children[i].innerHTML='';  
        }
    }*/
    
    document.body.removeAttribute('onkeydown','move(event)');
    document.body.removeAttribute('onkeyup','stop(event)');
    stopped = true;
    jump = false;
    stepNr = 0;
    obstacle=false;

    var points = document.createElement('div');
    points.className='points';
    points.innerHTML= `Total gifts accumulated: ${gifts_nr}/3`;
    var div = document.createElement('div');
    div.className='load';
    var btn = document.createElement('div');
    btn.className = 'newG-btn';
    var over = document.createElement('div');
    over.className='gameOver';
    
    if(lose==true){
        wasted.play();
        setTimeout(function(){
            div.appendChild(over);
        },200)
       
        playarena.appendChild(div);
        setTimeout(function(){
            div.appendChild(points);
             btn.setAttribute('onclick','restartGame()');
            btn.innerHTML='New Game';
            div.appendChild(btn);
        },2500)
    }
    if(win==true){
        
        
        btn.setAttribute('onclick','restartGame()');
        btn.innerHTML='You win!';
        div.appendChild(btn);
        playarena.appendChild(div);
    }
    if(gifts_nr<3 && lose==false){
        btn.setAttribute('onclick','resumeGame()');
        btn.innerHTML='Collect all gifts!';
        div.appendChild(btn);
        playarena.appendChild(div);
       
       }
    //location.reload();
}
//#### end finish game ####

//#### restart/resume Game #####
function restartGame(){
    location.reload();
}
function resumeGame(){
    playarena.removeChild(playarena.lastElementChild);
    /*document.body.setAttribute('onkeydown','move(event)');
    document.body.setAttribute('onkeyup','stop(event)');*/
    lastPosition='left';
    santa.style.marginLeft=`515px`;
    stop();
}
//end

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


//##### All move conditions up/down/left/right/fire/hide/slide ######
function startMove(nav){
    
    console.log(santaLeft);

    
    //find on which level is santa
    if(santaTop<=0){
        santaPosition = "3 level";
    }else if(santaTop>10 && santaTop<150){
        santaPosition = "2 level";
    }else if(santaTop>180 && santaTop<290){
        santaPosition = "1 level";
    }
    
    
//find all gifts:
     for(var i = 0; i< gifts.length ; i++){
        
        if(santaLeft>gifts[i].position_1 && santaLeft<gifts[i].position_2  && gifts[i].enabled == true && jump == false){
            if((i==0 &&  santaPosition=='3 level') || ((i==1||i==2) &&  santaPosition=='2 level') )  {
                     gifts_nr++; document.getElementById('gifts').firstElementChild.children[1].innerHTML = `${gifts_nr}`;
                        gifts[i].found = true;
            }
       
        }
         if(gifts[i].found==true){
            gift_aduio.play();
            if(i==0){
                 playarena.children[3].removeChild(gifts[i].gift_nr);
            }else if(i==1){
                 playarena.children[20].removeChild(gifts[i].gift_nr);
                
            }else if(i==2){
                 playarena.children[12].removeChild(gifts[i].gift_nr);
                
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
                    if((obstacles[0].enable||obstacles[1].enable||obstacles[3].enable||obstacles[4].enable||obstacles[5].enable)==true || (santaLeft < obstacles[6].position_2 &&santaPosition=='2 level')){
                        obstacle=true;
                        stop();  
                    }else if(obstacles[2].enable==true ){
                        if(gifts_nr==3&&santalife>0){
                            win=true;
                            console.log(gifts_nr,'collect all gifts!');
                        }
                        if(santalife<1){
                            lose=true;
                        }
                        finish();      
                    }
                    santaLeft>=710 ? santaLeft=-25 : santaLeft +=5;
                    santa.classList.remove(`r_${stepNr}`);
                    stepNr > 9 ? stepNr=1 : stepNr++;   
                    santa.classList.add(`r_${stepNr}`);
                    santa.style.marginLeft = `${santaLeft}px`;
                    
                    startMove(nav);
                }
        },60);
    }
    //### END moveRight ###//
    
    //move santa to Left
    if(nav == 'left'){
        setTimeout(function(){
            if(stopped != true){
                //if snowman
                if(santaLeft >= obstacles[7].position_1 && santaLeft <= obstacles[7].position_2 && santaPosition=='2 level' && obstacles[7].alive==true){
                    lose=true; finish();
                }
                if((obstacles[0].enable || obstacles[1].enable|| obstacles[3].enable || obstacles[4].enable)==true|| (santaLeft > obstacles[6].position_1 &&  santaLeft < obstacles[6].position_2+10 &&santaPosition=='2 level')){
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
        },60);
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
            //stop jumping if ice or other obstacle
                 if((ice_blocks[0].enabled==true&&(santaLeft+10)>ice_blocks[0].position_1 && (santaLeft+10)<ice_blocks[0].position_2 && santaPosition=='2 level')||(santaLeft < obstacles[6].position_2 && santaPosition=='2 level') || (santaLeft>515 && santaPosition=='1 level')){
                    
                        stepNr=8;
                     if(santaPosition=='1 level'){santaTop=286};
                     if(santaPosition=='2 level'){santaTop=143};
                     if(santaPosition=='3 level'){santaTop=0};
                       
                    santa.style.marginTop = `${santaTop}px`;
                     /*if(santaLeft>=obstacles[7].position_1&&santaLeft<=obstacles[7].position_2 && obstacles[7].enable===true && santaPosition=='2 level'){
                            lose=true;
                            finish();
                        }*/
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
                //stop jumping if ice or other obstacle
                 if(ice_blocks[0].enabled==true&&(santaLeft+10)>ice_blocks[0].position_1 && (santaLeft+10)<ice_blocks[0].position_2 && santaPosition=='2 level'||(santaLeft > obstacles[6].position_1 &&  santaLeft < obstacles[6].position_2+20 &&santaPosition=='2 level') || (santaLeft >= obstacles[7].position_1 && santaLeft <= obstacles[7].position_2 && santaPosition=='2 level' && obstacles[7].alive==true) ){
                    if(santaLeft >= obstacles[7].position_1 && santaLeft <= obstacles[7].position_2 && santaPosition=='2 level' && obstacles[7].alive==true){
                        lose=true;
                        finish();
                    }
                     
                        stepNr=8;
                        santaTop=143;
                        santa.style.marginTop = `${santaTop}px`;
                 }
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
                },50);
              
        }
        
    }
    //### END Jump ###//
    
    //hide or go down:
    if(nav == 'down'){
        console.log('topcik',santaTop);
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
                },50);
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
//##### end move #####


window.onload=createmap(); //create and show Game menu when page is loaded


