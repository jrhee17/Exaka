angular.module('myApp').directive('genericComment', function() {
    return {
        restrict: 'E',
        scope: {
            title: '@',
        },
        transclude: true,
        templateUrl: 'genericComment.html',
        controller: ['$scope', function($scope) {
            $scope.showEdit = false;
            $scope.clicked = function() {
                $scope.showEdit = !$scope.showEdit;
            };
        }]
    };
});

