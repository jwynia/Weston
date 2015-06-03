# Weston
A photo finder that uses Flickr's Creative Commons photos to find images for blog posts/presentations that can be used By-Attribution (https://creativecommons.org/licenses/by/4.0/). Built using node-webkit and KnockoutJS.

The app is named after Edward Weston (http://en.wikipedia.org/wiki/Edward_Weston) who is one of my favorite photographers. His "Pepper No. 30" (http://en.wikipedia.org/wiki/Pepper_No._30) and that whole series are
masterpieces of B&W photography and lighting. Incidentally, if you want an original print of that photo, it'll cost you at least $340,000 (http://www.sothebys.com/en/auctions/ecatalogue/2014/photographs-n09129/lot.24.html).

# Setup
This is a nwjs/node-webkit app. You'll need a functioning node/npm setup. To pull in the dependencies, in the root directory of this repository, run:

npm install

You'll also need nwjs/node-webkit:

https://github.com/nwjs/nw.js

You need to enter a Flickr API key into the js/application.js file toward the top. If I decide to bundle this as an installable app, I'll probably put my key into that, but I avoid putting API keys into anything in github.

The run.sh script is currently hard-coded to node-webkit/nwjs v0.12.2 because the "current" version on my machine doesn't cooperate. It also assumes node-webkit-build is installed on your machine.

npm install node-webkit-builder -g

## Use
Assuming the app launches correctly when you run ./run.sh, enter a search term in the giant text box at the top and click "Go" or hit ENTER. You'll get a bunch of interesting images related to that term as well as some synonym suggestions for alternate terms. To see a larger version of an image, just click it. To run a search for one of the alternate terms, just click the term.

If you click the "Save to Local" button under the larger image, a copy of the largest version Flickr has will be downloaded in the background along with a JSON file. That JSON file contains all of the info about the image, including the Flickr page for it and the name of the person who took the photo, which is what you need to do to comply with the license.

All photos you see in this app are licensed under the terms of the Creative Commons Attribution License (https://creativecommons.org/licenses/by/4.0/). That means the photos can be used for commercial purposes, but you DO have to attribute (indicate the creator of the image by name) in the work. The "license: 4" portion in the JSON file documents the fact that at the time of download, the image was licensed under those terms. In the past, I've seen photos removed/had their licenses changed and so I wanted coverage in case that ever becomes a problem.

Future versions will hopefully upload the image/documentation to Amazon S3 for CDN/linking purposes as well as generate HTML blocks for quick insertion into blog posts as well as generating "citation images" for including at the end of presentations that cover the attribution requirement easily.

## CDN
The JS and CSS files for the UI are hosted in my own personal CDN. If you clone this for another purpose, please
change that or at least live with the possibility that I may move/rename/remove those files fromt the CDN whenever I feel like it.

## Theme License
The UI theme is the AdminLTE project (https://github.com/almasaeed2010/AdminLTE), which is also licensed under the MIT license.
