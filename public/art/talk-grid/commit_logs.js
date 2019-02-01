let width, height;
const canvas = document.getElementById('commit_logs');


const ROW_HEIGHT = 30;
const LETTER_OFFSET = 30;
const BACKGROUND_COLOR = '#181818';
const SECONDS_MODE = 10;


const MODE_OPS = [
    function(ary) {
        for (let i = 0; i < 3; i++) {
            ary[Math.floor(Math.random()*ary.length)] = true;
        }
    },
    function(ary, fr) {
        if (fr % 4 !== 0) return;
        ary[Math.floor(Math.random()*ary.length)] = !ary[Math.floor(Math.random()*ary.length)]; 
    },
    function(ary) {
        ary[Math.floor(Math.random()*ary.length)] = true;
    },
    function(ary, fr) {
        if (fr % 3 !== 0) return;
        const ri = Math.floor(Math.random()*ary.length);
        ary[ri] = !ary[ri]; 
    },
    function(ary) {
        ary[Math.floor(Math.random()*ary.length)] = false;
    }
];

const SYMBOL_STRING = 'do{let speaker = /jsconf/.replace(/$/, \'asia\')} () => } while (0)';

let mode = 0;
setInterval(() => {
    mode = ++mode % MODE_OPS.length;
}, SECONDS_MODE * 1000);

function TalkNode(offset, text) {
    const revealed = new Array(text.length).fill(false);

    this.drawNode = function(ctx, counter) {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, offset, width, width, 20);
        ctx.fillStyle = '#aaa';
        MODE_OPS[mode](revealed, counter); 
        ctx.font = '20px courier';
        for (let i = 0; i < text.length; i++) {
            ctx.fillStyle = revealed[i] ? '#aaa' : '#333';
            ctx.fillText(revealed[i] ? text[i] : SYMBOL_STRING[i], i * LETTER_OFFSET, offset);
        }
    }
}

function setup() {
	width = Math.ceil(window.innerWidth / 2) * 2;
	height = Math.ceil(window.innerHeight / 2) * 2;

	canvas.width = width;
	canvas.height = height;
}

const nodes = window.talks.map((talk, i) => new TalkNode(i * ROW_HEIGHT, talk));

const ctx = canvas.getContext('2d');
let counter = 0;
function draw() {
    counter++;
    nodes.forEach((node) => node.drawNode(ctx, counter));
    requestAnimationFrame(draw);
}

window.onresize = setup;
window.onload = () => {
    setup();
    draw();
};

