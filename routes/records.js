var express = require('express');
var router = express.Router();

router.get('/',function(req, res){
	var db = req.db;
	db.collection('records').find().toArray(function(err,result){
		res.json(result);
	});
});

router.post('/',function(req, res){
	var db = req.db;
	
	if(!req.body.uid||!req.body.userId){
		res.send({status:'fail',log:'資料輸入不完整'});	
	}else{
		var userData = {}, spotData = {};
		//fetch user info
		db.collection('user').findById(req.body.userId,function(err, user){
			if(err){
				res.send({status:'fail',log:'user info error'});		
			}else{
				userData = user;
				if(userData){
					//fetch spot info
					db.collection('spots').find({'uid':req.body.uid}).toArray(function(err, spot){
						if(err){
							res.send({status:'fail',log:'spot info error'});		
						}else{
							spotData = spot;
							
							//insert data to records collection
							if(spotData&&spotData.length>0){
								db.collection('records').insert({timestamp:new Date().toString().replace(/GMT\+.*?\)$/,""),mac:spotData[0].mac,spotName:spotData[0].name,userName:userData.name,userId:userData._id.toString()},function(err,result){
									res.send(
										(err===null) ? {status:'success'} : {status:'fail'}
									);
								});
							}else{
								res.send({status:'fail',log:'spot info error'});
							}
						}
					});
				}else{
					res.send({status:'fail',log:'user info error'});
				}
			}
		});
	}
});

/*Delete specific record*/

router.delete('/',function(req,res){
	if(!req.body.id){
		res.send({status:'fail',log:'未指定資料ID'});
	}else{
		var db = req.db;
		
		db.collection('records').removeById(req.body.id,function(err,result){
			res.send(
				(err===null) ? {status:'success'} : {status:'fail'}
			);
		});
	}
});

module.exports = router;