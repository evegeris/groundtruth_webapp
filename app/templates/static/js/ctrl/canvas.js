angular.module('myApp').controller('CanvasCtrl', function($http, $state, $scope, user_info, localStorageService) {

$scope.showLoadingWidget = true;
/*
$.ajaxSetup({
  cache:false
});
*/
$scope.aLabels = localStorageService.get('activeLabels');


$scope.label1 = localStorageService.get('label1');
$scope.label2 = localStorageService.get('label2');
$scope.label3 = localStorageService.get('label3');
$scope.label4 = localStorageService.get('label4');
$scope.label5 = localStorageService.get('label5');
$scope.label6 = localStorageService.get('label6');
$scope.label7 = localStorageService.get('label7');
$scope.label8 = localStorageService.get('label8');
$scope.label9 = localStorageService.get('label9');
$scope.label10 = localStorageService.get('label10');

$scope.color1 = '#' + localStorageService.get('color1');
$scope.color2 = '#' + localStorageService.get('color2');
$scope.color3 = '#' + localStorageService.get('color3');
$scope.color4 = '#' + localStorageService.get('color4');
$scope.color5 = '#' + localStorageService.get('color5');
$scope.color6 = '#' + localStorageService.get('color6');
$scope.color7 = '#' + localStorageService.get('color7');
$scope.color8 = '#' + localStorageService.get('color8');
$scope.color9 = '#' + localStorageService.get('color9');
$scope.color10 = '#' + localStorageService.get('color10');

// Preset screen to hidden
$scope.textL2 = false;
$scope.textL3 = false;
$scope.textL4 = false;
$scope.textL5 = false;
$scope.textL6 = false;
$scope.textL7 = false;
$scope.textL8 = false;
$scope.textL9 = false;
$scope.textL10 = false;

// Initialize the screen
if ($scope.aLabels >= 2){
  $scope.textL2 = true;
}
if ($scope.aLabels >= 3){
  $scope.textL3 = true;
}
if ($scope.aLabels >= 4){
  $scope.textL4 = true;
}
if ($scope.aLabels >= 5){
  $scope.textL5 = true;
}
if ($scope.aLabels >= 6){
  $scope.textL6 = true;
}
if ($scope.aLabels >= 7){
  $scope.textL7 = true;
}
if ($scope.aLabels >= 8){
  $scope.textL8 = true;
}
if ($scope.aLabels >= 9){
  $scope.textL9 = true;
}
if ($scope.aLabels >= 10){
  $scope.textL10 = true;
}

$scope.updateHTML = function(){

$('hh1').css({'background-color':$scope.color1});
$('hh2').css({'background-color':$scope.color2});
$('hh3').css({'background-color':$scope.color3});
$('hh4').css({'background-color':$scope.color4});
$('hh5').css({'background-color':$scope.color5});
$('hh6').css({'background-color':$scope.color6});
$('hh7').css({'background-color':$scope.color7});
$('hh8').css({'background-color':$scope.color8});
$('hh9').css({'background-color':$scope.color9});
$('hh10').css({'background-color':$scope.color10});

$('hchosen').css({'background-color':$scope.color1});
$('#chosen').html('1 - '+$scope.label1);

$('#oneL').html('1 - '+$scope.label1);
$('#twoL').html('2 - '+$scope.label2);
$('#threeL').html('3 - '+$scope.label3);
$('#fourL').html('4 - '+$scope.label4);
$('#fiveL').html('5 - '+$scope.label5);
$('#sixL').html('6 - '+$scope.label6);
$('#sevenL').html('7 - '+$scope.label7);
$('#eightL').html('8 - '+$scope.label8);
$('#nineL').html('9 - '+$scope.label9);
$('#tenL').html('10 - '+$scope.label10);
}

$scope.convertRGBA = function(hex){
  var c;
if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
}
throw new Error('Bad Hex');

}

$scope.color1RGBA = $scope.convertRGBA($scope.color1);
$scope.color2RGBA = $scope.convertRGBA($scope.color2);
$scope.color3RGBA = $scope.convertRGBA($scope.color3);
$scope.color4RGBA = $scope.convertRGBA($scope.color4);
$scope.color5RGBA = $scope.convertRGBA($scope.color5);
$scope.color6RGBA = $scope.convertRGBA($scope.color6);
$scope.color7RGBA = $scope.convertRGBA($scope.color7);
$scope.color8RGBA = $scope.convertRGBA($scope.color8);
$scope.color9RGBA = $scope.convertRGBA($scope.color9);
$scope.color10RGBA = $scope.convertRGBA($scope.color10);
$scope.updateHTML();

  // variable Initialization

  var myImageMiddle = new Image();
  var myImageBack = new Image();

  $scope.current_img = localStorageService.get('current_img');

  $scope.user_info = user_info;
  $scope.image_info = user_info.user_info_object.data.attributes.image_info;
  $scope.current_img_idx = user_info.user_info_object.data.attributes.current_img;

  // Current max superpixel count is 1000. Change statically
  $scope.isPainted = [1000];
  $scope.newValue = [1000];
  $scope.classification;
  $scope.label1Count = 0;
  $scope.label2Count = 0;
  $scope.label3Count = 0;
  $scope.label4Count = 0;
  $scope.label5Count = 0;
  $scope.label6Count = 0;
  $scope.label7Count = 0;
  $scope.label8Count = 0;
  $scope.label9Count = 0;
  $scope.label10Count = 0;


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
  $scope.colour_f = $scope.color1RGBA;
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
  $scope.data = [];//304

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
      //alert("coloring");
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
    $('#maskID').html(mask_value);

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
              $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.classification;

              // Set the fill colour accordingly & colour a rectangle of 1 x 1 pixels
              contextTop.fillStyle = $scope.colour_f;
              contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );
            }
            // We want to recolour these pixels
            else {
              $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.classification;
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
              $scope.colour_f = $scope.color1RGBA;
          }
          // Key '2'
          else if ($scope.newValue[p] == 2) {
              // Colour 'Green'
              $scope.colour_f = $scope.color2RGBA;

          }
          // Key '3'
          else if ($scope.newValue[p] == 3) {
              // Colour 'Pink'
              //$scope.colour_f = "rgba(128, 128, 255, 0.4)";
              $scope.colour_f = $scope.color3RGBA;
          }
          // Key '4'
          else if ($scope.newValue[p] == 4) {
            // Colour 'Yellow'
            $scope.colour_f = $scope.color4RGBA;
          }
          // Key '5'
          else if ($scope.newValue[p] == 5) {
            // Colour 'Blue'
            $scope.colour_f = $scope.color5RGBA;
          }
          // Key '6'
          else if ($scope.newValue[p] == 6) {
            // Colour 'Grey'
            $scope.colour_f = $scope.color6RGBA;
          }
          // Key '7'
          else if ($scope.newValue[p] == 7) {
            // Colour 'Grey'
            $scope.colour_f = $scope.color7RGBA;
          }
          // Key '8'
          else if ($scope.newValue[p] == 8) {
            // Colour 'Grey'
            $scope.colour_f = $scope.color8RGBA;
          }
          // Key '9'
          else if ($scope.newValue[p] == 9) {
            // Colour 'Grey'
            $scope.colour_f = $scope.color9RGBA;
          }
          // Key '10'
          else if ($scope.newValue[p] == 10) {
            // Colour 'Grey'
            $scope.colour_f = $scope.color10RGBA;
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
                $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.newValue[p];
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

    $scope.label1Count = 0;
    $scope.label2Count = 0;
    $scope.label3Count = 0;
    $scope.label4Count = 0;
    $scope.label5Count = 0;
    $scope.label6Count = 0;
    $scope.label7Count = 0;
    $scope.label8Count = 0;
    $scope.label9Count = 0;
    $scope.label10Count = 0;


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
              $scope.label1Count ++;
              $scope.colour_f = $scope.color1RGBA;
          }
          // Key '2'
          else if ($scope.newValue[p] == 2) {
              // Colour 'Green'
              $scope.label2Count ++;
              $scope.colour_f = $scope.color2RGBA;
          }
          // Key '3'
          else if ($scope.newValue[p] == 3) {
              // Colour 'Pink'
              $scope.label3Count ++;
              $scope.colour_f = $scope.color3RGBA;
          }
          // Key '4'
          else if ($scope.newValue[p] == 4) {
            // Colour 'Yellow'
            $scope.label4Count ++;
            $scope.colour_f = $scope.color4RGBA;
          }
          // Key '5'
          else if ($scope.newValue[p] == 5) {
            // Colour 'Blue'
            $scope.label5Count ++;
            $scope.colour_f = $scope.color5RGBA;
          }
          // Key '6'
          else if ($scope.newValue[p] == 6) {
            // Colour 'Grey'
            $scope.label6Count ++;
            $scope.colour_f = $scope.color6RGBA;
          }
          // Key '7'
          else if ($scope.newValue[p] == 7) {
            // Colour 'Grey'
            $scope.label7Count ++;
            $scope.colour_f = $scope.color7RGBA;
          }
          // Key '8'
          else if ($scope.newValue[p] == 8) {
            // Colour 'Grey'
            $scope.label8Count ++;
            $scope.colour_f = $scope.color8RGBA;
          }
          // Key '9'
          else if ($scope.newValue[p] == 9) {
            // Colour 'Grey'
            $scope.label9Count ++;
            $scope.colour_f = $scope.color9RGBA;
          }
          // Key '10'
          else if ($scope.newValue[p] == 10) {
            // Colour 'Grey'
            $scope.label10Count ++;
            $scope.colour_f = $scope.color10RGBA;
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
                $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.newValue[p];
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

            if ($scope.aLabels == 2){
              $scope.colour_f = $scope.color2RGBA;
            }
            if ($scope.aLabels == 3){
              $scope.colour_f = $scope.color3RGBA;
            }
            if ($scope.aLabels == 4){
              $scope.colour_f = $scope.color4RGBA;
            }
            if ($scope.aLabels == 5){
              $scope.colour_f = $scope.color5RGBA;
            }
            if ($scope.aLabels == 6){
              $scope.colour_f = $scope.color6RGBA;
            }
            if ($scope.aLabels == 7){
              $scope.colour_f = $scope.color7RGBA;
            }
            if ($scope.aLabels == 8){
              $scope.colour_f = $scope.color8RGBA;
            }
            if ($scope.aLabels == 9){
              $scope.colour_f = $scope.color9RGBA;
            }
            if ($scope.aLabels == 10){
              $scope.colour_f = $scope.color10RGBA;
            }

            // Very similar to the standard colouring function

            var mask_value = p;

            // Disallow recolouring
            $scope.isPainted[mask_value] = 1;
            $scope.newValue[mask_value] = $scope.aLabels;

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
                  $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.newValue[p];
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
                  $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.classification;

                  // Colour in the single pixel
                  contextTop.fillStyle = $scope.colour_f;
                  contextTop.fillRect( $scope.scaleImgX*$scope.iter1, $scope.scaleImgY*$scope.iter2, 1, 1 );

                }
                // We want to recolour these pixels
                else{
                  $scope.mask_copy[$scope.iter2][$scope.iter1] = $scope.classification;
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
        $scope.colour_f = $scope.color1RGBA;
        $scope.classification = 1;
        $('hchosen').css({'background-color':$scope.color1})
        $('#chosen').html('1 - '+$scope.label1);

      }
      // Key '2'
      else if (map[50] == true) {
          // Colour 'Green'
          $scope.colour_f = $scope.color2RGBA;
          $scope.classification = 2;
          $('hchosen').css({'background-color':$scope.color2})
          $('#chosen').html('2 - '+$scope.label2);
      }
      // Key '3'
      else if (map[51] == true) {
        // Colour 'Pink'
        if ($scope.aLabels >= 3){
        $scope.colour_f = $scope.color3RGBA;
        $scope.classification = 3;
        $('hchosen').css({'background-color':$scope.color3})
        $('#chosen').html('3 - '+$scope.label3);
        }
      }
      // Key '4'
      else if (map[52] == true) {
        // Colour 'Yellow'
        if ($scope.aLabels >= 4){
        $scope.colour_f = $scope.color4RGBA;
        $scope.classification = 4;
        $('hchosen').css({'background-color':$scope.color4})
        $('#chosen').html('4 - '+$scope.label4);
        }
      }
      // Key '5'
      else if (map[53] == true) {
        // Colour 'Blue'
        if ($scope.aLabels >= 5){
        $scope.colour_f = $scope.color5RGBA;
        $scope.classification = 5;
        $('hchosen').css({'background-color':$scope.color5})
        $('#chosen').html('5 - '+$scope.label5);
        }
      }
      // Key '6'
      else if (map[54] == true) {
        // Colour 'Grey'
        if ($scope.aLabels >= 6){
        $scope.colour_f = $scope.color6RGBA;
        $scope.classification = 6;
        $('hchosen').css({'background-color':$scope.color6})
        $('#chosen').html('6 - '+$scope.label6);
        }
      }
      // Key '7'
      else if (map[55] == true) {
        // Colour 'Grey'
        if ($scope.aLabels >= 7){
        $scope.colour_f = $scope.color7RGBA;
        $scope.classification = 7;
        $('hchosen').css({'background-color':$scope.color7})
        $('#chosen').html('7 - '+$scope.label7);
        }
      }
      // Key '8'
      else if (map[56] == true) {
        // Colour 'Grey'
        if ($scope.aLabels >= 8){
        $scope.colour_f = $scope.color8RGBA;
        $scope.classification = 8;
        $('hchosen').css({'background-color':$scope.color8})
        $('#chosen').html('8 - '+$scope.label8);
        }
      }
      // Key '9'
      else if (map[57] == true) {
        // Colour 'Grey'
        if ($scope.aLabels >= 9){
        $scope.colour_f = $scope.color9RGBA;
        $scope.classification = 9;
        $('hchosen').css({'background-color':$scope.color9})
        $('#chosen').html('9 - '+$scope.label9);
        }
      }
      // Key '10'
      else if (map[48] == true) {
        // Colour 'Grey'
        if ($scope.aLabels >= 10){
        $scope.colour_f = $scope.color10RGBA;
        $scope.classification = 10;
        $('hchosen').css({'background-color':$scope.color10})
        $('#chosen').html('10 - '+$scope.label10);
        }
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

    $('#undoID').html($scope.undoPosition );

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
                $scope.mask_copy[$scope.iter2][$scope.iter1] = 0;
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


    var answer = confirm("Set any remaing cells to label #"+$scope.aLabels + "?")
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
    var dictionary = new Array(11);

    // First array value is reserved for specifying the chosen cropped image
    dictionary[0] = 0;

    // Creating the perfect sized arrays
    dictionary[1] = new Array($scope.label1Count);
    dictionary[2] = new Array($scope.label2Count);
    dictionary[3] = new Array($scope.label3Count);
    dictionary[4] = new Array($scope.label4Count);
    dictionary[5] = new Array($scope.label5Count);
    dictionary[6] = new Array($scope.label6Count);

    dictionary[7] = new Array($scope.label7Count);
    dictionary[8] = new Array($scope.label8Count);
    dictionary[9] = new Array($scope.label9Count);
    dictionary[10] = new Array($scope.label10Count);



    var labelled = new Array($scope.mask_copy.length)

    for (z = 0; z < $scope.mask_copy.length; z ++){
      labelled[z] = new Array($scope.mask_copy[0].length);
      labelled[z] = $scope.mask_copy[z];
    }


    var label1Position = 0;
    var label2Position = 0;
    var label3Position = 0;
    var label4Position = 0;
    var label5Position = 0;
    var label6Position = 0;
    var label7Position = 0;
    var label8Position = 0;
    var label9Position = 0;
    var label10Position = 0;


    // Check every superpixel to see if it has been assigned a colour
    for (p = 0; p < 1000; p ++){

        // This has been classified, need to add it to the dictionary
        if ($scope.isPainted[p] == 1){

          // Key '1' Label1
          if ($scope.newValue[p] == 1) {
              dictionary[1][label1Position] = p;
              label1Position ++;
          }
          // Key '2' Label2
          if ($scope.newValue[p] == 2) {
              dictionary[2][label2Position] = p;
              label2Position ++;
          }
          // Key '3' Label3
          if ($scope.newValue[p] == 3) {
              dictionary[3][label3Position] = p;
              label3Position ++;
          }
          // Key '4' Label4
          if ($scope.newValue[p] == 4) {
              dictionary[4][label4Position] = p;
              label4Position ++;
          }
          // Key '5' Label5
          if ($scope.newValue[p] == 5) {
              dictionary[5][label5Position] = p;
              label5Position ++;
          }
          // Key '6' Label6
          if ($scope.newValue[p] == 6) {
              dictionary[6][label6Position] = p;
              label6Position ++;
          }
          // Key '7' Label7
          if ($scope.newValue[p] == 7) {
              dictionary[7][label7Position] = p;
              label7Position ++;
          }
          // Key '8' Label8
          if ($scope.newValue[p] == 8) {
              dictionary[8][label8Position] = p;
              label8Position ++;
          }
          // Key '9' Label9
          if ($scope.newValue[p] == 9) {
              dictionary[9][label9Position] = p;
              label9Position ++;
          }
          // Key '10' Label10
          if ($scope.newValue[p] == 10) {
              dictionary[10][label10Position] = p;
              label10Position ++;
          }

        }
    }

    // Next we need to convert the dictionary to a JSON file
    var data1 = JSON.stringify(dictionary);
    var data2 = JSON.stringify($scope.mask_copy);

    // Get the file path for proper naming of the zip file
    segPath = localStorageService.get('selected_fp');
    var email = localStorageService.get('email');
    $http.post('post_saveLabel/', {
            email: email,
            imageId: $scope.current_img,
            data1: data1,
            data2: data2,
            segPath: segPath,
            headers: {'Authorization': 'token'}
        }
    )
    .then(function(response) {

      var r_code = response.status;

      if (r_code != 200){
         localStorageService.set('error_status', r_code);
         $state.go('error_status');
      }

      // Raw UTF-8 data sent
     content = response.data;

     // Need to convert back to binary BLOB
      var binary_string =  window.atob(content);
      var len = binary_string.length;
      var bytes = new Uint8Array( len );
      for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
      }
      bytes.buffer;

      // Get the number of segments and date for .zip file naming
      var spl = segPath.split("_");
      fileName = spl[0].substring(spl[0].length-3, spl[0].length) + "_" + spl[1] + ".zip";

      // Workaround so we can name the download file with a hidden tag
       var a = document.createElement("a");
       document.body.appendChild(a);
       a.style = "display: none";

      // Creating the blob file
      var blob = new Blob([bytes.buffer], {type: "application/zip"});

      // Setting up the download
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);


        //var classified = localStorageService.get('classified') +1;
        //user_info.setClassified(classified);
        //var in_queue = localStorageService.get('in_queue')-1;
        //user_info.setInQueue(in_queue);
        //var pComplete = Math.floor((classified/(classified+in_queue))*100);
        //user_info.setPercentComplete(pComplete);



    }, function(x) {
        // Request error
    });

    // Website display to show what the data looks like
    //var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data1);
    //window.open(url, '_blank');
    //window.focus()

  }


  //***************************************************************//
  // Custom Function for Reading in a JSON file - Is called from polygon-draw.template.html
  // Navigation is from the index.html directory
  //***************************************************************//
  $scope.readJSON = function(){


    /*
    if (window.location.href.indexOf("?") > -1){
        $scope.showLoadingWidget = false;
    }
    else {

      window.location = window.location + '?loaded';
      window.location.reload(true);
      $scope.showLoadingWidget = true;
    }
    */




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

      //var json_str = localStorageService.get('json_str');
      //var json_str2 = localStorageService.get('json_str');
      //$scope.mask_data = localStorageService.get('json_str');
      //$scope.mask_copy = localStorageService.get('json_str');
      //alert($scope.mask_data);

      var email = localStorageService.get('email');
      var segmented_filepath = localStorageService.get('selected_fp');
      var json_filepath = localStorageService.get('json_str');


      $http.get('get_json/', {
              params:  {segmented_filepath: segmented_filepath, json_filepath: json_filepath, email: email},
              headers: {'Authorization': 'token'}
          }
      )
      .then(function(response) {

        var r_code = response.status;

        if (r_code != 200){
           localStorageService.set('error_status', r_code);
           $state.go('error_status');
        }

          // retrieve JSON
          $scope.mask_data = response.data.message.json_data;

            $scope.showLoadingWidget = false;

      }, function(x) {
          // Request error
      });

      $http.get('get_json/', {
              params:  {segmented_filepath: segmented_filepath, json_filepath: json_filepath, email: email},
              headers: {'Authorization': 'token'}
          }
      )
      .then(function(response) {

        var r_code = response.status;

        if (r_code != 200){
           localStorageService.set('error_status', r_code);
           $state.go('error_status');
        }

          // retrieve JSON
          $scope.mask_copy = response.data.message.json_data;

            $scope.showLoadingWidget = false;

      }, function(x) {
          // Request error
      });



/*
    $http.get('/polygon-draw/test_image_swift_segment_n566_s14.json').then(function(response) {
      // Storing the data in a multidimensional array that can be accessed
      // By both the .html file and other functions within this 'scope'
      //alert(typeof response.data);
      $scope.mask_data = response.data;

    });
*/

  }
  catch(err){
    alert("error");
  }

  }


    //***************************************************************//
    // Custom Function for Reading in the original img
    //***************************************************************//

    function readBackImage(){
      //alert("readBackimg");
      //alert(localStorageService.get('cropped_img'));
      myImageBack.src = localStorageService.get('cropped_img');
      readMiddleImage();
    }


    //***************************************************************//
    // Custom Function for Reading in the original img
    //***************************************************************//
    function readMiddleImage(){
      //alert("readMiddleimg");

      var fpToSend = localStorageService.get('segmented_img');

      var email = localStorageService.get('email');
      $http.get('dyn_img/fp=' + '/' + fpToSend, {
        params:  {email: email}
        }
      ).then(function(response) {
        var r_code = response.status;
        if (r_code != 200){
           localStorageService.set('error_status', r_code);
           $state.go('error_status');
         }

         myImageMiddle.src = "data:image/png;base64," + response.data;
      });


      //var tstimg = document.getElementById('test_img');
      //tstimg.src = localStorageService.get('segmented_img');

    }

    readBackImage();

    //myImageBack.src = "static/images/test_image_swift.jpg";
    //myImageMiddle.src = "static/images/test_image_swift_segment_n566_s14.jpg";

  //***************************************************************//
  // restart the entire process
  //***************************************************************//

