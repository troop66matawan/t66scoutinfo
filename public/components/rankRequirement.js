app.component('rankRequirement', {
    controller: RankRequirement,
    templateUrl: 'templates/rankRequirement.html',
    bindings: {
        requirements: '<',
        onClose: '&'
    }
});

function RankRequirement() {
    const _this = this;

    _this.$onInit = function() {
        if (_this.requirements === undefined) {
            _this.requirements = {}
        }
        if(_this.requirements._requirement !== undefined) {
            _this.rankRequirements = _this.requirementsToArray(_this.requirements._requirement)
        }
    }

    _this.requirementsToArray = function(req) {
        const array = [];
        for (const requirement in req) {
            if (req.hasOwnProperty(requirement)) {
                array.push(req[requirement]);
            }
        }
        return array.sort(_this.sortRequirementsArray);
    }

    _this.sortRequirementsArray = function(e1,e2) {
        const id1 = e1._id;
        const index1 = parseInt(id1,10);
        const id2 = e2._id;
        const index2 = parseInt(id2,10);

        let rval;
        if (index1 < index2) {
            rval = -1;
        } else if (index1 > index2) {
            rval = 1;
        } else {
            // indexes are equal.  Check for alpha.
            const num1 = ''+index1;
            const alpha1 = id1.substr(id1.indexOf(num1)+num1.length);
            const num2 = ''+index2;
            const alpha2 = id2.substr(id2.indexOf(num2)+num2.length);

            if (alpha1 < alpha2) {
                rval = -1;
            } else if (alpha1 > alpha2) {
                rval = 1;
            } else {
                rval =0;
            }
        }
        return rval;
    }
}