const ScoutImporter = require('scoutbook-scouts-importer');
const AdvancementImporter = require('scoutbook-advancement-importer');
const ActivityImporter = require('scoutbook-activities-importer');
const LeadershipImporter = require('scoutbook-leadership-importer');
const IAActivityImporter = require('ia-activity-importer');
const admin = require('firebase-admin');

const t66App = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://t66scoutinfo.firebaseio.com'
});
const dbInst = t66App.database();
const t66scoutbookDb = dbInst.ref('scoutbookDb');

if (process.argv.length !== 7) {
    console.log('Usage: ' + process.argv[1] + ' <scoutbook__scouts.csv file to import> <scoutbook_advancement.csv file to import> <scoutbook_log.csv file to import> <scoutbook_leadership.csv file to import> <ia-activity-export.csv to import>');
} else {

    ScoutImporter.scoutbook_scouts_importer(process.argv[2])
        .then(function (scouts) {
            AdvancementImporter.scoutbook_advancement_importer(scouts, process.argv[3])
                .then(function(scoutsWithAdv) {
                    ActivityImporter.scoutbook_activities_importer(scouts, process.argv[4])
                        .then(function(scoutsWithAct) {
                            IAActivityImporter.scoutbook_ia_activities_importer(scoutsWithAct, process.argv[6])
                                .then(function(scoutsWithIA) {
                                    LeadershipImporter.scoutbook_leadership_importer(scoutsWithIA, process.argv[5])
                                        .then(function(finalScouts) {
                                            t66scoutbookDb.update(finalScouts);
                                        });
                                })
                        })

                })
        })
        .catch(function (err) {
            console.error(err.message);
        });
}

