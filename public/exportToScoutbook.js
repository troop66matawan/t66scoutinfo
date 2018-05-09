app.component('exporttoscoutbook', {
  bindings : {
    scouts: '<'
  },
  template:   '<div class="exporttoscoutbook">'+
  '<div class="header">Export Data to Scoutbook</div>' +
  '<div id="downloadAdvancement"><button ng-click="$ctrl.exportAdvancement()">Advancement</button></div>' +
  '</div>',
  controller: [ function() {
    var _this = this;
    var csvString;
    _this.tmMbMap = new Map();
    initTmMBMap(_this.tmMbMap);

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      };

    _this.encodeCSV = function() {
      return 'data:text/csv;charset=utf-8,';
    };

    _this.createCSVAdvancement = function(scout,type,advancement,date){
      var csv = scout._bsaID + ',';
      csv += scout._lastName + ',';
      csv += scout._firstName + ',';
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

    _this.downloadCsv = function(csvContent, name, htmlID) {
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", name + ".csv");
      link.innerHTML= "Click Here to download " + name;
      document.getElementById(htmlID).appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".
    };

    _this.exportAdvancement = function() {
      csvString = _this.encodeCSV();
      csvString += 'BSA Member ID,First Name,Last Name,Advancement Type,Advancement,Date Completed,Approved\r\n';
      _this.scouts.forEach(function(scout) {
        var rank = scout._rankAdvancement;

        if (rank.hasOwnProperty('_scout')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','Scout', rank._scout );
        }
        if (rank.hasOwnProperty('_tenderfoot')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','Tenderfoot', rank._tenderfoot );
        }
        if (rank.hasOwnProperty('_2ndClass')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','Second Class', rank._2ndClass );
        }
        if (rank.hasOwnProperty('_1stClass')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','First Class', rank._1stClass );
        }
        if (rank.hasOwnProperty('_star')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','Star Scout', rank._star );
        }
        if (rank.hasOwnProperty('_life')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','Life Scout', rank._life );
        }
        if (rank.hasOwnProperty('_eagle')) {
          csvString += _this.createCSVAdvancement(scout,'Rank','Eagle Scout', rank._eagle );
        }
        if (scout.meritBadges !== undefined ) {
          for (var j = 0; j < scout.meritBadges.length; j++) {
            csvString += _this.createCSVAdvancement(scout, 'Merit Badge',
              _this.mapTroopMasterMBNameToScoutbook(scout.meritBadges[j]._name),
              scout.meritBadges[j]._earned);
          }
        }
      });
      _this.downloadCsv(csvString,'advancement', 'downloadAdvancement' );
    };

    function initTmMBMap(mbMap) {
      mbMap.set("Auto Maintenance", "Automotive Maintenance");
      mbMap.set("Cit In Community", "Citizenship in the Community");
      mbMap.set("Cit In Nation", "Citizenship in the Nation");
      mbMap.set("Cit In World", "Citizenship in the World");
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
    }

  }]
});
