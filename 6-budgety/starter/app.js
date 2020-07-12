var budgetController = (function(){
    
    var Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value
    };

    var Expense = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.pc = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome){
        if(totalIncome > 0){
            this.pc = Math.round((this.value/totalIncome)*100);
        }else{
            this.pc = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.pc;
    }

    var data = {
        items:{
            inc: [],
            exp: []
        },
        totals:{
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: 0
    };

    calculateSum = function(type){
        var sum = 0;
        data.items[type].forEach(function(currentItem){
            sum += currentItem.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, des, val){
            var newItem, id;
            
            //setting up the value of 'id'
            if(data.items[type].length > 0){
                id = data.items[type][data.items[type].length - 1].id + 1;
            }else{
                id = 0;
            }

            //new item based on type
            if(type === 'exp'){
                newItem = new Expense(id, des, val);
            }else if(type === 'inc'){
                newItem = new Income(id, des, val);
            }

            //pushing data to DS and returning it to the calling function
            data.items[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id){
            var ids, idToBeDeleted;

            //we collect all the ids in a separate array (remember that ids can be different than the indexes)
            ids = data.items[type].map(function(current){
                return current.id;
            });
            //finding the index of the id we particularly want to delete
            indexToBeDeleted = ids.indexOf(id);
            //deleting the id using the index we found above
            if(indexToBeDeleted !== -1){
                data.items[type].splice(indexToBeDeleted, 1);
            }
        },

        calculateBudget: function(){
            
            //calculating sum of all incomes/expenses
            calculateSum('inc');
            calculateSum('exp');

            //calculating budget
            data.budget = data.totals.inc - data.totals.exp;

            //calculating percentage of income/expenses
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }else{
                data.percentage = -1;
            }
            
        },

        calculateExpensePercentage: function(){
            data.items['exp'].forEach(function(expense){
                expense.calculatePercentage(data.totals.inc);
            });
        },

        getExpensePercentages: function(){
            var allPcs = data.items.exp.map(function(current){
                return current.getPercentage();
            });
            return allPcs;
        },

        //to pass all the budget data to the caller function
        getBudgetData: function(){
            return {
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp, 
                budget: data.budget,
                percentage: data.percentage
            };
        },

        //for testing data in the console
        getAllDataForTest: function(){
            return data;
        }
    };
})();


var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    formatItemValue =  function(num, type){
        var formattedNum, splitNum;

        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split('.');
        
        //splitNum[0] is the int part, splitNum[1] is the decimal part
        if(splitNum[0].length>3){
            formattedNum = splitNum[0].substr(0, splitNum[0].length-3) + ',' + splitNum[0].substr(splitNum[0].length-3);
        }else{
            formattedNum = splitNum[0];
        }  
        return (type === 'exp' ? '-' : '+') + formattedNum + '.' + splitNum[1];
    };

    var nodeListForEach = function(list, callback){
        for(var i=0; i<list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInputValues: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desc: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addItemToUI: function(newObj, type){
            var html, newHtml, element; 

            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
      
            //replacing the placeholders in the above html snippet
            newHtml = html.replace('%id%', newObj.id);
            newHtml = newHtml.replace('%desc%', newObj.desc);
            newHtml = newHtml.replace('%value%', formatItemValue(newObj.value, type));
            
            //placing the html as a new list item of income/expense in the UI
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteItemFromUI: function(itemId){
            var elemToBeDeleted = document.querySelector('#' + itemId);
            elemToBeDeleted.parentElement.removeChild(elemToBeDeleted);
        },

        clearFields: function(){
            var fields, fieldsArray;

            //getting all the query selector to clear the values from
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            //since we get a list instead of an array, we try to use a trick to slice it off and convert to array
            fieldsArray = Array.prototype.slice.call(fields);
            //setting individual fields to empty
            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });
            //shifting the focus back to the description field
            fieldsArray[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = formatItemValue(obj.budget, obj.budget > 0? 'inc' : 'exp'); 
            document.querySelector(DOMStrings.incomeLabel).textContent = formatItemValue(obj.totalIncome, 'inc'); 
            document.querySelector(DOMStrings.expenseLabel).textContent = formatItemValue(obj.totalExpenses, 'exp'); 

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'; 
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '--'; 
            }
        },

        //displaying expense %s for individual items
        displayExpensePercentages: function(percentagesArray){
            var pcFields = document.querySelectorAll(DOMStrings.expensePercentageLabel);

            nodeListForEach(pcFields, function(pcField, index){
                if(percentagesArray[index] > 0){
                    pcField.textContent = percentagesArray[index] + '%';
                }else{
                    pcField.textContent = '--';
                }
            });
        },

        //to display the month on the top of the app
        displayDate: function(){
            var now, months;
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            now = new Date();
            document.querySelector(DOMStrings.dateLabel).textContent = months[now.getMonth()] + ", " + now.getFullYear();
        },

        //to change colors of borders on inputType change (income/expense)
        changeInputFieldColors: function(){
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };
})();



var controller = (function(dataController, displayController){

    var setupEventListeners = function(){
        var UIDOMStrings = displayController.getDOMStrings();
        document.querySelector(UIDOMStrings.inputBtn).addEventListener('click', addItemCtrl);    
        //setting up listener for 'Enter' key
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                addItemCtrl();
            };
        });
        document.querySelector(UIDOMStrings.container).addEventListener('click', deleteItemCtrl);
        document.querySelector(UIDOMStrings.inputType).addEventListener('change', displayController.changeInputFieldColors);
    };

    function updateBudget(){
        //calculating the budget
        dataController.calculateBudget();
        //retrieving the budget data
        var budgetData = dataController.getBudgetData();
        //diplaying the budget data in the UI
        displayController.displayBudget(budgetData);
    };

    function updateExpensePercentages(){
        //calculate percentages
        dataController.calculateExpensePercentage();
        //get percentages
        var expensePcs = dataController.getExpensePercentages();
        //display pcs in the UI
        displayController.displayExpensePercentages(expensePcs);
    };

    var addItemCtrl = function(){
        var inputValues, newItem;
        //perform various steps for adding a transaction
        
        //1. Get the input values from various fields
        inputValues = displayController.getInputValues();
        
        if(inputValues.desc !== "" && !isNaN(inputValues.value) && inputValues.value > 0){
            //2. Putting the values into the DS
            newItem = dataController.addItem(inputValues.type, inputValues.desc, inputValues.value);

            //3. Setting the new item in the UI
            displayController.addItemToUI(newItem, inputValues.type);

            //4. Clear fields and reset the focus
            displayController.clearFields();

            //5. Update & Display the budget calculations
            updateBudget();

            //6. Update expense percentages
            updateExpensePercentages();
        };
    };

    var deleteItemCtrl = function(){
        var deleteItemId, splitItems, type, id;

        deleteItemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitItems = deleteItemId.split('-');
        type = splitItems[0];
        id = parseInt(splitItems[1]);

        //Deleting the item from DS
        dataController.deleteItem(type, id);
        //Updating UI
        displayController.deleteItemFromUI(deleteItemId);
        //update Budget
        updateBudget();
        //Update expense percentages
        updateExpensePercentages();
    };

    return{
        init: function(){
            console.log('The application has started!');
            displayController.displayDate();
            displayController.displayBudget({
                totalIncome: 0,
                totalExpenses: 0, 
                budget: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
    

})(budgetController, UIController);

controller.init();