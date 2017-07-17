angular.module('myApp').controller('GuestCropCtrl', function($http, $state,  $scope, user_info, localStorageService, toaster) {

/*
// investigating whether this is needed
  if (!$auth.isAuthenticated()) {
    //alert('not auth');
    $state.go('login');
  }else {
    //alert('yes auth');
  }
*/

//window.location.reload(true);

  $scope.myImage='';
  $scope.segm_img = new Image();
  $scope.myCroppedImage='';
  $scope.cropType="rectangle";
  $scope.showLoadingWidget = false;
  $scope.browseImage = true;
  $scope.croppingStage = true;
  $scope.segmentingStage = false;
  $scope.segmentedArray = [];
  $scope.jsonArray = [];
  $scope.userImage = 0;
  $scope.selectedIndex = 0;
  var slider1 = document.getElementById("granularity");
  //localStorage.clear();



  /*
    $scope.testBtn= function(){
      alert('seems alright.');
    }
  */

  slider1.addEventListener("input", function() {
    //console.log('slider: ');
    //console.log(slider1.value);
    //console.log($scope.segmentedArray[slider1.value]);
    setImage(slider1.value);

    $('#slidePosition').html('Granularity: '+ slider1.value);

  }, false);

  $scope.setArea=function(value){
    $scope.cropType=value;
  }


  function getAllImages(filepath1, filepath2, filepath3, filepath4, filepath5){

    var email = localStorageService.get('email');
    $http.get('dyn_img/fp=' + '/' + filepath1, {
      params:  {email: email}
      }
    ).then(function(response) {
      var r_code = response.status;
      if (r_code != 200){
         localStorageService.set('error_status', r_code);
         $state.go('error_status');
       }

       $scope.sentImg1 = "data:image/png;base64," + response.data;
       $scope.fpImg1 = filepath1;
    });

    $http.get('dyn_img/fp=' + '/' + filepath2, {
      params:  {email: email}
      }
    ).then(function(response) {
      var r_code = response.status;
      if (r_code != 200){
         localStorageService.set('error_status', r_code);
         $state.go('error_status');
       }

       $scope.sentImg2 = "data:image/png;base64," + response.data;
       $scope.fpImg2 = filepath2;
    });

    $http.get('dyn_img/fp=' + '/' + filepath3, {
      params:  {email: email}
      }
    ).then(function(response) {
      var r_code = response.status;
      if (r_code != 200){
         localStorageService.set('error_status', r_code);
         $state.go('error_status');
       }

       $scope.sentImg3 = "data:image/png;base64," + response.data;
       $scope.fpImg3 = filepath3;
       setTimeout(function(){  setImage(2);},100);
    });

    $http.get('dyn_img/fp=' + '/' + filepath4, {
      params:  {email: email}
      }
    ).then(function(response) {
      var r_code = response.status;
      if (r_code != 200){
         localStorageService.set('error_status', r_code);
         $state.go('error_status');
       }

       $scope.sentImg4 = "data:image/png;base64," + response.data;
       $scope.fpImg4 = filepath4;
    });

    $http.get('dyn_img/fp=' + '/' + filepath5, {
      params:  {email: email}
      }
    ).then(function(response) {
      var r_code = response.status;
      if (r_code != 200){
         localStorageService.set('error_status', r_code);
         $state.go('error_status');
       }

       $scope.sentImg5 = "data:image/png;base64," + response.data;
       $scope.fpImg5 = filepath5;
    });
  }



  function setImage(index){

    // set segmented image as src
    $scope.showLoadingWidget = true;
    $scope.croppingStage = false;
    $scope.segmentingStage = true;


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

      if (index == 0) {
        var imgData = $scope.sentImg1;
        var imgFp = $scope.fpImg1;
      }
      if (index == 1) {
        var imgData = $scope.sentImg2;
        var imgFp = $scope.fpImg2;
      }
      if (index == 2) {
        var imgData = $scope.sentImg3;
        var imgFp = $scope.fpImg3;
      }
      if (index == 3) {
        var imgData = $scope.sentImg4;
        var imgFp = $scope.fpImg4;
      }
      if (index == 4) {
        var imgData = $scope.sentImg5;
        var imgFp = $scope.fpImg5;
      }

      try{
        $scope.segm_img.src = imgData;
        localStorageService.set('segmented_img', imgFp);
        $scope.showLoadingWidget = false;
      }catch(e){
          error(e);

      }
    $scope.showLoadingWidget = false;

  }


    // Changes the image from a loaded local file!
     var handleFileSelect=function(evt) {
       var file=evt.currentTarget.files[0];
       var fullPath = document.getElementById('fileInput').value;

       var re = /(\.jpg|\.jpeg|\.png)$/i;
        if(!re.exec(fullPath))
        {

          toaster.pop({
           type: 'info',
           title: 'Invalid Extension',
           body: fullPath,
           showCloseButton: true,
           timeout: 200
           });
        }
        else {

       var reader = new FileReader();
       reader.onload = function (evt) {
         $scope.$apply(function($scope){
           $scope.myImage=evt.target.result;
           var email = localStorageService.get('email');

           myImg = evt.target.result;
           $http.post('post_localsave/', {
                   email: email,
                   imgData:  myImg,
                   headers: {'Authorization': 'token'}
               }
           )
           .then(function(response) {


             r_code = response.status;
            fp = response.data.message;

            if (r_code != 200){
              localStorageService.set('error_status', r_code);
              $state.go('error_status');
            }

            $scope.userFilepath = response.data.message;
             $scope.userImage = 1;
             //setImage(filepath);var theCookies = document.cookie.split(';');
             var x = document.cookie;
             //window.alert(x);




           }, function(x) {
               // Request error
                var r_code = 400;
                localStorageService.set('error_status', r_code);
                $state.go('error_status');

           });

         });
       };
     }
       reader.readAsDataURL(file);

     };
     angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);




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

 };

 var onError = function(e){
  alert(e.message);
 };


