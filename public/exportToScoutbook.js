app.component('exporttoscoutbook', {
  bindings : {
    scouts: '<'
  },
  template:   '<div class="exporttoscoutbook">'+
  '<div class="header">Export Data to Scoutbook</div>' +
    '<div id="downloadAdvancement"><button ng-click="$ctrl.exportAdvancement()">Advancement</button></div>' +
    '<div id="downloadLogs"><button ng-click="$ctrl.exportLogs()">Logs</button></div>' +
  '</div>',
  controller: [ 'CsvDownloadService', function(CsvDownloadService) {
    var _this = this;
    var csvString;
    _this.tmMbMap = new Map();
    initTmMBMap(_this.tmMbMap);

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      };

    _this.createCSVAdvancement = function(scout,type,advancement,date){
      var csv = scout._bsaID + ',';
      csv += scout._firstName + ',';
      csv += scout._lastName + ',';
      csv += type + ',';
      csv += advancement + ',';
      csv += (date.month +1) + '/'+date.date + '/' + (1900+date.year) + ',';
      csv += '1\r\n';
      return csv;
    };

    _this.mapTroopMasterMBNameToScoutbook = function(tmMeritBadgeName) {
      var scoutBookMbName = tmMeritBadgeName;
      var remap = _this.tmMbMap.get(tmMeritBadgeName);
      if (remap !== undefined) {
        scoutBookMbName = remap;
      }

      return scoutBookMbName;
    };

    _this.exportAdvancement = function() {
      csvString = CsvDownloadService.encodeCSV();
      csvString += 'BSA Member ID,First Name,Last Name,Advancement Type,Advancement,Date Completed,Approved\r\n';
      _this.scouts.forEach(function(scout) {
        if (scout._bsaID !== undefined) {
          var rank = scout._rankAdvancement;

          if (rank.hasOwnProperty('_scout')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'Scout', rank._scout);
          }
          if (rank.hasOwnProperty('_tenderfoot')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'Tenderfoot', rank._tenderfoot);
          }
          if (rank.hasOwnProperty('_2ndClass')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'Second Class', rank._2ndClass);
          }
          if (rank.hasOwnProperty('_1stClass')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'First Class', rank._1stClass);
          }
          if (rank.hasOwnProperty('_star')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'Star Scout', rank._star);
          }
          if (rank.hasOwnProperty('_life')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'Life Scout', rank._life);
          }
          if (rank.hasOwnProperty('_eagle')) {
            csvString += _this.createCSVAdvancement(scout, 'Rank', 'Eagle Scout', rank._eagle);
          }
          if (scout.meritBadges !== undefined) {
            for (var j = 0; j < scout.meritBadges.length; j++) {
              csvString += _this.createCSVAdvancement(scout, 'Merit Badge',
                _this.mapTroopMasterMBNameToScoutbook(scout.meritBadges[j]._name),
                scout.meritBadges[j]._earned);
            }
          }
        }
      });
      CsvDownloadService.downloadCsv(csvString,'advancement', 'downloadAdvancement' );
    };

    _this.createCSVLogs = function(scout,type,date,nights,days,miles,hours,frostpoints,locationName,notes){
      var csv = scout._bsaID + ',';
      csv += scout._firstName + ',';
      csv += scout._lastName + ',';
      csv += type + ',';
      csv += (date.month +1) + '/'+date.date + '/' + (1900+date.year) + ',';
      csv += nights + ',';
      csv += days + ',';
      csv += miles + ',';
      csv += hours + ',';
      csv += frostpoints + ',';
      csv += locationName + ',';
      csv += notes + ',';
      csv += '\r\n';
      return csv;
    };

    _this.exportLogs = function() {
      csvString = CsvDownloadService.encodeCSV();
      csvString += 'BSA Member ID,First Name,Last Name,Log Type,Date,Nights,Days,Miles,Hours,Frost' +
        ' Points,Location/Name,Notes\r\n';
      _this.scouts.forEach(function(scout) {
        if (scout._bsaID !== undefined) {
          if (scout._service && scout._service.length > 0) {
            scout._service.forEach(function(service) {
              csvString += _this.createCSVLogs(scout, "Service", service.activityDate, '', '', '', service.amount, '',
                service.location, service.remarks);
            });
          }
          if (scout._camping && scout._camping.length > 0) {
            scout._camping.forEach(function(camping) {
              var nights = parseFloat(camping.amount);
              csvString += _this.createCSVLogs(scout, "Camping", camping.activityDate, nights, nights + 1, '', '', '',
                camping.location, camping.remarks);
            });
          }
        }
      });
      CsvDownloadService.downloadCsv(csvString,'logs', 'downloadLogs' );

    };

    function initTmMBMap(mbMap) {
      mbMap.set("Auto Maintenance", "Automotive Maintenance");
      mbMap.set("Cit In Community", "Citizenship in the Community");
      mbMap.set("Cit In Nation", "Citizenship in the Nation");
      mbMap.set("Cit In World", "Citizenship in the World");
      mbMap.set("Disability Aware", "Disabilities Awareness");
      mbMap.set("Emergency Prep", "Emergency Preparedness");
      mbMap.set("Environmental Sci", "Environmental Science");
      mbMap.set("Fish and_Wildlife_Management", "Fish and Wildlife Management");
      mbMap.set("Mining in_Society", "Mining in Society");
      mbMap.set("Model Design_and_Building", "Model Design and Building");
      mbMap.set("Pulp and_Paper", "Pulp and Paper");
      mbMap.set("Reptile/Amphibian", "Reptile and Amphibian Study");
      mbMap.set("Search %26_Rescue", "Search and Rescue");
      mbMap.set("Signs%2C Signals%2C_and_Codes", "Signs, Signals, and Codes");
      mbMap.set("Soil and Water", "Soil and Water Conservation");
      mbMap.set("Small Boat Sailing", "Small-Boat Sailing");
    }

  }]
});
