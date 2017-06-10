angular.module('myApp.controllers').controller('LimboCtrl', function($state, $scope, user_info, localStorageService, toaster) {

// state-change functions

if(localStorageService.get('email')=="guest@guest.com"){
  $state.go("guest_crop");
}

$scope.goCrop = function(){
  $state.go("crop_image");
}
$scope.goPolygonDraw = function(){
  $state.go("polygon");
}
$scope.goDashboard = function(){
  $state.go("dashboard");
}

/// decide which page to go to


// index pointing to an incomplete image
user_info.updateNextImageIndex();
// get that index
var idx = localStorageService.get('current_img');
// get image info JSON
var img_info_at = JSON.parse(localStorageService.get('image_info'+idx.toString()));
// get progress
var wasImage = false;


// Checking to see if the user has uploaded any images to the DB
if (img_info_at != null){
  wasImage = true;
}
else if((img_info_at == null) && (localStorageService.get('email')!="guest@guest.com")){
  toaster.pop({
   type: 'error',
   title: 'No available images!',
   body: 'Please upload an image on the Dashboard',
   showCloseButton: true,
   timeout: 200
   });
   $scope.goDashboard();
}

var match = false;
// Iterate through every image until we run out, or until we find an image that isn't finished
while (1 < 2){
  var progress = img_info_at.progress;
  if (progress == 0){
    match = true;
    localStorageService.set('current_img', idx);
    break;
  }
  else {
    // Get next image and check
    idx = idx+1;
    img_info_at = JSON.parse(localStorageService.get('image_info'+idx.toString()));
    if (img_info_at == null){
      break;
    }
  }
}
if (match == true){
  $scope.goCrop();

}
else {
  toaster.pop({
   type: 'error',
   title: 'All images have been labelled!',
   body: 'Either manually select image from table or upload more images',
   showCloseButton: true,
   timeout: 200
   });
   $scope.goDashboard();
}


// Ran out of images to check!
/*

*/


});
