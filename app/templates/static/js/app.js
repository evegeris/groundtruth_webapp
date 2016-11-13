angular.module('myApp', ['ui.router', 'ngResource',  "angularGrid" , 'myApp.controllers', 'myApp.services', 'satellizer','toaster', 'ngAnimate', 'angular-google-analytics', 'ngIdle', 'ngImgCrop']);

angular.module('myApp')
  .run( function($rootScope, $state){
                //$rootScope.$on('$stateChangeStart'
                $rootScope.$state = $state;
                $rootScope.$state.current.title = "Flask-Scaffold";
                }
    );

angular.module('myApp').config(function( $stateProvider , $urlRouterProvider, $authProvider, AnalyticsProvider, IdleProvider, KeepaliveProvider) {

   // Google Analytics
    AnalyticsProvider.setAccount('UA-37519052-11');
    AnalyticsProvider.setDomainName('seven.leog.in');

    // configure Idle settings
    IdleProvider.idle(30*60); // in seconds
    IdleProvider.timeout(5); // in seconds
    KeepaliveProvider.interval(2); // in seconds

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
  })
  .state('timeout', {
  	 url: '/timeout',
      title: 'Session timed out!',
      resolve: {
            skipIfLoggedIn: skipIfLoggedIn
          },
      views: {
            'login_page': {
            templateUrl: 'timeout.html',
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
      title: 'Dashboard',
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
.state('polygon', {
      url: '/polygonDraw',
      title: 'Continue identification',
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
          templateUrl: 'dashboard.html'
        }
      }
  })

  // Routes for users
  .state('users', {
          // Note: abstract state cannot be loaded, but it still needs a ui-view for its children to populate.
          // https://github.com/angular-ui/ui-router/wiki/Nested-States-and-Nested-Views
          abstract: true,
          url: '/users',
          title: 'Users',
          template: '<ui-view/>'
      })
    .state('users.list', {
      url: '/list',
      title: 'Users',
      views: {
            'inner_page': {
            templateUrl: 'users/index.html',
            controller: 'UserListController'
          }
        },
      resolve: {
            loginRequired: loginRequired
        }
    })
    .state('users.new', {
      url: '/new',
      templateUrl: '/users/add.html',
      controller: 'UserCreateController',

      resolve: {
            loginRequired: loginRequired
          }

      }).state('users.edit', {
      url: '/:id/edit',
      templateUrl: 'users/update.html',
      controller: 'UserEditController',
      resolve: {
            loginRequired: loginRequired
          }

          })

      // End Routes for users


  // States

  ;

  })

  .service('user_info', function() {

      var credentials = {
            "data": {
              "type": "users",
              "attributes": {
                "email":"me@place",
                "password": "mypass",
                "first": "fname",
                "classified": "3.2"
                }
             }
          };

/*
      var user_infoService = {};

      user_infoService.updateEmail = function(item) {
          //items.push(item);
      };
      user_infoService.getEmail = function() {
        alert(credentials.data.attributes.email);
          return credentials.data.attributes.email;
      };

      return user_infoService;
*/

      this.setFirstName = function(first){
        credentials.data.attributes.first = first;
      };

      this.sayHello = function(){
        return "Hello " + credentials.data.attributes.first;
      };

      this.setClassified = function(classified){
        credentials.data.attributes.classified = classified;
      };

      this.getClassified = function(){
        return credentials.data.attributes.classified;
      };

      this.setInQueue = function(in_queue){
        credentials.data.attributes.in_queue = in_queue;
      };

      this.getInQueue = function(){
        return "queue" + credentials.data.attributes.in_queue;
      };
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
}).controller('LogoutCtrl', function($auth, $state, $window, toaster, $scope, Idle, user_info) { // Logout the user if they are authenticated.

  // check if authenticated
  $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.$on('$viewContentLoaded', function(){
        //user_info.setFirstName("ME");
        $scope.user_name = user_info.sayHello(); //user_info.getEmail;
        $scope.classified = user_info.getClassified();

      });

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


})
.controller('CanvasCtrl', function($http, $scope) {


  // variable Initialization
  // Current max superpixel count is 1000. Change statically
  $scope.isPainted = [1000];
  $scope.newValue = [1000];
  $scope.classification;
  var q;

  // Variable for the toggle feature
  var toggle = 0;

  // Initialzing the array to 0
  for (q = 0; q < 1000; q ++){
    $scope.isPainted[q] = 0;
    $scope.newValue[q] = 0;
  }


  // Default colour of red (1)
  $scope.colour_f = "rgba(32, 0, 0, 0.4)";
  $scope.classification = 1;

  // Maybe some uneeded variables
  $scope.mouseDown = 0;
  $scope.pointer;
  $scope.points;

  // Variables Predefined for the canvas drawing implementation
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var canvasMiddle = document.getElementById('canvasMiddle');
  var contextMiddle = canvas.getContext('2d');
  var canvasTop = document.getElementById('canvasTop');
  var contextTop = canvasTop.getContext('2d');

  // Empty data file which lives within the
  // Note: The use of $scope is the bridge between html and javascript
  $scope.data = [];

  //***************************************************************//
  // This listener enables 'click and drag' mode
  //***************************************************************//
  $(document).mousemove(function(e){

    // Getting the mouse position
    var pos = getMousePos(canvas, e);

    $scope.posx_1 = (Math.round(pos.x))/($scope.scaleImgX);
    $scope.posy_1 = (Math.round(pos.y))/($scope.scaleImgY);

    // When the user clicks, we want to colour in those spaces
    if ($scope.mouseDown == 1){
      $('#status').html($scope.posx_1 +', '+ $scope.posy_1);
      colourCanvas();
    }
  });


  //***************************************************************//
  // This function will colour the canvas in 'click and drag' mode
  // Near identicle to the 'static click' mode
  //***************************************************************//
  function colourCanvas(){

    var i = 0;
    var k = 0;
    $scope.length_2 = $scope.mask_data.length;
    $scope.length_1 = $scope.mask_data[0].length;

    // Getting the integer mask at the clicked location
    var mask_value = $scope.mask_data[$scope.posy_1][$scope.posx_1];

    // Only run if it will result in a new colour to be painted
    if (($scope.newValue[mask_value] != $scope.classification) && (toggle == 0)){

      // Disallow recolouring
      $scope.isPainted[mask_value] = 1;
      $scope.newValue[mask_value] = $scope.classification;

      // Keep track of event for undo feature
      $scope.undoPosition ++;
      $scope.undoQueue[$scope.undoPosition] = mask_value;

      // Check every pixel and colour accordingly
      for (i = 0; i < $scope.length_2; i ++){
        $scope.iter2 = i;

        for (k = 0; k < $scope.length_1; k++){
          $scope.iter1 = k;

          // If the pixel has the ascociated mask, we want to colour it in
          if (mask_value == $scope.mask_data[$scope.iter2][$scope.iter1]){

            // Only colour in the superpixel if it hasn't been coloured yet
            if ($scope.isPainted[mask_value] == 0){

              // Set the fill colour accordingly & colour a rectangle of 1 x 1 pixels
              contextTop.fillStyle = $scope.colour_f;
              contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
            }
            // We want to recolour these pixels
            else {
              contextTop.clearRect($scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
              contextTop.fillStyle = $scope.colour_f;
              contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
            }
        }
          // Do not colour in the pixel
          else {
          }
        }
      }
    }
  }


  //****************************************************************//
  // Overwrite a specific colour
  //***************************************************************//
  function overwriteColour(){

    var i = 0;
    var k = 0;
    var p = 0;

    // Check every superpixel to see if it has been assigned a colour
    for (p = 0; p < 1000; p ++){

        // This has been classified already! Recolour it
        if ($scope.isPainted[p] == 1){

          // Select the colour (classification) it was previously assigned
          // Key '1'
          if ($scope.newValue[p] == 1) {
              // Colour 'red'
              $scope.colour_f = "rgba(32, 0, 0, 0.4)";
          }
          // Key '2'
          else if ($scope.newValue[p] == 2) {
              // Colour 'Mahogony'
              $scope.colour_f = "rgba(0, 32, 0, 0.4)";
          }
          // Key '3'
          else if ($scope.newValue[p] == 3) {
              // Colour 'Dark Yellow'
              $scope.colour_f = "rgba(0, 0, 32, 0.4)";
          }
          // Key '4'
          else if ($scope.newValue[p] == 4) {
            // Colour 'Orange'
            $scope.colour_f = "rgba(32, 32, 0, 0.4)";
          }

          // Very similar to the standard colouring function
          var mask_value = p;
          $scope.length_2 = $scope.mask_data.length;
          $scope.length_1 = $scope.mask_data[0].length;

          // Iterate through every pixel and colour it in
          for (i = 0; i < $scope.length_2; i ++){
              $scope.iter2 = i;

            for (k = 0; k < $scope.length_1; k++){
              $scope.iter1 = k;

              // Colour in the single pixel the appropiate colour
              if (mask_value == $scope.mask_data[$scope.iter2][$scope.iter1]){
                contextTop.fillStyle = $scope.colour_f;
                contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
              }
              // Do nothing
              else {
              }
            }
          }
        }
    }
  }


  //***************************************************************//
  // This function will redraw the labeled superpixels
  //***************************************************************//
  function reColour(){

    var i = 0;
    var k = 0;
    var p = 0;

    // Check every superpixel to see if it has been assigned a colour
    for (p = 0; p < 1000; p ++){

        // This has been classified already! Recolour it
        if ($scope.isPainted[p] == 1){

          // Select the colour (classification) it was previously assigned
          // Key '1'
          if ($scope.newValue[p] == 1) {
              // Colour 'red'
              $scope.colour_f = "rgba(32, 0, 0, 0.4)";
          }
          // Key '2'
          else if ($scope.newValue[p] == 2) {
              // Colour 'Mahogony'
              $scope.colour_f = "rgba(0, 32, 0, 0.4)";
          }
          // Key '3'
          else if ($scope.newValue[p] == 3) {
              // Colour 'Dark Yellow'
              $scope.colour_f = "rgba(0, 0, 32, 0.4)";
          }
          // Key '4'
          else if ($scope.newValue[p] == 4) {
            // Colour 'Orange'
            $scope.colour_f = "rgba(32, 32, 0, 0.4)";
          }

          // Very similar to the standard colouring function
          var mask_value = p;
          $scope.length_2 = $scope.mask_data.length;
          $scope.length_1 = $scope.mask_data[0].length;

          // Iterate through every pixel and colour it in
          for (i = 0; i < $scope.length_2; i ++){
              $scope.iter2 = i;

            for (k = 0; k < $scope.length_1; k++){
              $scope.iter1 = k;

              // Colour in the single pixel the appropiate colour
              if (mask_value == $scope.mask_data[$scope.iter2][$scope.iter1]){
                contextTop.fillStyle = $scope.colour_f;
                contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
              }
              // Do nothing
              else {
              }
            }
          }
        }
    }
    contextMiddle.drawImage(myImageMiddle, 0, 0, $scope.draw_w, $scope.draw_h);
  }


    //***************************************************************//
    // This is a simple mouse down listener for dragging
    //***************************************************************//
    document.body.onmousedown = function(e) {
    $('#mouse_down').html(1);
    $scope.mouseDown = 1;
    }

    // This will detect if the mouse is released
    document.body.onmouseup = function() {
      $('#mouse_down').html(0);
      $scope.mouseDown = 0;
    }





    //***************************************************************//
    // This is a listener on the canvas to fill the superpixel
    //***************************************************************//
    $('#canvasTop').click(function(e){

      // Getting the mouse position
      var pos = getMousePos(canvas, e);
      $scope.posx = (Math.round(pos.x))/($scope.scaleImgX);
      $scope.posy = (Math.round(pos.y))/($scope.scaleImgY);

      var i = 0;
      var k = 0;

      $scope.length_2 = $scope.mask_data.length;
      $scope.length_1 = $scope.mask_data[0].length;

      // Getting the integer mask where the mouse was clicked
      var mask_value = $scope.mask_data[$scope.posy][$scope.posx];

      // Only run if it will result in a new colour to be painted
      if (($scope.newValue[mask_value] != $scope.classification) && (toggle == 0)){

        // Dissalow recolouring and label the superpixel
        $scope.isPainted[mask_value] = 1;
        $scope.newValue[mask_value] = $scope.classification;

        // Make a log for the undo feature
        $scope.undoPosition ++;
        $scope.undoQueue[$scope.undoPosition] = mask_value;

        // Iterate through every pixel
        for (i = 0; i < $scope.length_2; i ++){
            $scope.iter2 = i;

            for (k = 0; k < $scope.length_1; k++){
              $scope.iter1 = k;

              if (mask_value == $scope.mask_data[$scope.iter2][$scope.iter1]){

                // Only colour in the superpixel if it hasn't been assigned yet
                if ($scope.isPainted[mask_value] == 0){

                  // Colour in the single pixel
                  contextTop.fillStyle = $scope.colour_f;
                  contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );

                }
                // We want to recolour these pixels
                else{
                  contextTop.clearRect($scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
                  contextTop.fillStyle = $scope.colour_f;
                  contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
                }
              }
              // Do nothing
              else {
              }
            }
          }
        }
      })



    //***************************************************************//
    // Keyboard listeners
    //***************************************************************//
    var map = {};
    window.onkeydown = window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      e = e || event; // to deal with IE

      // Create a map to allow for multi key press options
      map[e.keyCode] = e.type == 'keydown';

      $('#key_code').html(e.keyCode);

      // Key '1'
      if (map[49] == true) {
        // Colour 'red' (1)
        $scope.colour_f = "rgba(32, 0, 0, 0.4)";
        $scope.classification = 1;
      }
      // Key '2'
      else if (map[50] == true) {
          // Colour 'Mahogony'
          $scope.colour_f = "rgba(0, 32, 0, 0.4)";
          $scope.classification = 2;
      }
      // Key '3'
      else if (map[51] == true) {
        // Colour 'Dark Yellow'
        $scope.colour_f = "rgba(0, 0, 32, 0.4)";
        $scope.classification = 3;
      }
      // Key '4'
      else if (map[52] == true) {
        // Colour 'Orange'
        $scope.colour_f = "rgba(32, 32, 0, 0.4)";
        $scope.classification = 4;
      }
      // Escape key to fix the mouse
      else if (map[27] == true){
        $scope.mouseDown = 0;
      }
      // Undo Feature (ctrl + z)
      if (map[90] && map[17] ){
        undoMethod();
      }
      // Undo Feature (ctrl + z)
      if (map[84] ){
        toggleOverlay();
      }
    }



    //***************************************************************//
    // This function allows for toggling of the overlay
    //***************************************************************//
    function toggleOverlay(){

      // Clear canvas
      if (toggle == 0){
        toggle = 1;
        contextTop.clearRect(0, 0, canvas.width, canvas.height);
        contextMiddle.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(myImageBack, 0, 0, $scope.draw_w, $scope.draw_h);
        $('#toggle_code').html("toggle on");

      }
      // rePaint the canvas
      else {
        toggle = 0;
        $('#toggle_code').html("toggle off");
        reColour();
      }
    }



  //***************************************************************//
  // This enables the undo feature
  //***************************************************************//
  $scope.undoQueue = [];
  $scope.undoPosition = 0;
  function undoMethod(){

    var toRemove = 0;
    var i = 0;
    var k = 0;

    // Only undo if there is something there to remove
    if (($scope.undoPosition > 0) && (toggle == 0)){

      // get the mask integer we want to remove
      toRemove = $scope.undoQueue[$scope.undoPosition];

      // Rewind the queue one position
      $scope.undoQueue[$scope.undoPosition] = 0;
      $scope.undoPosition --;

      // Clear the integer mask and set uncoloured flag
      $scope.isPainted[toRemove] = 0;
      $scope.newValue[toRemove] = 0;

      // Iterate through every pixel
      for (i = 0; i < $scope.length_2; i ++){
          $scope.iter2 = i;

          for (k = 0; k < $scope.length_1; k++){
            $scope.iter1 = k;

            if (toRemove == $scope.mask_data[$scope.iter2][$scope.iter1]){

              // We want to recolour these pixels

                contextTop.clearRect($scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
              }

            // Do nothing
            else {
            }
          }
        }
    }
  }



  //***************************************************************//
  // This function will get the mouse cursor relative to the canvas
  //***************************************************************//
  function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    $scope.globalX = evt.clientX;
    $scope.globalY = evt.clientY;

    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }


//***************************************************************//
// Weird variable function code found online for the mouse scrolling
//***************************************************************//
var doScroll = function (e) {


    // Only enable wheel scrolling if we are on the canvas
    if (($scope.posx_1 > 0) && ($scope.posy_1 > 0)){

      // Get the the event from the winow
      e = window.event || e;
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      // Prevent default scrolling behavoir
      e.preventDefault();

      // Scroll up
      if (delta == 1){
        scaleUp();
        zoomMove(delta);
      }

      // Scroll down
      if (delta == -1){
        scaleDown();
        zoomMove(delta);
      }
    }

    // Normal Scrolling
    else {
    }
};


//***************************************************************//
// Moves the window when you scroll zoom with the mouse wheel
//***************************************************************//
function zoomMove(delta) {

  // Pan right
    //var pos = getMousePos(canvas, e);
    // "html, body" == previous setting
    // "canvasWrapper" == zoom confined to canvas but no longer follows mouse
    var scrollUp = $("canvasWrapper").scrollTop();
    var scrollLeft = $("canvasWrapper").scrollLeft();

    $('#global').html($scope.globalX +', '+ $scope.globalY);
    $('#overall_dim').html(window.innerHeight +', '+ window.innerWidth);

/*
    // "html, body"
    A = window.innerHeight/2;
    B = window.innerHeight*0.1;
    C = window.innerWidth/2;
    D = window.innerWidth*0.1;
*/

    A = canvas.style.height/2;
    B = canvas.style.height*0.1;
    C = canvas.style.width/2;
    D = canvas.style.width*0.1;

    // Middle point of window hieght plus a 20% threshold
  if ($scope.globalY > (A + B)){
    $("canvasWrapper").scrollTop(scrollUp + 10);

  }
  // Middle point of window height minus a 20% threshold
  else if ($scope.globalY < (A - B)){
    $("canvasWrapper").scrollTop(scrollUp - 10);
  }

  // Middle point of window width plus a 20% threshold
if ($scope.globalX > (C + D)){
  $("canvasWrapper").scrollLeft(scrollLeft + 10);

}
// Middle point of window width minus a 20% threshold
else if ($scope.globalX < (C - D)){
  $("canvasWrapper").scrollLeft(scrollLeft - 10);
}
}

//***************************************************************//
// Listeners for the mouse wheel
//***************************************************************//
if (window.addEventListener) {
    window.addEventListener("mousewheel", doScroll, false);
    window.addEventListener("DOMMouseScroll", doScroll, false);
}


//***************************************************************//
// Listener for the middle mouse click
//***************************************************************//
$(document).mousedown(function(e){

    var oldX = 0;
    var oldY = 0;
    // We middle clicked on the canvas, enabled drag feature
    if ((e.which == 2) && ($scope.posx_1 > 0) && ($scope.posy_1 > 0)){

    }
    return true;// to allow the browser to know that we handled it.
});






  //***************************************************************//
  // Lets you scale the image smaller
//***************************************************************//
  scaleDown = function(){
    $scope.ResizeValue = $scope.ResizeValue + 10;
    resize($scope.ResizeValue);
  }

  //***************************************************************//
  // Lets you scale the image bigger
  //***************************************************************//
  scaleUp = function(){
    $scope.ResizeValue = $scope.ResizeValue - 10;
    resize($scope.ResizeValue);
  }

  //***************************************************************//
  // Reset user progress for the canvas
  //***************************************************************//
  $scope.clearCanvas = function(){

    // Initialzing the array to 0
    for (q = 0; q < 1000; q ++){
      $scope.isPainted[q] = 0;
      $scope.newValue[q] = 0;
      $scope.undoPosition = 0;
    }
    contextTop.clearRect(0, 0, canvas.width, canvas.height);
    reColour();
  }




  //***************************************************************//
  // Custom Function for Reading in a JSON file - Is called from polygon-draw.template.html
  // Navigation is from the index.html directory
  //***************************************************************//
  $scope.readJSON = function(){

    // The .get command assumes a JSON file type.
    // The .then determines how we handle the file that has been read
    //******************************************************************//
    // We can only read in a file once. Then the same file is re-used

    $http.get('/polygon-draw/segmentedImg.json').then(function(response) {
      // Storing the data in a multidimensional array that can be accessed
      // By both the .html file and other functions within this 'scope'
      $scope.mask_data = response.data;
      $scope.the_string = "Done!";
    });
  }

$scope.restartClassification = function(){

  var answer = confirm("You can restart, but all of your progress will be lost for this image!\nProceed?")
  if (answer){
         //some code
  }
  else{
          //some code
  }

}

//***************************************************************//
// resize both top and bottom canvas
//***************************************************************//
function resize(value) {

  var canvasRatio = canvas.height / canvas.width;
  var windowRatio = window.innerHeight / window.innerWidth;
  var width = canvas.width;
  var height = canvas.height;

  /*
  if (windowRatio < canvasRatio) {
      height = window.innerHeight;
      width = height / canvasRatio;
  } else {
      width = window.innerWidth;
      height = width * canvasRatio;
  }
  */

    canvas.style.width = width - value + 'px';
    canvas.style.height = height - value + ('px'*canvasRatio);
    canvasMiddle.style.width = width - value + 'px';
    canvasMiddle.style.height = height - value + ('px'*canvasRatio);
    canvasTop.style.width = width - value + 'px';
    canvasTop.style.height = height - value + ('px'*canvasRatio);
  };


var myImageMiddle = new Image();
myImageMiddle.src = "static/images/segmentedImg.jpg";
var myImageBack = new Image();
myImageBack.src = "static/images/wound_2_origin.jpg";


  //***************************************************************//
  // Loads in the correct background image
  //***************************************************************//
  function onPhotoDataSuccess(imageData){


    $scope.scaleImgX = 1;
    $scope.scaleImgY = 1;
    $scope.ResizeValue = 0;

      myImageMiddle.onload = function() {
      $scope.draw_w = myImageMiddle.width * $scope.scaleImgX;
      $scope.draw_h = myImageMiddle.height * $scope.scaleImgY;

      /*
      context.canvas.width  = window.innerWidth*0.9;
      context.canvas.height = window.innerHeight*0.9;
      contextMiddle.canvas.width  = window.innerWidth*0.9;
      contextMiddle.canvas.height = window.innerHeight*0.9;
      contextTop.canvas.width  = window.innerWidth*0.9;
      contextTop.canvas.height = window.innerHeight*0.9;

      */
      context.canvas.width  = $scope.draw_w;
      context.canvas.height = $scope.draw_h;
      contextMiddle.canvas.width  = $scope.draw_w;
      contextMiddle.canvas.height = $scope.draw_h;
      contextTop.canvas.width  = $scope.draw_w;
      contextTop.canvas.height = $scope.draw_h;

       contextMiddle.drawImage(myImageMiddle, 0, 0, $scope.draw_w, $scope.draw_h);

       //onPhotoDataSuccess2();
       }


  }
      // Function call to load the image
      onPhotoDataSuccess(null);

      context.globalAlpha = 1.0;
      contextMiddle.globalAlpha = 1.0
      contextTop.globalAlpha = 1.0;
      context.beginPath();
      contextMiddle.beginPath();
      contextTop.beginPath();

})
.run(function(Idle){
    // start watching for timeout when the app runs. also starts the Keepalive service by default.
    Idle.watch();
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
