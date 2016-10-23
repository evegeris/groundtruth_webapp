/*
var canvas_app = angular.module( 'RDash.display', ['react', 'ngReact'] );

canvas_app.controller( 'displayCtrl', function( $scope ) {
  $scope.canvas_ctrl = { imagefp: 'image fp here' };
} );

canvas_app.directive( 'display_dir', function( reactDirective ) {
  return reactDirective( ScaleCanvasToImage );
} );

// Justin's code starts here

/*

var ScaleCanvasToImage = React.createClass( {
  propTypes: {
    imagefp: React.PropTypes.string.isRequired
  },

render: function($canvas, childWidth, childHeight) {
  var parentWidth = $canvas.parent().width();
  var parentHeight = $canvas.parent().height();
  var imageAR = childWidth/childHeight;

  // Scale the parentHeight to the width
  var parentHeight = Math.round(parentWidth/imageAR);

  // Resize height based on window size
  if (parentHeight > (window.innerHeight - 50)) {
    parentHeight = window.innerHeight - 50;
  }
  $canvas.parent().css('height', parentHeight);

  var parentAR = parentWidth/parentHeight;

  var size = {
    height: parentHeight,
    width: parentWidth
  };

  var margins = {
    top: 0,
    left: 0
  };

  if (parentHeight > parentWidth) { // Portrait parent
    if (childHeight > childWidth) { // Portrait image
      if (parentAR <= imageAR) { // 9:16 screen with 3:4 image
        size.height = parentWidth/imageAR;
        margins.top = (parentHeight-size.height)/2;
      } else {
        size.width = parentHeight*imageAR;
        margins.left = (parentWidth-size.width)/2;
      }
    } else { // Landscape image
      size.height = parentWidth/imageAR;
      margins.top = (parentHeight-size.height)/2;
    }
  } else { // Landscape viewport
    if (childHeight > childWidth) { // Portrait image 3:4 or 9:16 in 16:9
      size.width = parentHeight*imageAR;
      margins.left = (parentWidth-size.width)/2;
    } else { // Landscape image
      if (parentAR > imageAR) { // 4:3 in 16:9
        size.width = parentHeight*imageAR;
        margins.left = (parentWidth-size.width)/2;
      } else {
        size.height = parentWidth/imageAR;
        margins.top = (parentHeight-size.height)/2;
      }
    }
  }

  $canvas.attr({
    width: Math.round(size.width),
    height: Math.round(size.height)
  });

  $canvas.css("margin-top", Math.round(margins.top) + "px");
  $canvas.css("margin-bottom", Math.round(margins.top) + "px");
  $canvas.css("margin-left", Math.round(margins.left) + "px");
  $canvas.css("margin-right", Math.round(margins.left) + "px");
};
window.ScaleCanvasToImage = ScaleCanvasToImage;



RDash.display.value( "ScaleCanvasToImage", ScaleCanvasToImage );
/**/
