angular.module('jiraCardApp')
    .controller('TicketCtrl', function ($scope, $rootScope) {

        // selected tickets
        $scope.selection = [];
        $scope.selectedTickets = {};

        $scope.$on('ticketsAreLoaded', function (scope, element, attrs) {
            $scope.selection = [];
            $scope.selectedTickets = {};

            angular.forEach(element.tickets, function (elem, key) {
                $scope.toggleSelection(elem.key);
                $scope.selectedTickets[elem.key] = elem;

                if (typeof elem.subtasks !== "undefined" && elem.subtasks !== null) {
                    $scope.selectedTickets[elem.key].subtasks = null; // remove subtasks..

                    angular.forEach(elem.subtasks, function (subElem, subKey) {
                        $scope.toggleSelection(subElem.key);
                        $scope.selectedTickets[subElem.key] = subElem;
                    });
                }
            });
        });

        // toggle selection for a given ticket
        $scope.toggleSelection = function toggleSelection(ticketKey) {
            var idx = $scope.selection.indexOf(ticketKey);

            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            } else {
                $scope.selection.push(ticketKey);
            }
        };

        /**
         * generate cards and publish to rootScope..
         */
        $scope.generateCards = function () {
            var cards = [],
                ticketKey = null;

            for (var idx in $scope.selection) {
                ticketKey = $scope.selection[idx];
                cards.push(
                    $scope.selectedTickets[ticketKey]
                );
            }

            $rootScope.$broadcast('generateCards', {
                'cards': cards
            });
        };

    }
);