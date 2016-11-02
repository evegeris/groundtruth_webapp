angular.module('myApp', ['ui.router', 'ngResource',  "angularGrid" , 'myApp.controllers', 'myApp.services', 'satellizer','toaster', 'ngAnimate', 'angular-google-analytics']);

angular.module('myApp')
  .run( function($rootScope, $state){
                //$rootScope.$on('$stateChangeStart'
                $rootScope.$state = $state;
                $rootScope.$state.current.title = "Flask-Scaffold";
                }
    );

angular.module('myApp').config(function( $stateProvider , $urlRouterProvider, $authProvider, AnalyticsProvider) {

   // Google Analytics
    AnalyticsProvider.setAccount('UA-37519052-11');
    AnalyticsProvider.setDomainName('seven.leog.in');

   // Satellizer configuration that specifies which API
  // route the JWT should be retrieved from
    $authProvider.loginUrl = '/api/v1/login.json';
    $urlRouterProvider.otherwise('/login')

 //If a user is already logged in, the Login window if requested need not be displayed.
   function skipIfLoggedIn($q, $auth, $state) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {

        //deferred.reject();
        $state.go('home');

      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

   //Redirect unauthenticated users to the login state
   function loginRequired($q, $location, $auth, $state) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.href='/login';
      }
      return deferred.promise;
    }

$stateProvider.state('login', {
	 url: '/login',
    title: 'Sign In',
    resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        },
    views: {
          'login_page': {
          templateUrl: '/login/login.html',
          controller: 'LoginController'
    }
}

  }).state('ForgotPassword', {
	url: '/forgotpassword/:token',
  title: 'Forgotten Password',
    resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        },
        views: {
              'login_page': {
              templateUrl: '/forgot-password/forgotpassword.html',
              controller: 'LoginController'
        }
      }

  })
  .state('tables', {
      url: '/tables',
      views: {
        'inner_page': {
        templateUrl: 'tables.html'
      }
    }
  })
  .state('dashboard', {
      url: '/dashboard',
      views: {
        'inner_page': {
        templateUrl: '/dashboard/dashboard.html'
      }
    }
  })
  .state('display', {
      url: '/display',
      views: {
        'inner_page': {
        templateUrl: '/display/display.html',
        controller: 'CanvasCtrl'
      }
    }
  })
  .state('hello', {
      url: '/hello',
      views: {
        'inner_page': {
        templateUrl: '/hello-example/helloExample.html'

      }
      }

  })
