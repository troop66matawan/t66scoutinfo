app.component('rosterReport', {
  bindings: {
    scouts: '<',
    contacts: '<'
  },
  templateUrl: 'templates/rosterReport.html',
  controller: ['ScoutService',RosterReportController]
});

function RosterReportController(ScoutService) {
  var _this = this;

  _this.$onInit = function() {
    _this.patrols = ScoutService.getPatrols(_this.scouts);
    var styleElement = document.getElementById('rosterReport');
    styleElement.append('@media print { @page { size: letter portrait; } }');
  };

  _this.getContact = function(scout) {
    return ScoutService.getContact(scout, _this.contacts);
  }
};
