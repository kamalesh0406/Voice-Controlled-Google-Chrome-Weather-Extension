var body = document.querySelector('body');
chrome.contentSettings.microphone= "allow";
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var recognitionList = new SpeechGrammarList();


recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

body.addEventListener('click',function(){
	recognition.start();
	console.log("Receiving");
})
geolocator.config({
    language: "en",
    google: {
        version: "3",
        key: "AIzaSyB75KOXOcgjftFtFcc5OiuXXVpa1QzGSCc"
    }
});
var options = {
	    enableHighAccuracy: true,
	    fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
	    addressLookup: true
			};
		geolocator.locate(options, function (err, location) {
			if (err) return console.log(err);
		    console.log(location);
});

recognition.onresult = function(event){
	var statement = event.results[0][0].transcript

	if (statement=='what is the weather for today')
	{
		
	}

	console.log(statement)
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
