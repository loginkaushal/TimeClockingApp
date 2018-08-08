var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var express = require('express');
var app = express();
var ejs = require('ejs');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var MongoClient = mongodb.MongoClient;
var Employee = mongoose.model('Employee', {EmpID: String, ILCStatus: String, Week: String});
var EmployeeData = mongoose.model('EmployeeData', {EmpID: String, EmpName: String, ManagersID: String, ManagersName: String}, 'EmployeeData');
var DefaultersList = require('./getDefaulters.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/services', function(req, res, next) {
console.log('get');
   fs.readFile('MyFile1.json', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
console.log(data);
        res.end();

console.log("response end");
});
});

app.get('/ServiceOperationsAngularTrying.js', function (req, res) {

	console.log("inside file download");
   res.sendFile( __dirname +"/" + "ServiceOperationsAngularTrying.js" );
})


app.get('/homepage', function(req, res) {
console.log('PageGet');
   fs.readFile('DataReporting.HTML', function (err, page) {
    /*    res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': page.length
        });*/

if (err) {
		res.end('error occurred');
		return;
		}

	//var renderedHtml = ejs.render(page);

console.log("response end");


res.write(page);

        res.end();

});
});

app.get('/UpdateComplete', function(req, res) {
console.log('PageGet');
   fs.readFile('UpdateComplete.HTML', function (err, page) {
    /*    res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': page.length
        });*/

if (err) {
		res.end('error occurred');
		return;
		}

	//var renderedHtml = ejs.render(page);

console.log("response end");
res.write(page);

        res.end();

});

});



app.post('/ProcessReportingData', function(req, res) {
	
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {	
	console.log(fields.EmpID + " " + fields.ILCStatus + " " + fields.Week);  
	mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/KaushalDB');
	console.log(" connnected with Data base " ) ;
  
  Employee.update(
      { EmpID : fields.EmpID, Week: fields.Week },
      { EmpID : fields.EmpID, ILCStatus : fields.ILCStatus, Week: fields.Week }, {upsert : true } ,
	  function (err, result) {
      if (err) throw err;
      console.log(result);
	  });
	  
        mongoose.connection.close();
		res.redirect('/UpdateComplete');	
		res.end();
   	 });
});


app.get('/RetriveDefaulters', function(req, res) {
console.log('RetriveDefaulters');
    var EmpID = '';
	
	//console.log(req.body.EmpID);
	getEmployeeData(function(data){
		
	var DefaulterList = {};
	var key = 'Defaulters';
	DefaulterList[key] = [];
		
	var Defaulters = DefaultersList.test.getDefaulters(data,Employee, EmployeeData, DefaulterList, function (data1) {
	
		console.log('Defaulter ' + data);
		
		res.send(data);
			res.end();
	
	});
	
		
	});
	

});

app.get('/RetriveEmployees', function(req, res) {
console.log('RetriveEmployees');
    var EmpID = '';
	getEmployee(function(data){			
		res.send(data);
			res.end();
	});
	

});

app.get('/DefaulterEmployees', function(req, res) {
console.log('DefaulterEmployees');
    var EmpID = '';
	var o = {};
		var key = 'EmployeeData';
		o [key] = [];
		
	EmployeeData.find().forEach(o, key, function (object) {
		var commonInBoth=Employee.findOne({ "EmpID": object.EmpID} );
		if (commonInBoth != null) {
			var data = { EmpID : object.EmpID, EmpName : object.EmpName, ManagersID : object.ManagersID, ManagersName : object.ManagersName }
			o[key].push(data);
			console.log(o);
		}else {
			// did not match so we don't care in this case
		}
});
	

});




function getEmployeeData(callback){
	mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/KaushalDB');
	console.log(" connnected with Data base " ) ;
	
    EmployeeData.find(function(err, objs){
		console.log('in function');
		var returnable_name;
		var len = objs.length;
		console.log('Total Employees ' + len);
		var EmpData = [];
		var o = {};
		var key = 'EmployeeData';
		o [key] = [];
		var o1 = {};
		var key = 'EmployeeData';
		o1 [key] = [];
		for ( i= 0 ; i<len ; i++){
			EmpData[i] = [];
			EmpData[i][0] = objs[i].EmpID;
			EmpData[i][1] = objs[i].EmpName;
			EmpData[i][2] = objs[i].ManagersID;
			EmpData[i][3] = objs[i].ManagersName;
			
			/*Employee.findOne({EmpID : objs[i].EmpID},function(err, objs1){
			console.log ('Inside Find Employee');
			console.log(objs1);
			if(objs1){
				var data = { EmpID : objs[i].EmpID, EmpName : objs[i].EmpName, ManagersID : objs[i].ManagersID, ManagersName : objs[i].ManagersName }
				o1[key].push(Empdata);
				console.log('ABC'+ o1);
		}			
		});*/
			
		}
		for ( i= 0 ; i<len ; i++){
			var data = { EmpID : objs[i].EmpID, EmpName : objs[i].EmpName, ManagersID : objs[i].ManagersID, ManagersName : objs[i].ManagersName }
			o[key].push(data);
		}
		console.log( EmpData);
		console.log (JSON.stringify(o));
        returnable_name = objs[0].EmpID;
        console.log(returnable_name); 
        callback(objs);
    });
	 mongoose.connection.close();
}

function getEmployee(callback){
	mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/KaushalDB');
	console.log(" connnected with Data base " ) ;
	
    Employee.find(function(err, objs){
		console.log('in Employee function');
        callback(objs);
    });
	 mongoose.connection.close();
}




app.get('/answers', function (req, res){
     db.open(function(err,db){ // <------everything wrapped inside this function
         db.collection('EmployeeData', function(err, collection) {
             collection.find().toArray(function(err, items) {
                 console.log(items);
                 res.send(items);
             });
         });
     });
});

app.listen(1185, function () {
  console.log('Example app listening on port 1185!');
});