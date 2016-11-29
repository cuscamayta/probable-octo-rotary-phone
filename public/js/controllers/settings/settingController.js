app.controller('SettingsController', function ($scope, commonService, $ionicModal, settingService, $rootScope, $location) {


    $scope.settings = settingService.getSettings();
    $rootScope.$on("/config", function (event, data) {
        $scope.settings = settingService.getSettings();
    })

    $scope.hola=function(){
        alert('hola');
    }

    $scope.$watch('settings', function (newValue, oldValue) {

        if (newValue && newValue.project && newValue.project.key != oldValue.project.key) {
            $scope.loadVersions(newValue.project);
            $scope.loadSprints(newValue.project);
        }
        if ($scope.settings.useCurrentUser)
            $scope.settings.user = angular.copy($scope.settings.defaultUser);

        $rootScope.summaryIssuesByType = undefined;
        $rootScope.dataPriority = undefined;
        $rootScope.reportTeam = undefined;
        setInLocalStorage('jiraMobileSettings', $scope.settings);
    }, true);

    $scope.loadVersions = function (project) {
        if (projectHasVersions(project.key)) return;

        commonService.getVersionsByProject(project.key).then(function (versions) {
            var project = getProjectByKey($scope.settings.project.key);
            if(!project)
            return;
            project.versions = versions.items;
            $scope.projectVersions = project.versions;
            if (versions.items.length)
                $scope.settings.project.version = versions.items[versions.items.length - 1];
        })
    }
    $scope.loadProjects = function () {
        // $scope.settings = settingService.getSettings();
        if (!$scope.settings.jira.projects.length) {
            toastr.warning("There is not  projects loaded, possibly need to log in.")
            $location.path('/login');
        }
    }


    $scope.loadSprints = function (project) {
        if (projectHasSprints(project.key)) return;

        commonService.getSprintsByProject(project.key).then(function (sprints) {
            var project = getProjectByKey($scope.settings.project.key);
            if(!project)
            return;
            project.sprints = sprints.items;
            $scope.projectSprints = project.sprints;
            if (sprints.items.length)
                $scope.settings.project.sprint = sprints.items[sprints.items.length - 1];

        })
    }

    function projectHasVersions(projectkey) {
        var project = getProjectByKey(projectkey);
        if (project && project.versions) {
            $scope.projectVersions = project.versions;
            //  $scope.settings.project.version = project.versions[project.versions.length - 1];
            return true;
        }
        else {
            $scope.projectVersions = [];
            return false;
        }
    }

    function projectHasSprints(projectkey) {
        var project = getProjectByKey(projectkey);
        if (project && project.sprints) {
            $scope.projectSprints = project.sprints;
            //   $scope.settings.project.sprint = project.sprints[project.sprints.length - 1];
            return true;
        }
        else {
            $scope.projectSprints = [];
            return false;
        }
    }

    function getProjectByKey(projectKey) {
        var project = $scope.settings.jira.projects.where(function (project) {
            return project.key == projectKey;
        }).first();
        return project;
    }

})

