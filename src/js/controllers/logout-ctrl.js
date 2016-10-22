/**
 * Logout Controller
 */

angular
    .module('RDash')
    .controller('LogoutCtrl', ['$scope', LogoutCtrl]);

// $state
function LogoutCtrl($auth, toaster, $window, $scope) { // Logout the user if they are authenticated.

  //Display the Logout button for authenticated users only
  $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.logout = function(){

     if (!$auth.isAuthenticated()) { return; }
     $auth.logout()
      .then(function() {

        toaster.pop({
                type: 'success',
                body: 'Logging out',
                showCloseButton: true,

                });

        //$state.go('login');

      });
      }
      
}
/**/
