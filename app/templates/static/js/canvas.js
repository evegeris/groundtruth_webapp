

angular.module('myApp.controllers').controller('CanvasCtrl_', function($http, $scope) {
    window.alert("canvasctrl!!");

          // Variables Predefined for the canvas drawing implementation
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');

            // Note: The use of $scope is the bridge between html and javascript
            $scope.data = [
            ];

            // Sets up the canvas dimensions (have not explored)
            canvas.width = 600;
            canvas.height = 400;
            context.globalAlpha = 1.0;
            context.beginPath();
            draw($scope.data);


            $("#display_img").attr("src", "http://i.imgur.com/PWSOy.jpg");
            var background = document.getElementById('display_img');
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
 });
