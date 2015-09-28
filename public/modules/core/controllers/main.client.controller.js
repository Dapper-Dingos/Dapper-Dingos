'use strict';

angular.module('core')

.controller('mainController', ['$scope', 'Menus', function($scope, Menus) {
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.ytQuery = '';

		//#DD input box function for taking the submitted string and parsing into a videoKey.
		$scope.ytSearcher = function(){

			var video_id = $scope.ytQuery.split('v=')[1];
				if(video_id.indexOf('&') !== -1) {
				var ampersandPosition = video_id.indexOf('&');
				  video_id = video_id.substring(0, ampersandPosition);
				} else {
				  video_id = video_id.substring(0, video_id.length);
				}
				
				var socket = io.connect();
				// #DD triggers url change via sockets, sends videoID as data
				socket.emit('changingUrl', video_id)
		}

	}])

//create youtube helper functions for sockets and functionality #DD
.factory('youtubeFactory', function(){
	return {

	    onPlayerStateChange: function(event){
	    	
	    	var socket = io.connect();
	    	
	// If player is Playing #DD
			if (event.data === 1 && !window.hold) {
				window.hold = true;
				socket.emit('initiate');	
			}

	//If Player is paused #DD
			if (event.data === 2 && !window.hold) {
				window.hold = true;
				socket.emit('paused');
				}
			},

			onPlayerReady: function(event){
		}
	}
})

//create youtube directive/tag for HTML #DD, THIS IS THE MAGIC!
.directive('youtube', 
	function($window, youtubeFactory) {
	  return {
	    restrict: "E",

	    scope: {
      		height:   "@",
      		width:    "@",
      		videoId:  "@"  
    	},

	    template: '<div></div>',

	    link: function(scope, element, attrs) {
	      window.j = attrs;
	      var tag = document.createElement('script');
	      tag.src = "https://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	      var player;
	      var socket = io.connect();

	      // #DD socket trigger for Starting Vid
	      socket.on('startVid', function(){
    			player.playVideo();
    			window.hold = false;
 				});

	      // #DD socket trigger for Pausing Vid
	      socket.on('pauseVid', function(){
    			player.pauseVideo();
    			window.hold = false;
 				});

	      // #DD socket trigger for Changing Videotime
 				socket.on('changeTime', function(newTime){
 					player.seekTo({seconds:newTime, allowSeekAhead:true})
 					window.hold = false;
 				})

	      // #DD socket trigger for changing URL
				socket.on('changeVid', function(urlKey){
					// #DDyoutube API function for cueing new video
					player.cueVideoByUrl({ mediaContentUrl: 'http://www.youtube.com/v/' + urlKey + '?version=5'})
				})

	      $window.onYouTubeIframeAPIReady = function() {
	        player = new YT.Player(element.children()[0], {

		        playerVars: {
	            autoplay: 0,
	            html5: 1,
	            theme: "light",
	            modesbranding: 0,
	            color: "white",
	            iv_load_policy: 3,
	            showinfo: 1,
          		controls: 1,
          		start: 0
         	  },
          	  height: scope.height,
              width: scope.width,
              videoId: 'AXwGVXD7qEQ',
              events: {
              	'onReady': youtubeFactory.onPlayerReady,
              	'onStateChange': youtubeFactory.onPlayerStateChange
              }
       		});
	      };
	    },  
	  }
	});

