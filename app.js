

var budgetController = (function () {
    // do something
})();






var UIController = (function() {
    // some code


})();




// global app controller
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
      // 1. get input data
      // 2. add the item to budget controller
      // 3. add the item to UI
      // 4. calculate the budget
      // 5. display the budget on UI
      console.log('it works')
    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

})(budgetController, UIController);









//
