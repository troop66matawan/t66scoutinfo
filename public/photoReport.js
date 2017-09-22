app.component('photoReport', {
  bindings: {
    scouts: '<'
  },
  template: '<div class="photoreportcontainer">'+
  '<div class="header">Scout Photo Report</div>' +
  '<div class="photoreport">' +
  '<div class="scoutphoto" ng-repeat="scout in $ctrl.scouts">' +
    '<scoutimage class="scout"  scout="scout"></scoutimage>' +
    '<scoutname scout="scout"></scoutname>' +
  '</div></div></div><div>'
});