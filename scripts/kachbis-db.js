
var fs = require('fs');

exports.init = function() {
    exports.db = new KachbisDB();
};

exports.getOrders = function() {
    return exports.db.orders;
};

exports.addOrder = function(order) {
    exports.db.addOrder(order);
};

exports.setOrderArrived = function(orderId) {
    exports.db.setOrderArrived(orderId);
};

// ------------------------------

function KachbisDB() {
    this.loadOrders();
    this.loadRestaurants();
    this.contacts();
}

KachbisDB.prototype.loadOrders = function() {
    var data = fs.readFileSync("./app/data/orders.json", 'utf8');
    this.orders = JSON.parse(data).orders;
};

KachbisDB.prototype.loadRestaurants = function() {
    var data = fs.readFileSync("./app/data/restaurants.json", 'utf8');
    this.restaurants = JSON.parse(data);
};

KachbisDB.prototype.contacts = function() {
    var data = fs.readFileSync("./app/data/contacts.json", 'utf8');
    this.contacts = JSON.parse(data).contacts;
};

KachbisDB.prototype._updateOrdersFile = function() {
    var dataToWrite = JSON.stringify({"orders": this.orders});

    fs.writeFile("./app/data/orders.json", dataToWrite, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Orders.json was successfully updated");
        }
    });
}

KachbisDB.prototype.addOrder = function(order) {
    var date = this._getCurrentDate();
    var mainOrdererId = order.mainOrdererId;

    for (var i=0; i<this.orders.length; i++) {
        var curOrder = this.orders[i];
        if (curOrder.mainOrdererId == order.mainOrdererId && curOrder.date == date) {
            curOrder.ordererIds = curOrder.ordererIds.concat(order.ordererIds);
            this._updateOrdersFile();
            return;
        }
    }

    order.id = Date.now();
    order.date = date;
    this.orders.push(order);
    this._updateOrdersFile();
};

KachbisDB.prototype.setOrderArrived = function(orderId) {
    for (var i=0; i<this.orders.length; i++) {
        var curOrder = this.orders[i];
        if (curOrder.orderId == orderId) {
            curOrder.orderArrived = true;
            this._updateOrdersFile();
            return;
        }
    }
};

KachbisDB.prototype._getCurrentDate = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if (month<10) {
        month = "" + 0 + "" + month;
    }
    var day = date.getDate();
    return year + "" + month + "" + day;
}