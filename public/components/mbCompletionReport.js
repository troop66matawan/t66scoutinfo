app.component('mbCompletionReport', {
    bindings: {
        scouts: '<'
    },
    templateUrl: 'templates/mbCompletionReport.html',
    controller: ['ScoutbookDBService', 'ScoutbookDBService','RankPatchFactory','CsvDownloadService','MeritBadgeService', MbCompletionController]
});

function MbCompletionController(ScoutbookDBService, ScoutbookDBService, RankPatchFactory, CsvDownloadService, MeritBadgeService ) {
    var _this = this;

    _this.$onInit = function() {
        _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts)
        _this.mbList = Array.from(MeritBadgeService.mbmap.keys());
        _this.selectedMB = _this.mbList[0];
        _this.haveMeritBadge = false;
        _this.setSelected();
    }

    _this.setSelected = function() {
        _this.scoutsNeedingMB = [];
        _this.activeScouts.forEach((scout) => {
           const advancement = scout._advancement;
           if (advancement !== undefined && advancement._meritBadges !== undefined) {
               const mb = advancement._meritBadges[_this.selectedMB];
               if (_this.haveMeritBadge) {
                   if (mb !== undefined && mb._isApproved === true) {
                       _this.scoutsNeedingMB.push(scout);
                   }
               } else {
                   if (mb === undefined || mb._isApproved !== true) {
                       _this.scoutsNeedingMB.push(scout);
                   }
               }
           } else {
               if (!_this.haveMeritBadge) {
                   _this.scoutsNeedingMB.push(scout);
               }
           }
        });
    }
}
