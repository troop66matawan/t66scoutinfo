angular.module('t66tmweb').component('serviceReport', {
  bindings : {
    scouts: '<',
  },
  templateUrl:   'templates/serviceReport.html',
  controller: ServiceReportController,
 });

function ServiceReportController(ScoutbookActivityService, ScoutbookDBService) {
  const _this = this;
  _this.scoutsNeedService = [];


  _this.$onChanges = function(changes) {
    _this.scouts =  changes.scouts.currentValue;
    _this.scouts.forEach(function(scout) {

      const needed = ScoutbookActivityService.getScoutServiceNeeededForNextRank(scout);
      if (needed && (needed.total > 0  || needed.conservation > 0)) {
        _this.scoutsNeedService.push(scout);
      }
    });
  };

  _this.getCurrentRank = function(scout) {
    return ScoutbookDBService.getCurrentRank(scout);
  }

  _this.getRankDate = function(scout) {
    let date='';
    const rankDate = ScoutbookDBService.getRankDate(scout, ScoutbookDBService.getCurrentRank(scout));
    if (rankDate) {
      date = rankDate.getMonth()+1 + '/' + rankDate.getDate()+'/'+rankDate.getFullYear();
    }
    return date;
  }

  _this.getTotalServiceNeeded = function(scout) {
    let total=-1;
    const needed = ScoutbookActivityService.getScoutServiceNeeededForNextRank(scout);
    if (needed) {
      total = needed.total;
    }
    return total;
  }

  _this.getConservationNeeded = function(scout) {
    let cons=-1;
    const needed = ScoutbookActivityService.getScoutServiceNeeededForNextRank(scout);
    if (needed) {
      cons = needed.conservation;
    }
    return cons;
  }
}
