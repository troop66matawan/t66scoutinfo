app.component('createMailDistribution', {
    bindings: {
        scouts: '<',
    },
    templateUrl: 'templates/createMailDistrubtion.html',
    controller: ['ScoutbookDBService','CsvDownloadService', CreateMailDistribution]
});

function CreateMailDistribution(ScoutbookDBService, CsvDownloadService ) {
    var _this = this;


    _this.$onInit = function() {
        _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts).sort(function(a,b) {
            if (a._lastName < b._lastName) {
                return -1;
            } else if (a._lastName > b._lastName) {
                return 1;
            } else {
                if (a._firstname < b._firstName) {
                    return -1;
                } else if (a._firstName > b._firstName) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        console.log(JSON.stringify(_this.activeScouts));
        _this.isChecked = [];
        var styleElement = document.getElementById('distribution-creator');
        styleElement.append('@media print { @page { size: letter portrait; } }');
    };

    _this.getContact = function(scout) {
        return ScoutbookDBService.getContact(scout);
    };
    _this.getParents = function(scout) {
        const contact = _this.getContact(scout);
        let parents;
        if (contact && Array.isArray(contact._parents) && contact._parents.length > 0) {
            parents = contact._parents;
        }
        return parents;
    }

    _this.exportRoster = function() {
        let emails = {};
        for (let i =0; i < _this.activeScouts.length; i++) {
            if (_this.isChecked[i]) {
                const scout = _this.activeScouts[i];
                const contact = _this.getContact(scout);
                const parents = _this.getParents(scout);
                if (contact._email1) {
                    emails[contact._email1] = true;
                }
                if (contact._email2) {
                    emails[contact._email2] = true;
                }
                if (parents !== undefined && Array.isArray(parents)) {
                    parents.forEach(function (parent) {
                        if (parent._email1) {
                            emails[parent._email1] = true;
                        }
                        if (parent._email2) {
                            emails[parent._email2] = true;
                        }
                    })
                }
            }
        }
        const emailList = Object.keys(emails);
        console.log(JSON.stringify(emailList));
        _this.distCSV = "Group Email [Required],Member Email,Member Type,Member Role\n";
        emailList.forEach(function(email) {
            _this.distCSV += `${_this.distributionEmail},${email},USER,MEMBER\n`;
        })
    };

    _this.downloadCSV = function() {
        var csvString = CsvDownloadService.encodeCSV();
        csvString += 'BSA Member ID,Last Name,First Name,DOB,Rank,Patrol\r\n';
        _this.scouts.forEach(function(scout) {
            if (scout._bsaID !== undefined) {
                csvString += scout._bsaID + ',';
                csvString += scout._lastName + ',';
                csvString += scout._firstName + ',';
                var date = scout._dateOfBirth;
                csvString += (date.month + 1) + '/' + date.date + '/' + (1900 + date.year) + ',';
                csvString += RankAdvancement.getCurrentRankText(scout._rankAdvancement) + ',';
                csvString += scout._patrol + '\r\n';
            }
        });
        CsvDownloadService.downloadCsv(csvString,'roster', 'rosterDownload' );
    };
}
