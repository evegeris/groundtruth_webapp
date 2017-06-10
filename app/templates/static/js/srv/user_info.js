angular.module('myApp').service('user_info', function(localStorageService) {

    this.user_info_object = {
          "data": {
            "type": "users",
            "attributes": {
              "email":"",
              "full_name": "",
              "classified": "0",
              "in_queue": "0",
              "error_status": 0,
              "firstTime": 1,
              "activeLabels": 6,
              "label1": "Healthy",
              "label2": "Scar",
              "label3": "Inflammatory",
              "label4": "Necrotic",
              "label5": "Background",
              "label6": "Bad Data",
              "label7": "",
              "label8": "",
              "label9": "",
              "label10": "",
              "color1": "FF944D",
              "color2": "E5FFE5",
              "color3": "FF99B1",
              "color4": "8080FF",
              "color5": "FF944D",
              "color6": "A6A6A6",
              "color7": "FFFFFF",
              "color8": "",
              "color9": "",
              "color10": "",
              "percent_complete": "0",
              "image_info": {},
              "current_img": 0,
              "token": ""
              }
           }
        };

        this.updateNextImageIndex = function(){
          var arrayLength = this.user_info_object.data.attributes.image_info.length;
          // check data types, ie str vs num
          //alert(typeof this.user_info_object.data.attributes.image_info[0].progress);
          // loop over images for next one
          // TODO: (start at current index or 0, assuming user jumping around?)
          // this.user_info_object.data.attributes.current_img
          for (var i = 0; i < arrayLength; i++) {
            if (this.user_info_object.data.attributes.image_info[i].progress < 100){
              this.user_info_object.data.attributes.current_img = i;
              break;
            }
          }
          localStorageService.set('current_img', this.user_info_object.data.attributes.current_img);
          //return this.user_info_object.data.attributes.current_img;
        };

    this.setImageData = function(image_info){

      var arrayLength = image_info.length;
      localStorageService.set('image_arrayLen', arrayLength);
      //alert("array len "+arrayLength.toString() );
      for (var i = 0; i < arrayLength; i++) {
        //alert('image_info'+i.toString());
        //alert(JSON.stringify(image_info[i]));
        localStorageService.set('image_info'+i.toString(), JSON.stringify(image_info[i]) );
      }

      this.user_info_object.data.attributes.image_info = image_info; // set srv var to whatever to trigger watcher
      //alert('user_info: '+this.user_info_object.data.attributes.image_info[0].fullsize_orig_filepath);
    };

/*
    this.getImageData = function(){
      alert("fgfdh??");
      alert('user_info: '+this.user_info_object.data.attributes.image_info[0].fullsize_orig_filepath);
        return this.user_info_object.data.attributes.image_info;
    }
*/

    this.setFullName = function(full_name){
      localStorageService.set('full_name', full_name);
      this.user_info_object.data.attributes.full_name = full_name;
    };

    this.setEmail = function(email){
      localStorageService.set('email', email);
      this.user_info_object.data.attributes.email = email;
    };

    this.sayHello = function(){
      return "Hello " + localStorageService.get('full_name');
    };
    this.setClassified = function(classified){
      localStorageService.set('classified', classified);
      this.user_info_object.data.attributes.classified = classified;
    };

    this.setInQueue = function(in_queue){
      localStorageService.set('in_queue', in_queue);
      this.user_info_object.data.attributes.in_queue = in_queue;
    };

    this.setPercentComplete = function(pComplete){
      localStorageService.set('percent_complete', pComplete);
      this.user_info_object.data.attributes.percent_complete = pComplete;
    };
    this.setErrorStatus = function(errorCode){
      localStorageService.set('error_status', errorCode);
      this.user_info_object.data.attributes.error_status = errorCode;
    };
    this.setFirstTime = function(numFirst){
      localStorageService.set('firstTime', numFirst);
      this.user_info_object.data.attributes.firstTime = numFirst;
    };
    this.setActiveLabels = function(numLabels){
      localStorageService.set('activeLabels', numLabels);
      this.user_info_object.data.attributes.activeLabels = numLabels;
    };
    this.setLabels = function(label1, label2, label3, label4, label5, label6, label7, label8, label9, label10){
      localStorageService.set('label1', label1);
      this.user_info_object.data.attributes.label1 = "test";
      localStorageService.set('label2', label2);
      this.user_info_object.data.attributes.label2 = label2;
      localStorageService.set('label3', label3);
      this.user_info_object.data.attributes.label3 = label3;
      localStorageService.set('label4', label4);
      this.user_info_object.data.attributes.label4 = label4;
      localStorageService.set('label5', label5);
      this.user_info_object.data.attributes.label5 = label5;
      localStorageService.set('label6', label6);
      this.user_info_object.data.attributes.label6 = label6;
      localStorageService.set('label7', label7);
      this.user_info_object.data.attributes.label7 = label7;
      localStorageService.set('label8', label8);
      this.user_info_object.data.attributes.label8 = label8;
      localStorageService.set('label9', label9);
      this.user_info_object.data.attributes.label9 = label9;
      localStorageService.set('label10', label10);
      this.user_info_object.data.attributes.label10 = label10;
    };
    this.setColors = function(color1, color2, color3, color4, color5, color6, color7, color8, color9, color10){
      localStorageService.set('color1', color1);
      this.user_info_object.data.attributes.color1 = color1;
      localStorageService.set('color2', color2);
      this.user_info_object.data.attributes.color2 = color2;
      localStorageService.set('color3', color3);
      this.user_info_object.data.attributes.color3 = color3;
      localStorageService.set('color4', color4);
      this.user_info_object.data.attributes.color4 = color4;
      localStorageService.set('color5', color5);
      this.user_info_object.data.attributes.color5 = color5;
      localStorageService.set('color6', color6);
      this.user_info_object.data.attributes.color6 = color6;
      localStorageService.set('color7', color7);
      this.user_info_object.data.attributes.color7 = color7;
      localStorageService.set('color8', color8);
      this.user_info_object.data.attributes.color8 = color8;
      localStorageService.set('color9', color9);
      this.user_info_object.data.attributes.color9 = color9;
      localStorageService.set('color10', color10);
      this.user_info_object.data.attributes.color10 = color10;
    };



});
