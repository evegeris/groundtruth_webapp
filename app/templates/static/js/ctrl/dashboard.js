angular.module('myApp.controllers').controller('DashboardCtrl', function($auth, $state, $scope, user_info, localStorageService) {

/*
$scope.goSomewhere = function(){
  $state.go("crop_image");
}
*/

//$scope.image_info = user_info.getImageData();
//alert($scope.image_info[0].fullsize_orig_filepath);
//$scope.user_info = user_info;
//$scope.image_info = user_info.getImageData();
//$scope.image_info = user_info.user_info_object.data.attributes.image_info;
//alert($scope.image_info[0].fullsize_orig_filepath);
//alert('dash: '+$scope.image_info[0].fullsize_orig_filepath);

  // reset local vars
  $scope.refresh = function(){

    $scope.image_info = [];
    $scope.classified = localStorageService.get('classified');
    $scope.in_queue = localStorageService.get('in_queue');
    $scope.percent_complete = localStorageService.get('percent_complete');

    var arrayLength = localStorageService.get('image_arrayLen');
    arrayLength = parseInt(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
      $scope.image_info.push(JSON.parse(localStorageService.get('image_info'+i.toString())));
      //alert( $scope.image_info[i].fullsize_orig_filepath );
    }

  }


$scope.refresh();


// watchers

$scope.$watch('user_info.user_info_object.data.attributes.image_info', function (newVal, oldVal, scope) {

  if(newVal) {
    $scope.image_info = [];
    var arrayLength = localStorageService.get('image_arrayLen');
    arrayLength = parseInt(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
      $scope.image_info.push(JSON.parse(localStorageService.get('image_info'+i.toString())));
      //alert( $scope.image_info[i].fullsize_orig_filepath );
    }
  }

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
