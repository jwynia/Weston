var gui = require('nw.gui');
var Flickr = require("node-flickr");
var mkdirp = require('mkdirp');
var request = require('request');
var s3 = require('s3');
var natural = require('natural');
var WNdb = require('WNdb');
var fs = require('fs');
var path = require('path');
var prototypeFind = require('array.prototype.find');
var httpreq = require('httpreq');
var watchr = require('watchr');

var savePath = gui.App.dataPath + "/savedPhotos";


mkdirp(savePath, function(error) {
   if (error) {
      console.log(error);
   }
});

// Create menu container
var Menu = new gui.Menu({
   type: 'menubar'
});

//initialize default mac menu
Menu.createMacBuiltin("Image Finder");

// Get the root menu from the default mac menu
var rootMenu = Menu.items[0].submenu;

// Append new item to root menu
//rootMenu.insert(
// new gui.MenuItem({
//  label: 'Preferences',
//click : function () {
//$('#preferences').modal('toggle');
//}
//})
//);

// Append Menu to Window
gui.Window.get().menu = Menu;
//gui.Window.get().showDevTools();
gui.Window.get().focus();

var flickrKeys = {
   "api_key": "YOURKEYHERE"
}
flickr = new Flickr(flickrKeys);



var s3Client = s3.createClient({
   maxAsyncS3: 20, // this is the default
   s3RetryCount: 3, // this is the default
   s3RetryDelay: 1000, // this is the default
   multipartUploadThreshold: 20971520, // this is the default (20 MB)
   multipartUploadSize: 15728640, // this is the default (15 MB)
   s3Options: {
      accessKeyId: "YOURKEYHERE",
      secretAccessKey: "YOURKEYHERE",
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
   },
});

window.fs = fs;
window.flickr = flickr;
window.rootSearchFolder = './searchResults/';
window.mkdirp = mkdirp;
window.s3Client = s3Client;
window.wordnet = new natural.WordNet();
window.request = request;
window.httpreq = httpreq;
window.savePath = savePath;

watchr.watch({
   path: window.savePath,
   listener: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
      var photoInfo = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if(photoInfo.originalURL){
         request(photoInfo.originalURL).pipe(fs.createWriteStream(window.savePath + "/" + photoInfo.photo.id + ".jpg")).on('close', function(){ console.log("downloaded")});
      }
   }
});
