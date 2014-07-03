var cacularApp = angular.module("cacularApp",['ngRoute','ngAnimate']);

cacularApp.config(function($routeProvider){
	$routeProvider
	.when("/",{
            templateUrl : './home.html',
            controller : ''
        })
	.when("/new-meal",{
            templateUrl : './new-meal.html',
            controller : 'inputController'
        })
	.when("/earning",{
            templateUrl : './earning.html',
            controller : 'earnController'
    }).otherwise({
    	redirectTo :"/"
    });
}).run(function($rootScope, $location, $timeout) {
        $rootScope.$on('$routeChangeError', function() {
            $location.path("/");
        });
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
          $timeout(function() {
            $rootScope.isLoading = false;
          }, 1000);
        });
    });

cacularApp.controller('panelController',function($scope,$rootScope,$location){
	//menu select
	var path = $location.path();
	if(path === "/new-meal"){
		this.tab =2;
	}else if(path === "/earning"){
		this.tab = 3;
	}else{
		this.tab = 1;
	}

	this.changeTab = function(tabNum){
		this.tab = tabNum;
	}

	this.acitvieTab = function(tabNum){
			return this.tab === tabNum;
	}

	//work as a parent scope to deliver data between 'new meal' and 'earning' pages
	$scope.earn={
		tip_total:0.00,
		meal_count:0,
		average_tip:0.00
	}
	$scope.$on("tip_result",function(event,data){
		$scope.earn.tip_total += data.tip;
		$scope.earn.meal_count += 1;
		$scope.earn.average_tip += $scope.earn.tip_total / $scope.earn.meal_count;
	});
})
.controller('inputController',function($scope,$rootScope){
	$scope.submit = function() {
		$scope.submitted = true;
		//only broadcast event when form is valid
		if($scope.inputForm.$valid){
			$rootScope.$broadcast("calculate",$scope.input);   
			resetForm();
		}
  	}
  	$scope.$on("reset",function(){
		resetForm();
		
	});

  	$scope.cancel = function(){
  		resetForm();

  	};

  	function resetForm(){
  		$scope.submitted = false;
  		$scope.input = {
  			meal_price:0,
  			tax_rate:0,
  			tip_percent:0
  		};
  	}
})
.controller("customerController",function($scope,$rootScope){
	$scope.customer={
		subtotal:0,
		tip:0,
		total:0
	}
	$scope.$on("calculate",function(event,data){
		resetCustomer();
		$scope.customer.subtotal = data.meal_price *(100+data.tax_rate)/100;
		$scope.customer.tip = data.meal_price *(data.tip_percent)/100;
		$scope.customer.total = $scope.customer.subtotal + $scope.customer.tip;
		$rootScope.$broadcast("tip_result",$scope.customer);
	});
	$scope.$on("reset",function(){
		resetCustomer();
	});

	function resetCustomer(){
		$scope.customer={
			subtotal:0.00,
			tip:0.00,
			total:0.00
		}
	}
})
.controller("earnController",function($scope){
	$scope.$on("reset",function(){
		$scope.earn={
		tip_total:0,
		meal_count:0,
		average_tip:0
	}
	});
})
.controller("resetController",function($scope,$rootScope){
	$scope.reset=function(){
		$rootScope.$broadcast("reset");
	};
});
