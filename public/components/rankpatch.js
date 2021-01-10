app.component('rankpatch', {
    templateUrl: 'templates/rankPatch.html',
    controller: RankPatchController,
    bindings: {
        rank: '@',
        advancement: '<'
    }
});

function RankPatchController(RankPatchFactory) {
    const _this = this;
    _this.rpf = RankPatchFactory;
    _this.showRequirements = false;

    _this.isValidDate = function() {
        var rv = false;
        if (_this.advancement && _this.advancement._completionDate)
            rv = true;

        return rv;
    };
    _this.getRankPatch = function(rank,date) {
        const dateObj = new Date(date);
        return _this.rpf.getPatchUrl(rank,dateObj);
    }
    _this.openRequirements = function() {
        _this.showRequirements = true;
        console.log('open');
    }
    _this.closeRequirements = function() {
        _this.showRequirements = false;
    }
}