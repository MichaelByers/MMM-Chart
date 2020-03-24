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

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);
            var covidData = null; // Clear the array

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) { 
                covidData = result;
            } else {
                // In all other cases it's some other error
            }

            // We have the response figured out so lets fire off the notifiction
            _this.sendSocketNotification('GOT-COVID', {'url': _this.url, 'covidData': covidData});
        });
    },

    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-COVID') {
            this.getCovidData(payload);
        }
    }

});
