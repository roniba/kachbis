'use strict';

//TODO get contacts directly from dapulse (it is password protected..)

var kachBisApp = angular.module('kachBisApp', []);

/* Controllers */
kachBisApp.controller('OrderListCtrl', function($scope, $http){
    var updateOrderListFromServer = function() {
        $http.get('/getOrders').success(function(data) {
            $scope.orderList = data;
        });
    };

    updateOrderListFromServer();
    setInterval(updateOrderListFromServer, 30000);


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
        orderArrived: 'Your food is here!!!',
        undoButtonTitle: 'Oops... Undo!'
    };

    $scope.clickedOrders = {};

    $scope.setOrderArrived = function(order, value) {
        var orderToMark = _.find($scope.orderList, function(curOrder){
            return curOrder.orderId == order.orderId;
        })
        orderToMark.orderArrived = value;
    };

    $scope.setOrderClicked = function(order, value) {
        $scope.clickedOrders[order.orderId] = value;
    };

    $scope.onButtonClick = function(order) {
        var notifyServer = function(order) {
            $http.get('/orderArrived?orderId=' + order.orderId).success(function() {});
        };

        $scope.setOrderClicked(order, true);
        setTimeout(function(){
            if (!$scope.clickedOrders[order.orderId]) {
                return;
            }
            $scope.setOrderArrived(order, true);
            $scope.setOrderClicked(order, false);
            $scope.$apply();
            notifyServer(order);
        }, 3000);
    };

    $scope.onUndoButtonClick = function(order) {
        $scope.setOrderClicked(order, false);
    };



});
