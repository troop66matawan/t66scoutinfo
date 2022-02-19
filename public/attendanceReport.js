app.component('attendanceReport', {
  bindings: {
    scouts: '<'
  },
  templateUrl: 'templates/attendanceReport.html',
  controller: ['ScoutbookDBService','$scope',AttendanceReportController]
});

function AttendanceReportController(ScoutbookDBService, $scope) {
  const _this = this;

  this.$onInit = function() {
    $scope.ScoutbookDBService = ScoutbookDBService;
  };
  _this.getCurrentRankDate = function(scout) {
    let curRankDate = undefined;
    let date = '';
    const curRank = ScoutbookDBService.getCurrentRank(scout);
    if (curRank) {
      curRankDate = ScoutbookDBService.getRankDate(scout,curRank);
    }
    if (curRankDate) {
      date = curRankDate.getMonth()+1 + '/' + curRankDate.getDate()+'/'+curRankDate.getFullYear();
    }
    return date;
  };

}
