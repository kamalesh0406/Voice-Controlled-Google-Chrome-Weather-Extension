var button = $('#signup')

button.on('click',function(){
	console.log('Here')
	data={'username':$('#username').val(),'password':$('#password').val()}
	$.post("http://localhost:5000/signup",data,function(response){
			console.log(response)
			window.location.href = 'loginpage.html'
	});
});