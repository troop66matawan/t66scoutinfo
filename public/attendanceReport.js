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

  _this.styleBackground= function(scout, campingPercent) {
    var expectedCampingPercent = 50;
    var style = "";

    if (campingPercent < expectedCampingPercent) {
      if ((campingPercent + 10) >= expectedCampingPercent) {
        style = 'blackonyellow';
      } else if (campingPercent + 20 >= expectedCampingPercent) {
        style = 'whiteonred';
      } else {
        style = 'whiteonblack';
      }
    }

    return style;
  };
}
