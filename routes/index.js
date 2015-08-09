var express = require('express');
var router = express.Router();
var fs = require('fs');

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
		var csvBody = 'id,Check-in Time,Card Id,User-Name\n';
		var recordDataLen;
		var record;

		//identify user role
		if(req.cookies.uData.super==1){
			var viewData={};

			//fetch records data
			db.collection('records').find().sort({timestamp:-1}).toArray(function(err, records){
				viewData.records = records;
				recordDataLen = viewData.records.length;

				//fetch user data
				db.collection('user').find().toArray(function(err, users){
					viewData.users = users;

					//fetch spot data
					db.collection('spots').find().toArray(function(err, spots){
						// prepare CSV file
						for (var i = 0; i < recordDataLen; i++) {
							record = viewData.records[i];
							for (var key in record) {
								if (key !== 'userName') {
									csvBody += record[key] + ',';
								} else {
									csvBody += record[key] + '\n';
								}
							}
						}
						fs.writeFile('public/records.csv', csvBody, {encoding: 'utf8'}, function (err) {
							if (err) { 
								console.log('csv file generation error');
								throw err; 
							}
							viewData.spots = spots;
							res.render('main',{isSuper:req.cookies.uData.super,recordData: viewData.records, userData: viewData.users, spotData: viewData.spots});				
						});
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
