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
                      //"first_name": $scope.first_name,
                      //"last_name": $scope.last_name,
                      //"name": $scope.name,
                      "email": $scope.email,
                      "password": $scope.password
                      //"classified": $scope.classified,
                      //"in_queue": $scope.in_queue

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
              var user_entry = user.UserInfo.get({ email: $scope.email}, function() {
                alert(user_entry.message.classified);
              }); // get() returns a single entry


/*
              $scope.user.$save(function(user) {

                                    toaster.pop({
                                                type: 'success',
                                                title: 'Sucess',
                                                body: "userinfo $save",
                                                showCloseButton: true,
                                                timeout: 200
                                                });
                                       $scope.loading = false;

                                    }, function(error) {
                                    toaster.pop({
                                                type: 'error',
                                                title: 'Error',
                                                body: 'Ignore',
                                                showCloseButton: true,
                                                timeout: 200
                                                });
                                     $scope.loading = false;
                                               });

              user_info.setFirstName($scope.email);
              //alert("classified(?): " + $scope.classified);
              //user_info.setFirstName($scope.first_name);
              //user_info.setClassified($scope.classified);
              //user_info.setQueue($scope.in_queue);
              */

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
