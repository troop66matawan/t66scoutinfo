app.component('rankReport', {
    controller: RankReportController,
    templateUrl: 'templates/rankReport.html',
    bindings: {
        results: '<'
    }
});

function RankReportController(ScoutbookDBConstant, $scope) {
    $scope.ScoutbookDBConstant = ScoutbookDBConstant;

}