/* New State Added Here called polygon */
/* State uses the controller function CanvasCtrl, this is where angularJs code lives */
.state('polygon', {
      url: '/polygonDraw',
      views: {
        'inner_page': {
        templateUrl: '/polygon-draw/polygon-draw.template.html',
        controller: 'CanvasCtrl'
      }
    }
  })
  .state('home', {
    url: '/',
    title: 'Home',
    resolve: {
          loginRequired: loginRequired
        },
        views: {
          'inner_page': {
          templateUrl: 'home.html'
        }
      }
  })

  ;

  })
  .directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      })
       }
  };
})
.directive('formatdate', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {

      //format text going to user (model to view)
      ngModel.$formatters.push(function(date) {
        return new Date(date);
      });

      //format text from the user (view to model)
     // ngModel.$parsers.push(function(value) {
      //  return value.toLowerCase();
     // });
    }
  }
}).controller('LogoutCtrl', function($auth, $state, $window, toaster, $scope) { // Logout the user if they are authenticated.

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

        $state.go('login');

      });
      }



})
.controller('CanvasCtrl', function($http, $scope) {

            // This is a listener on the canvas to fill the polygona
            $('#canvas').click(function(e){

              var pos = getMousePos(canvas, e);
              posx = pos.x;
              posy = pos.y;

              var i = 0;
              var k = 0;
              var length_1 = $scope.polygonPoints.length;
              var length_2 = 0;

              // Need to create an array structure to check each point
              $scope.JsonX = [];
              $scope.JsonY = [];

              // Iterate through first dimension of the JSON file
              for (i = 0; i < length_1; i++){

                length_2 = $scope.polygonPoints[i].length;

                // Iterate through the second dimension of the JSON file
                for(k = 0; k < length_2; k++){

                  // Set a temporary array to the entire polygon
                  $scope.JsonX[k] = $scope.polygonPoints[i][k].xPosition;
                  $scope.JsonY[k] = $scope.polygonPoints[i][k].yPosition;
                }


              // Compare if we clicked inside of the polygon for each polygon
              // (# of vertices, array of X positions, array of Y positions, test X position, test Y position)
              if (pnpoly(length_2,  $scope.JsonX, $scope.JsonY, posx, posy)){

                // Fill with Colour using different drawing method
                var j = 0;
                var c2 = document.getElementById('canvas').getContext('2d');

                // Custom Fill colour
                c2.fillStyle = $scope.colour_f;

                c2.beginPath();
                c2.moveTo($scope.JsonX[0], $scope.JsonY[0]);
                for (j = 1; j < length_2; j ++){
                  c2.lineTo($scope.JsonX[j], $scope.JsonY[j]);
                }
                c2.closePath();
                c2.fill();
                  }
                }
              })

              // Keyboard listern! Lets us change the colour of the fill
              window.onkeyup = function(e) {
                  var key = e.keyCode ? e.keyCode : e.which;

                      // Key '1'
                      if (key == 49) {
                          // Colour 'red'
                          $scope.colour_f = '#f00';
                      }
                      // Key '2'
                      else if (key == 50) {
                          // Colour 'Mahogony'
                          $scope.colour_f = '#400'
                      }
                      // Key '3'
                      else if (key == 51) {
                          // Colour 'Dark Yellow'
                          $scope.colour_f = '#C90'
                      }
                      // Key '4'
                      else if (key == 52) {
                        // Colour 'Orange'
                        $scope.colour_f = '#930'
                      }
  }

              // This function will get the mouse cursor relative to the canvas
              function  getMousePos(canvas, evt) {
                var rect = canvas.getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
                scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

                return {
                  x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
                  y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
                }
              }

              // This Function will check to see if you clicked inside of a polygon
              function pnpoly( nvert, vertx, verty, testx, testy ) {
                  var i, j, c = false;
                      for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
                            if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
                                ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                              c = !c;
                              }
                            }
                          return c;
                        }



            // Variables Predefined for the canvas drawing implementation
              var canvas = document.getElementById('canvas');
              var context = canvas.getContext('2d');

              // Empty data file which lives within the
              // Note: The use of $scope is the bridge between html and javascript
              $scope.data = [
              ];

              // Custom Function for Reading in a JSON file - Is called from polygon-draw.template.html
              // Navigation is from the index.html directory
              $scope.readJSON = function(){

                // The .get command assumes a JSON file type.
                // The .then determines how we handle the file that has been read
                //**************************BUG****************************************//
                  // We can only read in a file once. Then the same file is re-used

                $http.get('/polygon-draw/polygon6.json').then(function(response) {
                  // Storing the data in a multidimensional array that can be accessed
                  // By both the .html file and other functions within this 'scope'
                  $scope.polygonPoints = response.data;
                });
              }

              // Copied and Pasted Function from an example online
              // When the function leads with $scope, it is called using ng-submit in the .html document
              $scope.drawJSON = function(){

                var i = 0;
                var k = 0;
                var id = 0;

                var length_1 = $scope.polygonPoints.length;
                var length_2 =0;
                // Iterate through first dimension
                for (i = 0; i < length_1; i++){

                  // Reset the count for each Polygon to disconnect them
                  $scope.data.length = 0;
                  length_2 = $scope.polygonPoints[i].length;

                  // Iterate through the second dimension
                  for(k = 0; k < length_2; k++){

                    // Update the ID for connections
                    if($scope.data.length > 0) {
                        id = $scope.data[$scope.data.length-1].id + 1;
                    }

                    // Extract each point and Draw
                    var p = {id: id, x: $scope.polygonPoints[i][k].xPosition, y: $scope.polygonPoints[i][k].yPosition, amount: 5};
                    $scope.data.push(p);
                    draw($scope.data);
                  }
                }
              }


              // This function is called from the .html document
              // It was the starting point for automating a drawing tool for a triangle
              $scope.autoAdd = function(){

                  var id = 0;
                  if($scope.data.length > 0) {
                      id = $scope.data[$scope.data.length-1].id + 1;
                  }

                  // Variables that define for loop control and the coodinates to plot
                  var loopStart = 0;
                  var numPoints = 4;
                  var xPoints = [50, 75, 25, 50];
                  var yPoints = [50, 100, 100, 50];

                  // Simple For loop iterating through the data points
                  for (loopStart = 0; loopStart < numPoints; loopStart++) {

                      // Package the points to draw
                      var p = {id: id, x: xPoints[loopStart], y: yPoints[loopStart], amount: 5};
                      $scope.data.push(p);

                      // Call the draw function
                      draw($scope.data);
                    }
              }

              // This is the origional function to draw a single Dot
              $scope.addData = function() {

                  var id = 0;
                  if($scope.data.length > 0) {
                      id = $scope.data[$scope.data.length-1].id + 1;
                  }

                  // Packaging point to draw
                  var p = {id: id, x: 10, y: 50, amount: 5};
                  $scope.data.push(p);

                  // Cleans the .html interface
                  $scope.x = '';
                  $scope.y = '';
                  $scope.amount = '';

                  // Calls the draw function
                  draw($scope.data);
              };

              // This is the clickable remove function for the points (Have not explored)
              $scope.removePoint = function(point) {
                  console.log(point);
                  for(var i=0; i<$scope.data.length; i++) {
                      if($scope.data[i].id === point.id) {
                          console.log("removing item at position: "+i);
                          $scope.data.splice(i, 1);
                      }
                  }

                  context.clearRect(0,0,600,400);
                  draw($scope.data);
                  console.log($scope.data);
              }

              // Notice this Function call does not have a $scope attached
              // It cannot be directly called through the .html interface
              function draw(data) {
                  for(var i=0; i<data.length; i++) {
                      drawDot(data[i]);
                      if(i > 0) {
                          drawLine(data[i], data[i-1]);
                      }
                  }
              }

              // Draws a dot
              function drawDot(data) {
                  context.beginPath();
                  context.arc(data.x, data.y, data.amount, 0, 2*Math.PI, false);
                  context.fillStyle = "#ccddff";
                  context.fill();
                  context.lineWidth = 1;
                  context.strokeStyle = "#666666";
                  context.stroke();
              }

              // Draws a line
              function drawLine(data1, data2) {
                  context.beginPath();
                  context.moveTo(data1.x, data1.y);
                  context.lineTo(data2.x, data2.y);
                  context.strokeStyle = "black";
                  context.stroke();
              }



              function resize() {

                  var canvasRatio = canvas.height / canvas.width;
                  var windowRatio = window.innerHeight / window.innerWidth;
                  var width;
                  var height;

                  if (windowRatio < canvasRatio) {
                      height = window.innerHeight;
                      width = height / canvasRatio;
                  } else {
                      width = window.innerWidth;
                      height = width * canvasRatio;
                  }

                  canvas.style.width = width + 'px';
                  canvas.style.height = height + 'px';
              };
              //window.addEventListener('resize', resize, false);
              //resize();


                function onPhotoDataSuccess(imageData)
                {
                  var myImage = new Image();


                   myImage.onload = function() {
                     var draw_w = myImage.width * 0.4;
                     var draw_h = myImage.height * 0.4;

                     context.canvas.width  = draw_w;
                     context.canvas.height = draw_h;
                     context.drawImage(myImage, 0, 0, draw_w, draw_h);
                   }

                   myImage.src = "static/images/Pressure08.jpg";
                }

                onPhotoDataSuccess(null);


                context.globalAlpha = 1.0;
                context.beginPath();
                draw($scope.data);


});


angular.module('myApp.services', []);
angular.module('myApp.controllers', []);

angular.module('myApp').run(function(Analytics) {
            Analytics.pageView();
 });

/*
var app = angular.module( 'MyApp.scripts', ['ngRoute'] );
 var bootstrap_dir = require.resolve('bootstrap')
                            .match(/.*\/node_modules\/[^/]+\//)[0];
 app.use('/scripts', express.static(bootstrap_dir + 'dist/'));
*/
