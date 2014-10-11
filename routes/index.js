var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  //check if is an authenticated user
  if(req.cookies.uData){
  	//if had been authenticated, then redirect to main page
  	res.location('main');
  	res.redirect('main');
  }else{
  	res.render('login', { title: 'Express' });
  }
});

router.get('/main', function(req, res){
	if(req.cookies.uData){
		var db = req.db;
		var viewData = [];

		//identify user role
		if(req.cookies.uData.super==1){
			var viewData={};

			//fetch records data
			db.collection('records').find().sort({timestamp:-1}).toArray(function(err, records){
				viewData.records = records;

				//fetch user data
				db.collection('user').find().toArray(function(err, users){
					viewData.users = users;

					//fetch spot data
					db.collection('spots').find().toArray(function(err, spots){
						viewData.spots = spots;
						res.render('main',{isSuper:req.cookies.uData.super,recordData: viewData.records, userData: viewData.users, spotData: viewData.spots});			
					});
				});
			});
		}else{
			db.collection('records').find({userId:req.cookies.uData.uid}).sort({timestamp:-1}).toArray(function(err, items){
				viewData = items;
				res.render('main',{isSuper:req.cookies.uData.super,recordData: viewData});	
			});
		}
	}else{
		res.location('/');
		res.redirect('/');	
	}
	
});

router.get('/spot', function(req, res){
	res.render('spot',{ title: 'Add spot'});
});

router.get('/record', function(req, res){
	res.render('record',{title:'Add record'});
});

module.exports = router;
