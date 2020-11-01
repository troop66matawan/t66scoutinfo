app.component('scoutdiv' , {
    templateUrl: 'templates/scoutdiv.html',
    bindings: {
        scout: '<',
    },
    controller: ScoutDivController
});

function ScoutDivController() {
    const _this = this;
    _this.$onChanges = function(changes) {
        if (changes && changes.scout) {
            _this.scout = changes.scout.currentValue;
        }
    };
}
