

var budgetController = (function () {
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      }
    };

    return {
      addItem: function(type, des, val) {
        var newItem, ID;
        // create new ID
        if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
          ID = 0;
        }


        // create new item based on inc or exp type
        if (type === 'exp') {
          newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
          newItem = new Income(ID, des, val);
        }
        // push it into our data structure
        data.allItems[type].push(newItem);
        return newItem;

      },

      testing: function() {
        console.log(data);
      }
    };
})();





// private
var UIController = (function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn'
    };

    // expose it, public
    return {
      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value, // income or expenses
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: document.querySelector(DOMstrings.inputValue).value
        };
      },
      getDOMstrings: function() {
        return DOMstrings;
      }
    };
})();




// global app controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
      var DOM = UICtrl.getDOMstrings();
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });
    };


    var ctrlAddItem = function() {
      var input, newItem
      // 1. get input data
      input = UICtrl.getInput();
      // 2. add the item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. add the item to UI
      // 4. calculate the budget
      // 5. display the budget on UI
    };

    return {
      init: function() {
        console.log('Application has started');
        setupEventListeners();
      }
    };

})(budgetController, UIController);


// not thing  is going to happen without this line
controller.init();






//
