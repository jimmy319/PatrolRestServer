var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res){
	var db = req.db;
	db.collection('user').find().toArray(function(err, items){
		res.json(items);
	});
});

/**Create new user*/
router.post('/', function(req, res){

	if(!req.body.name||!req.body.email||!req.body.pwd||!req.body.cardId||!req.body.isSuper){
		res.send({status:"fail",log:"輸入資料不完整"});
	}else{
		var db = req.db;

		//check if account is in using
		var newAccount = req.body.email;

		db.collection('user').findOne({email:newAccount},function(err, result){
			if(result){
				res.send({status:"User exists"});
			}else{
				//create new user
				db.collection('user').insert(req.body, function(err, result){
					db.collection('user').findOne({email:req.body.email},function(err, result){
						res.send(
							(err === null) ? {status:"success",userInfo: result} : {status:"fail"}
						);
					});
				});
			}
		});
	}
});

router.delete('/', function(req, res){
	//check data
	if(!req.body.id){
		res.send({status:"fail",log:"未指定資料ID"});
	}else{
		var db = req.db;

		db.collection("user").removeById(req.body.id, function(err, result){
			res.send(
				(err === null) ? {status:'success'} : {status:'fail'}
			);
		});
	}
});

router.put('/', function(req, res){
	if(!req.body.id||!req.body.name||!req.body.pwd||!req.body.email||!req.body.cardId||!req.body.isSuper){
		res.send({status:"fail",log:"輸入資料不完整"});
	}else{
		var db = req.db;

		//update user data
		db.collection('user').updateById(req.body.id,req.body, function(err, result){
			db.collection('user').findById(req.body.id,function(err, result){
				res.send(
					(err === null) ? {status:"success",userInfo: result} : {status:"fail"}
				);
			});
		});
			
	}
});

/*User Login*/
router.post('/login', function(req, res){
	var db = req.db;

	//verify login info
	db.collection('user').findOne({email:req.body.email,pwd:req.body.pwd},function(err,result){
		if(result){
			//create a new cookie for logined user
			res.cookie('uData',{uid:result._id,super:result.isSuper},{expires: new Date(Date.now()+900000)});
			res.send({status:"success",userInfo:{id:result._id,name:result.name,email:result.email}});
		}else{
			res.send(
				(err === null) ? {status:"fail"} : {status:"system error"}
			);
		}
	});
});

/*User logout*/
router.post('/logout', function(req, res){
	//clear cookie
	res.clearCookie('uData');
	res.send({status:"success"});
});

module.exports = router;
