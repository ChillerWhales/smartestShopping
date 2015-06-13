var React = require('react/addons');
var Eventful = require('eventful-react');
var NavToggle = require('./NavToggle');
var List = require('./List');
var auth = require('./auth');
var AisleMap = require('./AisleMap');
var AisleMapCanvas = require('./AisleMapCanvas');

var StoreLayout = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      items: [],
      aisleMap: new AisleMap({numTestItems: this.props.data.items.length})
    };
  },

  renderAisleMap: AisleMapCanvas,

  componentDidMount: function() {
    var testMap = this.state.aisleMap;
    testMap.constructGrid(5);
    testMap.placeItems();
    testMap.findAislesWithItems();
    testMap.createPath();
    this.renderAisleMap(testMap);
    console.log("testmap items:", testMap.items);
    console.log("testmap aisleWithItems:", testMap.aislesWithItems);
    console.log("testmap path", testMap.path);
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
    console.log("props:", this.props.data.items);
    return (
      <div id="home">
        <NavToggle />
        <div className="row">
          <canvas className="aisle-canvas" id="myCanvas" width="1000" height="1000"></canvas>
          <canvas className="aisle-canvas" id="backgroundCanvas" width="1000" height="1000"></canvas>
        </div>
      </div>
    );
  }
});

module.exports = StoreLayout;
