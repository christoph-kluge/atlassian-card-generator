angular.module('jiraCardApp')
    .controller('AppCtrl', function ($scope, jiraProvider) {

        /**
         * logged in state
         * @type {boolean}
         */
        $scope.isLoggedIn = false;
        $scope.jiraUsername = '';

        /**
         * tickets to pass into card selector
         * @type {Array}
         */
        $scope.hasTickets = false;
        $scope.tickets = [];

        /**
         * cards to be printed
         * @type {Array}
         */
        $scope.hasCards = false;
        $scope.cards = [];

        /**
         * when user is logged in.. prepare different views
         */
        $scope.$on('isLoggedIn', function (scope, element, attrs) {
            $scope.isLoggedIn = true;
            $scope.jiraUsername = element.location;
        });

        /**
         * when tickets wizard is complete
         */
        $scope.$on('ticketsAreLoaded', function (scope, element, attrs) {
            $scope.hasTickets = true;
            $scope.tickets = element.tickets;
        });

        /**
         * when tickets wizard is complete
         */
        $scope.$on('generateCards', function (scope, element, attrs) {
            $scope.isCardView = true;
            $scope.hasCards = true;
            $scope.cards = element.cards;

            console.log(element.cards);
        });
    }
);