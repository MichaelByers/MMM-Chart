/* Magic Mirror Module: MMM-Travel-Time helper
 * Version: 1.0.0
 *
*/

var NodeHelper = require('node_helper');
var request = require('request');
var csvToJson = require('convert-csv-to-json');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Chart helper, started...');
    },


    getCovidData: function(payload) {

        var _this = this;
        this.url = payload;
        var currData = null; // Clear the array
        var covidData = null; // Clear the array
        var coData = null;

        request({url: this.url[0], method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) { 
                _this.currData = result;
                request({url: _this.url[1], method: 'GET'}, function(error, response, body) {
                    // Lets convert the body into JSON
                    var result = JSON.parse(body);
        
                    // Check to see if we are error free and got an OK response
                    if (!error && response.statusCode == 200) { 
                        _this.covidData = result;
                        _this.coData = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv('https://drive.google.com/drive/folders/1bBAC7H-pdEDgPxRuU_eR36ghzc0HWNf1/cofid19_case_summary_2020-04-27.csv');
                        // We have the response figured out so lets fire off the notifiction
                        _this.sendSocketNotification('GOT-COVID', {'url': _this.url, 'currData': _this.currData, 'covidData': _this.covidData, 'coData': _this.coData});
                    } else {
                        // In all other cases it's some other error
                    }
                }); 
            } else {
                // In all other cases it's some other error
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-COVID') {
            this.getCovidData(payload);
        }
    }

});
