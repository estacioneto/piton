(function () {
    var noteModule = angular.module('note', []);

    noteModule.factory('Note', ['$http', '$rootScope', function ($http, $rootScope) {

        var NOTE_ENDPOINT = $rootScope.apiRoot + "/notes/";

        var NOTES = $rootScope.apiRoot + "/notes";

        /**
         * Note constructor.
         * @param data Custom data to fill note.
         */
        function Note(data) {
            this._data = {};
            this.dateAndTime = '';

            if (_.isString(data)) {
                this._id = data;
            } else if (data) {
                this.buildThis(data);
                return;
            }

            this.title = '';
            this.textContent = '';
            this.todos = [];
            this.active = true;
            this.tags = [];
            this.scheduling = null;
            this.color = 'yellow-A100'; // Default yellow
        }

        Note.prototype.constructor = Note;

        /**
         * Builds Scheduling Date object and returns only 
         * server properties from this Note.
         * @return JSON with Note server properties.
         */
        Note.prototype.getJson = function () {
            this.buildScheduling();
            return this._data;
        };

        /**
         * Builds this note with custom properties.
         * @param data Properties.
         */
        Note.prototype.buildThis = function (data) {
            var self = this;
            _.each(props, function (prop) {
                self._data[prop] = angular.copy(data[prop]);
            });
            if (data.scheduling) {
                this.scheduling = new Date(data.scheduling);
            }
            this.dateAndTime = "";
            this.schedulingColor = data.schedulingColor;
            this.buildDateAndTime();
            this.updateSchedulingColor();
        };

        /**
         * Builds scheduling as a Date object, using 
         * date and time in dateAndTime.
         * dateAndTime is in format 'DD/MM/YYYY hh:mm',
         * it's converted to 'YYYY/MM/DD hh:mm' and then
         * into a Date object to the property scheduling.
         */
        Note.prototype.buildScheduling = function () {
            if (this.dateAndTime) {
                var yyyymmdd = '';
                var temp = this.dateAndTime.split(' ');
                var date = _.first(temp).split('/');
                var hour = _.last(temp);

                date = _.reverse(date);
                yyyymmdd = _.join(date, "/");

                this.scheduling = new Date(yyyymmdd + ' ' + hour);
            }
        };

        /**
         * Builds Date and Time from Scheduling Date object.
         * The directive uses date in form 'DD/MM/YYYY hh:mm'
         * and in scheduling it's 'YYYY/MM/DD hh:mm:ss'. After
         * formatting it's set to property dateAndTime.
         */
        Note.prototype.buildDateAndTime = function () {
            if (this.scheduling) {
                var day = this.scheduling.getDate();
                var month = this.scheduling.getMonth() + 1;
                var year = this.scheduling.getFullYear();
                var hour = this.scheduling.getHours();
                var minutes = this.scheduling.getMinutes();

                if (day < 10) { day = '0' + day; }
                if (month < 10) { month = '0' + month; }
                if (hour < 10) { hour = '0' + hour; }
                if (minutes < 10) { minutes = '0' + minutes; }

                this.dateAndTime = day + '/' + month + '/' + year + ' ' + hour + ':' + minutes;
            }
        };

        /**
         * Save a note, or creates if it's a new Note.s
         */
        Note.prototype.save = function () {
            var toSave = this.getJson();
            var promise;
            var self = this;
            if (toSave._id) {
                promise = $http.patch(NOTE_ENDPOINT + toSave._id, toSave);
            } else {
                promise = $http.post(NOTES, toSave);
                promise.then(function (data) {
                    self.buildThis(data.data);
                }, function (err) {
                    // TODO: verificar onde realmente precisa colocar
                    // avisos de erros nas requisições. Eric Breno
                });
            }
            return promise;
        };

        /**
         * Load a note from server.
         */
        Note.prototype.load = function () {
            var promise = $http.get(NOTE_ENDPOINT + this._id);
            var self = this;
            promise.then(function (data) {
                self.buildThis(data.data);
            }, function (err) { });
            return promise;
        };

        /**
         * Deletes itself from server.
         */
        Note.prototype.del = function () {
            return $http.delete(NOTE_ENDPOINT + this._id);
        };

        /**
         * Updates one note color, if needed, depending on
         * how far it's from the scheduling time. If there's
         * no scheduling, the custom color is applied,
         * if there is no custom color, default yellow is
         * applied.
         */
        Note.prototype.updateSchedulingColor = function () {
            var colors = {
                0: 'red',   // Done
                1: 'amber-800',         // < 12 hours
                2: 'green',  // > 12 hours
                4: ''                   // no scheduling 
            };

            var colorCode = getHoursToSchedule(this);
            this.schedulingColor = colors[colorCode];
        };

        /**
         * Removes the todo from the todos' list
         *
         * @param {Number} index Index of the todo to be removed.
         */
        Note.prototype.removeTodo = function (index) {
            this.todos.splice(index, 1);
        };

        /**
         * Verifies how close are the note of it's schedule time.
         * If there is no scheduling time, code 4 is returned.
         * If it's greater than 12 hours, code 2 is returned.
         * If it's between 0 and 12 hours, code 1 is returned.
         * Zero is returned otherwise.
         */
        function getHoursToSchedule(note) {
            if (!note.scheduling) {
                return 4;
            }

            var dateNow = new Date();
            var twelveHours = 1000 * 60 * 60 * 12;

            if (note.scheduling.getTime() - dateNow.getTime() > twelveHours) {
                return 2;
            }
            if (note.scheduling.getTime() < dateNow.getTime()) {
                return 0;
            }
            return 1;
        }

        var props = ['_id', 'title', 'textContent', 'todos', 'active', 'tags', 'scheduling', 'color', 'createDate', 'editDate'];

        function defineProp(prop, value) {
            Note.prototype.__defineGetter__(prop, function () {
                return this._data[prop];
            });
            Note.prototype.__defineSetter__(prop, function (value) {
                this._data[prop] = value;
            });
        }
        _.each(props, function (prop) {
            defineProp(prop);
        });

        Note.prototype.__defineGetter__('dateAndTime', function () {
            return this._dateAndTime;
        });

        Note.prototype.__defineSetter__('dateAndTime', function (value) {
            this._dateAndTime = value;
        });

        Note.prototype.__defineGetter__('schedulingColor', function () {
            return this._schedulingColor;
        });

        Note.prototype.__defineSetter__('schedulingColor', function (value) {
            this._schedulingColor = value;
        });

        return Note;
    }]);
} ());