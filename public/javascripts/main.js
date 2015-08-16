angular.module("patrolApp",[])
.controller("recordCtrl",function($scope,$http){
	//fetch records
	$http.get('/records')
	.success(function(data, status, headers, config){
		if(status===200){
			$scope.records=data;	
		}else{
			alert("server error");
		}
	});

	$scope.predicate = 'tsValue';
	$scope.reverse = true;
	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};
});
