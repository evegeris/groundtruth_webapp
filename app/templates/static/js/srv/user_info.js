angular.module('myApp').service('user_info', function(localStorageService) {

    this.user_info_object = {
          "data": {
            "type": "users",
            "attributes": {
              "email":"",
              "full_name": "",
              "classified": "0",
              "in_queue": "0",
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


});
