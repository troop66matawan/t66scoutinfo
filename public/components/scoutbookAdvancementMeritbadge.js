app.component('scoutbookAdvancementMeritbadge', {
    controller: ScoutbookAdvancementMeritbadge,
    templateUrl: 'templates/scoutbookAdvancementMeritbadge.html',
     bindings: {
        scout: '='
    }
});

function ScoutbookAdvancementMeritbadge  (EagleRequired, $scope) {
    const _this = this;
    _this.meritBadges = [];

    $scope.$watch(
        // This function returns the value being watched. It is called for each turn of the $digest loop
        function() { return _this.scout; },
        // This is the change listener, called when the value returned from the above function changes
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                if (_this.scout && _this.scout._advancement && _this.scout._advancement._meritBadges) {
                    const mbKeys = Object.keys(_this.scout._advancement._meritBadges);
                    _this.meritBadges = [];
                    for (let i=0; i< mbKeys.length;i++) {
                        _this.meritBadges.push(_this.scout._advancement._meritBadges[mbKeys[i]]);
                    }
                }
            }
        },
        true);

    _this.needEagleReq = function(scout) {
        return EagleRequired.needEagleReq(scout, true);
    }
}