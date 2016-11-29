app.controller('timeSheetController', function($scope, $location, $rootScope, timeSheetService, commonService, settingService,$ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modalWorklogDetail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(issue) {
        $scope.issueSelected = issue;
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };


    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $scope.settings = settingService.getSettings();
        if (!settingService.hasValidSettings($scope.settings)) return;
        init();
    });
    $rootScope.$on("/timesheet", function(event, data) {
        init();
    })

    $scope.test = function() {
        alert('hola mundo');
    }

    function init() {
      
        var settings = settingService.getSettings();
        if (!settings.user.data) return;
        var response = !settings.isInRangeDates ? timeSheetService.getTimeSheetInDates(settings)
            : timeSheetService.getTimeSheetInSprint(settings.project.sprint.id, settings.user.data.name);

        response.then(function(data) {
            if (data.length == undefined) toastr.warning("You dont have worksLogs ");
            $scope.worksLogs = data;
        });
    }


})
