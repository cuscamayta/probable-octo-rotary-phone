app.service('settingService', ['$http', '$q', '$location', function ($http, $q, $location) {

    this.defaulSettings = function () {
        return {
            useCurrentUser: true,
            user: {},
            defaultUser: {},
            isInRangeDates: true,
            startDate: '',
            endDate: '',
            project: {
                name: '',
                key: '',
                sprint: {
                    id: '',
                    name: '',
                },
                version: {
                    id: '',
                    name: ''
                }
            },
            jira: {
                projects: []
            }
        }
    }

    this.cloneObject = function (obj) {
        var clone = {};
        for (var i in obj) {
            if (typeof (obj[i]) == "object" && obj[i] != null)
                clone[i] = this.cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
    }

    this.saveUserInLocalStorage = function (user) {
        var settings = this.getSettings();
        settings.user = user;
        settings.defaultUser = this.cloneObject(user);
        setInLocalStorage('jiraMobileSettings', settings);
    };

    this.saveProjectInLocalStorage = function (project) {
        var settings = this.getSettings();
        settings.project = project;
        setInLocalStorage('jiraMobileSettings', settings);
    };

    this.hasValidSettings = function (settings) {
        if (!settings.user.data || !settings.user.data.name || !settings.project || !settings.project.key  || !isValidReporOrSprint(settings)) {
            toastr.warning("Setting invalid, please try again.")
            $location.path('/settings/config');
            return false;
        }
        return true;
    }
    
    function isValidReporOrSprint(settings){
        if (!settings.isInRangeDates && settings.startDate && settings.endDate)
            return true;
        else
            if (settings.isInRangeDates && settings.project.sprint && settings.project.sprint.id)
                return true;
        return false;
    }

    this.saveProjectsInLocalStorage = function (projects) {
        var settings = this.getSettings();
        settings.jira.projects = projects;
        setInLocalStorage('jiraMobileSettings', settings);
    }

    this.getProject = function () {
        var settings = getItemFromLocalstorage('jiraMobileSettings');
        if (settings)
            return settings.project;
        return this.defaulSettings().project;
    }

    this.getProjects = function () {
        var settings = getItemFromLocalstorage('jiraMobileSettings');
        if (settings)
            return settings.jira.projects;
        else return [];
    }

    this.getSettings = function () {
        var settings = getItemFromLocalstorage('jiraMobileSettings');

        if (settings)
            return settings;
        else
            return this.defaulSettings();
    }

    this.loadSettingForUser = function () {
        var defer = $q.defer();
        $http.get('/getProjects').success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.settings = this.getSettings();

}])

