const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const frame = new Image();
let dataFrame;
let speed = 4;
const frame_offset = {
    width: 96,
    height: 104
}
const frame_move = {
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 0,
}
const pos = {
    x: (window.innerWidth/2 - frame_offset.width/2)|0,
    y: (window.innerHeight/2 - frame_offset.height/2)|0
}
const keyState = {
    left: false,
    right: false,
    up: false,
    down: false
}
console.log(pos.x, pos.y);
const status = {
    direction: 'down',
    frame_index: 0,
    interval_stay: {
        isLoop: false,
        delay: 2000,
        loop: undefined
    },
    interval_move: {
        isLoop: true,
        delay: 60,
        loop: undefined
    },
}

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
            status.direction = 'left';
            keyState['left'] = true;
            break;
        case 'KeyD':
        case 'ArrowRight':
            status.direction = 'right';
            keyState['right'] = true;
            break;
        case 'KeyW':
        case 'ArrowUp':
            status.direction = 'up';
            keyState['up'] = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            status.direction = 'down';
            keyState['down'] = true;
            break;
        case 'Space':
            speed = 20;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
            keyState['left'] = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            keyState['right'] = false;
            break;
        case 'KeyW':
        case 'ArrowUp':
            keyState['up'] = false;
            break;
        case 'KeyS':
        case 'ArrowDown':
            keyState['down'] = false;
            break;
        case 'Space':
            speed = 5;
            break;
    }
});

init();

function moveState(){
    let checkIsMoving = false;

    if(keyState['left'] === true){
        pos.x -= speed;
        checkIsMoving = true;
    }
        
    if(keyState['right'] === true){
        pos.x += speed;
        checkIsMoving = true;
    }
       
    if(keyState['up'] === true){
        pos.y -= speed;
        checkIsMoving = true;
    }
       
    if(keyState['down'] === true){
        pos.y += speed;
        checkIsMoving = true;
    }

    canvas.style.top = pos.y + 'px';
    canvas.style.left = pos.x + 'px';

    if(checkIsMoving && !status.interval_move.isLoop){
        clearInterval(status.interval_stay.loop);
        status.interval_stay.isLoop = false;

        draw();
        status.interval_move.loop = setInterval(draw, status.interval_move.delay);
        status.interval_move.isLoop = true;
    }
    else if(!checkIsMoving && !status.interval_stay.isLoop){
        clearInterval(status.interval_move.loop);
        status.interval_move.isLoop = false;

        draw();
        status.interval_stay.loop = setInterval(draw, status.interval_stay.delay);
        status.interval_stay.isLoop = true;
    }

    setTimeout(moveState, 10);
}

function draw() {
    const frame_pos = {
        x: 0,
        y: 0
    }
    if(status.interval_move.isLoop){
        if(status.frame_index >= 10){
            status.frame_index = 0;
        }
        const data = dataFrame[`move_${status.direction}_${status.frame_index + 1}.png`].frame;
        frame_pos.x = data.x;
        frame_pos.y = data.y;    
    } 
    else {
        if(status.frame_index >= 3){
            status.frame_index = 0;
        }
        const data = dataFrame[`stay_${status.direction}_${status.frame_index + 1}.png`].frame;
        frame_pos.x = data.x;
        frame_pos.y = data.y;  
    }
    status.frame_index++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, frame_pos.x, frame_pos.y, frame_offset.width, frame_offset.height, 0, 0, frame_offset.width, frame_offset.height);
}

async function init(){
    dataFrame = await fetchData();
    canvas.width = frame_offset.width;
    canvas.height = frame_offset.height;
    frame.src = './asset/spritesheet.png';
    frame.onload = ()=>{
        draw();
        frame.onload = null;
    };
    moveState();
}

async function fetchData(){
    const spritesheetJSON = await fetch('./asset/spritesheet.json');
    const json = await spritesheetJSON.json();
    return json.frames;
}
