app.component('scoutbookCampingActivity', {
    controller: ScoutbookCampingActiviy,
    templateUrl: 'templates/scoutbookCampingActivity.html',
    bindings: {
        scout: '='
    }
});

function ScoutbookCampingActiviy($scope) {
    this.totalNights = function() {
        var nights=0;
        if (this.scout && this.scout._activities && this.scout._activities._camping) {
            for (i=0;i<this.scout._activities._camping.length;i++) {
                var amount = parseInt(this.scout._activities._camping[i]._count);
                nights += amount;
            }
        }
        return nights;
    };
}