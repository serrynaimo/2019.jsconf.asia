$("#subscribeForm").ajaxForm({
	url: "https://2012.jsconf.asia/addsubscriber.php",
	dataType: "html",
	beforeSubmit: function() {
		$("#subscribeForm").removeClass("failure success").addClass("load");
		$("#subscribeForm .msg").removeClass("play");
	},
	success: function(r) {
		if(r.substr(0,6) != "Thanks") {
			$("#subscribeForm").removeClass("load").addClass("failure");
			$("#subscribeForm .msg span").text(r.substr(0,r.indexOf('<br/>')));
			$("#subscribeForm .msg").addClass("play");
			setTimeout(function() {
				$("#subscribeForm").removeClass("failure");
				$("#subscribeForm input[name='text']").focus();
			},5000);
		}
		else {
			$("#subscribeForm").removeClass("load").addClass("success");
			setTimeout(function() {
				$("#subscribeForm input").val("");
				$("#subscribeForm").removeClass("success active");
				$("#subscribeForm .msg").removeClass("play");
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

$("#subscribeForm input").focus(function(e) {
	$("#subscribeForm").addClass("selected");
}).blur(function(e) {
	$("#subscribeForm").removeClass("selected");
});

$("#subscribeForm").hover(function() {
	$("#subscribeForm").addClass("hovered");
}, function() {
	$("#subscribeForm").removeClass("hovered");
});


$("#subscribeForm input[type='email']").on("focus", function() {
    if($("#subscribeForm input[type='text']").val() === '' && $("#subscribeForm input[type='email']").val() === '') {
        setTimeout(function() {
            $("#subscribeForm input[type='text']").select();
        },1);
    }
});

let startdate = new Date()
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan']
const request = new XMLHttpRequest()
request.open('GET', '/api/currentTime', false)
request.send(null)

if (request.status === 200) {
	const currentTime = request.getResponseHeader('date')
	const currentDate = new Date(currentTime)
	if (currentDate.toString() !== 'Invalid Date') {
		startdate = currentDate
	}
}

const nextmonth = months[startdate.getMonth() + 1]
const target = startdate.getFullYear() < 2018 ? 'Mon, 1 ' + nextmonth + (startdate.getMonth() < 10 ? ' 2019' : ' 2018') + ' 00:00:00 +0800' : 'Thu, 13 Jun 2019 09:00:00 +0800'
CountDownTimer(target, 'countdown')

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
		if (distance <= 0) {
				clearInterval(timer);
				document.getElementById("counter").style.display = "none"
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
