angular.module('myApp').controller('ErrorCtrl', function($http, $state,  $scope, toaster, localStorageService) {



    $scope.myImage='';


       $scope.errorBack = function(){

         if(localStorageService.get('email')=="guest@guest.com"){
           $state.go("guest_crop");
         }
         else {
            $state.go('home');
         }

       }



       // request image from server
       function requestImage(index){
         if (index == 400){

           var filepath = "groundtruth_webapp/server_images/400.png";
           $('#errorMessage').html("Client Side Error - It seems like you uploaded something you shouldn't have!");
         }

         else if (index == 401){

           var filepath = "groundtruth_webapp/server_images/401.png";
           $('#errorMessage').html("Unauthorized Access - You shouldn't be here!");
         }

         else if (index == 404){

           var filepath = "groundtruth_webapp/server_images/404.png";
           $('#errorMessage').html("What you were looking for doesn't exists!");
         }

         else if (index == 500){

           var filepath = "groundtruth_webapp/server_images/500.png";
           $('#errorMessage').html("This is embarrasing... our server is having some technical issues!");
         }

         else {
           var filepath = "groundtruth_webapp/server_images/40X.png";
         }

         //Error status code is consumed
         localStorageService.set('error_status', 0);


         $http.get('dyn_img/fp=' + '/' + filepath).then(function(response) {
           $scope.myImage = "data:image/png;base64," + response.data;
           var errorId = document.getElementById("errorImg");
           errorId.src = $scope.myImage;
         }).catch(function(response) {

           toaster.pop({
            type: 'error',
            title: 'Error loading image!',
            body: 'Our error page had an error!',
            showCloseButton: true,
            timeout: 200
            });
            $scope.loading = false;
         });

       }

      $scope.statusCode = localStorageService.get('error_status');
      requestImage($scope.statusCode);

  });
