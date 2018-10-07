
//////////////////////////////////////////////////////////////////////
var budgetController = (function () {
    // this is Expense object
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    // method of Expense of boject
    Expense.prototype.calcPercentage = function(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    };

    Expense.prototype.getPercentage = function() {
      return this.percentage;
    };

    // Income object
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
        sum += cur.value;
      });
      data.totals[type] = sum;

    };

    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1 // -1 is something is non-existent
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

      deleteItem: function(type, id) {
        var ids, index;
        // ids = [1,2,4,6,8], id is not index
        ids = data.allItems[type].map(function(current) {
          return current.id;
        });
        index = ids.indexOf(id);
        // if not fonud in array index = -1, if found we are going to delete it
        if (index !== -1) {
          data.allItems[type].splice(index, 1)
        }
      },

      calculateBudget: function() {
        // calculate total incom and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        // calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        // calculate the percentage of income that we spent
        if (data.totals.inc > 0) {
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
          data.percentage = -1;
        }

      },

      calculatePercentages: function() {
        data.allItems.exp.forEach(function(cur) {
          cur.calcPercentage(data.totals.inc);
        });

      },

      getPercentages: function() {
        // map return something, forEach doesn't
        var allPerc = data.allItems.exp.map(function(cur) {
          return cur.getPercentage();
        });
        return allPerc;
      },

      getBudget: function() {
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        }
      },

      testing: function() {
        console.log(data);
      }
    };
})();




/////////////////////////////////////////////////
// private //////////////////////////////////////
/////////////////////////////////////////////////
var UIController = (function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage'
    };

    // expose it, public
    return {
      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value, // income or expenses
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
      },

      addListItem: function(obj, type) {
        var html, newHtml, element;

        // create HTML string with placeholder text
        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description)
        newHtml = newHtml.replace('%value%', obj.value)

        // insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

      deleteListItem: function(selectorID) {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);

      },

      clearFields: function() {
        var fields, fieldsArr;
        // fields is a list
        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

        // this will trick the slice method into thinking that we give it an array
        // fieldsArr is a array
        fieldsArr = Array.prototype.slice.call(fields);

        // set the value of field ""
        // fieldsArr hold [input.add__description, input.add__value]
        fieldsArr.forEach(function(current, index, array) {// array is fieldsArr
          current.value = "";
        });
        fieldsArr[0].focus();
      },

      displayBudget: function(obj) {
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

        if (obj.percentage > 0) {
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
          document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }

      },

      displayPercentages: function(percentages) {
        // fields is Nodelist
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

        // list is fields, callback is function(current, index)
        var nodeListForEach = function(list, callback) {
          for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
          }
        };

        nodeListForEach(fields, function(current, index) { // list[i], i
          if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
          } else {
            current.textContent = '---';
          }
        });
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    };
})();



/////////////////////////////////////////////////
// global app controller ////////////////////////
/////////////////////////////////////////////////
var controller = (function(budgetCtrl, UICtrl) {

    // click and keypress listener
    var setupEventListeners = function() {
      var DOM = UICtrl.getDOMstrings();
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });

      // if we click on web page, addEventListener will give us what element we click whitin container
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {
      // 1. calculate the budget
      budgetCtrl.calculateBudget();
      // 2. return the budget
      var budget = budgetCtrl.getBudget();
      // 3. display the budget on UI
      UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
      // calculate updatePercentages
      budgetCtrl.calculatePercentages();

      // read percentages from the budget controller
      var percentages = budgetCtrl.getPercentages();

      // update the UI with the new percentages
      // console.log(percentages)
      UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
      var input, newItem
      // 1. get input data
      input = UICtrl.getInput();

      // if value > 0 and is number
      if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // 2. add the item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. add the item to UI
        UICtrl.addListItem(newItem, input.type);
        // 4. clear the fields
        UICtrl.clearFields();
        // 5. calculate and update budget
        updateBudget();
        // 6. calculate and update percentages
        updatePercentages();
      }


    };


    var ctrlDeleteItem = function(event) {
      var itemID, splitID, type, ID;
      // target is where event happen(click)
      // itemID is income-0, target is <i class="ion-ios-close-outline"> in this case
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
      if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // delete the item from data structure
        budgetCtrl.deleteItem(type, ID);

        // delete the item from the UI
        UICtrl.deleteListItem(itemID);

        // update and show the new budget__title
        updateBudget();
        // calculate and update percentages
        updatePercentages();

      }
    };

    return {
      init: function() {
        console.log('Application has started');
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
        setupEventListeners();
      }
    };

})(budgetController, UIController);


// not thing  is going to happen without this line
controller.init();






//
