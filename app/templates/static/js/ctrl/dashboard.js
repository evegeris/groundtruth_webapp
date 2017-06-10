angular.module('myApp.controllers').controller('DashboardCtrl', function($http, $auth, $state, $scope, user, user_info, localStorageService, toaster) {


  window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };


  var check = mobilecheck();
  if (check == true){
    alert("Hey User! It appears that you are on a mobile device. This web-app works poorly with mobile devices and we recommend using a PC! ");

  }


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
  else {
  }

$scope.selected = {value: -1};


  if((localStorageService.get('firstTime')==1) && (localStorageService.get('email')!="guest@guest.com")){
    $state.go("main_tutorial");
  }

  // Upload an image to the SQL database!
   var handleFileSelect=function(evt) {
     //alert("image");
     var file=evt.currentTarget.files[0];
     var fullPath = document.getElementById('fileInput').value;

     var re = /(\.jpg|\.jpeg|\.png)$/i;
      if(!re.exec(fullPath))
      {

        toaster.pop({
         type: 'info',
         title: 'Invalid Extension',
         body: '',
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


         // Enables sending images of anysize to server without garbled message
         //alert(myImg);
         $http.post('post_image/', {
                 email: email,
                 imgData:  myImg,
                 headers: {'Authorization': 'token'}
             }
         )
         .then(function(response) {

           var r_code = response.status;

           if (r_code != 200){
              localStorageService.set('error_status', r_code);
              $state.go('error_status');
            }

            var classified = response.data.message.classified;
            user_info.setClassified(classified);
            //alert(classified);
            var in_queue = response.data.message.in_queue;
            user_info.setInQueue(in_queue);
            var pComplete = Math.floor((classified/(classified+in_queue))*100);
            user_info.setPercentComplete(pComplete);

            // get images assigned to user to display as table
            //alert(user_entry.message.image_info[0].fullsize_orig_filepath);
            user_info.setImageData(response.data.message.image_info);

            $scope.refresh();

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


//$scope.image_info = user_info.getImageData();
//alert($scope.image_info[0].fullsize_orig_filepath);
//$scope.user_info = user_info;
//$scope.image_info = user_info.getImageData();
//$scope.image_info = user_info.user_info_object.data.attributes.image_info;
//alert($scope.image_info[0].fullsize_orig_filepath);
//alert('dash: '+$scope.image_info[0].fullsize_orig_filepath);

  // reset local vars
  $scope.refresh = function(){

    $scope.colors = [];


    $scope.user = new user.UserInfo();
    $scope.user.data = {
         "type": "users",
         "attributes": {
           "email": $scope.email
           }
          }

    var email = localStorageService.get('email');

    var user_entry = user.UserInfo.get({ email: email }, function() {

      var listClas = user_entry.message.listClas;


      for (i = 0; i < listClas.length; i++){
        if (listClas[i] == 0){
          $scope.colors.push('white');
        }
        else {
          $scope.colors.push('#aed581');
        }
      }


      var classified = user_entry.message.classified;
      user_info.setClassified(classified);
      var in_queue = user_entry.message.in_queue;
      user_info.setInQueue(in_queue);
      var pComplete = Math.floor((classified/(classified+in_queue))*100);
      user_info.setPercentComplete(pComplete);

      // get images assigned to user to display as table
      //alert(user_entry.message.image_info[0].fullsize_orig_filepath);
      user_info.setImageData(user_entry.message.image_info);
    });

    $scope.image_info = [];
    $scope.classified = localStorageService.get('classified');
    $scope.in_queue = localStorageService.get('in_queue');
    $scope.percent_complete = localStorageService.get('percent_complete');

    var arrayLength = localStorageService.get('image_arrayLen');
    arrayLength = parseInt(arrayLength);

    for (var i = 0; i < arrayLength; i++) {
      $scope.image_info.push(JSON.parse(localStorageService.get('image_info'+i.toString())));
      $scope.tableSize = $scope.tableSize+1;
      //alert( $scope.image_info[i].fullsize_orig_filepath );
    }

    setTimeout(function(){addBtn();},300);




  }

$scope.tableSize = 0;
$scope.refresh();

addBtn = function() {

  for (j = 0; j < $scope.tableSize; j++){
      namePass = "button-"+j;
      currentBtn = document.getElementById(namePass);
      currentBtn.addEventListener("click", function (ev) {
          var idx = this.id.split("-")[1];
          ev.stopPropagation();


          var email = localStorageService.get('email');

          $http.post('delete_row/', {
                  email: email,
                  imgID:  idx,
                  headers: {'Authorization': 'token'}
              }
          )
          .then(function(response) {

            var r_code = response.status;

            if (r_code != 200){
               localStorageService.set('error_status', r_code);
               $state.go('error_status');
             }
             $scope.refresh();


          }, function(x) {
              // Request error
          });


      }, true);
  }

}


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

// state-change functions
$scope.goCrop = function(){
  $state.go("crop_image");
}
$scope.goPolygonDraw = function(){
  $state.go("polygon");
}

$scope.setSelectedImg = function() {
        $scope.selected = this.$index;

        var idx = $scope.selected;
        var img_info_at = JSON.parse(localStorageService.get('image_info'+idx.toString()));
        var progress = img_info_at.progress;
        var email = localStorageService.get('email');

        // Ask if user wants to re-download zip file
        if (progress == 100){
          var answer = confirm("Re-download completed files?")
          if (answer){
            $http.post('post_redownload/', {
                    email: email,
                    imgID:  idx,
                    headers: {'Authorization': 'token'}
                }
            )
            .then(function(response) {

              var r_code = response.status;

              if (r_code != 200){
                 localStorageService.set('error_status', r_code);
                 $state.go('error_status');
               }

               $http.get('get_zipPath/', {
                 params:  {email: email, imgID: idx},
                 headers: {'Authorization': 'token'}
                   }
               )
               .then(function(response2) {




                                // Raw UTF-8 data sent
                               content = response.data;
                               zipPath = response2.data.message;

                               // Need to convert back to binary BLOB
                                var binary_string =  window.atob(content);
                                var len = binary_string.length;
                                var bytes = new Uint8Array( len );
                                for (var i = 0; i < len; i++)        {
                                  bytes[i] = binary_string.charCodeAt(i);
                                }
                                bytes.buffer;

                                // Get the number of segments and date for .zip file naming
                                //zipPath = zipPath.split("/")[1];
                                var spl = zipPath.split("_");
                                fileName = spl[0].substring(spl[0].length-3, spl[0].length) + "_" + spl[1] + ".zip";

                                // Workaround so we can name the download file with a hidden tag
                                 var a = document.createElement("a");
                                 document.body.appendChild(a);
                                 a.style = "display: none";

                                // Creating the blob file
                                var blob = new Blob([bytes.buffer], {type: "application/zip"});

                                // Setting up the download
                                  url = window.URL.createObjectURL(blob);
                                  a.href = url;
                                  a.download = fileName;
                                  a.click();
                                  window.URL.revokeObjectURL(url);


               }, function(x) {
                   // Request error
               });

            }, function(x) {
                // Request error
            });

          }
          else{
            var answer = confirm("Re-classify this image?")
            if (answer){
              var idx = $scope.selected;
              localStorageService.set('current_img', idx);
              // get image info JSON
              //alert(idx);
              var img_info_at = JSON.parse(localStorageService.get('image_info'+idx.toString()));
              // get progress
              var progress = img_info_at.progress;
              // assume if progress = 0, this image needs cropping
              if (progress == 0){
                $scope.goCrop();
              }
              else{
                //$scope.goPolygonDraw();
                $scope.goCrop();
              }
            }
            else{
            }

          }

        }
        else {
          var answer = confirm("Classify this image?")
          if (answer){
            var idx = $scope.selected;
            localStorageService.set('current_img', idx);
            // get image info JSON
            //alert(idx);
            var img_info_at = JSON.parse(localStorageService.get('image_info'+idx.toString()));
            // get progress
            var progress = img_info_at.progress;
            // assume if progress = 0, this image needs cropping
            if (progress == 0){
              $scope.goCrop();
            }
            else{
              //$scope.goPolygonDraw();
              $scope.goCrop();
            }
          }
          else{
          }

        }



    };

});
