app.controller('bugPrioridadDetailController', function ($scope, $location, commonService, bugPrioridadService, settingService, $rootScope) {
    $scope.iconClassMetricalDetail = {};
    $scope.dataPriority = {};

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        initialize();
    });

    function arrayFromObject(obj) {
        var arr = [];
        for (var i in obj) {
            arr.push(obj[i]);
        }
        return arr;
    }

    function groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    }

    function initialize() {
        $scope.settings = settingService.getSettings();
        if (!settingService.hasValidSettings($scope.settings)) return;
        $scope.iconClassMetricalDetail = commonService.getIconForIssueType('Bug');
        // if (($scope.settings.project.key != -1) && (($scope.settings.project.sprint.id != -1) ||
        //     (!$scope.settings.isInRangeDates)) && ($scope.settings.project.version != "")) {
        getDataDetail();
        // }
    }

    function getDataDetail() {
        $scope.title = $scope.settings.isInRangeDates ? $scope.settings.project.sprint.name + " - " + $scope.settings.project.name : $scope.settings.project.name;

        if (!$rootScope.dataPriority) {
            var response = ($scope.settings.isInRangeDates) ? bugPrioridadService.getMetricsByTypeIssueByPriority($scope.settings) :
                bugPrioridadService.getMetricsByBugPriorityDate($scope.settings);
            response.then(function (data) {
                if (data && data.worklogs && data.worklogs.items && (data.worklogs.items.length > 0)) {
                    prepareData(data);
                } else {

                    var responseWithoutVersion = ($scope.settings.isInRangeDates) ? bugPrioridadService.getMetricsByTypeIssueWitOutVersionByPriority($scope.settings) :
                        bugPrioridadService.getMetricsByBugPriorityDateWithOutVersion($scope.settings);
                    responseWithoutVersion.then(function name(data) {
                        if (data && data.worklogs.items && (data.worklogs.items.length > 0)) {
                            prepareData(data);
                        } else {
                            toastr.warning("The sprint or dates do not have bugs");
                        }
                    });

                }
            });
        } else {
            $scope.localdataPriority = $rootScope.dataPriority;
        }


    }
    function prepareData(data) {

        var dataNotFilter = data.worklogs.items.select(function (item) {
            return item.priority.name;
        });

        var auxgroup = groupBy(dataNotFilter, function (priority) {
            return [priority];
        });

        $scope.localdataPriority = auxgroup.select(function (params) {
            return [params[0], params.length];
        }).select(function (item) {
            var icon = commonService.getIconForPriority(item[0]);
            return { priority: item[0], count: item[1], iconClass: icon }
        });
        $rootScope.dataPriority = $scope.localdataPriority;
        $rootScope.sprintDetail = !data.sprintDetail ? { startDate: $scope.settings.startDate, endDate: $scope.settings.endDate } : data.sprintDetail;
    }

    function sprintDetailDates(sprintDetail) {
        return { startDate: sprintDetail.startDate.toJiraDate(), endDate: sprintDetail.endDate.toJiraDate() };
    }

})
