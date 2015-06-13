var React = require('react/addons');
var Eventful = require('eventful-react');
var ListItem = require('./ListItem');
var ModeToggle = require('./ModeToggle');
var url = require('./url');
var AutocompleteItem = require('./AutocompleteItem');
var List = Eventful.createClass({
  getInitialState: function() {
    return {
      autocomplete_items: []
    }
  },

  componentDidMount: function() {
    // eventful event listeners
    this.on('emptyAutocomplete', function() {
      this.setState({autocomplete_items: []});
    });
    this.on('refresh-list', function(data) {
      React.findDOMNode(this.refs.newItemInput).value = '';
    });
  },

  renderListItem: function(itemData, id) {
    return (
      <ListItem key={id} index={id} name={itemData.name} category={itemData.category} price={itemData.price} mode={this.props.mode}/>
    );
  },

  renderAutocompleteItem: function(itemData, id) {
    return (
      <AutocompleteItem key={id} index={id} name={itemData.name} item={itemData} price={itemData.price} mode={this.props.mode} foodCategory={itemData.data.food_category}/>
    );
  },

  handleInput: function(){
    event.preventDefault();
    var value = event.target.value;
    if (this.props.mode === ModeToggle.SHOPPING) {
      this.filterList(value);
    }else {
      this.autocomplete(value);
    }
  },

  filterList: function(value) {
    this.emit('filter-list', value);
  },

  selectFirst: function() {
    event.preventDefault();
    if (this.state.autocomplete_items[0]) {

      var item = this.state.autocomplete_items[0];
      $.post(url.addItem, {_id: item._id})
      .done(function(data) {
        React.findDOMNode(this.refs.newItemInput).value = '';
        this.emit('refresh-list',data);
        this.emit('emptyAutocomplete');
      }.bind(this))
      .fail(function(xhr, status, err) {
        console.error('Error getting item list:', status, err);
      }.bind(this));
    }
  },

  autocomplete: function(value) {
    if (value.length >= 3 ){
      $.get(url.autocomplete + '/' + value)
      .done(function(data) {
        this.setState({autocomplete_items: []});
        this.setState({autocomplete_items: data});
      }.bind(this))
      .fail(function(xhr, status, err) {
        console.error('Error getting item list:', status, err);
      }.bind(this));
    }else {
      this.setState({autocomplete_items: []});
    }
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="ibox float-e-margins" id="list-border">
            <div className="ibox-title">
              <h5> Shopping List </h5>
            </div>
            <div className="ibox-content">
            <ModeToggle mode={this.props.modeData} />
              <div className="row">
                <div className="list">
                  <div className='new-item-input'>
                    <form name="new-item-form" onSubmit={this.selectFirst} >
                      <input id="tags" type="text" ref="newItemInput" name="newItemInput" onChange={this.handleInput} placeholder="Enter an item"/>
                    </form>
                </div>
                <div className="budgetDisplay">
                  <div className="setBudget">Budget: ${this.props.budget}</div>
                  <div className="remainingBudget">Balance: ${this.props.remainingBudget}</div>
                </div>
                <ul>
                  {this.state.autocomplete_items.map(this.renderAutocompleteItem)}
                </ul>
                <ul class="itemList">
                  {this.props.filteredItems.map(this.renderListItem)}
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    );
  }
});


module.exports = List;
