$(function(){

	var $loginPanel = $("#login-panel");
	if($loginPanel.length>0){
		var viewportHeight = window.innerHeight,panelHeight = $loginPanel.outerHeight();
		var marginVal = (viewportHeight - panelHeight) / 2;
		$loginPanel.css({'margin-top':marginVal,'margin-bottom':marginVal});
	}

	// $("#addBtn").click(function(e){

	// 	var formData = {
	// 		'name':$("#userName").val(),
	// 		'email':$("#userEmail").val(),
	// 		'pwd':$("#userPwd").val()
	// 	};

	// 	$.ajax({
	// 		type: 'POST',
	// 		data: formData,
	// 		url: '/users',
	// 		dataType: 'JSON'
	// 	}).done(function(response){
	// 		alert(response.status);
	// 	});

	// });

	// $("#addSpotBtn").click(function(){
	// 	var formData = {
	// 		'mac':$("#mac").val(),
	// 		'uid':$("#uid").val(),
	// 		'name':$("#spotName").val()
	// 	};

	// 	$.ajax({
	// 		type: 'POST',
	// 		data: formData,
	// 		url: '/spots',
	// 		dataType: 'JSON'
	// 	}).done(function(response){
	// 		alert(response.status);
	// 	});
	// });

	$("#addRecordBtn").click(function(){
		var formData = {
			'uid':$("#uid").val(),
			'userId':$("#userId").val()
		};

		$.ajax({
			type: 'POST',
			data: formData,
			url: '/records',
			dataType: 'JSON'
		}).done(function(response){
			console.log(response);
			alert(response.status);
		});
	});

	$("#logoutBtn").click(function(){
		$.ajax({
			type: 'POST',
			url: '/users/logout',
		}).done(function(){
			location.reload();
		});
	});

	/* data management related*/

	/*======Insert data======*/

	/*Create User*/

	var $insertUserWin = $("#insertUserWin");
	var $insertSpotWin = $("#insertSpotWin");

	$("#addUserBtn").on("click",function(e){
		//update dialog title
		$('#winLabel',$insertUserWin).text("新增使用者");
		$('#addUserForm',$insertUserWin)[0].reset();
		$('#email',$insertUserWin)[0].disabled=null;
		$insertUserWin.find(".btn-confirm").attr({'data-target-id':null});
		$insertUserWin.modal({backdrop:"static"});
	});

	$("#addSpotBtn").on("click",function(e){
		//update dialog title
		$('#winLabel',$insertSpotWin).text("新增巡邏點");
		$('#addSpotForm',$insertSpotWin)[0].reset();
		$insertSpotWin.find(".btn-confirm").attr({'data-target-id':null});
		$insertSpotWin.modal({backdrop:"static"});
	});

	$insertUserWin.on("click",".btn-confirm",function(e){
		var $ele = $(e.target), $cancelBtn = $ele.prev(), url = $ele.attr('data-url'), targetId = $ele.attr('data-target-id'), $table = $("#userManagement tbody");

		//disable buttons while AJAX request is in process
		$ele.attr('disabled','disabled');
		$cancelBtn.attr('disabled','disabled');

		var formData = {
			name: $("#name",$insertUserWin).val(),
			email: $("#email",$insertUserWin).val(),
			pwd: $("#pwd",$insertUserWin).val(),
			isSuper: $("#isSuper",$insertUserWin).prop('checked')?1:0
		};
		var action = "POST";

		if(targetId){
			formData.id = targetId;
			action = "PUT";
		} 

		$.ajax({
			url: url,
			data: formData,
			type: action,
			dataType: 'JSON'
		}).done(function(response){
			if(response.status==='success'){
				var userData = response.userInfo;
				var btnTemp = userData.isSuper==="1"?'':'<a class="btn btn-warning del-btn" data-id="'+userData._id+'" data-url="/users">刪除</a><a class="btn btn-success edit-btn" data-id="'+userData._id+'" data-url="/users">編輯</a>';
				if(action==="POST"){
					$table.append('<tr class="data-row" data-id="'+userData._id+'"><td>'+btnTemp+'</td><td>'+userData._id+'</td><td id="userName">'+userData.name+'</td><td id="userEmail">'+userData.email+'</td><td id="userPwd">'+userData.pwd+'</td></tr>');	
				}else if(action==="PUT"){
					$('.data-row[data-id="'+userData._id+'"]').replaceWith('<tr class="data-row" data-id="'+userData._id+'"><td>'+btnTemp+'</td><td>'+userData._id+'</td><td id="userName">'+userData.name+'</td><td id="userEmail">'+userData.email+'</td><td id="userPwd">'+userData.pwd+'</td></tr>');
				}			
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				$insertUserWin.modal('hide');
			}else if(response.status==='User exists'){
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				alert('該信箱已被註冊!');
			}else{
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				alert('新增失敗!');
			}
		});
	});

	$insertSpotWin.on("click",".btn-confirm",function(e){
		var $ele = $(e.target), $cancelBtn = $ele.prev(), url = $ele.attr('data-url'), targetId = $ele.attr('data-target-id'), $table = $("#spotManagement tbody");

		//disable buttons while AJAX request is in process
		$ele.attr('disabled','disabled');
		$cancelBtn.attr('disabled','disabled');

		var formData = {
			name: $("#spotName",$insertSpotWin).val(),
			mac: $("#spotMac",$insertSpotWin).val(),
			uid: $("#spotUid",$insertSpotWin).val()
		};
		var action = "POST";

		if(targetId){
			formData.id = targetId;
			action = "PUT";
		} 

		$.ajax({
			url: url,
			data: formData,
			type: action,
			dataType: 'JSON'
		}).done(function(response){
			if(response.status==='success'){
				var spotData = response.spotInfo;
				if(action==="POST"){
					var btnTemp = '<a class="btn btn-warning del-btn" data-id="'+spotData._id+'" data-url="/spots">刪除</a>';
					$table.append('<tr class="data-row" data-id="'+spotData._id+'"><td>'+btnTemp+'</td><td>'+spotData._id+'</td><td>'+spotData.name+'</td><td>'+spotData.mac+'</td><td>'+spotData.uid+'</td></tr>');	
				}			
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				$insertSpotWin.modal('hide');
			}else if(response.status==='duplicated mac address'){
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				alert('該巡邏點已被註冊!');
			}else{
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				alert('新增失敗!');
			}
		});
	});
	
	/*======Update data======*/

	$("#userManagement").on("click",".edit-btn",function(e){
		var $dataRow = $(e.target).parents('.data-row');

		$('#name',$insertUserWin).val($('#userName',$dataRow).text());
		$('#email',$insertUserWin).val($('#userEmail',$dataRow).text())[0].disabled="disabled";
		$('#pwd',$insertUserWin).val($('#userPwd',$dataRow).text());

		//update dialog title
		$('#winLabel',$insertUserWin).text("編輯使用者");
		$insertUserWin.find(".btn-confirm").attr({'data-target-id':e.target.getAttribute('data-id'),'data-url':e.target.getAttribute('data-url')});
		$insertUserWin.modal({backdrop:"static"});
	});


	/*======Delete data======*/
	var $delConfirmWin = $("#delConfirmWin");

	$("#recordManagement, #userManagement, #spotManagement").on("click",".del-btn",function(e){
		$delConfirmWin.find(".btn-confirm").attr({'data-target-id':e.target.getAttribute('data-id'),'data-url':e.target.getAttribute('data-url')});
		$delConfirmWin.modal({backdrop:"static"});
	});

	$(".del-win").on("click",".btn-confirm",function(e){
		var $ele = $(e.target), $cancelBtn = $ele.prev(), url = $ele.attr('data-url'), id = $ele.attr('data-target-id');

		//disable buttons while AJAX request is in process
		$ele.attr('disabled','disabled');
		$cancelBtn.attr('disabled','disabled');

		$.ajax({
			url: url,
			data: {id:id},
			type: 'DELETE',
			dataType: 'JSON'
		}).done(function(response){
			if(response.status==='success'){
				$('.data-row[data-id="'+id+'"]').remove();
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				$delConfirmWin.modal('hide');
			}else{
				$ele.attr('disabled',null);
				$cancelBtn.attr('disabled',null);
				alert('刪除失敗!');
			}
		});
	});
});