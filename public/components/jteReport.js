app.component('jteReport', {
    controller: JteReportController,
    templateUrl: 'templates/jteReport.html',
    bindings: {
        results: '<'
    }
});

function JteReportController() {
    const _this = this;

    _this.getCurrentYear = function() {
        return new Date().getFullYear();
    }

    _this.getAdvPercentage = function() {
        const percent = _this.results.advancement.advancedOneRankThisYear / _this.results.advancement.totalScouts;
        return ((percent * 100).toFixed(2));
    }
}