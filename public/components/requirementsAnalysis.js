app.component('requirementsAnalysis', {
    controller: RequirementsAnalysis,
    templateUrl: 'templates/requirementsAnalysis.html',
    bindings: {
        results: '<',
        firstName: '<',
        lastName: '<'
    }
});

function RequirementsAnalysis() {
}