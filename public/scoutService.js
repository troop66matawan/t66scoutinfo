angular.module('t66tmweb').service('ScoutService', ScoutService);

function ScoutService() {
  var _this = this;

  /**
   * @function getPatols
   * @param {Array} scouts - array of scouts
   * @returns {Array} array of patrol names
   */
  _this.getPatrols = function(scouts) {
    var patrols = [];

    for (var i=0; (scouts instanceof Array) && i < scouts.length; ++i) {
      var patrolName = scouts[i]._patrol;
      if (patrolName !== undefined && patrols.indexOf(patrolName) === -1) {
        patrols.push(patrolName);
      }
    }
    return patrols;
  };

  _this.getContact = function(scout, contacts) {
    var contact;
    var name = scout._firstName + scout._lastName;
    if (contacts.hasOwnProperty(name)) {
      contact = contacts[name];
    }
    return contact;
  };
};

