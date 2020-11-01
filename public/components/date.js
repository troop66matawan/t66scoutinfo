app.component('date', {
    controller: DateController,
    templateUrl: 'templates/date.html',
    bindings: {
        date: '='
    }
});

function DateController(){
    const _this = this;
    _this.getDateString = function(){
        let dateString = '';
        if (_this.date && _this.date.length > 0) {
            const date = new Date(_this.date);
            dateString =  date.getMonth()+1 + '/' + date.getDay() + '/' + date.getFullYear();
        }
        return dateString;
    }
}