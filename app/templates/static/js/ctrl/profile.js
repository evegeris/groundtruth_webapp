angular.module('myApp').controller('ProfileCtrl', function($http, $state, user, $stateParams, $auth, $scope, localStorageService, toaster, user_info) {

  // Prevent the guest profile from modifying the Trial mode
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


  // Need to get local stored data to populate profile screen
  $scope.aLabels = localStorageService.get('activeLabels');
  $scope.email = localStorageService.get('email');



  document.getElementById('labelOne').value = localStorageService.get('label1');
  document.getElementById('labelTwo').value = localStorageService.get('label2');
  document.getElementById('labelThree').value = localStorageService.get('label3');
  document.getElementById('labelFour').value = localStorageService.get('label4');
  document.getElementById('labelFive').value = localStorageService.get('label5');
  document.getElementById('labelSix').value = localStorageService.get('label6');
  document.getElementById('labelSeven').value = localStorageService.get('label7');
  document.getElementById('labelEight').value = localStorageService.get('label8');
  document.getElementById('labelNine').value = localStorageService.get('label9');
  document.getElementById('labelTen').value = localStorageService.get('label10');

  document.getElementById('colorOne').value = localStorageService.get('color1');
  document.getElementById('colorTwo').value = localStorageService.get('color2');
  document.getElementById('colorThree').value = localStorageService.get('color3');
  document.getElementById('colorFour').value = localStorageService.get('color4');
  document.getElementById('colorFive').value = localStorageService.get('color5');
  document.getElementById('colorSix').value = localStorageService.get('color6');
  document.getElementById('colorSeven').value = localStorageService.get('color7');
  document.getElementById('colorEight').value = localStorageService.get('color8');
  document.getElementById('colorNine').value = localStorageService.get('color9');
  document.getElementById('colorTen').value = localStorageService.get('color10');


  // Create user object for future use
  $scope.user = new user.UserInfo();
  $scope.user.data = {
       "type": "users",
       "attributes": {
         "email": $scope.email
         }
        }

  // Preset screen to hidden
  $scope.lTwo = false;
  $scope.lThree = false;
  $scope.lFour = false;
  $scope.lFive = false;
  $scope.lSix = false;
  $scope.lSeven = false;
  $scope.lEight = false;
  $scope.lNine = false;
  $scope.lTen = false;

  // Initialize the screen
  if ($scope.aLabels >= 2){
    document.getElementById("n-two").checked = true;
    $scope.lTwo = true;
  }
  if ($scope.aLabels >= 3){
    document.getElementById("n-three").checked = true;
    $scope.lThree = true;
  }
  if ($scope.aLabels >= 4){
    document.getElementById("n-four").checked = true;
    $scope.lFour = true;
  }
  if ($scope.aLabels >= 5){
    document.getElementById("n-five").checked = true;
    $scope.lFive = true;
  }
  if ($scope.aLabels >= 6){
    document.getElementById("n-six").checked = true;
    $scope.lSix = true;
  }
  if ($scope.aLabels >= 7){
    document.getElementById("n-seven").checked = true;
    $scope.lSeven = true;
  }
  if ($scope.aLabels >= 8){
    document.getElementById("n-eight").checked = true;
    $scope.lEight = true;
  }
  if ($scope.aLabels >= 9){
    document.getElementById("n-nine").checked = true;
    $scope.lNine = true;
  }
  if ($scope.aLabels >= 10){
    document.getElementById("n-ten").checked = true;
    $scope.lTen = true;
  }

  //***************************************************************//
  // Update the CSS colors for the SAMPLES
  //***************************************************************//
    $scope.showColor = function(){
        var upColor1 = '#' + document.getElementById('colorOne').value;
        $('pC1').css({'background-color':upColor1});

        var upColor2 = '#' + document.getElementById('colorTwo').value;
        $('pC2').css({'background-color':upColor2});

        var upColor3 = '#' + document.getElementById('colorThree').value;
        $('pC3').css({'background-color':upColor3});

        var upColor4 = '#' + document.getElementById('colorFour').value;
        $('pC4').css({'background-color':upColor4});

        var upColor5 = '#' + document.getElementById('colorFive').value;
        $('pC5').css({'background-color':upColor5});

        var upColor6 = '#' + document.getElementById('colorSix').value;
        $('pC6').css({'background-color':upColor6});

        var upColor7 = '#' + document.getElementById('colorSeven').value;
        $('pC7').css({'background-color':upColor7});

        var upColor8 = '#' + document.getElementById('colorEight').value;
        $('pC8').css({'background-color':upColor8});

        var upColor9 = '#' + document.getElementById('colorNine').value;
        $('pC9').css({'background-color':upColor9});

        var upColor10 = '#' + document.getElementById('colorTen').value;
        $('pC10').css({'background-color':upColor10});
    }

    $scope.showColor();

    //***************************************************************//
    // Button actives the save option, grabs the data from the screen
    // and call the server to store the data. Then re-update the screen
    //***************************************************************//
    $scope.saveWork = function(){
      var answer = confirm("Save your profile settings?")
      if (answer){


        // Aqcuire data filled out by the user to send to the database
        $scope.label1 =  document.getElementById('labelOne').value;
        $scope.label2 =  document.getElementById('labelTwo').value;
        $scope.label3 =  document.getElementById('labelThree').value;
        $scope.label4 =  document.getElementById('labelFour').value;
        $scope.label5 =  document.getElementById('labelFive').value;
        $scope.label6 =  document.getElementById('labelSix').value;
        $scope.label7 =  document.getElementById('labelSeven').value;
        $scope.label8 =  document.getElementById('labelEight').value;
        $scope.label9 =  document.getElementById('labelNine').value;
        $scope.label10 =  document.getElementById('labelTen').value;

        $scope.color1 = document.getElementById('colorOne').value;
        $scope.color2 = document.getElementById('colorTwo').value;
        $scope.color3 = document.getElementById('colorThree').value;
        $scope.color4 = document.getElementById('colorFour').value;
        $scope.color5 = document.getElementById('colorFive').value;
        $scope.color6 = document.getElementById('colorSix').value;
        $scope.color7 = document.getElementById('colorSeven').value;
        $scope.color8 = document.getElementById('colorEight').value;
        $scope.color9 = document.getElementById('colorNine').value;
        $scope.color10 = document.getElementById('colorTen').value;

        // Monstrous function call to pass important parameters
        var user_entry = user.UserUpdate.get({ email: $scope.email, activeLabels: $scope.aLabels, label1: $scope.label1, label2: $scope.label2, label3: $scope.label3, label4: $scope.label4, label5: $scope.label5, label6: $scope.label6, label7: $scope.label7, label8: $scope.label8, label9: $scope.label9, label10: $scope.label10,
           color1: $scope.color1, color2: $scope.color2, color3: $scope.color3, color4: $scope.color4, color5: $scope.color5, color6: $scope.color6, color7: $scope.color7, color8: $scope.color8, color9: $scope.color9, color10: $scope.color10}, function() {

          // Update the local storage with the return results
          user_info.setLabels(user_entry.message.label1, user_entry.message.label2, user_entry.message.label3, user_entry.message.label4, user_entry.message.label5, user_entry.message.label6, user_entry.message.label7, user_entry.message.label8, user_entry.message.label9, user_entry.message.label10);
          user_info.setColors(user_entry.message.color1, user_entry.message.color2, user_entry.message.color3, user_entry.message.color4, user_entry.message.color5, user_entry.message.color6, user_entry.message.color7, user_entry.message.color8, user_entry.message.color9, user_entry.message.color10);
          var aL = user_entry.message.activeLabels;
          user_info.setActiveLabels(aL);

          // Re-populate the screen to show the cleaned data
          document.getElementById('labelOne').value = localStorageService.get('label1');
          document.getElementById('labelTwo').value = localStorageService.get('label2');
          document.getElementById('labelThree').value = localStorageService.get('label3');
          document.getElementById('labelFour').value = localStorageService.get('label4');
          document.getElementById('labelFive').value = localStorageService.get('label5');
          document.getElementById('labelSix').value = localStorageService.get('label6');
          document.getElementById('labelSeven').value = localStorageService.get('label7');
          document.getElementById('labelEight').value = localStorageService.get('label8');
          document.getElementById('labelNine').value = localStorageService.get('label9');
          document.getElementById('labelTen').value = localStorageService.get('label10');

          document.getElementById('colorOne').value = localStorageService.get('color1');
          document.getElementById('colorTwo').value = localStorageService.get('color2');
          document.getElementById('colorThree').value = localStorageService.get('color3');
          document.getElementById('colorFour').value = localStorageService.get('color4');
          document.getElementById('colorFive').value = localStorageService.get('color5');
          document.getElementById('colorSix').value = localStorageService.get('color6');
          document.getElementById('colorSeven').value = localStorageService.get('color7');
          document.getElementById('colorEight').value = localStorageService.get('color8');
          document.getElementById('colorNine').value = localStorageService.get('color9');
          document.getElementById('colorTen').value = localStorageService.get('color10');

          // Recolor the screen to force a color update
          $scope.showColor();
        });

      }
      else{

      }
    }

    // Go back to the dashboard
    $scope.discardProfile = function(){
      $state.go('dashboard');
    }



$.ajaxSetup({
  cache:false
});

$('input[type=radio]').click(function(){

  $scope.aLabels = this.value;

  $scope.lTwo = true;
  $scope.lThree = true;
  $scope.lFour = true;
  $scope.lFive = true;
  $scope.lSix = true;
  $scope.lSeven = true;
  $scope.lEight = true;
  $scope.lNine = true;
  $scope.lTen = true;
  //alert(escape(document.getElementById('labelOne').value));

  if (this.value<10){
    $scope.lTen = false;
  }
  if (this.value<9){
    $scope.lNine = false;
  }
  if (this.value<8){
    $scope.lEight = false;
  }
  if (this.value<7){
    $scope.lSeven = false;
  }
  if (this.value<6){
    $scope.lSix = false;
  }
  if (this.value<5){
    $scope.lFive = false;
  }
  if (this.value<4){
    $scope.lFour = false;
  }
  if (this.value<3){
    $scope.lThree = false;
  }


});




});
