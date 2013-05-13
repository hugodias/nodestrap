app.factory('parse', function($rootScope, $http) {
	var parseURL = "http://nodestrap.herokuapp.com/api";
	return {
		all: function(className, callback) {
			$http.get(parseURL + '/' + className)
			.success(function(response){
				callback(null, response);
			})
			.error(function(response){
				callback("Error");
			})
		},
	//Create a db object on server
	create: function(className, data, callback) {
		$http.post(
			parseURL+'/'+className,
			data
			)
		.success(function(response) {
			callback(null, response);
		})
		.error(function(response) {
			callback("Cannot submit data!");
		});
	},
	// Update a db object on server
	update: function(className, data, callback) {
		$http.put(
			parseURL+'/'+className,
			data
			)
		.success(function(response) {
			callback(null, response);
		})
		.error(function(response) {
			callback("Cannot submit data!");
		});
	},
	//Get a db object by id
	get: function(className, callback) {
		$http.get(
			parseURL+'/'+className
			).success(function(response) {
				callback(null, response);
			}).error(function(response) {
				callback(response.error || "Cannot get object "+className+"!");
			});
		},
	//Get a list of db objects with query
	query: function(className, query, callback) {
		var config = { headers: parseHeaders };
		if (query) config.params = { where: query };
		$http.get(
			parseURL+'/classes/'+className,
			config
			).success(function(response) {
				callback(null, response);
			}).error(function(response) {
				callback(response.error || "Could not query "+className+"!");
			});
		},
	//Remove a db object
	remove: function(className, objectId, callback) {
			$http['delete']( //['delete'] to get around using delete js keyword
				parseURL+'/'+className+'/'+objectId
				).success(function(response) {
					callback(null, response);
				}).error(function(response) {
					callback(response.error || "Cannot delete object "+className+"/"+objectId+"!");
				});
			}
		};
	});
