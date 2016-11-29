app.controller('bugPrioridadChartController', function($scope, $location, bugPrioridadService, commonService, settingService, $rootScope) {

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        initialize();
    });

    $rootScope.$on("/metrical", function(event, data) {
        initialize();
    })

    function initialize() {
        $scope.settings = settingService.getSettings();
        if (!settingService.hasValidSettings($scope.settings)) return;
        LoadChart();
    }
    function groupBy(array, f) {
        var groups = {};
        array.forEach(function(o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function(group) {
            return groups[group];
        })
    }
    function clearSeries(chart) {
        if (chart) {
            var length = chart.series ? chart.series.length : 0;
            for (var i = 0; i < length; i++) {
                chart.series[0].remove(true);
            }
        }

    }
    function getDataDetail() {
        $scope.titlechart = $scope.settings.isInRangeDates ? $scope.settings.project.sprint.name + " - " + $scope.settings.project.name : $scope.settings.project.name;

        if (!$rootScope.dataPriority) {
            clearSeries($rootScope.limitedPrioridadesBug);
            if ($rootScope.limitedPrioridadesBug && $rootScope.limitedPrioridadesBug.addSeriesPie)
                $rootScope.limitedPrioridadesBug.addSeriesPie([], "...");
            var response = ($scope.settings.isInRangeDates) ? bugPrioridadService.getMetricsByTypeIssueByPriority($scope.settings) :
                bugPrioridadService.getMetricsByBugPriorityDate($scope.settings);
            response.then(function(data) {
                clearSeries($scope.limitedPrioridadesBug);
                if (data && data.worklogs && data.worklogs.items && (data.worklogs.items.length > 0)) {
                    drawChart(data);
                } else {

                    var responseWithoutVersion = ($scope.settings.isInRangeDates) ? bugPrioridadService.getMetricsByTypeIssueWitOutVersionByPriority($scope.settings) :
                        bugPrioridadService.getMetricsByBugPriorityDateWithOutVersion($scope.settings);
                    responseWithoutVersion.then(function name(data) {
                        clearSeries($scope.limitedPrioridadesBug);
                        if (data && data.worklogs.items && (data.worklogs.items.length > 0)) {
                            drawChart(data);
                        } else {
                            $scope.texto = "El sprint que desea ver no contiene bugs ";
                            toastr.warning("El sprint que desea ver no contiene bugs");
                        }
                    });

                }
            });
        } else {
            if ($scope.limitedPrioridadesBug) {
                clearSeries($scope.limitedPrioridadesBug);
                addSeries();
            }
        }

    }

    function drawChart(data) {
        var dataNotFilter = data.worklogs.items.select(function(item) {
            return item.priority.name;
        });

        var auxgroup = groupBy(dataNotFilter, function(priority) {
            return [priority];
        });

        $rootScope.dataPriority = auxgroup.select(function(params) {
            return [params[0], params.length];
        }).select(function(item) {
            var icon = commonService.getIconForPriority(item[0]);
            return { priority: item[0], count: item[1], iconClass: icon }
        });
        addSeries();
        $rootScope.sprintDetail = !data.sprintDetail ? { startDate: $scope.settings.startDate, endDate: $scope.settings.endDate } : data.sprintDetail;
    }

    function addSeries() {
        $scope.limitedPrioridadesBug.addSeriesPie($rootScope.dataPriority.select(function(item) {
            return [item.priority, item.count];
        }), $scope.titlechart);
    }

    function LoadChart() {



        getDataDetail();

    }
})
