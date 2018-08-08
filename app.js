angular.module('myApp', ["ngTable"])
.controller('customersCtrl', ['$scope', '$http', 'NgTableParams', function($scope, $http, NgTableParams) {
    
	
	console.log('before function');
	//var o2 = FilterDefaulters();
	//var o2 = FilterDefaulters();
	
		
		$scope.getDefaulters = function  FilterDefaulters() {
			
			console.log ('inside loop');
			console.log($scope.selectedWeek);
			
			$http.get("http://localhost:1185/RetriveDefaulters")
    .then(function (response) {
		
	
	//var self = this;
//var data = [{name: "Moroni", age: 50} /*,*/];
	/*var o1 = {};
	var key = 'EmployeeData';
	o1 [key] = [];*/
	
	 $http.get("http://localhost:1185/RetriveEmployees")
    .then(function (Employee) {
		$scope.Employee = Employee;
		console.log(Employee.data);
		console.log(response.data[1].EmpID);
		var match = false;
			
			
			
			//console.log (response.keys('EmpID').length);
			var i= 0;   
			
			var o1 = {};
	var key = 'EmployeeData';
	o1 [key] = [];
			
			
			for (res in response.data){
				console.log(i);
				match = false;
				var j =  0;
				for (EmpID in Employee.data){
				console.log('DEF');
					
					//console.log(j.hasOwnProperty());
					// 	console.log(EmpID[0]);
					console.log(Employee.data[j].EmpID);
					console.log(response.data[i].EmpID);
					console.log(Employee.data[j].Week);
					
					var week = Employee.data[j].Week
					
					if (response.data[i].EmpID == Employee.data[j].EmpID && Employee.data[j].Week == $scope.selectedWeek && Employee.data[j].ILCStatus == 'Yes') {
						match = true;
					}
					j = j + 1;
					console.log (' j ' + j);
					
				}
			console.log(match);				
			if (match == false){				
				var data = { EmpID : response.data[i].EmpID, EmpName : response.data[i].EmpName, ManagersID : response.data[i].ManagersID, ManagersName : response.data[i].ManagersName }
			o1[key].push(data);
			console.log('object created '+ o1);				
			}
				i = i+1;				
			console.log('LoopEnd');			
		

			
			}
			$scope.data = o1.EmployeeData;
			tableParams = new NgTableParams({}, { dataset: $scope.data});
			
			return o1;
		
		
			});

	
	});
	}
	
}]).directive('reportGeneration',function(){


		return {templateUrl: function(elem, attr) 
			{


			return  'ReportPage.HTML';	


			}

		};

	});
