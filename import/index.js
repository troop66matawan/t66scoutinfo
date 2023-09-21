const ScoutImporter = require('scoutbook-scouts-importer');
const AdvancementImporter = require('scoutbook-advancement-importer');
const ActivityImporter = require('scoutbook-activities-importer');
const LeadershipImporter = require('scoutbook-leadership-importer');
const IAActivityImporter = require('ia-activity-importer');
const admin = require('firebase-admin');
const csvToJson = require('csvtojson');
const RankAdvancement = require('./rankAdvancement');

const t66App = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://t66scoutinfo.firebaseio.com'
});
const dbInst = t66App.database();
const t66scoutbookDb = dbInst.ref('scoutbookDb');

function mergeContactInfo(scouts, pathToContactCSV) {
    function findScout(scouts, name) {
        let scout = undefined;
        if (scouts) {
            scoutKeys = Object.keys(scouts);
            for (var i=0; i < scoutKeys.length; i++) {
                const k = scoutKeys[i];
                const s = scouts[k];
                if (name.bsaId && name.bsaId === s.bsaId) {
                    return s;
                }
                if (s.firstName === name.firstName && s.lastName === name.lastName) {
                    return s;
                }
                if (s.nickname === name.firstName && s.lastName === name.lastName) {
                    return s;
                }
            }
        }
        return scout;
    }

    return csvToJson()
        .on('header', function (header) {
            console.log(header);
        })
        .fromFile(pathToContactCSV)
        .then(function (importedData) {
            importedData.forEach(contactRecord => {
                const contact = {};
                const lastName = contactRecord['Last Name'];
                const firstName = contactRecord['First Name'];
                const nickName = contactRecord['Nickname'];
                const bsaID = contactRecord['BSA ID#'];
                const dob = contactRecord['Date of Birth'];
                const joinedUnit = contactRecord['Joined Unit']

                contact._address1 = contactRecord['Home Address Line 1'];
                contact._address2 = contactRecord['Home Address Line 2'];
                contact._city = contactRecord['Home City'];
                contact._state = contactRecord['Home State'];
                contact._zip = contactRecord['Home Zip'];
                contact._homePhone = contactRecord['Home Phone'];
                contact._cellPhone = contactRecord['Cell Phone'];
                contact._email1 = contactRecord['Email #1'];
                contact._parents = [];
                const parent1Relation = contactRecord['Parent #1 Relation'];

                if (parent1Relation.length > 0) {
                    const parent1 = {};
                    parent1._relation = parent1Relation;
                    parent1._lastName = contactRecord['Parent #1 Last Name'];
                    parent1._firstName = contactRecord['Parent #1 First Name'];
                    parent1._suffix = contactRecord['Parent #1 Suffix'];
                    parent1._nickName = contactRecord['Parent #1 Nickname'];
                    //Parent #1 Sex (M/F),
                    parent1._homePhone = contactRecord['Parent #1 Home Phone'];
                    parent1._workPhone = contactRecord['Parent #1 Work Phone'];
                    parent1._cellPhone = contactRecord['Parent #1 Cell Phone'];
                    parent1._email1 = contactRecord['Parent #1 Email #1'];
                    parent1._email2 = contactRecord['Parent #1 Email #2'];
                    parent1._employer = contactRecord['Parent #1 Employer'];
                    parent1._occupation = contactRecord['Parent #1 Occupation'];
                    contact._parents.push(parent1);
                }

                const parent2Relation = contactRecord['Parent #2 Relation'];
                if (parent2Relation.length > 0) {
                    const parent2 = {};
                    parent2._relation = parent2Relation;

                    parent2._lastName = contactRecord['Parent #2 Last Name'];
                    parent2._firstName = contactRecord['Parent #2 First Name'];
                    parent2._suffix = contactRecord['Parent #2 Suffix'];
                    parent2._nickName = contactRecord['Parent #2 Nickname'];
                    //Parent #2 Sex (M/F),
                    parent2._homePhone = contactRecord['Parent #2 Home Phone'];
                    parent2._workPhone = contactRecord['Parent #2 Work Phone'];
                    parent2._cellPhone = contactRecord['Parent #2 Cell Phone'];
                    parent2._email1 = contactRecord['Parent #2 Email #1'];
                    parent2._email2 = contactRecord['Parent #2 Email #2'];
                    parent2._employer = contactRecord['Parent #2 Employer'];
                    parent2._occupation = contactRecord['Parent #2 Occupation'];
                    contact._parents.push(parent2);
                }

                const parent3Relation = contactRecord['Parent #3 Relation'];

                if (parent3Relation.length > 0) {
                    const parent3 = {};
                    parent3._relation = parent3Relation;
                    parent3._lastName = contactRecord['Parent #3 Last Name'];
                    parent3._firstName = contactRecord['Parent #3 First Name'];
                    parent3._suffix = contactRecord['Parent #3 Suffix'];
                    parent3._nickName = contactRecord['Parent #3 Nickname'];
                    //Parent #3 Sex (M/F),
                    parent3._homePhone = contactRecord['Parent #3 Home Phone'];
                    parent3._workPhone = contactRecord['Parent #3 Work Phone'];
                    parent3._cellPhone = contactRecord['Parent #3 Cell Phone'];
                    parent3._email1 = contactRecord['Parent #3 Email #1'];
                    parent3._email2 = contactRecord['Parent #3 Email #2'];
                    parent3._employer = contactRecord['Parent #3 Employer'];
                    parent3._occupation = contactRecord['Parent #3 Occupation'];
                    contact._parents.push(parent3);
                }
                
                const parent4Relation = contactRecord['Parent #4 Relation'];

                if (parent4Relation.length > 0) {
                    const parent4 = {};
                    parent4._relation = parent4Relation;
                    parent4._lastName = contactRecord['Parent #4 Last Name'];
                    parent4._firstName = contactRecord['Parent #4 First Name'];
                    parent4._suffix = contactRecord['Parent #4 Suffix'];
                    parent4._nickName = contactRecord['Parent #4 Nickname'];
                    //Parent #4 Sex (M/F),
                    parent4._homePhone = contactRecord['Parent #4 Home Phone'];
                    parent4._workPhone = contactRecord['Parent #4 Work Phone'];
                    parent4._cellPhone = contactRecord['Parent #4 Cell Phone'];
                    parent4._email1 = contactRecord['Parent #4 Email #1'];
                    parent4._email2 = contactRecord['Parent #4 Email #2'];
                    parent4._employer = contactRecord['Parent #4 Employer'];
                    parent4._occupation = contactRecord['Parent #4 Occupation'];
                    contact._parents.push(parent4);
                }

                let scout = findScout(scouts, {bsaId: bsaID, firstName: firstName, lastName: lastName, nickname: nickName });

                if (scout) {
                    scout._contactInfo = contact;
                    scout._dateJoinedUnit = joinedUnit;
                    if (scout.dob === undefined || scout.dob === '') {
                        scout.dob = dob;
                    }
                }
            });
            return scouts;
        });
}

