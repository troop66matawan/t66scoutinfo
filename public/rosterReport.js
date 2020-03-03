app.component('rosterReport', {
  bindings: {
    scouts: '<',
    contacts: '<'
  },
  templateUrl: 'templates/rosterReport.html',
  controller: ['ScoutService','CsvDownloadService','RankAdvancement',RosterReportController]
});

function RosterReportController(ScoutService, CsvDownloadService,RankAdvancement) {
  var _this = this;

  _this.$onInit = function() {
    _this.patrols = ScoutService.getPatrols(_this.scouts);
    var styleElement = document.getElementById('rosterReport');
    styleElement.append('@media print { @page { size: letter portrait; } }');
  };

  _this.getContact = function(scout) {
    return ScoutService.getContact(scout, _this.contacts);
  };

  _this.exportRoster = function() {
    var csvString = CsvDownloadService.encodeCSV();
    csvString += 'BSA Member ID,Last Name,First Name,DOB,Rank,Patrol\r\n';
    _this.scouts.forEach(function(scout) {
      if (scout._bsaID !== undefined) {
        csvString += scout._bsaID + ',';
        csvString += scout._lastName + ',';
        csvString += scout._firstName + ',';
        var date = scout._dateOfBirth;
        csvString += (date.month + 1) + '/' + date.date + '/' + (1900 + date.year) + ',';
        csvString += RankAdvancement.getCurrentRankText(scout._rankAdvancement) + ',';
        csvString += scout._patrol + '\r\n';
      }
    });
    CsvDownloadService.downloadCsv(csvString,'roster', 'rosterDownload' );
  };
}
