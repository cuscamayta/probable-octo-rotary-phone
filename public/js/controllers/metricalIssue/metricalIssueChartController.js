app.controller('metricalIssueChartController', function($scope, $rootScope, commonService, metricalIssueService, settingService,$location) {
    $scope.titlechart = 'Metrics time registered for issueType';
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        init();
    });
    $rootScope.$on("/metricalIssue", function(event, data) {
        init();
    })
    function init() {
        $scope.settings = settingService.getSettings();
        if (!settingService.hasValidSettings($scope.settings)) return;        
        if (!$scope.settings.isInRangeDates) {
            toastr.warning("You have select a sprint");
            $location.path("/setting/config");
        }
        loadChartForMetricsByIssueType();
    }

    function loadChartForMetricsByIssueType() {

        if (!$rootScope.summaryIssuesByType) {
            clearSeries($rootScope.settingissuepie);
            if ($rootScope.settingissuepie && $rootScope.settingissuepie.addSeriesPie)
                $rootScope.settingissuepie.addSeriesPie([], "...");
            var response = metricalIssueService.getMetricsOfTimeForIssue($scope.settings).then(function(data) {
                clearSeries($rootScope.settingissuepie);
                if (data.issueTypeSummary && Array.isArray(data.issueTypeSummary)) {
                    var listIssueResume = data.issueTypeSummary.select(function(issue) {
                        issue.iconClass = commonService.getIconForIssueType(issue.issueType);
                        return issue;
                    });
                    $rootScope.summaryIssuesByType = {
                        listIssuesResume: listIssueResume,
                        timeNotRegisterSummary: data.timeNotRegisterSummary,
                        totalTimeTeam: data.totaTimeInTeam
                    }
                    drawChart();
                }
            });
        }
        //     else{
        //     if (!$scope.settingissuepie) {
        //         clearSeries($scope.settingissuepie);
        //          drawChart();
        //     }


        // }

    }

    function drawChart() {

        var listIssuesForChart = $rootScope.summaryIssuesByType.listIssuesResume.select(function(issueResume) {
            return [issueResume.issueType, issueResume.timeSpentPercent];
        })
        listIssuesForChart.push(['Not Register', $rootScope.summaryIssuesByType.timeNotRegisterSummary.timeSpentPercent]);
        $scope.listIssuesResume = listIssuesForChart;
        $rootScope.settingissuepie.addSeriesPie($scope.listIssuesResume, $scope.settings.project.sprint.name + " - " + $scope.settings.project.name);

    }
    function clearSeries(chart) {
        var length = chart && chart.series ? chart.series.length : 0;
        for (var i = 0; i < length; i++) {
            chart.series[0].remove(true);
        }
    }
})