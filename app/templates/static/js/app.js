angular.module('myApp', ['ui.router', 'ngResource',  "angularGrid" , 'myApp.controllers', 'myApp.services', 'satellizer','toaster', 'ngAnimate', 'angular-google-analytics', 'ngIdle', 'ngImgCrop', 'LocalStorageModule']);

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
        templateUrl: 'dashboard.html',
        controller: 'DashboardCtrl'
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

  /* New State Added Here called polygon */
  .state('crop_image', {
        url: '/cropImage',
        title: 'Crop Image',
        views: {
          'inner_page': {
          templateUrl: '/crop-image/crop-image.template.html',
          controller: 'CropCtrl'
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
          templateUrl: 'dashboard.html',
          controller: 'DashboardCtrl'
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
