app.component('scoutbookDate', {
    template: '<div>{{$ctrl.getDateString($ctrl.date)}}</div>',
    bindings: {
        date: '='
    },
    controller: function() {
        const _this = this;

        _this.getDateString = function(dateTime) {
            let dateString='';
            let date;
            if (dateTime instanceof Date) {
                date = dateTime;
            } else if (typeof dateTime === 'number') {
                date = new Date(dateTime);
            }

            if (date) {
                dateString = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
            }
            return dateString;
        }
    }
});
