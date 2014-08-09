var express = require('express');
var router = express.Router();

router.get('/',function(req, res){
	var db = req.db;
	db.collection('spots').find().toArray(function(err,result){
		res.json(result);
	});
});

router.post('/',function(req, res){
	if(!req.body.mac||!req.body.uid||!req.body.name){
		res.send({status:'fail',log:'資料不完整'});
	}else{
		var db = req.db;

		var newMac = req.body.mac;

		//check if spot is exist
		db.collection('spots').findOne({mac:newMac},function(err,result){
			//if exist
			if(result){
				res.send({status:'Spot has already been created'});
			}else{
				db.collection('spots').insert(req.body,function(err,result){
					db.collection('spots').findOne({mac:req.body.mac},function(err, result){
						res.send(
							(err===null) ? {status:'success',spotInfo:result} : {status:'duplicated mac address'}
						);
					});
				});
			}
		});
	}
});

/*Delete spot data*/
router.delete('/',function(req, res){
	//check data
	if(!req.body.id){
		res.send({status:'fail',log:"未指定資料ID"});
	}else{
		var db = req.db;

		db.collection("spots").removeById(req.body.id,function(err, result){
			res.send(
				(err===null) ? {status:"success"} : {status:"fail"}
			);
		});
	}
});

module.exports = router;