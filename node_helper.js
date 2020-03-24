/* Magic Mirror Module: MMM-Travel-Time helper
 * Version: 1.0.0
 *
*/

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Chart helper, started...');
    },


    getCovidData: function(payload) {

        var _this = this;
        this.url = payload;
        var currData = null; // Clear the array
        var covidData = null; // Clear the array

        request({url: this.url[0], method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) { 
                _this.currData = result;
            } else {
                // In all other cases it's some other error
            }
        });

        request({url: this.url[1], method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) { 
                _this.covidData = result;
            } else {
                // In all other cases it's some other error
            }
        });

        // We have the response figured out so lets fire off the notifiction
        this.sendSocketNotification('GOT-COVID', {'url': this.url, 'currData': this.currData, 'covidData': this.covidData});
 
    },

    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-COVID') {
            this.getCovidData(payload);
        }
    }

});
