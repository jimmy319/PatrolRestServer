$(function(){
	$('#loginBtn').click(function(){
		var formData = {
			'email': $('#account').val(),
			'pwd': $('#pwd').val()
		};

		$.ajax({
			type: 'POST',
			data: formData,
			url: '/users/login',
			dataType: 'JSON'
		}).done(function(response){
			if(response.status==="fail"){
				alert("帳號/密碼有誤，請重新登入");	
			}else{
				location.reload();	
			}
		});
	});
});