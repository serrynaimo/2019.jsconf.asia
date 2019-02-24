const dpr = window.devicePixelRatio;
	const visWidth = window.innerWidth;
	const visHeight = window.innerHeight;


	const canvasEl = document.querySelector('#vis');
	// canvasEl.width = visWidth*dpr;
	canvasEl.width = visWidth;
	// canvasEl.height = visHeight*dpr;
	canvasEl.height = visHeight;

	// set up our canvas
	const ctx = canvasEl.getContext('2d');

	ctx.fillStyle = 'hsla(31, 96%, 7%, 1)';
	ctx.fillRect(0,0,visWidth, visHeight);

	// all lines are going to be white (for now)
	ctx.lineWidth = 2.0;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.strokeStyle = 'hsla(41, 77%, 94%, 1)';

	// this is a shit way of doing this but whatever
	const colourPalette = [
		'hsla(5, 86%, 53%, 1)', // red
		'hsla(5, 84%, 76%, 1)', // pink
		'hsla(41, 88%, 60%, 1)', // yellow
		'hsla(31, 75%, 35%, 1)' // copper
	];

	// draw a square: style can be blank, grid or sliced
	function drawSquare(context, size, x, y, colour, style = 'blank') {
		context.save();

		context.fillStyle = colour;

		// outline
		context.beginPath();
		// context.rect(x, y, size, size);
		context.moveTo(x, y);
		context.lineTo(x+(size/2), y+(size/2));
		context.lineTo(x, y+size);
		context.lineTo(x-(size/2), y+(size/2));
		context.lineTo(x, y);
		context.fill();

		if (style === 'grid' || style === 'sliced') {
			// grid lines
			context.moveTo(x+(size/4), y+(size/4));
			context.lineTo(x-(size/4), y+(size*0.75));
			context.moveTo(x-(size/4), y+(size/4));
			context.lineTo(x+(size/4), y+(size*0.75));

			if (style === 'sliced') {
				// diagonal lines
				context.moveTo(x, y);
				context.lineTo(x, y+size);
				context.moveTo(x-(size/2), y+(size/2));
				context.lineTo(x+(size/2), y+(size/2));
			}
		}

		context.stroke();
		context.closePath();
		context.restore();

	}

	// randomely set style of square (val: math.rand)
	function returnStyle(val) {
		if (val < 0.3) {
			return 'blank';
		} else if (val < 0.6) {
			return 'grid';
		} else {
			return 'sliced';
		}
	}

	// set up the coords for our grid
	const gridSize = 60;

	const coords = [];
	// start with border, up until border
	// THIS IS THE ULTIMATE DISTRIBUTION LOOP OH MY GOD - DO GRID SIZE AND BORDERS AND BOOM STICKS
	for (let y=gridSize*2; y<visHeight-(gridSize*3); y+=gridSize) {
		for (let x=gridSize*2; x<visWidth-(gridSize*3); x+=gridSize) {

				coords.push({x,y});

		}
	}
	// console.log(coords);

	// draw squares
	// only draw a third of the time
	// can we draw some double the size?

	let debounce = 0;
	function draw() {
		requestAnimationFrame(draw);

		if (debounce === 45) {
			ctx.clearRect(0,0,visWidth, visHeight);
			ctx.fillStyle = 'hsla(31, 96%, 7%, 1)';
			ctx.fillRect(0,0,visWidth, visHeight);
			renderSquares();
			debounce = 0;
		} else {
			debounce++;
		}



	}
	draw();

	function renderSquares() {

		for (let i=0; i<coords.length; i++) {

			let canDraw = Math.random();
			let doubleSize = Math.random();

			if (canDraw < 0.4) {

				if (doubleSize > 0.6) {
					drawSquare(ctx, gridSize*2, coords[i].x, coords[i].y, colourPalette[i%4], returnStyle(Math.random()));
				} else {
					drawSquare(ctx, gridSize, coords[i].x, coords[i].y, colourPalette[i%4], returnStyle(Math.random()));
				}

			}

		} // for


	}