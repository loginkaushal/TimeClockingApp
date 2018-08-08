var mongodb = require('mongodb');
var mongoose = require('mongoose');
var MongoClient = mongodb.MongoClient;
var wait = require('wait.for');
var Sync = require('sync');


function getDefaulters(data, Employee, EmployeeData, DefaulterList,callback){
	this.data = data;
	this.Employee = Employee;
	this.EmployeeData = EmployeeData;

	var DefaulterList = {};
	var key = 'Defaulters';
	DefaulterList[key] = [];
	
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost/KaushalDB');
	console.log(" connnected with Data base " ) ;
	
		
		for( i = 0 ; i< this.data.length ; i++){
			console.log ('Inside defaulters For Loop');
			console.log (data[i].EmpID);
			var EmployeeID  = data[i].EmpID;
		
			var match = true;
			
			Sync (function(){
			
			var abc = getDefaulterData(data, i, Employee, EmployeeData, DefaulterList, key, match, function (data1) {
				//console.log('Result ' + result);
				/*if (match == true){
					var Empdata = { EmpID : data[i].EmpID, EmpName : data[i].EmpName, ManagersID : data[i].ManagersID, ManagersName : data[i].ManagersName }
					DefaulterList[key].push(Empdata);
					console.log(DefaulterList);
				}*/
				console.log(data1);
				return data1;
			});
			
			console.log('ABC ' + abc);
			});
			
		};
	console.log('connection closed');
	mongoose.connection.close();	
	callback('ABC');
};   


function getDefaulterData( data, i, Employee, EmployeeData, DefaulterList, key, match, callback){
	
			Employee.findOne({EmpID : data[i].EmpID}, function(err, objs){
			console.log ('Inside Find Employee');
			console.log(data[i].EmpID);
			//console.log(objs);
		if(!objs){
			console.log('in defaulters');
			var match = false;
			var Empdata = { EmpID : data[i].EmpID, EmpName : data[i].EmpName, ManagersID : data[i].ManagersID, ManagersName : data[i].ManagersName }
			DefaulterList[key].push(Empdata);
			
			//console.log(DefaulterList);
			callback(DefaulterList);
			//callback(match);
		}			
		});
	
	
}
 
exports.test = {
    getDefaulters: getDefaulters
}

