/* global Module */

/* Magic Mirror
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu https://github.com/MarinescuEvghenii/
 * MIT Licensed.
 */

Module.register("MMM-Chart", {
    defaults: {
        width       : 200,
        height      : 200,
        interval:   120000,
        chartConfig : {}
    },

    getScripts: function() {
		return ["moment.js", "Chart.bundle.min.js"];
	},

    getStyles: function() {
        return ['chart.css', 'font-awesome.css'];
    },

	start: function() {
        Log.log('Starting module: ' + this.name);
        var self = this;

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.covidData = [];
        this.currData = null;
        this.coData = null;
        this.url = ['https://covidtracking.com/api/states?state=CO', 'https://covidtracking.com/api/states/daily?state=CO'];
        this.config = Object.assign({}, this.defaults, this.config);

        this.getCovidData(this);

        setInterval(function() {
            self.getCovidData(self);
          }, self.config.interval);

    },

    getCovidData: function(_this) {
		// get latest data
        _this.sendSocketNotification('GET-COVID', _this.url);
    },

	getDom: function() {
        // Create wrapper element
        var wrapper = document.createElement('div');

        if (this.loaded) {
//	 	    wrapper.className = 'data';
            wrapper.setAttribute("style", "position: relative; display: inline-block;");
            // create today's data row
            dataRow = document.createElement('div');
			var title = 'As of ';
			var today = '';
			var text = '';
            var count = '';
            var dataX = [];
            var dataY = [];
            var dataH = [];

			today = moment(this.currData.dateChecked).format('MMMM Do');
            count = this.currData.positive;
			text = title + today + ' : ' + count;

            dataRow.innerHTML = text;
            wrapper.appendChild(dataRow);
debugger;
            // Create chart canvas
            var chartEl = document.createElement("canvas");
            chartEl.width  = this.config.width;
            chartEl.height = this.config.height;
            // format data
            this.covidData.forEach(function(item){
                dataX.push(moment(item.dateChecked).format('MM-DD'));
                dataY.push(item.positive);
                dataH.push(item.hospitalized);
            });
            // reverse array, currently newest is first
            dataX.reverse();
            dataY.reverse();
            dataH.reverse();
            
            // build chart
            this.config.chartConfig = {
                type: 'line',
                data: {
                  labels: dataX,
                  datasets: [{ 
                      data: dataY,
                      label: "Positive",
                      borderColor: "#3e95cd",
                      fill: false
                    }, { 
                      data: dataH,
                      label: "Hospitalized",
                      borderColor: "#8e5ea2",
                      fill: false
                    }
                  ]
                },
                options: {
                  title: {
                    display: true,
                    text: 'Colorado Cases'
                  }
                }
            };

            // Init chart.js
            this.chart = new Chart(chartEl.getContext("2d"), this.config.chartConfig);

            // Append chart
            wrapper.appendChild(chartEl);

        } else {
            // Otherwise lets just use a simple div
            wrapper.innerHTML = 'LOADING...';
        }

		return wrapper;
    },
    
    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-COVID') {  //&& payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.covidData = payload.covidData;
                this.currData = payload.currData;
                this.coData = payload.coData;
                this.updateDom(1000);
        }
    }

});
