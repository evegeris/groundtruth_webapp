angular.module('myApp').controller('MainTutorialCtrl', function($http, $state,  $scope, localStorageService, toaster, user_info, user) {


    $scope.email = localStorageService.get('email');

    $scope.myImage='';
    $scope.segm_img = new Image();
    $scope.myCroppedImage='';
    $scope.cropType="rectangle";
    $scope.showLoadingWidget = false;
    $scope.browseImage = true;
    $scope.tutStage1 = true;
    $scope.tutStage2 = false;
    $scope.tutStage3 = false;
    $scope.tutStage4 = false;
    $scope.tutStage5 = false;
    $scope.segmentedArray = [];
    $scope.jsonArray = [];
    $scope.userImage = 0;
    $scope.selectedIndex = 0;
    var _validFileExtensions = [".jpg"];


       $scope.tut1 = function(){
         $scope.tutStage1 = false;
         $scope.tutStage2 = true;
         requestImage(2);
         $('#instructions').html('Labelling Tool Tutorial Stage 2: The Dashboard');
       }

       $scope.tut2 = function(){
         $scope.tutStage2 = false;
         $scope.tutStage3 = true;
         requestImage(3);
         $('#instructions').html('Labelling Tool Tutorial Stage 3: Cropping an Image');

       }

       $scope.tut3 = function(){
         $scope.tutStage3 = false;
         $scope.tutStage4 = true;
         requestImage(4);
         $('#instructions').html('Labelling Tool Tutorial Stage 4: Granularity Selection');

       }

       $scope.tut4 = function(){
         $scope.tutStage4 = false;
         $scope.tutStage5 = true;
         requestImage(5);
         $('#instructions').html('Labelling Tool Tutorial Stage 5: Label the Image');

       }

       $scope.tut5 = function(){
         $scope.tutStage5 = false;
        if(localStorageService.get('email')=="guest@guest.com"){
         $state.go('guest_crop');
       }
       else {
         var userEA = user.UserActiveUpdate.get({email: $scope.email, firstTime: 0}, function(){
           user_info.setFirstTime(userEA.message.firstTime);
         });
         $state.go('user_profile');
       }

       }


       // request image from server
       function requestImage(index){

         if (index == 1){

           var filepath = "groundtruth_webapp/server_images/main-tutorial1_f.png";
         }

         else if (index == 2){

           var filepath = "groundtruth_webapp/server_images/main-tutorial2_f.png";
         }

         else if (index == 3){

           var filepath = "groundtruth_webapp/server_images/main-tutorial3_f.png";
         }

         else if (index == 4){

           var filepath = "groundtruth_webapp/server_images/main-tutorial4_f.png";
         }

         else if (index == 5){

           var filepath = "groundtruth_webapp/server_images/main-tutorial5_f.png";
         }

         var email = localStorageService.get('email');
         $http.get('dyn_img/fp=' + '/' + filepath, {
           params:  {email: email},
           headers: {'Authorization': 'token'}
           }
         ).then(function(response) {
           $scope.myImage = "data:image/png;base64," + response.data;
           var tutId = document.getElementById("tutId");
           tutId.src = $scope.myImage;
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

      requestImage(1);

  });
