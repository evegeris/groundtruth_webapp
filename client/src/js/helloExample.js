var app = angular.module( 'RDash.display', ['ngRoute', 'react'] );

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/display', {
    templateUrl: '../client/display.html',
    controller: 'DisplayCtrl'
  });
}]);

app.controller( 'DisplayCtrl', function( $scope ) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
} );

app.directive( 'hello', function( reactDirective ) {
  return reactDirective( Hello );
} );

// ngReact

var HelloWorld = React.createClass( {
  propTypes: {
    fname: React.PropTypes.string.isRequired,
    lname: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.span( null,
      'Hello ' + this.props.fname + ' ' + this.props.lname
    );
  }
} );

app.value( "HelloWorld", HelloWorld );
