angular.module('jiraCardApp')
    .controller('CardCtrl', function ($scope, $rootScope) {

        $scope.getProject = function (card) {
            return card.fields.project.key;
        };
        $scope.getIssueNumber = function (card) {
            return card.key.replace($scope.getProject(card) + '-', '');
        };
        $scope.getTitle = function (card) {
            if (typeof card.fields.parent !== "undefined") {
                return card.fields.parent.fields.summary;
            }
            return card.fields.summary;
        };
        $scope.getSummary = function (card) {
            if($scope.getType(card) === 'Story') {
                return '';
            }
            return card.fields.summary;
        };
        $scope.getType = function (card) {
            return card.fields.issuetype.name;
        };
    }
);