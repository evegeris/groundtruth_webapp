angular.module('myApp.services').factory('user', function($resource) {
  return{

     SignUp: $resource('api/v1/signup.json', {},{},
                 { stripTrailingSlashes: false }),
     ForgotPassword: $resource('api/v1/forgotpassword', null, null,
                                                             {
                                                stripTrailingSlashes: false
                                                }),

    UserInfo: $resource('api/v1/userinfo',
            {
              query:'@query'
            },
            {
              },
              { stripTrailingSlashes: false }),

     UserUpdate: $resource('api/v1/userupdate',
            {
              query:'@query'
            },
            {
              },
              { stripTrailingSlashes: false }),


    UserActiveUpdate: $resource('api/v1/useractiveupdate',
              {
                query:'@query'
              },
              {
                },
                { stripTrailingSlashes: false }),

    UserActiveUpdate: $resource('api/v1/updatecompleted',
              {
                query:'@query'
              },
                {
                },
                { stripTrailingSlashes: false }),

     UpdatePassword: function (token) {
                       return $resource('api/v1/forgotpassword', {}, {
                                                                update: {
                                                                    method: 'PATCH',
                                                                    headers: {
                                                                        'Authorization': 'Bearer ' + token
                                                                    }
                                                                }
                                                            },
                                                             {
                                                stripTrailingSlashes: false
                                                })
                                       }



      }
});


