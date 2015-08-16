var express = require('express');
var router = express.Router();

router.get('/',function(req, res){
	var db = req.db;
	db.collection('records').find().sort({timestamp:-1}).toArray(function(err,result){
		res.json(result);
	});
});

/** For card id use case */
router.post('/', function (req, res) {

	var db = req.db;

	if(!req.body.cardId) {
		res.send({status: 'fail', log: '資料輸入不完整'});
	} else {
		var userData = {}
		db.collection('user').findOne({cardId: req.body.cardId}, function (err, user) {
			if (err) { 
				res.send({status:'fail',log:'user info error'}); 
			} else {
				userData = user;

				if (userData) {
					//insert data to records collection
					var dateObj = new Date();
					var tsValue = dateObj.getTime();
					var timestamp = dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate()+" "+(dateObj.getHours()<10?"0"+dateObj.getHours():dateObj.getHours())+":"+(dateObj.getMinutes()<10?"0"+dateObj.getMinutes():dateObj.getMinutes())+":"+(dateObj.getSeconds()<10?"0"+dateObj.getSeconds():dateObj.getSeconds());
					db.collection('records').insert({timestamp:timestamp,tsValue:tsValue,cardId:userData.cardId,userName:userData.name},function(err,result){
						res.send(
							(err===null) ? {status:'success'} : {status:'fail'}
						);
					});
				}
			}
		});
	}

});

// router.post('/',function(req, res){
// 	var db = req.db;
	
// 	if(!req.body.uid||!req.body.userId){
// 		res.send({status:'fail',log:'資料輸入不完整'});	
// 	}else{
// 		var userData = {}, spotData = {};
// 		//fetch user info
// 		db.collection('user').findById(req.body.userId,function(err, user){
// 			if(err){
// 				res.send({status:'fail',log:'user info error'});
// 			}else{
// 				userData = user;
// 				if(userData){
// 					//fetch spot info
// 					db.collection('spots').find({'uid':req.body.uid}).toArray(function(err, spot){
// 						if(err){
// 							res.send({status:'fail',log:'spot info error'});		
// 						}else{
// 							spotData = spot;
							
// 							//insert data to records collection
// 							if(spotData&&spotData.length>0){
// 								var dateObj = new Date();
// 								var timestamp = dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate()+" "+(dateObj.getHours()<10?"0"+dateObj.getHours():dateObj.getHours())+":"+(dateObj.getMinutes()<10?"0"+dateObj.getMinutes():dateObj.getMinutes())+":"+(dateObj.getSeconds()<10?"0"+dateObj.getSeconds():dateObj.getSeconds());
// 								db.collection('records').insert({timestamp:timestamp,mac:spotData[0].mac,spotName:spotData[0].name,userName:userData.name,userId:userData._id.toString()},function(err,result){
// 									res.send(
// 										(err===null) ? {status:'success'} : {status:'fail'}
// 									);
// 								});
// 							}else{
// 								res.send({status:'fail',log:'spot info error'});
// 							}
// 						}
// 					});
// 				}else{
// 					res.send({status:'fail',log:'user info error'});
// 				}
// 			}
// 		});
// 	}
// });

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
