angular.module('myApp').controller('CropCtrl', function($http, $state,  $scope, user_info, localStorageService) {

/*
// investigating whether this is needed
  if (!$auth.isAuthenticated()) {
    //alert('not auth');
    $state.go('login');
  }else {
    //alert('yes auth');
  }
*/

  $scope.myImage='';
  $scope.segm_img = new Image();
  $scope.myCroppedImage='';
  $scope.cropType="rectangle";
  $scope.showLoadingWidget = false;
  $scope.croppingStage = true;
  $scope.segmentingStage = false;
  $scope.segmentedArray = [];
  $scope.jsonArray = [];
  $scope.selectedIndex = 0;
  var slider1 = document.getElementById("granularity");

  /*
    $scope.testBtn= function(){
      alert('seems alright.');
    }
  */

  slider1.addEventListener("input", function() {
    //console.log('slider: ');
    //console.log(slider1.value);
    //console.log($scope.segmentedArray[slider1.value]);
    setImage($scope.segmentedArray[slider1.value]);

    $('#slidePosition').html('Granularity: '+ slider1.value);

  }, false);

  $scope.setArea=function(value){
    $scope.cropType=value;
  }

function setImage(filepath){

  // set segmented image as src
  $scope.showLoadingWidget = true;
  $scope.croppingStage = false;
  $scope.segmentingStage = true;
  $http.get('dyn_img/fp=' + filepath).then(function(response) {

    var canvas, container, context;
    $scope.segm_img.onload = function(){
        // Create the canvas element.
        canvas = document.getElementById('segmenting_canvas');
        container = $('#segmContainer');
        var contWidth = container.width();
        var contHeight = container.height();
        canvas.width = contWidth;
        canvas.height = contHeight;
        //alert($scope.segm_img.width);
        //alert($scope.segm_img.height);
        var imgAspectRatio = $scope.segm_img.width/$scope.segm_img.height;
        context = canvas.getContext('2d');
        context.drawImage($scope.segm_img, 0, 0, canvas.height*imgAspectRatio, canvas.height);
         //$('#slidePosition').html('Granularity: '+ slider1);
         $('#slidePosition').html('Granularity: '+ slider1.value);
    }
    // Load image URL.
    try{
      $scope.segm_img.src = "data:image/png;base64," + response.data;
      localStorageService.set('segmented_img', "data:image/png;base64," + response.data);
      $scope.showLoadingWidget = false;
    }catch(e){
        error(e);
    }

  });

  $scope.showLoadingWidget = false;

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

function setCroppedImageDataURL(success, error) {

    var data, canvas, ctx;
    var img = new Image();
    img.onload = function(){
        // Create the canvas element.
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        // Get '2d' context and draw the image.
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        // Get canvas data URL
        try{
            data = canvas.toDataURL();
            success({image:img, data:data});
        }catch(e){
            error(e);
        }
    }
    // Load image URL.
    try{
        img.src = $scope.myCroppedImage;
    }catch(e){
        error(e);
    }
}

var onSuccess = function(e){
  //document.body.appendChild(e.image);
  localStorageService.set('cropped_img', e.data );
 };

 var onError = function(e){
  alert(e.message);
 };


/********/
/* CROP */
/********/

     // Saving feature once you crop the image
     $scope.saveCrop = function(){

       var answer = confirm("Save the Cropped Image!\nProceed?")
       if (answer){
             // save original cropped image
             setCroppedImageDataURL(onSuccess, onError);

              //These are the important points, the x,y position and the width/length of the new image
              $('#pulled_position').html('Position: ' + $scope.myOriginalX +', '+$scope.myOriginalY );
              $('#pulled_size').html('Size: ' +$scope.myCroppedOriginalW +', '+$scope.myCroppedOriginalH );

              var filepath = $scope.img_info_at.fullsize_orig_filepath;
              var email = localStorageService.get('email');

              $scope.showLoadingWidget = true;
              $http.get('get_crop/', {
                      params:  {filepath: filepath, x: $scope.myOriginalX, y: $scope.myOriginalY, w: $scope.myCroppedOriginalW, h: $scope.myCroppedOriginalH, email: email},
                      headers: {'Authorization': 'token'}
                  }
              )
              .then(function(response) {

                //$('hchosen').css({'background-color':'#FFFFAD'})

                  // parse received data
                  var obj = JSON.parse(response.data.message);
                  var len = obj.arrayLength;

                  for(i = 0; i < len; i++){
                    var img_idx = 'obj.img'+i.toString();
                    var json_idx = 'obj.json'+i.toString();
                    //alert(eval(json_idx));
                    $scope.segmentedArray.push(eval(img_idx));
                    $scope.jsonArray.push(eval(json_idx));
                  }

                  // default img to display:
                  $scope.selectedIndex = len - 1;

                  // set segmented image as src
                  var filepath = $scope.segmentedArray[$scope.selectedIndex];
                  setImage(filepath);

              }, function(x) {
                  // Request error
              });

       }
       else{
         alert("Cancelled!");
       }
     }

/***********************/
/* ACCEPT SEGMENTATION */
/***********************/

     $scope.saveSegmentation = function(){

       var answer = confirm("Confirm the segmentation?\nProceed?")
       if (answer){

              $scope.selectedIndex = slider1.value; // update index
              var segmented_filepath = $scope.segmentedArray[$scope.selectedIndex];
              var json_filepath = $scope.jsonArray[$scope.selectedIndex];
              var email = localStorageService.get('email');
              //$scope.segmentedArray
              //$scope.jsonArray

              $scope.showLoadingWidget = true;
              $http.get('get_json/', {
                      params:  {segmented_filepath: segmented_filepath, json_filepath: json_filepath, email: email},
                      headers: {'Authorization': 'token'}
                  }
              )
              .then(function(response) {

                  $scope.showLoadingWidget = false;

                  // retrieve JSON
                  localStorageService.set('json_str', response.data.message.json_data);

                  // hmm. fails on first attempt when ?loaded bit in polygonDraw
                  $state.go("polygon");

              }, function(x) {
                  // Request error
              });

       }
       else{
         alert("Cancelled!");
       }
     }

     // request image from server
     function requestImage(index){

       $scope.img_info_at = JSON.parse(localStorageService.get('image_info'+index.toString()));
       var filepath = $scope.img_info_at.fullsize_orig_filepath;

       $http.get('dyn_img/fp=' + filepath).then(function(response) {
         $scope.myImage = "data:image/png;base64," + response.data;
       });

     }


    // get current image from server
    var idx = localStorageService.get('current_img');
    requestImage(idx);


  });
