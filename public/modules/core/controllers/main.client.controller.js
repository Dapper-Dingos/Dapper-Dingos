'use strict';

angular.module('core')



// ['$scope', 'MessageCreator', function ($scope, MessageCreator) 






.controller('mainController', ['$scope', 'Menus', function($scope, Menus) {
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		window.searchVideos = 'AXwGVXD7qEQ';


		$scope.ytQuery = '';

		$scope.ytSearcher = function(){

			var video_id = $scope.ytQuery.split('v=')[1];
			console.log(video_id, $scope.ytQuery)
				if(video_id.indexOf('&') !== -1) {
				var ampersandPosition = video_id.indexOf('&');
				  video_id = video_id.substring(0, ampersandPosition);
				} else {
				  video_id = video_id.substring(0, video_id.length);
				}


				console.log('Video_ID is ' + video_id)
			window.searchVideos = video_id;
		}

	}])



//create youtube helper functions for sockets and functionality #DD
.factory('youtubeFactory', function(){
	return {

			// socketPlayVideo: 

	    onPlayerStateChange: function(event){
	    	
	    	var socket = io.connect();

	    	
	// If player is Playing #DD
			if (event.data === 1) {
				console.log('Youtube object: ' + JSON.stringify(window.j))
				console.log(event)
				console.log(event.target.B.videoUrl)
				socket.emit('initiate', console.log('sending that its time to play!'));

				// socket.broadcast('Initiate Player')

				// function videoPlay() {
				// 	player.videoPlay
				// 	console.log('working')
				// }

					
			}

	//If Player is paused #DD
			if (event.data === 2) {
				console.log('paused')
				}
			},

			onPlayerReady: function(event){
		   	console.log('player ready')
		}
	}
})
//create youtube directive/tag for HTML #DD
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
	      //var searchVideos;
	      var socket = io.connect();

	      socket.on('startVid', function(){
    			console.log('startingVid')
    			player.playVideo();
    			console.log('playing video')
 				});

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
              // videoId: 'AXwGVXD7qEQ', //set to searchVideos
              videoId: window.searchVideos, //set to searchVideos
              events: {
              	'onReady': youtubeFactory.onPlayerReady,
              	'onStateChange': youtubeFactory.onPlayerStateChange
              }
       		});
	      };
	    },  
	  }
	});


