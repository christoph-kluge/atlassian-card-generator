angular.module('jiraCardApp')
    .controller('WizardCtrl', function ($scope, $rootScope, jiraProvider) {

        /**
         * define constants
         * @type {{SPRINT: string, BOARD: string, TICKETS: string, XBOARD: string}}
         */
        $scope.type = {
            SPRINT: 'sprint',
            TICKETS: 'tickets'
        };

        /**
         * define initial types
         * @type {*[]}
         */
        $scope.types = [
            {id: $scope.type.SPRINT, name: 'Jira Finder'},
            {id: $scope.type.TICKETS, name: 'Comma Seperated Tickets'}
        ];

        $scope.isLoading = false;

        /**
         * define wizard data
         * @type {{type: string, project: null, sprint: null, board: null, tickets: null, fixVersion: null}}
         */
        $scope.wizard = {
            type: null,
            project: null,
            fixVersion: null,
            tickets: null
        };

        /**
         * define collection data
         * @type {{project: Array, sprint: Array, board: Array, tickets: Array, fixVersion: Array}}
         */
        $scope.collection = {};
        $scope.tickets = [];

        /**
         * define wizard functions
         */
        $scope.changeType = function () {
            $scope.wizard.project = null;
            $scope.wizard.fixVersion = null;
            $scope.wizard.tickets = null;

            $scope.typeHandler($scope.wizard.type);
        };

        $scope.typeHandler = function (type) {
            switch (type.id) {
                case $scope.type.SPRINT:
                    $scope.isLoading = true;
                    jiraProvider.getProjects()
                        .success(function (data, status, headers, config) {
                            $scope.collection['project'] = data;
                            $scope.isLoading = false;
                        });
                    break;
            }
        };

        $scope.isApplied = function (type) {
            if (typeof $scope.wizard[type] === 'undefined') {
                return false;
            }
            if ($scope.wizard[type] === null) {
                return false;
            }
            if (!$scope.wizard[type].hasOwnProperty('id') && !$scope.wizard[type].hasOwnProperty('key')) {
                return false;
            }
            return true;
        };

        $scope.isType = function (type) {
            if (false === $scope.isApplied('type')) {
                return false;
            }
            return $scope.wizard.type.id === type;
        };

        $scope.canShow = function (type) {
            if ($scope.isLoading) {
                return false;
            }

            if (!$scope.isApplied('type')) {
                return false;
            }

            switch (type) {
                case 'project':
                    return $scope.isType($scope.type.SPRINT);
                case 'tickets':
                    return $scope.isType($scope.type.TICKETS);
                case 'fixVersion':
                    return $scope.isApplied('project');
                case 'submit':
                    if ($scope.isType($scope.type.SPRINT)) {
                        if (!$scope.isApplied('project')) {
                            return false;
                        }
                        if (!$scope.isApplied('fixVersion')) {
                            return false;
                        }
                    }
                    return true;
            }
            return false;
        };

        $scope.getCollection = function (type) {
            if (typeof $scope.collection[type] === 'undefined') {
                return [];
            }
            return $scope.collection[type];
        };

        $scope.selectHandler = function (type) {
            switch (type) {
                case 'project':
                    if ($scope.isApplied('project')) {
                        $scope.isLoading = true;
                        jiraProvider.getProject($scope.wizard.project.id)
                            .success(function (data, status, headers, config) {
                                $scope.collection['fixVersion'] = data.versions;
                                $scope.isLoading = false;
                            });
                    }
                    break;
            }
        };

        $scope.submit = function (form) {
            if ($scope.isType($scope.type.TICKETS)) {
                if (typeof $scope.collection['tickets'] === "undefined" || $scope.collection['tickets'] === null) {
                    return false;
                }

                var tickets = $scope.collection['tickets'].split(",").map(λ("_.trim()")).map(λ("_.toUpperCase()"));

                $scope.isLoading = true;
                jiraProvider.getTicketsById(tickets)
                    .success(function (data, status, headers, config) {
                        $scope.isLoading = false;
                        $rootScope.$broadcast('ticketsAreLoaded', {
                            tickets: data.issues
                        });
                    });
            }

            if ($scope.isType($scope.type.SPRINT)) {
                var projectId = $scope.wizard.project.id,
                    fixVersion = $scope.wizard.fixVersion.id;

                jiraProvider.doSearch("project = " + projectId + " and fixVersion = " + fixVersion + " and status not in ('closed', 'resolved') ORDER BY key")
                    .success(function (data, status, headers, config) {
                        $scope.isLoading = false;
                        $rootScope.$broadcast('ticketsAreLoaded', {
                            tickets: data.issues
                        });
                    });
            }
        };
    }
);