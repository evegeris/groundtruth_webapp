var app = angular.module( 'RDash.display', ['ngRoute', 'react'] );

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/display', {
    templateUrl: 'templates/display.html',
    controller: 'DisplayCtrl'
  });
}]);

app.controller( 'DisplayCtrl', function( $scope ) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
} );

app.directive( 'display-canvas', function( reactDirective ) {
  return reactDirective( Hello );
} );

// ngReact

var ScaleCanvasToImage = React.createClass( {
  propTypes: {
    //fname: React.PropTypes.string.isRequired,
    //lname: React.PropTypes.string.isRequired
    imagefp: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.span( null,
      'Hello ' + this.props.fname + ' ' + this.props.lname
    );
  }
} );

app.value( "ScaleCanvasToImage", ScaleCanvasToImage );
