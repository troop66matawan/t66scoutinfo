app.component('scoutbookServiceActivity', {
    controller: ScoutbookServiceActiviy,
    templateUrl: 'templates/scoutbookServiceActivity.html',
    bindings: {
        scout: '='
    }
});

function ScoutbookServiceActiviy($scope) {
    this.totalNights = function() {
        var nights=0;
        if (this.scout && this.scout._activities && this.scout._activities._service) {
            for (i=0;i<this.scout._activities._service.length;i++) {
                var amount = parseInt(this.scout._activities._service[i]._count);
                nights += amount;
            }
        }
        return nights;
    };
}