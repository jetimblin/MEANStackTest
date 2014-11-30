// public/core.js
var jetEmployee = angular.module('jetEmployee', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all employees and show them
    $http.get('/api/employees')
        .success(function(data) {
            $scope.employees = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createEmployee = function() {
        $http.post('/api/employees', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.employees = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


}