app.controller('logoutController', function ($scope, userService, $location, commonService) {

    $scope.logout = function (user) {
        var response = userService.logout(user);
        response.then(function (data) {
            $scope.user = {};
            if (data.isSuccess) {
                // setInLocalStorage('currentUser', "");
                localStorage.clear();
                $location.path('/login');
            } else
                commonService.showAlert(data.Message, null);
        });
    };
 

})
