app.component('scoutcontact', {
  bindings: {
    contact: '<'
  },
  templateUrl: 'templates/scoutContact.html',
  controller: ScoutContactController
});

function ScoutContactController() {
  var _this = this;

  _this.getHomePhone = function(contact) {
    if (contact._homephone) {
      return contact.homephone;
    } else if (contact._homePhone) {
      return contact._homePhone;
    }
  }
}
