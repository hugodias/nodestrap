app.controller('AppCtrl', ['$scope','$location', '$http','parse',
	function AppCtrl($scope, $location, $http, parse) {
		$scope.sidebar = 'views/partials/sidebar.html';
		$scope.logged = $('.userinfo').attr('data-username');
		$scope.breadcrumburl = 'views/partials/breadcrumb.html';

		$scope.setFlash = function(title,message,type){
			var base = 'alert alert-block alert-';

			$scope.flash = {
				title: title,
				message: message,
				type: base + type,
				url: 'views/partials/flash.html'
			}
		}
	}
	]);
