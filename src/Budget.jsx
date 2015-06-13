var React = require('react/addons');
var Eventful = require('eventful-react');
var NavToggle = require('./NavToggle');
var List = require('./List');
var auth = require('./auth');

var Budget = Eventful.createClass({
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
  
  updateBudget: function(e) {
    e.preventDefault();
    var updatedBudget = e.target.updateBudgetInput.value;
    e.target.updateBudgetInput.value = '';
    this.emit('update-budget', { name: updatedBudget });
  },


  render: function() {
    return (
      <div id="budget">
        <NavToggle />

      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="ibox float-e-margins" id="list-border">
            <div className="ibox-title">
              <h5>Budget Management</h5>
            </div>
            <div className="ibox-content">

              <div className="row">
                <div className="setBudget"> Budget: ${this.props.data.budget}</div>
                <div className="remainingBudget"> Balance: ${this.props.data.remainingBudget}</div>
              </div>

              <div className="row">
                <div className="list">
                  <div className='new-item-input'>
                    <form name="update-budget-form" onSubmit={this.updateBudget}>
                      <input className='new-item-input' type="text" ref="updateBudgetInput" name="updateBudgetInput" placeholder="Input New Budget"/>
                      <input className='btn btn-sm btn-primary add-item-button' type="submit" value="Update Budget"/>
                    </form>
                </div>
               </div>

              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>


      </div>
    );
  }
});

module.exports = Budget;
