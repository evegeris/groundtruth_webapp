angular.module('myApp').controller('LogoutCtrl', function($auth, $state, $window, toaster, $scope, Idle, user_info, localStorageService) { // Logout the user if they are authenticated.

  // check if authenticated
  $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

// for watching shared variables
    $scope.user_info = user_info;
    $scope.user_name = localStorageService.get('full_name');

  // watchers
  $scope.$watch('user_info.user_info_object.data.attributes.full_name', function (newVal, oldVal, scope) {
    if(newVal) {
      scope.user_name = localStorageService.get('full_name');;
    }
  });



/*
    $scope.$on('$viewContentLoaded', function(){
        $scope.user_name = user_info.sayHello();
        $scope.classified = user_info.getClassified();
        $scope.in_queue = user_info.getInQueue();
        //$scope.percent_complete = user_info.getPercentComplete();

      });
*/

    $scope.logout = function(){

     if (!$auth.isAuthenticated()) { return; }
     $auth.logout()
      .then(function() {

        $state.go('login');

      });
      }


      $scope.events = [];

      $scope.$on('IdleStart', function() {
          // the user appears to have gone idle
      });

      $scope.$on('IdleWarn', function(e, countdown) {
          // follows after the IdleStart event, but includes a countdown until the user is considered timed out
          // the countdown arg is the number of seconds remaining until then.
          // you can change the title or display a warning dialog from here.
          // you can let them resume their session by calling Idle.watch()
      });

      $scope.$on('IdleTimeout', function() {
          // the user has timed out (meaning idleDuration + timeout has passed without any activity)
          if (!$auth.isAuthenticated()) { return; }
          $auth.logout()
           .then(function() {

             toaster.pop({
                     type: 'success',
                     body: 'Timeout logout',
                     showCloseButton: true,

                     });

             $state.go('timeout');

           });
      });

      $scope.$on('IdleEnd', function() {
          // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
      });

      $scope.$on('Keepalive', function() {
          // do something to keep the user's session alive
      });


});
