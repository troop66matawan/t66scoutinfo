angular.module('t66tmweb').service('CsvDownloadService', CsvDownloadService);

function CsvDownloadService() {
    var _this = this;

    _this.encodeCSV = function() {
        return 'data:text/csv;charset=utf-8,';
    };

    _this.downloadCsv = function(csvContent, name, htmlID) {
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name + ".csv");
        link.setAttribute("style", "display:none");
        link.innerHTML= "Click Here to download " + name;
        document.getElementById(htmlID).appendChild(link); // Required for FF

        link.click(); // This will download the data file named "my_data.csv".
    };
}