app.controller('metricalTeamDetailController', function ($scope, commonService, metricalTeamService, settingService, $rootScope) {
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });

    function init() {
        $scope.settings = settingService.settings;
        // if (!settingService.hasValidSettings($scope.settings)) return;
        loadChartOfReport();
    }
    function loadChartOfReport() {
        if (!$scope.settings.isInRangeDates) {
            toastr.warning("You have select a sprint");
            $location.path("/setting/config");
        }
        if (!$rootScope.reportTeam)
            metricalTeamService.getTimebyDeveloper($scope.settings.project.sprint.id).then(function (result) {
                $rootScope.reportTeam = result;

            });
    }
})
