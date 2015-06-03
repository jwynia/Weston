Array.prototype.unique = function(a) {
   return function() {
      return this.filter(a)
   }
}(function(a, b, c) {
   return c.indexOf(a, b + 1) < 0
});

var ViewModel = function() {
   var vm = this;
   vm.searchTerm = ko.observable();
   vm.searchTerm.focused = ko.observable();
   vm.searchTerm.focused.subscribe(function(newValue) {
      if (!newValue) {
         vm.runSearch();
      }
   });
   vm.searchTermSynonyms = ko.observableArray();
   vm.searchResults = ko.observableArray();
   vm.searchFolder = ko.observable(rootSearchFolder);
   vm.selectedPhoto = ko.observable();
   vm.selectedPhotoDetail = ko.observable();
   vm.selectedPhotoUserInfo = ko.observable();
   vm.selectedPhotoOriginalURL = ko.observable();
   vm.selectledPhotoCompleteInfo = ko.computed(function() {
      return {
         'photo': vm.selectedPhoto(),
         'detail': vm.selectedPhotoDetail(),
         'userInfo': vm.selectedPhotoUserInfo(),
         'originalURL': vm.selectedPhotoOriginalURL()
      };
   }, vm);
   vm.savePath = ko.observable(savePath);

   vm.runSearch = function() {
      if (vm.searchTerm() != null) {
         wordnet.lookup(vm.searchTerm(), function(results) {
            var synonyms = [];
            results.forEach(function(result) {
               result.synonyms.forEach(function(synonym) {
                  synonyms.push(synonym);
               });
            });
            vm.searchTermSynonyms(synonyms.unique());
         });
         flickr.get("photos.search", {
            "text": vm.searchTerm(),
            "sort": "interestingness-desc",
            "license": 4,
            "per_page": 50
         }, function(result) {
            //console.log(result.photos.photo);
            if (result.photos.photo) {
               for (var i = 0; i < result.photos.photo.length; i++) {
                  result.photos.photo[i].small = "https://farm" + result.photos.photo[i].farm + ".staticflickr.com/" + result.photos.photo[i].server + "/" + result.photos.photo[i].id + "_" + result.photos.photo[i].secret + "_s.jpg";
                  result.photos.photo[i].medium = "https://farm" + result.photos.photo[i].farm + ".staticflickr.com/" + result.photos.photo[i].server + "/" + result.photos.photo[i].id + "_" + result.photos.photo[i].secret + "_z.jpg";
               }
               vm.searchResults(result.photos.photo);
            } else {

            }
         });
      }
   };
   vm.selectPhoto = function(photo) {
      vm.selectedPhoto(photo);
      flickr.get("photos.getInfo", {
         "photo_id": vm.selectedPhoto().id
      }, function(photoInfo) {
         vm.selectedPhotoDetail(photoInfo.photo);
         //console.log(vm.selectedPhotoDetail());
      });

      flickr.get("people.getInfo", {
         "user_id": photo.owner
      }, function(userInfo) {
         vm.selectedPhotoUserInfo(userInfo.person);
      });
      flickr.get("photos.getSizes", {
         "photo_id": vm.selectedPhoto().id
      }, function(sizes) {
         //console.log("Got sizes.");
         var originalURL = sizes.sizes.size[sizes.sizes.size.length - 1].source;
         //console.log("OriginalURL: " + originalURL);
         vm.selectedPhotoOriginalURL(originalURL);
      })
   }
   vm.setSearchTerm = function(term) {
      vm.searchTerm(term);
      vm.runSearch();
   }
   vm.saveSelectedPhotoToLocal = function() {
      fs.writeFile(vm.savePath() + "/" + vm.selectedPhoto().id + ".json", JSON.stringify(vm.selectledPhotoCompleteInfo(), null, 4), function(err) {
         if (err) {
            console.log("Couldn't write to file. Error: " + err);
            return console.log(err);
         }
      });

   }

   vm.openSavePath = function (){
      gui.Shell.openItem(vm.savePath());
   }
   vm.storePhotoToS3 = function(photo) {
      var params = {
         localFile: localFile,
         s3Params: {
            Bucket: "bucket",
            Key: "key",
         },
      };
      var uploader = client.uploadFile(params);
      uploader.on('error', function(err) {
         console.error("unable to upload:", err.stack);
      });
      uploader.on('progress', function() {
         console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
         s3.getPublicUrlHttp(bucket, key)
      });
   }
};

ko.applyBindings(new ViewModel());
