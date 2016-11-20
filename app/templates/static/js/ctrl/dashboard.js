angular.module('myApp.controllers').controller('DashboardCtrl', function($auth, $state, $window, $scope, user_info) {
//alert("hgfnfg");
/*
$scope.goSomewhere = function(){
  alert("hi");
  $state.go("#/cropImage");
}
*/


$scope.user_info = user_info;

//alert(user_info.user_info_object.data.attributes.image_info[0].fullsize_orig_filepath);
$scope.image_info = user_info.user_info_object.data.attributes.image_info;
//alert(scope.image_info[0].fullsize_orig_filepath);
/*
// watcher
$scope.$watch('user_info.user_info_object.data.attributes.image_info', function (newVal, oldVal, scope) {
  if(newVal) {
    scope.image_info = newVal;
  }
});
*/
//alert(scope.image_info[0].fullsize_orig_filepath);

});
