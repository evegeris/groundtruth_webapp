angular.module('myApp.controllers').controller('refreshPage', function($state, $scope, user_info, localStorageService) {

// state-change functions
$scope.refreshP = function(){
  window.location.reload(true);
}

$scope.goTutorial = function(){
  $state.go('guest_tutorial');
}


});
