angular.module('myApp.controllers').controller('DashboardCtrl', function($auth, $state, $window, $scope, user_info, localStorageService) {

/*
$scope.goSomewhere = function(){
  $state.go("crop_image");
}
*/

$scope.user_info = user_info;
$scope.image_info = user_info.user_info_object.data.attributes.image_info;

$scope.classified = localStorageService.get('classified');
$scope.in_queue = localStorageService.get('in_queue');

// watchers

// IN PROGRESS
$scope.$watch('user_info.user_info_object.data.attributes.image_info', function (newVal, oldVal, scope) {

/*
  if(newVal) {
    var image_array = [];
    var arrayLength = user_info.user_info_object.data.attributes.image_info.length;
    for (var i = 0; i < arrayLength; i++) {
      //alert(JSON.parse(localStorage.getItem('image_info'+toString(i))));
      image_array.push( JSON.parse(localStorage.getItem('image_info'+i.toString())) );
    }

    scope.image_info = user_info.user_info_object.data.attributes.image_info;
    //scope.image_info = image_array;

  }
*/
});
$scope.$watch('user_info.user_info_object.data.attributes.classified', function (newVal, oldVal, scope) {
  if(newVal) {
    scope.classified = localStorageService.get('classified');
  }
});
$scope.$watch('user_info.user_info_object.data.attributes.in_queue', function (newVal, oldVal, scope) {
  if(newVal) {
    scope.in_queue = localStorageService.get('in_queue');
  }
});
$scope.$watch('user_info.user_info_object.data.attributes.percent_complete', function (newVal, oldVal, scope) {
  if(newVal) {
    scope.percent_complete = localStorageService.get('percent_complete');
  }
});


});
