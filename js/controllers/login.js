angular.module('jiraCardApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $timeout, $log, $http, promiseTracker, jiraProvider) {
        $scope.submitted = false;
        $scope.location = 'https://localcommerce.atlassian.net';

        $scope.submit = function (form) {
            // Trigger validation flag.
            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                return;
            }

            /**
             * set config into provider
             */
            jiraProvider.setBaseUrl("https://cors-anywhere.herokuapp.com/" + $scope.location + '/rest/api/latest');
            jiraProvider.setBaseAuth($scope.username, $scope.pass);

            /**
             * start first try..
             */
            $scope.progress = promiseTracker('progress');
            jiraProvider.getProjects()
                .success(function (data, status, headers, config) {
                    $rootScope.$broadcast('isLoggedIn', {
                        'username': $scope.username
                    });
                })
                .error(function (data, status, headers, config) {
                    $scope.progress = data;
                    $scope.messages = 'There was a network error. Try again later.';
                    $log.error(data);
                }
            );

            // Hide the status message which was set above after 3 seconds.
            $timeout(function () {
                $scope.messages = null;
            }, 3000);
        };

    }
);