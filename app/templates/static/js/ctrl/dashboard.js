angular.module('myApp.controllers').controller('DashboardCtrl', function($auth, $state, $window, $scope, user_info) {

/*
$scope.goSomewhere = function(){
  $state.go("crop_image");
}
*/


$scope.user_info = user_info;
$scope.image_info = user_info.user_info_object.data.attributes.image_info;


// watcher
$scope.$watch('user_info.user_info_object.data.attributes.image_info', function (newVal, oldVal, scope) {
  if(newVal) {
    scope.image_info = newVal;
  }
});

//alert($scope.image_info[0].fullsize_orig_filepath);

});
