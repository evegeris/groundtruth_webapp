angular.module('myApp').controller('TutorialCtrl', function($http, $state,  $scope, toaster) {



    $scope.myImage='';
    $scope.segm_img = new Image();
    $scope.myCroppedImage='';
    $scope.cropType="rectangle";
    $scope.showLoadingWidget = false;
    $scope.browseImage = true;
    $scope.tutStage1 = true;
    $scope.tutStage2 = false;
    $scope.tutStage3 = false;
    $scope.segmentedArray = [];
    $scope.jsonArray = [];
    $scope.userImage = 0;
    $scope.selectedIndex = 0;
    var _validFileExtensions = [".jpg"];


       $scope.tut1 = function(){
         $scope.tutStage1 = false;
         $scope.tutStage2 = true;
         requestImage(2);
         $('#instructions').html('Labelling Tool Tutorial Stage 2: Select the segment granularity');

       }

       $scope.tut2 = function(){
         $scope.tutStage2 = false;
         $scope.tutStage3 = true;
         requestImage(3);
         $('#instructions').html('Labelling Tool Tutorial Stage 3: Label the image');

       }

       $scope.tut3 = function(){
         $scope.tutStage1 = false;
         $scope.tutStage2 = true;
         $state.go('guest_crop');

       }


       // request image from server
       function requestImage(index){

         if (index == 1){

           var filepath = "groundtruth_webapp/readme_images/tutorial1_f.png";
         }

         else if (index == 2){

           var filepath = "groundtruth_webapp/readme_images/tutorial2_f.png";
         }

         else if (index == 3){

           var filepath = "groundtruth_webapp/readme_images/tutorial3_f.png";
         }


         $http.get('dyn_img/fp=' + '/' + filepath).then(function(response) {
           $scope.myImage = "data:image/png;base64," + response.data;
           var tutId = document.getElementById("tutId");
           tutId.src = $scope.myImage;
         }).catch(function(response) {

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
