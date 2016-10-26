/*

<button ng-click="custom=!custom">Custom</button>
<span ng-hide="custom">From:
    <input type="text" id="from" />
</span>
<span ng-hide="custom">To:
    <input type="text" id="to" />
</span>
<span ng-show="custom"></span>

*/


angular.module('myApp.controllers', ['ngCookies'])
    .controller('ToggleCtrl', function($scope, $cookies){
        $scope.custom = true;

        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;

        $scope.getWidth = function() {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function(newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookies.get('toggle'))) {
                    $scope.toggle = ! $cookies.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }

        });

        $scope.toggleSidebar = function() {
            $scope.toggle = !$scope.toggle;
            $cookies.put('toggle', $scope.toggle);

        };

        window.onresize = function() {
            $scope.$apply();
        };

});
