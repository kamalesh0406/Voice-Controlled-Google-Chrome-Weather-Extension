var body = document.querySelector('body');
chrome.contentSettings.microphone= "allow";
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var recognitionList = new SpeechGrammarList();

var grammar = '#JSGF V1.0; grammar weather; public <statement> = what is the weather for today| what is the weather for tomorrow';
recognitionList.addFromString(grammar,1);
var flag = true;
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.grammars = recognitionList;
var ip;
var city;
var currentLocation;



var initangle = 0;
var finalangle = 1.57;




canvas = document.getElementById('loading');
function load(){

	var ctx = canvas.getContext('2d');
	canvas.width = 20;
	canvas.height = 40;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.arc(canvas.width/2,canvas.height/2,7,initangle,finalangle);
	ctx.strokeStyle='blue'
	ctx.stroke()
	ctx.closePath();
	initangle+=0.17;
	finalangle+=0.17;
	requestAnimationFrame(load);
}

load();
var promises = new Promise((resolve,reject)=>{
	$.getJSON("https://jsonip.com/?callback=?", function (data) {
        ip = data.ip
        console.log(ip)
    });
    window.setTimeout(function(){
    	var url = "http://api.ipstack.com/"+ip+"?access_key=656c27e768ecdfaeadedc4058e78d1bb"
    	$.getJSON(url, function (data) {
       		resolve(data)
    	});

    },1500);
});


promises.then((succes)=>{
	city = succes;
	console.log(city)
	cancelAnimationFrame(load);
	canvas.remove();
	$('.message').text("Click Now To start the voice recognition")
	body.addEventListener('click',function(){
		recognition.start();
		console.log("Receiving");
	});
});

var locationkeylat = (lat,long) => new Promise((resolve)=>{
	var datato;
	var url = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&q="+lat+"%2C"+long;
	$.getJSON(url,(data)=>{
		datato = data.Key;
		currentLocation = data.EnglishName;
		console.log(datato)
	});
	setTimeout(()=>{
		resolve(datato);
	},500);
});
var weatherdisplay = (data) =>{
	$('.message').text('');
	$('#day').empty()
	$('.card-holder').empty()

	$('.card-holder').append('<div class="card text-white bg-primary mb-3" style="max-width: 20rem;"><div class="card-header"><p>LOCATION:'+currentLocation+'</p></div>')
	for(var i = 0;i<data.DailyForecasts.length;i++){
		var tempdate = data.DailyForecasts[i].Date.slice(0,10)
		var hightemp = data.DailyForecasts[i].Temperature.Maximum.Value
		var lowtemp = data.DailyForecasts[i].Temperature.Minimum.Value
		var dayicon = data.DailyForecasts[i].Day.Icon
		var dayiconhead = data.DailyForecasts[i].Day.IconPhrase
		var nighticon = data.DailyForecasts[i].Night.Icon
		var nighticonhead = data.DailyForecasts[i].Night.IconPhrase
		console.log(data)
		/*<div class="card-body">
	<h4 class="card-title"></h4>
	<p class="card-text"></p>
	</div>*/
		$('.card').append("<div class='card-body'>"+"<h4 class='card-title'>"+tempdate+"</h4><p>Morning</p>"+"<img src='images/"+dayicon+".png'>"+"<p>"+dayiconhead+"</p>"+"<p>Night</p>"+"<img src='images/"+nighticon+".png'>"+"<p>"+nighticonhead+"</p>"+"<p>Max. Temperature "+hightemp+"C</p><p>Min. Temperature "+lowtemp+"C</p>"+"</div>");
		
	}
}
recognition.onresult = function(event){
	var statement = event.results[0][0].transcript
	//requestAnimationFrame(load)
	console.log(statement)
	console.log(recognition.grammars)
	if (statement=="what's the weather for today")
	{	
		locationkeylat(city.latitude,city.longitude).then((success)=>{
			var url = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/"+success+"?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&metric=true"
			$.getJSON(url,(data)=>{
				console.log(data)
				//cancelAnimationFrame(load);
				weatherdisplay(data);

			})
		})
	}
	if(statement == 'what is the weather for this week'){
		locationkeylat(city.latitude,city.longitude).then((success)=>{
			var url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+success+"?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&metric=true"
			$.getJSON(url,(data)=>{
				console.log(data)
				weatherdisplay(data);
			})
		})
	}
	matches = statement.match(/what is the weather in (\w+\s*\w+) for today/)

	if(matches !== null){
		let url1 = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&q="+matches[1]
		$.getJSON(url1,(data) => {
			let key = data[0].Key
			currentLocation = data[0].EnglishName;
			let url2 = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/"+key+"?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&metric=true"
			$.getJSON(url2,function(data){
				console.log(data);
				weatherdisplay(data);
			})
		})
	}
	matches2 = statement.match(/what is the weather in (\w+\s*\w+) for this week/)
	if(matches2 !== null){
		let url1 = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&q="+matches2[1]
		$.getJSON(url1,(data) => {
			let key = data[0].Key
			currentLocation = data[0].EnglishName;
			let url2 = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+key+"?apikey=ruv547RWxCrFllPept8TMH0f81ElICsW&metric=true"
			$.getJSON(url2,function(data){
				console.log(data);
				weatherdisplay(data);
			})
		})
	}
	console.log(matches2)


}
recognition.onnomatch = function(event){
	console.log("There is no sentence");
}
recognition.onspeechend = function() {
  console.log("Stopped")
  recognition.stop();
}
recognition.onerror = function(event) {
  console.log(event.error)
}
