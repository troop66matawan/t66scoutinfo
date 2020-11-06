app.component('meritbadge', {
    templateUrl: 'templates/meritbadge.html',
    controller: MeritBadge,
    bindings: {
        name: '=',
        earnedDate: '=',
    }
});

function MeritBadge(MeritBadgeService) {
    const _this = this;
    _this.visible = true;
    _this.$onInit = function() {
        _this.mbimage = MeritBadgeService.mbmap.get(_this.name);
    };
    _this.onClick = function() {
        _this.visible = !_this.visible;
    };
    _this.getVisibility = function() {
        let visible = 'hidden';
        if (_this.visible) {
            visible = 'visible';
        }
        return visible;
    }
}