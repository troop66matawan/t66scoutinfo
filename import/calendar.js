const ScoutImporter = require('scoutbook-scouts-importer');
const AdvancementImporter = require('scoutbook-advancement-importer');
const ActivityImporter = require('scoutbook-activities-importer');
const LeadershipImporter = require('scoutbook-leadership-importer');
const IAActivityImporter = require('ia-activity-importer');
const admin = require('firebase-admin');
const csvToJson = require('csvtojson');

const t66App = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://t66scoutinfo.firebaseio.com'
});
const dbInst = t66App.database();
const calendarDB = dbInst.ref('scoutbookCal');
function getKey(scout) {
    let firstName = scout._nickname;
    if (firstName.length === 0) {
        firstName = scout._firstName;
    }
    return `${firstName} ${scout._lastName}`;
}
function mergeCalendarInfo(scouts, pathToCalendarCSV) {
    let calendarInfo = {
        events: [],
        attendance: {}
    };
    const scoutKeys = Object.keys(scouts);

    scoutKeys.forEach(scoutKey => {
        const scout = scouts[scoutKey];
        const key = getKey(scout);
        calendarInfo.attendance[key] = {events: []};
    });
    return csvToJson()
        .on('header', function (header) {
            // store the header to get scouts.
            console.log(header);
        })
        .fromFile(pathToCalendarCSV)
        .then(function (importedData) {
            importedData.forEach(eventRecord => {
                const eventDate = eventRecord['Event Date'];
                const eventName = eventRecord['Event Name'];
                const event = {date: eventDate, name: eventName};

                calendarInfo.events.push(event);
                const scoutKeys = Object.keys(calendarInfo.attendance);
                scoutKeys.forEach(scout => {
                    const attend = eventRecord[scout];
                    if (attend && attend === 'YES') {
                        calendarInfo.attendance[scout].events.push(event)
                    }
                })

            });
            return calendarInfo;
        });
}

if (process.argv.length !== 6) {
    console.log('Usage: ' + process.argv[1] + ' <scoutbook_scouts.csv file to import> <scoutbook_meeting file to import> <scoutbook_campout file to import> <scoutbook_other file to import>');
} else {

    ScoutImporter.scoutbook_scouts_importer(process.argv[2])
        .then(function (scouts) {
            const scoutbookCalendar = {attendance: {}};
            const scoutKeys = Object.keys(scouts);
            scoutKeys.forEach(scoutKey => {
                const scout = scouts[scoutKey];
                const key = getKey(scout);
                scoutbookCalendar.attendance[key] = {};
            });

            mergeCalendarInfo(scouts, process.argv[3])
                .then(calendar => {
                    scoutbookCalendar.meeting = calendar.events;
                    scoutKeys.forEach(scoutKey => {
                        const scout = scouts[scoutKey];
                        const key = getKey(scout);
                        scoutbookCalendar.attendance[key].meeting = calendar.attendance[key].events;
                    });
                    mergeCalendarInfo(scouts, process.argv[4])
                        .then(calendar => {
                            scoutbookCalendar.camping = calendar.events;
                            scoutKeys.forEach(scoutKey => {
                                const scout = scouts[scoutKey];
                                const key = getKey(scout);
                                scoutbookCalendar.attendance[key].camping = calendar.attendance[key].events;
                            });
                            mergeCalendarInfo(scouts, process.argv[5])
                                .then(calendar => {
                                    scoutbookCalendar.other = calendar.events;
                                    scoutKeys.forEach(scoutKey => {
                                        const scout = scouts[scoutKey];
                                        const key = getKey(scout);
                                        scoutbookCalendar.attendance[key].other = calendar.attendance[key].events;
                                    });
                                    calendarDB.update(scoutbookCalendar)
                                        .then(function(){
                                            process.exit(0);
                                        },function(){
                                            process.exit(1);
                                        });
                                });
                        });

                });
        })
         .catch(function (err) {
            console.error(err.message);
        });
}

