var React = require('react');
var Eventful = require('eventful-react');
var ModeToggle = require('./ModeToggle');
var List = require('./List');
var auth = require('./auth');

var Home = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  statics: {
    willTransitionTo: function (transition, _, _, cb) {
      auth.loggedIn(function(authed) {
        if (!authed) {
          transition.redirect('/login');
        }
        cb();
      });
    }
  },

  render: function() {
    return (
      <div id="home">
        <ModeToggle mode={this.props.data.mode} />
        <List filteredItems={this.props.data.filteredItems} budget={this.props.data.budget} totalCost={this.props.data.totalCost} remainingBudget={this.props.data.remainingBudget} mode={this.props.data.mode} />
      </div>
    );
  }
});

module.exports = Home;
