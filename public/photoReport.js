app.component('photoReport', {
  bindings: {
    scouts: '<'
  },
  template: '<div class="photoreportcontainer">'+
  '<div class="header">Scout Photo Report</div>' +
  '<div class="photoreport">' +
  '<div class="scoutphoto" ng-repeat="scout in $ctrl.activeScouts">' +
    '<scoutimage class="scout"  scout="scout"></scoutimage>' +
    '<scoutname scout="scout"></scoutname>' +
  '</div></div></div><div>',
  controller: ['ScoutbookDBService',PhotoReportController]
});

function PhotoReportController(ScoutbookDBService) {
  const _this = this;

  _this.$onInit = function() {
    _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts).sort(function(a,b) {
      if (a._lastName < b._lastName) {
        return -1;
      } else if (a._lastName > b._lastName) {
        return 1;
      } else {
        if (a._firstName < b._firstName) {
          return -1;
        } else if (a._firstName > b._firstName) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }
}