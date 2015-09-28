// #DD calls the core app module
angular.module('core')
// #DD Establish functionality for pressing the enter key
.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keypress", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
})



//#DD controller interface for user chat window, need to change userName to current authed user
.controller('chatController', ['$scope', 'Authentication', function ($scope, Authentication) {
	$scope.userName = Authentication.user;
	$scope.message = '';
	$scope.filterText = '';
	$scope.messages = [];

	var socket = io.connect();

    // #DD load previous messages from chat
  socket.on('pastMessages', function (data) {
  	$scope.messages = data.reverse();
  	$scope.$apply();
  });



    //#DD using the local authentication as a condition, send a message to the server
  $scope.sendMessage = function () {
  	var chatMessage = {
  		'username': $scope.userName.displayName,
  		'message': $scope.message
  	};
  	socket.emit('newMessage', chatMessage);
  	$scope.message = '';
  };
  socket.emit('getUsers');
}]);