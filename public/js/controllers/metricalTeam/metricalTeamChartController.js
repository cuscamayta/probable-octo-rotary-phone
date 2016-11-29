app.controller('metricalTeamChartController', function ($scope, $rootScope, commonService, metricalTeamService, settingService, $location) {


    function validateSetting(){
                $scope.settings = settingService.getSettings();
        if (!settingService.hasValidSettings($scope.settings)) return;
        return true;
    }
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        if(validateSetting())
        init();
    });
    $rootScope.$on("/metricalTeam", function (event, data) {
        if(validateSetting())
        init();
    })

    function init() {
        
        //$scope.settings = settingService.getSettings();

        loadChartOfReport();
    }

    function loadChartOfReport() {
        if (!$scope.settings.isInRangeDates) {
            toastr.warning("You have select a sprint");
            $location.path("/setting/config");
        }
        if (!$rootScope.reportTeam)
            clearSeries($rootScope.limitedPrioridades);
            if( $rootScope.limitedPrioridades && $rootScope.limitedPrioridades.addSeriesPie )
            $rootScope.limitedPrioridades.addSeriesPie([], "...");
            metricalTeamService.getTimebyDeveloper($scope.settings.project.sprint.id).then(function (result) {

                
                $scope.titlechart = $scope.settings.project.sprint.name + " - " + $scope.settings.project.name;
                $rootScope.reportTeam = result;
                if (result)
                    var data =
                        $rootScope.limitedPrioridades.addSeriesPie(result.select(function (item) {
                            return [item.userName, item.timeValue];
                        }), $scope.titlechart);
            });
    }

    function clearSeries(chart) {
        var length = chart && chart.series ? chart.series.length : 0;
        for (var i = 0; i < length; i++) {
            chart.series[0].remove(true);
        }
    }


})
