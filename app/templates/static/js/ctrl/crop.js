angular.module('myApp').controller('CropCtrl', function($http, $state,  $scope, user_info, localStorageService) {

  $scope.myImage='';
  $scope.myCroppedImage='';
  $scope.cropType="rectangle";

  // Listener to update the range slider when the mouse moves
  $(document).mousemove(function(e){
      var slider1 = document.getElementById("slider").value;
      slider1 = slider1 - 2;

      $('#slidePosition').html('Granularity: '+ slider1);
  });

  $scope.setArea=function(value){
    $scope.cropType=value;
  }

/*
    // Changes the image from a loaded local file!
     var handleFileSelect=function(evt) {
       var file=evt.currentTarget.files[0];
       var reader = new FileReader();
       reader.onload = function (evt) {
         $scope.$apply(function($scope){
           $scope.myImage=evt.target.result;
         });
       };
       reader.readAsDataURL(file);
     };
     angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
/**/

     // Saving feature once you crop the image
     $scope.saveCrop = function(){

       var answer = confirm("Save the Cropped Image!\nProceed?")
       if (answer){
              //These are the important points, the x,y position and the width/length of the new image
              $('#pulled_position').html('Position: ' + $scope.myOriginalX +', '+$scope.myOriginalY );
              $('#pulled_size').html('Size: ' +$scope.myCroppedOriginalW +', '+$scope.myCroppedOriginalH );

              var email = localStorageService.get('email');
              var filepath = $scope.img_info_at.fullsize_orig_filepath;

              $http.get('get_crop/', {
                      params:  {filepath: filepath, x: $scope.myOriginalX, y: $scope.myOriginalY, w: $scope.myCroppedOriginalW, h: $scope.myCroppedOriginalH},
                      headers: {'Authorization': 'token'}
                  }
              )
              .then(function(response) {

                  $scope.myImage = "data:image/png;base64," + response.data;

                  // hmm.
                  //$state.go("polygon");
              }, function(x) {
                  // Request error
              });

       }
       else{
         alert("Cancelled!");
       }
     }

     function requestImage(index){

       $scope.img_info_at = JSON.parse(localStorageService.get('image_info'+index.toString()));
       var filepath = $scope.img_info_at.fullsize_orig_filepath;

       $http.get('dyn_img/' + filepath).then(function(response) {
         $scope.myImage = "data:image/png;base64," + response.data;
       });

     }


    // get current image from server
    var idx = localStorageService.get('current_img');
    requestImage(idx);


  });