/********/
/* CROP */
/********/

     // Saving feature once you crop the image
     $scope.saveCrop = function(){

       // check if image exists

       var answer = confirm("Proceed with cropping?")
       if (answer){
             // save original cropped image
             setCroppedImageDataURL(onSuccess, onError);
             $scope.browseImage = false;

              //These are the important points, the x,y position and the width/length of the new image
              $('#pulled_position').html('Position: ' + $scope.myOriginalX +', '+$scope.myOriginalY );
              $('#pulled_size').html('Size: ' +$scope.myCroppedOriginalW +', '+$scope.myCroppedOriginalH );

              if ($scope.userImage == 1){
                var filepath = $scope.userFilepath;
              }
              else {

                if (true){
                    var filepath = "images/wound.jpg";
                }
                else {
                    var filepath = $scope.img_info_at.relative_orig_filepath;
                }
              }
              var email = localStorageService.get('email');

              $scope.showLoadingWidget = true;
              $http.get('get_crop/', {
                      params:  {filepath: filepath, x: $scope.myOriginalX, y: $scope.myOriginalY, w: $scope.myCroppedOriginalW, h: $scope.myCroppedOriginalH, email: email},
                      headers: {'Authorization': 'token'}
                  }
              )
              .then(function(response) {

                var r_code = response.status;

               if (r_code != 200){
                 localStorageService.set('error_status', r_code);
                 $state.go('error_status');
               }

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
                  getAllImages($scope.segmentedArray[0],$scope.segmentedArray[1],$scope.segmentedArray[2],$scope.segmentedArray[3],$scope.segmentedArray[4]);


              }, function(x) {
                  // Request error
              });

       }
       else{
         toaster.pop({
          type: 'info',
          title: 'Cancelled',
          body: '',
          showCloseButton:  true,
          timeout: 5000,
          tapToDismiss: flase
          });
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
              var croppedPT = json_filepath.split("/")[1];
              croppedPT = croppedPT.split(".")[0];
              croppedPT = croppedPT.split("_")[1]+"_"+croppedPT.split("_")[2];
              croppedPT = "cropped/"+ croppedPT+"_cropped.jpg";

              localStorageService.set('cropped_img', croppedPT );

              var didSave = localStorageService.set('json_str', json_filepath);
              while (didSave == false);
              didSave = false;
              didSave = localStorageService.set('selected_fp', segmented_filepath);
              // hmm. fails on first attempt when ?loaded bit in polygonDraw
              while(didSave == false);
              setTimeout(function(){  $state.go("polygon");},500);


       }
       else{
         //alert("Cancelled!");
       }
     }

     // request image from server
     function requestImage(index){

       if (index == -999){

         var filepath = "images/wound.jpg";
       }
       else {
         $scope.img_info_at = JSON.parse(localStorageService.get('image_info'+index.toString()));
         var filepath = $scope.img_info_at.relative_orig_filepath;
       }

       var email = localStorageService.get('email');
       $http.get('dyn_img/fp=' + '/' + filepath, {
         params:  {email: email}
         }
       ).then(function(response) {
         $scope.myImage = "data:image/png;base64," + response.data;
       }).catch(function(response) {

         var r_code = response.status;

         if (r_code != 200){
            localStorageService.set('error_status', r_code);
            $state.go('error_status');
          }

         toaster.pop({
          type: 'error',
          title: 'Error loading image!',
          body: 'Filepath: '+filepath,
          showCloseButton: true,
          timeout: 200
          });
          $scope.loading = false;
       });

     }






    // get current image from server
    //var idx = localStorageService.get('current_img');
    requestImage(-999);



  });
