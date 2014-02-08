'use strict';

var kachBisApp = angular.module('kachBisApp', []);

/* Controllers */
kachBisApp.controller('OrderListCtrl', function($scope, $http){
    $http.get('data/orders.json').success(function(data) {
        $scope.orderList = data.orders;
    });

    $http.get('data/contacts.json').success(function(data) {
        var dapulseContacts = data.contacts;

        $scope.users = {};
        dapulseContacts.forEach(function(contact){
            $scope.users[contact.email] = {
                email: contact.email,
                photoUrl: contact.photo_url,
                name: contact.full_name
            };
        });
    });

    $http.get('data/restaurants.json').success(function(data) {
        $scope.restaurants = data;
    });

    $scope.orderProperty = 'time';

    $scope.lang = {
        time: 'זמן',
        mainOrdererId: 'מזמין',
        restaurantId: 'מסעדה',
        orderArrived: 'Your food is here!!!'
    };


});
