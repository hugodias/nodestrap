function slugify(text) {
	text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
	text = text.replace(/-/gi, "_");
	text = text.replace(/\s/gi, "-");
	return text;
}

app.controller('UsersCtrl', ['$scope','$location', '$http','parse', '$routeParams',
	function UsersCtrl($scope, $location, $http, parse, $routeParams) {
		$scope.user = [];
		$scope.flash = [];
		$scope.logged = $('.userinfo').attr('data-username');

		$scope.get = function(){
			parse.all("users",function(error,response){
				$scope.users = response;
			});
		}

		$scope.destroy = function(id, index){
			parse.remove('users',id,function(error,response){
				$scope.users.splice(index,1);
			});
		}

		$scope.get();
	}
	]);


app.controller('UsersCreateCtrl', ['$scope','parse','$routeParams','$location',
	function UsersCreateCtrl($scope,parse,$routeParams,$location){
		$scope.form_title = 'New user';
		$scope.form_edit = true;
		$scope.selected_user = false;
		$scope.user = [];

		$scope.breadcrumb = [{
			title: 'Home',
			url: '/'
		},
		{
			title: 'New user',
			active: 'active'
		}];

		$scope.save = function(){
			var user = {
				username: slugify($scope.user.username),
				email: $scope.user.email,
				password: $scope.user.password
			};

			parse.create("users/add/",{user: user},function(err,response){
				if(!err){
					$location.path('/');
				}
			});

		}
	}
	]);

app.controller('UsersUpdateCtrl', ['$scope','parse','$routeParams', '$location',
	function UsersUpdateCtrl($scope,parse,$routeParams, $location){
		$scope.form_edit = true;
		$scope.form_title = 'Update user';
		$scope.form_action = 'edit';

		$scope.breadcrumb = [{
			title: 'Home',
			url: '/'
		},
		{
			title: $routeParams.username,
			url: '#users/' + $routeParams.username
		},
		{
			title: 'Edit',
			active: 'active'
		}];

		parse.get("users/" + $routeParams.username, function(error,response){
			$scope.form_edit = false;
			// Remvove password from response
			delete response.password;
			$scope.user = response;
		});

		$scope.save = function(){
			$scope.user.username = slugify($scope.user.username);
			if( $scope.user.username === 'admin'){
				// Cant change admins password!
				console.log('Cant change admin password');
				$location.path('/');
			} else {
				user = $scope.user;
				parse.update("users/" + user._id, {user: user},function(err,response){
					//$scope.setFlash('Success','User updated succefully','success');
					$location.path('/');
				});
			}


		}
	}
	]);

app.controller('UsersDetailCtrl', ['$scope', 'parse', '$routeParams',
	function UsersDetailCtrl($scope, parse, $routeParams) {

		$scope.breadcrumb = [{
			title: 'Home',
			url: '/'
		},
		{
			title: $routeParams.username,
			active: 'active'
		}];

		$scope.view = function(username) {
			parse.get("users/" + username, function(error,response){
				$scope.form_edit = false;
				// Remvove password from response
				delete response.password;

				$scope.selected_user = response;
			});
		}

		if( $routeParams.username ) {
			$scope.username = $routeParams.username;
			$scope.view($scope.username);
		}
	}]);
