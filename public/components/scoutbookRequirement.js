app.component('scoutbookRequirement', {
    controller: ScoutbookRequirement,
    templateUrl: 'templates/scoutbookRequirement.html',
    bindings: {
        requirement: '<'
    }
});

function ScoutbookRequirement() {
    const _this = this;

    _this.$onInit = function() {
        if (_this.requirement === undefined) {
            _this.requirement = {}
        }
        if(_this.requirement._completionDate) {
            _this.completionDate = new Date(_this.requirement._completionDate);
        }
        if (_this.requirement._markedCompleted && _this.requirement._markedCompleted._markedDate) {
            _this.markedDate = new Date(_this.requirement._markedCompleted._markedDate);
        }
        if (_this.requirement._markedApproved && _this.requirement._markedApproved._markedDate) {
            _this.approvedDate = new Date(_this.requirement._markedApproved._markedDate);
        }
    }

    _this.getCheckboxType = function() {
        let type = "check_box_outline_blank";
        if (_this.isComplete()) {
            type = "check_box";
        }
        return type;
    }

    _this.isComplete = function() {
        let complete = false;
        if (_this.completionDate !== undefined) {
            complete = true;
        }
        return complete;
    }

    _this.isApproved = function() {
        let approved = false;
        if (_this.requirement._markedApproved !== undefined) {
            let markedApproved = _this.requirement._markedApproved;
            if (markedApproved._markedBy !== undefined && markedApproved._markedDate !== undefined) {
                approved = true;
            }
        }
        return approved;
    }


}