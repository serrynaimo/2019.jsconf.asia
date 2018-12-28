$("#subscribeForm").ajaxForm({
	url: "https://2019.jsconf.asia/add.php",
	dataType: "html",
	beforeSubmit: function() {
		$("#subscribeForm .msg span").text("");
		$("#subscribeForm").removeClass("failure success").addClass("load");
	},
	success: function(r) {
		if(r.substr(0,6) != "Thanks") {
			$("#subscribeForm").removeClass("load").addClass("failure");
			$("#subscribeForm .msg span").text(r.substr(0,r.indexOf('<br/>')));
			setTimeout(function() {
				$("#subscribeForm").removeClass("failure");
				$("#subscribeForm input[name='text']").focus();
			},5000);
		}
		else {
			$("#subscribeForm").removeClass("load").addClass("success");
			$("#subscribeForm .msg span").text("Thanks! We keep you updated!");
			setTimeout(function() {
				$("#subscribeForm input").val("");
				$("#subscribeForm").removeClass("success");
			},3000);
			setTimeout(function() {
				window.location = "https://facebook.com/jsconfasia";
			},10);
		}
	},
	error: function(r, s) {
		$("#subscribeForm").removeClass("load").addClass("failure");
		$("#subscribeForm .msg span").text("Something went wrong...");
		setTimeout(function() {
			$("#subscribeForm").removeClass("failure");
		},4000);
	}
});

$("#subscribeForm .msg").click(function() {
	$("#subscribeForm").removeClass("failure success");
	$("#subscribeForm input[name='email']").focus();
});


let startdate = new Date()
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan']
const request = new XMLHttpRequest()
request.open('GET', '/api/currentTime.php', false)
request.send(null)

if (request.status === 200) {
	const currentTime = request.getResponseHeader('date')
	const currentDate = new Date(currentTime)
	if (currentDate.toString() !== 'Invalid Date') {
		startdate = currentDate
	}
}

const nextmonth = months[startdate.getMonth() + 1]
const target = startdate.getFullYear() < 2018 ? 'Mon, 1 ' + nextmonth + (startdate.getMonth() < 10 ? ' 2019' : ' 2018') + ' 00:00:00 +0800' : 'Tue, 20 Nov 2018 11:00:00 +0800'
// CountDownTimer(target, 'countdown')

function CountDownTimer(dt, id)
{
	const end = new Date(dt)
	const _second = 1000
	const _minute = _second * 60
	const _hour = _minute * 60
	const _day = _hour * 24
	const startjs = new Date()
	const diff = startjs - startdate
	let timer;

	function showRemaining() {
		const now = new Date()
		const passed = now - startjs
		const distance = end - startdate - passed
		if (distance < _second) {
				clearInterval(timer);
				document.getElementById(id).innerHTML = '<a href="https://jsconfasia2019.pouchnation.com">&gt;&gt;&gt; NOW &lt;&lt;&lt;</a>';
				return;
		}
		const days = Math.floor(distance / _day);
		const hours = Math.floor((distance % _day) / _hour);
		let minutes = Math.floor((distance % _hour) / _minute);
		let seconds = Math.floor((distance % _minute) / _second);

		if(seconds < 10) {
			seconds = "0" + seconds;
		}

		if(minutes < 10) {
			minutes = "0" + minutes;
		}

		document.getElementById(id).innerHTML = days > 0 ? (days > 1 ? days + ' DAYS ' : '1 DAY ') : ''
		document.getElementById(id).innerHTML += hours + ':' + minutes + ':' + seconds;
	}

		timer = setInterval(showRemaining, 1000);
}

var shownBefore = false;
function detectswipe(ele,func) {
  swipe_det = new Object();
  swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  var min_x = 30;  //min x swipe for horizontal swipe
  var max_x = 30;  //max x difference for vertical swipe
  var min_y = 50;  //min y swipe for vertical swipe
  var max_y = 60;  //max y difference for horizontal swipe
  var direc = "";
  // ele = document.getElementById(el);
  ele.addEventListener('touchstart',function(e){
    var t = e.touches[0];
    swipe_det.sX = t.screenX;
    swipe_det.sY = t.screenY;
  },false);
  ele.addEventListener('touchmove',function(e){
    e.preventDefault();
    var t = e.touches[0];
    swipe_det.eX = t.screenX;
    swipe_det.eY = t.screenY;
  },false);
  ele.addEventListener('touchend',function(e){
    //horizontal detection
    if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
      if(swipe_det.eX > swipe_det.sX) direc = "r";
      else direc = "l";
    }
    //vertical detection
    else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
      if(swipe_det.eY > swipe_det.sY) direc = "d";
      else direc = "u";
    }

    if (direc != "") {
      if(typeof func == 'function') func(ele,direc);
    }
    direc = "";
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  },false);
}

var enableHover = true;
document.querySelector('.burger').addEventListener('click',function(e) {
	if (document.body.classList.contains('speakers')) {
		document.body.classList.remove('speakers', 'showmenu');
		document.getElementById('mainclose').classList.remove('close');
	} else {
		document.body.classList.toggle('showmenu');
		shownBefore = true
	}
});

document.getElementById('menu').addEventListener("touchstart",function(e) {
	enableHover = false;
})

document.getElementById('menu').addEventListener('mouseenter',function(e) {
	if(!enableHover) return;

	cancel = document.body.classList.contains('showmenu')
	setTimeout(function () {
		if (cancel === document.body.classList.contains('showmenu')) {
			document.body.classList.add('showmenu');
			shownBefore = true
		}
	}, 4);
});
document.getElementById('menu').addEventListener('mouseleave',function(e) {
	if(!enableHover) return;

	cancel = document.body.classList.contains('showmenu')
	setTimeout(function () {
		if (cancel === document.body.classList.contains('showmenu')) {
			document.body.classList.remove('showmenu');
		}
	}, 4);
});

detectswipe(document.body, function myfunction(el,d) {
  if (d === 'u') {
		document.body.classList.add('showmenu');
		shownBefore = true
	} else if (d === 'd') {
		document.body.classList.remove('showmenu');
	}
});

setTimeout(function () {
	if (!shownBefore) {
		document.body.classList.add('showmenu');
	}
}, 9900)

window.addEventListener('pageshow', function () {
	document.body.classList.remove('navigate', 'white');
	document.body.scrollTo(0, 0);
});

window.addEventListener('touchstart', function () {
	document.body.classList.add('touchscreen');
});