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


angular.module('myApp.controllers').controller('LoginController', function($scope, $state, $stateParams, user, $auth, toaster, $window, user_info) {

   $scope.login = true;
   $scope.signUp= false;
   $scope.fp = false;
   $scope.loading = false;

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

              // { token: $scope.token }
              //$scope.token = $stateParams.token;
              var user_entry = user.UserInfo.get({ email: $scope.email }, function() {

                user_info.setFullName(user_entry.message.full_name);
                var classified = user_entry.message.classified;
                user_info.setClassified(classified);
                var in_queue = user_entry.message.in_queue;
                user_info.setInQueue(in_queue);
                var pComplete = (classified/(classified+in_queue))*100;
                user_info.setPercentComplete(pComplete);

                // get images assigned to user to display as table
                //alert(user_entry.message.image_info[0].fullsize_orig_filepath);
                user_info.setImageData(user_entry.message.image_info);

                user_info.updateNextImageIndex();

              });


                $state.go('home');
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
                                            body: error,
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