if (process.argv.length !== 8) {
    console.log('Usage: ' + process.argv[1] + ' <scoutbook__scouts.csv file to import> <scoutbook_advancement.csv file to import> <scoutbook_log.csv file to import> <scoutbook_leadership.csv file to import> <ia-activity-export.csv to import> <scout contact info.csv>');
} else {

    ScoutImporter.scoutbook_scouts_importer(process.argv[2])
        .then(function (scouts) {
            AdvancementImporter.scoutbook_advancement_importer(scouts, process.argv[3])
                .then(function(scoutsWithAdv) {
                    // All Data is imported, ensure that next rank being worked exists in advancement even if no requirements completed.
                    scoutKeys = Object.keys(scoutsWithAdv);
                    scoutKeys.forEach(key => {
                        const scout = scoutsWithAdv[key];
                        if (scout && scout._advancement) {
                            const nextRank = RankAdvancement.getNextRank(scout);
                            const scoutAdvancement = scout._advancement;
                            RankAdvancement.addEmptyRanks(scoutAdvancement, nextRank);
                        }
                    })

                    ActivityImporter.scoutbook_activities_importer(scoutsWithAdv, process.argv[4])
                        .then(function(scoutsWithAct) {
                            IAActivityImporter.scoutbook_ia_activities_importer(scoutsWithAct, process.argv[6])
                                .then(function(scoutsWithIA) {
                                    LeadershipImporter.scoutbook_leadership_importer(scoutsWithIA, process.argv[5])
                                        .then(function(scoutsWithLeadership) {
                                            mergeContactInfo(scoutsWithLeadership, process.argv[7])
                                                .then(function(finalScouts){
                                                    t66scoutbookDb.update(finalScouts)
                                                        .then(function(){
                                                            process.exit(0);
                                                        },function(){
                                                            process.exit(1);
                                                        });
                                                });
                                        });
                                })
                        })

                })
        })
        .catch(function (err) {
            console.error(err.message);
        });
}

