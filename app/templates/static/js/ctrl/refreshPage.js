angular.module('myApp.controllers').controller('refreshPage', function($state, $scope, user_info, localStorageService) {

// state-change functions
$scope.refreshP = function(){
  window.location.reload(true);
}

$scope.goTutorial = function(){
    if(localStorageService.get('email')=="guest@guest.com"){
      $state.go('guest_tutorial');
    }
    else {
      $state.go('main_tutorial');
    }
}

$scope.goProfile = function(){
  $state.go('user_profile');
}


});
