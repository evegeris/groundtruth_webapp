angular.module('myApp.controllers').controller('LimboCtrl', function($state, $scope, user_info, localStorageService, toaster) {

// state-change functions

if(localStorageService.get('email')=="guest@guest.com"){
  toaster.pop({
   type: 'info',
   title: 'Not allowed in Guest Mode',
   body: '',
   showCloseButton: true,
   timeout: 200
   });
  $state.go("guest_crop");
}

$scope.goCrop = function(){
  $state.go("crop_image");
}
$scope.goPolygonDraw = function(){
  $state.go("polygon");
}


/// decide which page to go to


// index pointing to an incomplete image
user_info.updateNextImageIndex();
// get that index
var idx = localStorageService.get('current_img');
// get image info JSON
var img_info_at = JSON.parse(localStorageService.get('image_info'+idx.toString()));
// get progress
var progress = img_info_at.progress;
// assume if progress = 0, this image needs cropping
if (progress == 0){
  $scope.goCrop();
}
else{
  $scope.goPolygonDraw();
}


});
