angular.module('myApp').controller('CropCtrl', function($http, $scope) {

  // Select the Image to preload!
  var loadedImage = new Image();
  //loadedImage.src = "static/images/segmentedImg.jpg";
  loadedImage.src = "static/images/test_image_swift.jpg";


  $scope.myImage='';
  $scope.myCroppedImage='';
  $scope.cropType="circle";

  // Listener to update the range slider when the mouse moves
  $(document).mousemove(function(e){
      var slider1 = document.getElementById("slider").value;
      slider1 = slider1 - 2;

      $('#slidePosition').html('Granularity: '+ slider1);
  });

  $scope.setArea=function(value){
    $scope.cropType=value;
  }

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

     // Saving feature once you crop the image
     $scope.saveCrop = function(){

       var answer = confirm("Save the Cropped Image!\nProceed?")
       if (answer){

              //These are the important points, the x,y position and the width/length of the new image
              $('#pulled_position').html('Position: ' + $scope.myOriginalX +', '+$scope.myOriginalY );
              $('#pulled_size').html('Size: ' +$scope.myCroppedOriginalW +', '+$scope.myCroppedOriginalH );
       }
       else{
         // some code
       }
     }

    // Locally load the file
    loadedImage.onload = function() {
        $scope.myImage='static/images/test_image_swift.jpg';
    }
  });
