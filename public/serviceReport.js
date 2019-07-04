angular.module('t66tmweb').component('serviceReport', {
  bindings : {
    scouts: '<',
  },
  templateUrl:   'templates/serviceReport.html',
  controller: ServiceReportController,
 });

function ServiceReportController(RankAdvancement) {
  const _this = this;
  _this.scoutsNeedService = [];

  _this.getRankDate = function(rankAdv) {
    return RankAdvancement.getCurrentRankDate(rankAdv);
  };


  _this.$onChanges = function(changes) {
    _this.scouts =  changes.scouts.currentValue;
    _this.scouts.forEach(function(scout) {

      if (scout._rankAdvancement && scout._rankAdvancement._neededServiceHours &&
        scout._rankAdvancement._neededServiceHours > 0 ) {
        _this.scoutsNeedService.push(scout);
      }
    });
  };
}
