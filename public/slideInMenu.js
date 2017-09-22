// requires material-icons

app.component('slideInMenu', {
  bindings: {
    menuOptions: '<',
    view: '='
  },
  template: '<div ng-show="$ctrl.menuOptions.length > 1" id="slideinmenu">' +
  '<div id="btn"><i class="material-icons" ng-click="$ctrl.btnClick()">menu</i></div>' +
  '<div id="box">' +
    '<div id="items" >' +
      '<div class="item" ng-repeat="menuOption in $ctrl.menuOptions"' +
        'ng-click="$ctrl.setView(menuOption.value)">{{menuOption.name}}</div>' +
    '</div>' +
  '</div>' +
  '</div>',
  controller: [function() {
    const _this = this;
    const sidebarBox = document.querySelector('#box'),
      sidebarBtn = document.querySelector('#btn');

    _this.$onChanges = function(changes) {
      _this.menuOptions = changes.menuOptions.currentValue;
    };

    _this.setView = function(value) {
      _this.view = value;
      _this.btnClick();
    };

    _this.btnClick = function() {
      sidebarBox.classList.toggle('active');
      sidebarBtn.classList.toggle('active');
    };
  }]
});
