angular.module('myApp').controller('CanvasCtrl', function($http, $scope, user_info) {


if (window.location.href.indexOf("?") > -1){

}
else {
  window.location = window.location + '?loaded';
  window.location.reload(true);
}

  // variable Initialization

  var myImageMiddle = new Image();
  var myImageBack = new Image();

  $scope.user_info = user_info;
  $scope.image_info = user_info.user_info_object.data.attributes.image_info;
  $scope.current_img_idx = user_info.user_info_object.data.attributes.current_img;

  // Current max superpixel count is 1000. Change statically
  $scope.isPainted = [1000];
  $scope.newValue = [1000];
  $scope.classification;
  $scope.healthyCount = 0;
  $scope.scarCount = 0;
  $scope.infCount = 0;
  $scope.necroticCount = 0;
  $scope.backgroundCount = 0;
  $scope.badDataCount = 0;

  $scope.anyUnasigned = 0;
  var q;

  // Variable for the toggle feature
  var toggle = 0;
  var currentColour;

  // Initialzing the array to 0
  for (q = 0; q < 1000; q ++){
    $scope.isPainted[q] = 0;
    $scope.newValue[q] = 0;
  }


  // Default colour of red (1)
  $scope.colour_f = "rgba(255, 102, 0, 0.4)";
  $scope.classification = 1;

  // Maybe some uneeded variablesgetElement
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
  $scope.data = [];304

  //***************************************************************//
  // This listener enables 'click and drag' mode
  //***************************************************************//
  $(document).mousemove(function(e){

    // Getting the mouse position
    var pos = getMousePos(canvas, e);
    var container = $('#customContainer');
    var contWidth = container.width();
    var contHeight = container.height();



    $scope.posx_1 = (Math.round(pos.x))/($scope.scaleImgX);
    $scope.posy_1 = (Math.round(pos.y))/($scope.scaleImgY);

    // When the user clicks, we want to colour in those spaces

    // Only enable clicking when we are within the container
    if (($scope.containerX > 0) && ($scope.containerY > 0) && (($scope.containerX < contWidth)) && ($scope.containerY < contHeight)){

    // If its a left click, we want to colour the canavs
    if ($scope.mouseDown == 1){
      //$('#status').html($scope.posx_1 +', '+ $scope.posy_1);

      colourCanvas();
    }
    // Mouse wheel click implements the dragging feature
    else if ($scope.mouseDown == 2){

      // Check to see where we are moving on the screen
      if ($scope.containerX > ($scope.oldx)){

        // Algorithm to shift the canavs within the container
        $scope.leftShift = $scope.leftShift + 3;
        canvas.style.left = $scope.leftShift + 'px';
        canvasMiddle.style.left = $scope.leftShift + 'px';
        canvasTop.style.left = $scope.leftShift + 'px';
        $scope.oldx = $scope.containerX;

      }
      else if ($scope.containerX < ($scope.oldx)){
        $scope.leftShift = $scope.leftShift - 3;
        canvas.style.left = $scope.leftShift + 'px';
        canvasMiddle.style.left = $scope.leftShift + 'px';
        canvasTop.style.left = $scope.leftShift + 'px';
        $scope.oldx = $scope.containerX;
      }

      if ($scope.containerY > ($scope.oldy)){
        $scope.topShift = $scope.topShift + 3;
        canvas.style.top = $scope.topShift + 'px';
        canvasMiddle.style.top = $scope.topShift + 'px';
        canvasTop.style.top = $scope.topShift + 'px';
        $scope.oldy = $scope.containerY;
      }

      else if ($scope.containerY < ($scope.oldy)){
        $scope.topShift = $scope.topShift - 3;
        canvas.style.top = $scope.topShift + 'px';
        canvasMiddle.style.top = $scope.topShift + 'px';
        canvasTop.style.top = $scope.topShift + 'px';
        $scope.oldy = $scope.containerY;
      }
    }
  }
  // Update the mouse location
  $scope.oldx = $scope.containerX;
  $scope.oldy = $scope.containerY;

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
              // Colour 'orange'
              $scope.colour_f = "rgba(255, 102, 0, 0.4)";
          }
          // Key '2'
          else if ($scope.newValue[p] == 2) {
              // Colour 'Green'
              $scope.colour_f = "rgba(0, 32, 0, 0.6)";

          }
          // Key '3'
          else if ($scope.newValue[p] == 3) {
              // Colour 'Pink'
              //$scope.colour_f = "rgba(128, 128, 255, 0.4)";
              $scope.colour_f = "rgba(255, 51, 54, 0.4)";
          }
          // Key '4'
          else if ($scope.newValue[p] == 4) {
            // Colour 'Yellow'
            $scope.colour_f = "rgba(255, 255, 0, 0.4)";
          }
          // Key '5'
          else if ($scope.newValue[p] == 5) {
            // Colour 'Blue'
            $scope.colour_f = "rgba(128, 128, 255, 0.4)";
          }
          // Key '4'
          else if ($scope.newValue[p] == 6) {
            // Colour 'Grey'
            $scope.colour_f = "rgba(46, 46, 31, 0.7)";
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

  var foo = function(){

  };


  //***************************************************************//
  // This function will redraw the labeled superpixels
  //***************************************************************//
  function reColour(){

    // Save the current colour value
    currentColour = $scope.colour_f;

    var i = 0;
    var k = 0;
    var p = 0;
    var pMax = 0;

    $scope.healthyCount = 0;
    $scope.scarCount = 0;
    $scope.infCount = 0;
    $scope.necroticCount = 0;
    $scope.backgroundCount = 0;
    $scope.badDataCount = 0;

    // Finding maximum integer mask value
    $scope.length_2 = $scope.mask_data.length;
    $scope.length_1 = $scope.mask_data[0].length;

    for (i = 0; i < $scope.length_2; i ++){
        $scope.iter2 = i;

      for (k = 0; k < $scope.length_1; k++){
        $scope.iter1 = k;

        // Finding the maximum integer mask value
        if (pMax < $scope.mask_data[$scope.iter2][$scope.iter1]){

          pMax = $scope.mask_data[$scope.iter2][$scope.iter1];

        }

        else {
        }
      }
    }



    // Check every superpixel to see if it has been assigned a colour
    for (p = 0; p <= pMax; p ++){

      // Periodic timeout every 50 superpixels to prevent page from freezing
      if (p % 25 == 0){
        setTimeout(foo, 0);
     }

        // This has been classified already! Recolour it
        if ($scope.isPainted[p] == 1){

          // Select the colour (classification) it was previously assigned
          // Key '1'
          if ($scope.newValue[p] == 1) {
              // Colour 'orange'
              $scope.healthyCount ++;
              $scope.colour_f = "rgba(255, 102, 0, 0.4)";
          }
          // Key '2'
          else if ($scope.newValue[p] == 2) {
              // Colour 'Green'
              $scope.scarCount ++;
              $scope.colour_f = "rgba(0, 32, 0, 0.6)";
          }
          // Key '3'
          else if ($scope.newValue[p] == 3) {
              // Colour 'Pink'
              $scope.infCount ++;
              $scope.colour_f = "rgba(255, 51, 54, 0.4)";
          }
          // Key '4'
          else if ($scope.newValue[p] == 4) {
            // Colour 'Yellow'
            $scope.necroticCount ++;
            $scope.colour_f = "rgba(255, 255, 0, 0.4)";
          }
          // Key '5'
          else if ($scope.newValue[p] == 5) {
            // Colour 'Blue'
            $scope.backgroundCount ++;
            $scope.colour_f = "rgba(128, 128, 255, 0.4)";
          }
          // Key '4'
          else if ($scope.newValue[p] == 6) {
            // Colour 'Grey'
            $scope.badDataCount ++;
            $scope.colour_f = "rgba(46, 46, 31, 0.7)";
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

        // This pixel has not been , check to see if we want to overwrite it!
        else {

          // Only fill in remaing superpixels if told from save button
          if ($scope.anyUnasigned == 1 ){

            // Colour all remaining superpixels as badData cells
            $scope.badDataCount ++;
            $scope.colour_f = "rgba(46, 46, 31, 0.7)";

            // Very similar to the standard colouring function

            var mask_value = p;

            // Disallow recolouring
            $scope.isPainted[mask_value] = 1;
            $scope.newValue[mask_value] = 6;

            // Keep track of event for undo feature
            $scope.undoPosition ++;
            $scope.undoQueue[$scope.undoPosition] = mask_value;

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
    contextMiddle.drawImage(myImageMiddle, 0, 0, $scope.draw_w, $scope.draw_h);

    // Disable the autocolour funcitonality and reassign the colour
    $scope.anyUnasigned = 0;
    $scope.colour_f = currentColour;

  }


    //***************************************************************//
    // This is a simple mouse down listener for dragging
    //***************************************************************//
    document.body.onmousedown = function(e) {

    // Regular left click
    if  (e.which == 1){
    $('#mouse_down').html(1);
    $scope.mouseDown = 1;
    }

    //drag screen feature
    else if (e.which == 2){
      $('#mouse_down').html(2);
      $scope.mouseDown = 2;
    }
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
        // Colour 'Orange' (1)
        $scope.colour_f = "rgba(255, 102, 0, 0.4)";
        $scope.classification = 1;
        $('hchosen').css({'background-color':'#ff944d'})
        $('#tissue').html('1 - Healthy');
      }
      // Key '2'
      else if (map[50] == true) {
          // Colour 'Green'
          $scope.colour_f = "rgba(0, 32, 0, 0.6)";
          $scope.classification = 2;
          $('hchosen').css({'background-color':'#E5FFE5'})
          $('#tissue').html('2 - Scar');
      }
      // Key '3'
      else if (map[51] == true) {
        // Colour 'Pink'
        $scope.colour_f = "rgba(255, 51, 54, 0.4)";
        $scope.classification = 3;
        $('hchosen').css({'background-color':'#FF99B1'})
        $('#tissue').html('3 - Inflammatory');
      }
      // Key '4'
      else if (map[52] == true) {
        // Colour 'Yellow'
        $scope.colour_f = "rgba(255, 255, 0, 0.4)";
        $scope.classification = 4;
        $('hchosen').css({'background-color':'#FFFFAD'})
        $('#tissue').html('4 - Necrotic');
      }
      else if (map[53] == true) {
        // Colour 'Blue'
        $scope.colour_f = "rgba(128, 128, 255, 0.4)";
        $scope.classification = 5;
        $('hchosen').css({'background-color':'#8080ff'})
        $('#tissue').html('5 - Background');
      }
      else if (map[54] == true) {
        // Colour 'Grey'
        $scope.colour_f = "rgba(46, 46, 31, 0.7)";
        $scope.classification = 6;
        $('hchosen').css({'background-color':'#a6a6a6'})
        $('#tissue').html('6 - Bad Data');
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

    // set image identification
    /*
    function setImgID(){
      $('img_id').css({'background-color':'#FFE5E5'});
    }
    setImgID();
    */

    //***************************************************************//
    // This function allows for toggling of the overlay
    //***************************************************************//
    function toggleOverlay(){

      // Clear canvas
      if (toggle == 0){
        toggle = 1;

        context.drawImage(myImageBack, 0, 0, $scope.draw_w, $scope.draw_h);

        // Rearrange the layers
        document.getElementById("canvasTop").style.zIndex = "1";
        document.getElementById("canvas").style.zIndex = "3";

        $('#toggle_code').html("toggle on");

      }
      // rePaint the canvas
      else {
        toggle = 0;
        $('#toggle_code').html("toggle off");

        contextMiddle.drawImage(myImageMiddle, 0, 0, $scope.draw_w, $scope.draw_h);

        // Rearrange the layers
        document.getElementById("canvasTop").style.zIndex = "3";
        document.getElementById("canvas").style.zIndex = "1";

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

    var container = document.getElementById('customContainer');
    //var contWidth = container.width();
    //var contHeight = container.height();
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    // Global mouse coordinates
    $scope.globalX = evt.clientX;
    $scope.globalY = evt.clientY;

    // Determine the mouse position relative to the container
    var rect2 = container.getBoundingClientRect();
    $scope.containerX = (evt.clientX - rect2.left);
    $scope.containerY = (evt.clientY - rect2.top);


    $('#cont_xy').html($scope.containerX+ ", "+ $scope.containerY);

    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }


//***************************************************************//
// Weird variable function code found online for the mouse scrolling
//***************************************************************//
var doScroll = function (e) {

  var container = $('#customContainer');
  var contWidth = container.width();
  var contHeight = container.height();

  e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));



    // Only enable wheel scrolling if we are within the container
    if (($scope.containerX > 0) && ($scope.containerY > 0) && (($scope.containerX < contWidth)) && ($scope.containerY < contHeight)){

      // Stop the coanvas from shrinking smaller than the container
      if(((parseInt(canvas.style.width) < contWidth) && (parseInt(canvas.style.height) < contHeight)) && (delta == -1)){
        e.preventDefault();
      }

      // Zoom in or Zoom out
      else {

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
    }

    // Normal Scrolling
    else {
    }
};


//***************************************************************//
// Moves the window when you scroll zoom with the mouse wheel
//***************************************************************//

$scope.topShift = 0;
$scope.leftShift = 0;
function zoomMove(delta) {

  var container = $('#customContainer');
  var contWidth = container.width();
  var contHeight = container.height();


    $('#global').html($scope.globalX +', '+ $scope.globalY);
    $('#overall_dim').html(window.innerHeight +', '+ window.innerWidth);



    // Middle point of window hieght plus a small threshold
  if ($scope.containerY > (contHeight/2) + 100){

    $scope.topShift = $scope.topShift - 15;
    canvas.style.top = $scope.topShift + 'px';
    canvasMiddle.style.top = $scope.topShift + 'px';
    canvasTop.style.top = $scope.topShift + 'px';


  }

  // Middle point of window height minus a small threshold
  else if ($scope.containerY < (contHeight/2) - 100){

    $scope.topShift = $scope.topShift + 10;
    canvas.style.top = $scope.topShift + 'px';
    canvasMiddle.style.top = $scope.topShift + 'px';
    canvasTop.style.top = $scope.topShift + 'px';
  }

  // Middle point of window width plus a small threshold
if ($scope.containerX > (contWidth/2 + 100)){

  $scope.leftShift = $scope.leftShift - 15;
  canvas.style.left = $scope.leftShift + 'px';
  canvasMiddle.style.left = $scope.leftShift + 'px';
  canvasTop.style.left = $scope.leftShift + 'px';


}
// Middle point of window width minus a small threshold
else if ($scope.containerX < (contWidth/2 - 100)){

  $scope.leftShift = $scope.leftShift + 10;
  canvas.style.left = $scope.leftShift + 'px';
  canvasMiddle.style.left = $scope.leftShift + 'px';
  canvasTop.style.left = $scope.leftShift + 'px';

}

// Roughly center of the screen zooming
else {

  $scope.leftShift = $scope.leftShift - 5*delta;
  $scope.topShift = $scope.topShift - 5*delta;
  canvas.style.left = $scope.leftShift + 'px';
  canvasMiddle.style.left = $scope.leftShift + 'px';
  canvasTop.style.left = $scope.leftShift + 'px';
  canvas.style.top = $scope.topShift + 'px';
  canvasMiddle.style.top = $scope.topShift + 'px';
  canvasTop.style.top = $scope.topShift + 'px';
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
  // Lets you scale the image smaller
//***************************************************************//
  scaleDown = function(){
    $scope.ResizeValue = $scope.ResizeValue + 20;
    resize($scope.ResizeValue);
  }

  //***************************************************************//
  // Lets you scale the image bigger
  //***************************************************************//
  scaleUp = function(){
    $scope.ResizeValue = $scope.ResizeValue - 20;
    resize($scope.ResizeValue);
  }

  //***************************************************************//
  // Reset user progress for the canvas
  //***************************************************************//
  $scope.clearCanvas = function(){

    // Initialzing the array to 0

    var answer = confirm("Are you sure that you would like to clear the canvas?")
    if (answer){
      for (q = 0; q < 1000; q ++){
        $scope.isPainted[q] = 0;
        $scope.newValue[q] = 0;
        $scope.undoPosition = 0;
      }
      contextTop.clearRect(0, 0, canvas.width, canvas.height);
      reColour();


    }
    else{
            //some code
    }

  }


  //***************************************************************//
  // Create a Dictionary ready to be sent to the server
  //***************************************************************//
  $scope.saveWork = function(){

    // Ask if the user wants to set unclassified pixels to Bad Data
    var answer = confirm("Set any remaing cells to 'Bad Data' classification?")
    if (answer){
      // Recolour any unselected to badData
      $scope.anyUnasigned = 1;

    }
    else{
      // Ignore unselected (save work for future progress)
      $scope.anyUnasigned = 0;
    }

    // Need to get most recent work from the user
    contextTop.clearRect(0, 0, canvas.width, canvas.height);
    reColour();

    var p = 0;
    var i = 0;
    var dictionary = new Array(7);

    // First array value is reserved for specifying the chosen cropped image
    dictionary[0] = 0;

    // Creating the perfect sized arrays
    dictionary[1] = new Array($scope.healthyCount);
    dictionary[2] = new Array($scope.scarCount);
    dictionary[3] = new Array($scope.infCount);
    dictionary[4] = new Array($scope.necroticCount);
    dictionary[5] = new Array($scope.backgroundCount);
    dictionary[6] = new Array($scope.badDataCount);


    var healthyPosition = 0;
    var scarPosition = 0;
    var infPosition = 0;
    var necroticPosition = 0;
    var backgroundPosition = 0;
    var badDataPosition = 0;


    // Check every superpixel to see if it has been assigned a colour
    for (p = 0; p < 1000; p ++){

        // This has been classified, need to add it to the dictionary
        if ($scope.isPainted[p] == 1){

          // Key '1' healthy
          if ($scope.newValue[p] == 1) {

              dictionary[1][healthyPosition] = p;
              healthyPosition ++;

          }
          // Key '2' Scar
          else if ($scope.newValue[p] == 2) {

              dictionary[2][scarPosition] = p;
              scarPosition ++;
          }
          // Key '3' Infalmatory
          else if ($scope.newValue[p] == 3) {

              dictionary[3][infPosition] = p;
              infPosition ++;
          }
          // Key '4' Necrotic
          else if ($scope.newValue[p] == 4) {

            dictionary[4][necroticPosition] = p;
            necroticPosition ++;
          }
          // Key '5' Background
          else if ($scope.newValue[p] == 5) {

            dictionary[5][backgroundPosition] = p;
            backgroundPosition ++;
          }
          // Key '6' Bad Data
          else if ($scope.newValue[p] == 6) {

            dictionary[6][badDataPosition] = p;
            badDataPosition ++;
          }
        }
    }

    // Next we need to convert the dictionary to a JSON file
    var data1 = JSON.stringify(dictionary);

    //var data = "{name: 'Bob', occupation: 'Plumber'}";
    //var a = document.createElement('a');
    //a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(data));
    //a.setAttribute('download', testOutput.json);
    //a.click()

    // Website display to show what the data looks like
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data1);
    window.open(url, '_blank');
    window.focus()

  }


  //***************************************************************//
  // Custom Function for Reading in a JSON file - Is called from polygon-draw.template.html
  // Navigation is from the index.html directory
  //***************************************************************//
  $scope.readJSON = function(){
    //delete $http.defaults.headers.common['X-Requested-With'];

    //httpGetAsync('/polygon-draw/segmentedImg.json', callBack);
    //disable IE ajax request caching
   //$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
   // extra
   //$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
   //$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    // The .get command assumes a JSON file type.
    // The .then determines how we handle the file that has been read
    //******************************************************************//
    // We can only read in a file once. Then the same file is re-used
    try{

    //  $http.get('/polygon-draw/segmentedImg.json').then(function(response) {
    $http.get('/polygon-draw/test_image_swift_segment_n566_s14.json').then(function(response) {
      // Storing the data in a multidimensional array that can be accessed
      // By both the .html file and other functions within this 'scope'
      //alert(typeof response.data);
      $scope.mask_data = response.data;

    });


  }
  catch(err){
    alert("error");
  }

  }


    //***************************************************************//
    // Custom Function for Reading in the original img
    //***************************************************************//

    function readBackImage(index){

      alert($scope.image_info[index].fullsize_orig_filepath);
      var filepath = $scope.image_info[index].fullsize_orig_filepath;

      $http.get('dyn_img/' + filepath).then(function(response) {
        myImageBack.src = "data:image/png;base64," + response.data;
      });


    }


    //***************************************************************//
    // Custom Function for Reading in the original img
    //***************************************************************//
    function readMiddleImage(index){

      //alert($scope.image_info[index].fullsize_orig_filepath);
      var filepath = $scope.image_info[index].fullsize_orig_filepath;
      var full_filepath = 'dyn_img/' + filepath;
      alert(full_filepath);

      $http.get(full_filepath).then(function(response) {
        alert("yeah hi");
        myImageMiddle.src = "data:image/png;base64," + response.data;

        //var tstimg = document.getElementById('test_img');
        //tstimg.src = "data:image/png;base64," + response.data;
      });
      //alert("bye");

    }

  //***************************************************************//
  // restart the entire process
  //***************************************************************//

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

  var container = $('#customContainer');
  var contWidth = container.width();
  var contHeight = container.height();


  // cleaned up resize uses the container width and height for reference
    canvas.style.width = contWidth - value + 'px';
    canvas.style.height = (contHeight - value/$scope.contRatio) + 'px';
    canvasMiddle.style.width = contWidth - value + 'px';
    canvasMiddle.style.height = (contHeight - value/$scope.contRatio) + 'px';
    canvasTop.style.width = contWidth - value + 'px';
    canvasTop.style.height = (contHeight - value/$scope.contRatio) + 'px';

    $('#cv').html(parseInt(canvas.style.width)+ ', '+ parseInt(canvas.style.height));

  };


//readBackImage($scope.current_img_idx);
//readMiddleImage($scope.current_img_idx);

//myImageBack.src = "static/images/wound_2_origin.jpg";
//myImageMiddle.src = "static/images/segmentedImg.jpg";

myImageBack.src = "static/images/test_image_swift.jpg";
myImageMiddle.src = "static/images/test_image_swift_segment_n566_s14.jpg";


  //***************************************************************//
  // Loads in the correct background image
  //***************************************************************//
  function onPhotoDataSuccess(imageData){


    $scope.scaleImgX = 1;
    $scope.scaleImgY = 1;
    $scope.ResizeValue = 0;

    var container = $('#customContainer');
    $('#customContainer').css({'width':'800','height':'580'})
    var contWidth = container.width();
    var contHeight = container.height();
    $scope.contRatio = contWidth/contHeight;
    $('#ratio').html($scope.contRatio);

    $('#cont').html(contWidth+ ', '+contHeight);

      myImageMiddle.onload = function() {

        //$scope.scaleImgX = contWidth/myImageMiddle.width;
        //$scope.scaleImgY = contHeight/myImageMiddle.height;

      $scope.draw_w = myImageMiddle.width * $scope.scaleImgX;
      $scope.draw_h = myImageMiddle.height * $scope.scaleImgY;


      context.canvas.width  = $scope.draw_w;
      context.canvas.height = $scope.draw_h;
      contextMiddle.canvas.width  = $scope.draw_w;
      contextMiddle.canvas.height = $scope.draw_h;
      contextTop.canvas.width  = $scope.draw_w;
      contextTop.canvas.height = $scope.draw_h;

       contextMiddle.drawImage(myImageMiddle, 0, 0, $scope.draw_w, $scope.draw_h);
       $scope.readJSON();

       resize(0);
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

});
