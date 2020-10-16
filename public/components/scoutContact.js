app.component('scoutcontact', {
  bindings: {
    contact: '<'
  },
  templateUrl: 'templates/scoutContact.html',
  controller: ScoutContactController
});

function ScoutContactController() {
  var _this = this;

  _this.hasAddress = function(contact) {
    return ((contact._address1 && contact._address1.length > 0) ||
        (contact._city && contact._city.length > 0) ||
        (contact._state && contact._state.length > 0) ||
        (contact._zip && contact._zip.length > 0));
  }
  _this.getHomePhone = function(contact) {
    if (contact._homephone) {
      return contact.homephone;
    } else if (contact._homePhone) {
      return contact._homePhone;
    }
  }
}
