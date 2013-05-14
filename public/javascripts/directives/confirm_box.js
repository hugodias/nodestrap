app.directive('confirmBox', function(){
    return function (scope, element, attrs){
        element.bind('click',function(e){
        	var href,response;
        	e.preventDefault();
        	// Get link href
        	href = attrs.href;
        	// Display confirm box with elem question
        	response = confirm(attrs.confirmBox);
        	// Redirect if true
        	if(response){
        		window.location = href;
        	}
        });
    }
});