angular.module('myApp.controllers').controller('LoginController', function($http, $scope, $state, $stateParams, user, $auth, toaster, $window, user_info) {

   $scope.login = true;
   $scope.signUp= false;
   $scope.fp = false;
   $scope.loading = false;

/*
$http.post(url).success(function (data, status) {
  console.log(data);
  this.data = data;
  this.status = status;
  console.log(this.data);
}).error(function (data, status) {
  console.log('failed');
  this.response = 'failed call';
  this.status = status;
});
*/

$scope.guestLogin = function () {

  //alert("guest");
  //$state.go("guest_crop");
  $scope.email = "guest@guest.com";
  $scope.password = "guestpw";
  signIn();

}


   $scope.signUpClick = function () {

     $scope.login = false;
     $scope.signUp= true;
     $scope.fp = false;

   }

   $scope.fpClick = function () {

     $scope.login = false;
     $scope.signUp= false;
     $scope.fp = true;

   }

   $scope.loginClick = function () {

     $scope.login = true;
     $scope.signUp= false;
     $scope.fp = false;

   }

   // partner login
   $scope.authenticate = function(provider) {

         $scope.loading = true;

         $auth.authenticate(provider)
         .then(function() {
            alert('Google authenticated!');

            $scope.user = new user.UserInfo();
            $scope.user.data = {
                 "type": "users",
                 "attributes": {
                   "email": $scope.email
                   }
                  }


            var user_entry = user.UserInfo.get({ email: $scope.email }, function() {

              user_info.setFullName(user_entry.message.full_name);
              user_info.setEmail($scope.email);
              var classified = user_entry.message.classified;
              user_info.setClassified(classified);

              user_info.setLabels(user_entry.message.label1, user_entry.message.label2, user_entry.message.label3, user_entry.message.label4, user_entry.message.label5, user_entry.message.label6, user_entry.message.label7, user_entry.message.label8, user_entry.message.label9, user_entry.message.label10);
              user_info.setColors(user_entry.message.color1, user_entry.message.color2, user_entry.message.color3, user_entry.message.color4, user_entry.message.color5, user_entry.message.color6, user_entry.message.color7, user_entry.message.color8, user_entry.message.color9, user_entry.message.color10);
              var aL = user_entry.message.activeLabels;
              user_info.setActiveLabels(aL);
              var in_queue = user_entry.message.in_queue;
              user_info.setInQueue(in_queue);
              var pComplete = (classified/(classified+in_queue))*100;
              user_info.setPercentComplete(pComplete);

              // get images assigned to user to display as table
              user_info.setImageData(user_entry.message.image_info);
              //user_info.updateNextImageIndex();



            });

            // Getting firstTime active
            var userEA = user.UserActiveUpdate.get({email: $scope.email, firstTime: 9}, function(){
              user_info.setFirstTime(userEA.message.firstTime);

            });


              $state.go('home');
         })
         .catch(function(response) {

           toaster.pop({
            type: 'error',
            title: 'Login Error',
            body: response,
            showCloseButton: true,
            timeout: 200
            });
            $scope.loading = false;
         });


       };

   $scope.signIn = function() {

            $scope.loading = true;
            $scope.credentials = {

                  "data": {
                    "type": "users",
                    "attributes": {
                      "email": $scope.email,
                      "password": $scope.password

                      }
                     }
                  }

            // Use Satellizer's $auth.login method to verify the username and password
            $auth.login($scope.credentials).then(function(data) {

              $scope.user = new user.UserInfo();
              $scope.user.data = {
                   "type": "users",
                   "attributes": {
                     "email": $scope.email
                     }
                    }


              var user_entry = user.UserInfo.get({ email: $scope.email }, function() {

                user_info.setFullName(user_entry.message.full_name);
                user_info.setEmail($scope.email);
                var classified = user_entry.message.classified;
                user_info.setClassified(classified);
                //alert(classified);
                var in_queue = user_entry.message.in_queue;
                user_info.setInQueue(in_queue);
                user_info.setLabels(user_entry.message.label1, user_entry.message.label2, user_entry.message.label3, user_entry.message.label4, user_entry.message.label5, user_entry.message.label6, user_entry.message.label7, user_entry.message.label8, user_entry.message.label9, user_entry.message.label10);
                user_info.setColors(user_entry.message.color1, user_entry.message.color2, user_entry.message.color3, user_entry.message.color4, user_entry.message.color5, user_entry.message.color6, user_entry.message.color7, user_entry.message.color8, user_entry.message.color9, user_entry.message.color10);
                var aL = user_entry.message.activeLabels;
                user_info.setActiveLabels(aL);
                var pComplete = Math.floor((classified/(classified+in_queue))*100);
                user_info.setPercentComplete(pComplete);

                // get images assigned to user to display as table
                //alert(user_entry.message.image_info[0].fullsize_orig_filepath);
                user_info.setImageData(user_entry.message.image_info);

                //user_info.updateNextImageIndex();

                // Getting firstTime active

              });

              var userEA = user.UserActiveUpdate.get({email: $scope.email, firstTime: 9}, function(){
                user_info.setFirstTime(userEA.message.firstTime);

              });




              setTimeout(transferPage,500);
              //user_info.setFullName(user_entry.message.full_name);
              user_info.setEmail($scope.email);
              //var classified = user_entry.message.classified;
              //user_info.setClassified(classified);
              //var in_queue = user_entry.message.in_queue;
              //user_info.setInQueue(in_queue);
              //var pComplete = (classified/(classified+in_queue))*100;
              //user_info.setPercentComplete(pComplete);

              // get images assigned to user to display as table
              //alert(user_entry.message.image_info[0].fullsize_orig_filepath);
              //user_info.setImageData(user_entry.message.image_info);

            })
            .catch(function(response){ // If login is unsuccessful, display relevant error message.

               toaster.pop({
                type: 'error',
                title: 'Login Error',
                body: response.data.message,
                showCloseButton: true,
                timeout: 200
                });
                $scope.loading = false;
               });
        }

        transferPage = function() {
          if ($scope.email == "guest@guest.com"){
              $state.go('guest_tutorial');
          }
          else {
            $state.go('home');
          }

        }


        // Sign Up a New User

        $scope.addUser = function() {
               $scope.loading = true;
               $scope.user = new user.SignUp();
               $scope.user.data = {
                    "type": "users",
                    "attributes": {
                      "name": $scope.name,
                      "email": $scope.email,
                      "password": $scope.password,
                      "role": "classifier",
                      "active": "0",
                      "classified": "0",
                      "in_queue": "0"
                      }
                     }
                $scope.user.$save(function() {

                                // Setting up user profile
                                var user_entry = user.UserUpdate.get({ email: $scope.email, activeLabels: 6, label1: "Healthy", label2: "Scar", label3: "inflammatory", label4: "Necrotic", label5: "Background", label6: "Unclassified", label7: "null", label8: "null", label9: "null", label10: "null",
                                    color1: "AF9FFD", color2: "E5FFE5", color3: "FF99B1", color4: "FFFFAD", color5: "8080FF", color6: "A6A6A6", color7: "FFFFFF", color8: "FFFFFF", color9: "FFFFFF", color10: "FFFFFF"}, function() {
                                    });
                               // Setting up firstTime active
                               var user_entry_active = user.UserActiveUpdate.get({email: $scope.email, firstTime: 1});


                                toaster.pop({
                                            type: 'success',
                                            title: 'Sucess',
                                            body: "User created successfully",
                                            showCloseButton: true,
                                            timeout: 200
                                            });
                                   $scope.loading = false;
                                   //$state.go('login');

                                }, function(error) {
                                toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: error.data.error,
                                            showCloseButton: true,
                                            timeout: 200
                                            });
                                 $scope.loading = false;
                                           });



        }



        // Forgot password

        $scope.forgotPassword = function() {
               $scope.loading = true;
               $scope.user = new user.ForgotPassword();
               $scope.user.data = {
                    "type": "users",
                    "attributes": {
                      "email": $scope.email
                      }
                     }
                $scope.user.$save(function() {
                                toaster.pop({
                                            type: 'success',
                                            title: 'Sucess',
                                            body: "Password reset email has been sent successfully",
                                            showCloseButton: true,
                                            timeout: 200
                                            });
                                   $scope.loading = false;

                                }, function(error) {
                                toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: error,
                                            showCloseButton: true,
                                            timeout: 200
                                            });
                                 $scope.loading = false;
                                           });


        }



        // Update password
        $scope.token = $stateParams.token;
        $scope.updatePassword = function() {
               $scope.loading = true;

               $scope.user = new user.UpdatePassword($scope.token);
              // console.dir($scope.user)
               $scope.data = { "data":{
                    "type": "users",
                    "attributes": {
                      "password": $scope.password

                      }
                     }
                    }
                $scope.user.update({}, $scope.data, function() {
                                toaster.pop({
                                            type: 'success',
                                            title: 'Sucess',
                                            body: "We have successfully updated your password :)",
                                            showCloseButton: true,
                                            timeout: 200
                                            });
                                   $scope.loading = false;

                                }, function(error) {
                                toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: error,
                                            showCloseButton: true,
                                            timeout: 200
                                            });
                                 $scope.loading = false;
                                           });



        }


 });
