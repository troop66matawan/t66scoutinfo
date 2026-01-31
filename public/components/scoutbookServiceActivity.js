app.component('scoutbookServiceActivity', {
    controller: ['ScoutbookDBService',ScoutbookServiceActiviy],
    templateUrl: 'templates/scoutbookServiceActivity.html',
    bindings: {
        scout: '<',
    }
});

function ScoutbookServiceActiviy(ScoutbookDBService) {
    const _this=this;

    _this.$onChanges = function(changes) {
        if (changes && changes.scout) {
            _this.scout = changes.scout.currentValue;
            _this.scoutBSA_Service = undefined;
            if (_this.scout && _this.scout._activities && _this.scout._activities._service) {
                _this.scoutBSA_Service = ScoutbookDBService.getScoutsBSAService(_this.scout);
            }
        }
    };
    _this.totalNights = function() {
        var nights=0;
        //if (this.scout && this.scout._activities && this.scout._activities._service) {
        if (_this.scoutBSA_Service) {
            for (i=0;i< _this.scoutBSA_Service.length;i++) {
                var amount = parseFloat(_this.scoutBSA_Service[i]._count);
                nights += amount;
            }
        }
        return nights;
    };
}