$scope.restartClassification = function(){

  var answer = confirm("You can restart, but all of your progress will be lost for this image!\nProceed?")
  if (answer){

    if (localStorageService.get('email')=="guest@guest.com"){
      $state.go('guest_crop');
    }
    else{
      $state.go('crop_image');
    }
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



  //***************************************************************//
  // Loads in the correct background image
  //***************************************************************//
  function onPhotoDataSuccess(imageData){

      myImageMiddle.onload = function() {

        $scope.scaleImgX = 1;
        $scope.scaleImgY = 1;
        $scope.ResizeValue = 0;

        var im_width = myImageMiddle.width;
        var im_height = myImageMiddle.height;
        var ratio = im_width/800;
        var contWidth = 800;
        var contHeight = im_height/ratio;

        var container = $('#customContainer');
        $('#customContainer').css({'width':contWidth,'height':contHeight}) // Originally 800 X 535
        //var contWidth = 800;
        //var contHeight = 800*ratio;
        $scope.contRatio = contWidth/contHeight;
        $('#ratio').html($scope.contRatio);

        $('#cont').html(contWidth+ ', '+contHeight);

        //$scope.scaleImgX = contWidth/myImageMiddle.width;
        //$scope.scaleImgY = contHeight/myImageMiddle.height;

      $scope.draw_w = myImageMiddle.width * $scope.scaleImgX;
      $scope.draw_h = myImageMiddle.height * $scope.scaleImgY;
      //alert(""+$scope.draw_w)
      //alert(""+$scope.draw_h)

      context.canvas.width  = $scope.draw_w;
      context.canvas.height = $scope.draw_h;
      contextMiddle.canvas.width  = $scope.draw_w;
      contextMiddle.canvas.height = $scope.draw_h;
      contextTop.canvas.width  = $scope.draw_w;
      contextTop.canvas.height = $scope.draw_h;

       contextMiddle.drawImage(myImageMiddle, 0, 0, $scope.draw_w, $scope.draw_h);
       setTimeout(function(){  $scope.readJSON();},500);



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
