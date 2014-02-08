'use strict';

//TODO get contacts directly from dapulse (it is password protected..)

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

    $scope.onButtonClick = function(order) {
        var notifyServer = function(order) {

        };
        var markOrderAsArrived = function(order) {
            var orderToMark = _.find($scope.orderList, function(curOrder){
                return curOrder.orderId == order.orderId;
            })
            orderToMark.orderArrived = true;
        };
        markOrderAsArrived(order);
        notifyServer(order);
    };

});
