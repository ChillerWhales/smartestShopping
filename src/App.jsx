var React = require('react/addons');
var Eventful = require('eventful-react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var ModeToggle = require('./ModeToggle');
var auth = require('./auth');
var url = require('./url');
var config = require('./config')

var App = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    console.log(" I am executed here - gt init ");
    return {
      items: [],
      filteredItems: [],
      totalCost: 0,
      budget: this.getBudget(),
      remainingBudget: 0,
      mode: ModeToggle.EDITING
    };
  },

  getList: function(archive) {
    $.get(url.list)
    .done(function(data) {
      this.setState({items: data});
      this.setState({filteredItems: data});
      this.addPrices(archive);
      console.log("items in state:", data);
      for (var i = 0; i < data.length; i++) {
        this.getAisle(data[i].name, i);
      }
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error getting item list:', status, err);
    });
  },

  getAisle: function(itemName, index) {
    var aisle;
    $.ajax({
      url: url.aisle,
      data: {name: itemName},
      type: 'GET'
    }).done(function(data) {
      //the api returns the response in an intersting way and need to be parsed
      aisle = parseInt(data[0].AisleNumber[0].substring(6));
      if (aisle) {
        var items = this.state.items;
        items[index].aisle = aisle;
        this.setState({items: items});
      }
    }.bind(this))
  },

  filterList: function(filter) {
    var filteredList = this.state.items;
    this.setState({
      filteredItems: filteredList.filter(function(item) {
        return item.name.toLowerCase().search(filter) !==-1;
      })
    });
  },

  addPrices: function(archive) {
    var args = Array.prototype.slice.apply(arguments);
    var allItems = this.state.items;
    var sum = allItems.map(function(item) {
                return item.price;
              });
    this.setState({
      totalCost: sum.reduce(function(total, num){
        return total + num;
      }, 0)
    }) 
    //if the item is not being archived (args are only sent from archiveItem)
    if (!args[0]){
      this.setRemainingBudget();
    } 
  },

  setRemainingBudget: function(cost) {
    var itemCost;
    if(cost) {
      itemCost = cost + this.state.totalCost;
    } else {
      itemCost = this.state.totalCost;
    }
    // var itemCost = cost || this.state.totalCost;
    console.log('totalcost', this.state.totalCost);
      this.setState({
        remainingBudget: this.state.budget - itemCost
      })
  },

  addItem: function(item) {
    console.log("url add item : " + url.testItem);
    console.log("url Update item : " + url.updateItem);

    $.post(url.addItem, item)
    .done(function(data) {
      this.getList();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error adding new item to list:', status, err);
    });
  },

  updateItem: function(item) {
    $.post(url.updateItem, item)
    .done(function(data) {
      this.getList();
      // this.addPrices();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error updating item in list:', status, err);
    });
  },

  deleteItem: function(item) {
    $.ajax({
      url: url.deleteItem,
      type: 'DELETE',
      data: item
    })
    .done(function(data) {
      this.getList();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error deleting item from list:', status, err);
    });
  },

  archiveItem: function(item) {
    var archive = true;
    $.post(url.archiveItem, item)
    .done(function(data) {
      this.getList(archive);
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error archiving item in list:', status, err);
    });
  },

  updateBudget: function(budget) {
      
      console.log("event hit updateBudget" + budget);

    $.post(url.updateBudget, budget)
    .done(function(data) {
      this.setState({budget: data});
      this.setState({remainingBudget: (parseInt(this.state.remainingBudget,10)+ parseInt(data,10)) });
      console.log("hi -- just updated the budget" + data);
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error updating Budget for the user:', status, err);
    });
  },

  registerUser: function(userData) {
    $.post(url.register, userData)
    .done(function(data) {
      console.log('registered:', data);
      this.context.router.transitionTo('/');
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error registering user:', status, err);
    });
  },

  loginUser: function(userData) {
    $.post(url.login, userData)
    .done(function(data) {
      this.context.router.transitionTo('/');
      this.getBudget();
      this.getList();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error logging in user:', status, err);
    });
  },

  getBudget: function(archive){
    $.get(url.getBudget)
    .done(function(data) {
      this.setState({budget: data});
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error in getting Budget in App:', status, err);
    });
  },

  changeMode: function(data) {
    this.setState({ mode: data.mode });
  },

  componentDidMount: function() {
    // eventful event listeners
    this.on('register', function(data) {
      this.registerUser(data);
    });
    this.on('login', function(data) {
      this.loginUser(data);
    });
    this.on('update-item', function(data) {
      this.updateItem(data)
    });
    this.on('refresh-list', function(data) {
      this.getList();
      // console.log('ADD ITEM');
      // // if this.state.remainingBudget - thisItem.price > 0
      // if(this.state.remainingBudget - 30 >= 0){
      //   this.addItem(data);
      // } else {
      //   var exceedBudgetOk = confirm('This item will exceed your budget, are you sure you want to add it?');
      //   if(exceedBudgetOk){
      //     this.addItem(data);
      //   } else {
      //     this.getList();
      //   }
      // }
    });
    this.on('remove-item', function(data) {
      if (this.state.mode === ModeToggle.SHOPPING) {
        this.archiveItem(data);
      } else {
        this.deleteItem(data);
      }
    });
    this.on('set-quantity', function(data) {
      console.log('set-qty data', data.index);
      this.setRemainingBudget(data.index);
    });
    this.on('update-budget', function(data){
      this.updateBudget(data);
    });
    this.on('change-mode', function(data) {
      this.changeMode(data);
    });
    this.on('filter-list', function(data) {
      this.filterList(data);
    });
    this.on('add-budget', function(data) {
      this.addBudget(data);
    })

    this.getList();
  },

  componentDidUpdate: function(prevProps, prevState) {
    localStorage.state = JSON.stringify(this.state);
  },

  render: function() {
    //var loginOrOut = this.state.loggedIn ?
    //  <Link to="register"> Register Account</Link> :
    //  <Link to="login"> Sign In</Link>;
    return (
      <div id="app">
        <div class="container">
          <RouteHandler data={this.state} />
        </div>
      </div>
    );
  }
});

module.exports = App;