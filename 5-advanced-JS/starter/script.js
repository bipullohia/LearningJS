/*

//Function constrcutor

var john = {
    name: 'John',
    birthYear: 1999,
    job: 'Engineer'
}
/*
    we can create a prototype for the above
    function which we can then use to create
    as many objects with sane property as we want
*/

/*

var Person = function(name, birthYear, job){
    this.name = name,
    this.birthYear = birthYear,
    this.job = job
}

//We mostly use prototype to add additional functions to the object which  we want to share
Person.prototype.calculateAge = function(){
    console.log(2020 - this.birthYear);
}

//We can add variables through prototype (used scarcely)
Person.prototype.lastName = 'Smith';

//Instantiating objects from the prototype above
var mark = new Person('Mark Ruffalo', 1972, 'Actor');
mark.calculateAge();
console.log(mark.lastName);

var alex = new Person('Alex Botez', 1995, 'Chess Player');
alex.calculateAge();
console.log(alex.lastName);


*/

/*

//object.create
var personPrototype = {
    calculateAge: function(){
        console.log(2020 - this.birthYear);
    }
};

var mark = Object.create(personPrototype);
mark.name = 'Mark Ruffalo';
mark.birthYear = 1981;
mark.job = 'Actor';

var alex = Object.create(personPrototype, {
    name: {value: 'Alexa Botez'},
    birthYear: {value: 1995},
    job: {value: 'Chess Player'}
}
});

*/

/*

//Functions as arguments
var arr = [100, 32, 31, 74, 21, 77];

function doStuff(arr, func){
    var resArr = [];
    for(var i = 0; i<arr.length; i++){
        resArr.push(func(arr[i]));
    return resArr;
}

function isEven(elem){
    if(elem % 2 === 0) return true;
    else return false;
}

console.log(doStuff(arr, isEven));

//Functions returning functions
function returnAreaFunc(shape){
    if(shape === 'rect'){
        return function(ln, br){
            return ln*br;
        }
    }else if(shape === 'square'){
        return function(ln){
            return ln*ln;
        }
    }else{
        return function(){
            return 'Invalid Shape';
        }
    }
}

var rectArea = returnAreaFunc('rect');
console.log(rectArea(3,7));

console.log(returnAreaFunc('square')(4)); 


//IIFE
(function (test){
    console.log("Hello to the world, " + test + "!");
})('Mark');

*/


//Closures
// function returnAreaFunc(shape){
//     return function(l){
//         if(shape === 'square') return l*l;
//     else if(shape === 'circle') return 3.14*l*l;
//     else return 'Invalid Shape';
//     }
// }

// console.log(returnAreaFunc('circle')(4));
// console.log(returnAreaFunc('square')(5));
// console.log(returnAreaFunc('rect')(3));




////////////////////////////
// CODING CHALLENGE


/*
--- Let's build a fun quiz game in the console! ---

1. Build a function constructor called Question to describe a question. A question should include:
a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
c) correct answer (I would use a number for this)

2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor (Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code (Hint: we learned a special technique to do exactly that).
*/

var score = 0;

var Question = function(ques, answers, correctAns){
    this.ques = ques,
    this.answers = answers,
    this.correctAns = correctAns
}

Question.prototype.printQuestion = function(){
    console.log(this.ques);
    
    for(var i = 0; i<this.answers.length; i++){
        console.log(this.answers[i]);
    }
}

Question.prototype.checkAnswer = function(ans){
    if(ans === this.correctAns){
        console.log('Correct Answer :)');
        score ++;
    }else{
        console.log('Wrong Answer :(');
    }

    console.log('Your current score: ' + score);
}


var question1 = new Question('Is this a JS course?', ['0: Yes', '1: No'], 0);
var question2 = new Question('How many hours is this course of?', ['0: 24','1: 26','2: 28'], 1);
var question3 = new Question('Which Language is this course in?', ['1: Eng', '2: Esp', '3: Hin', '4: Por'], 1);

var questions = [question1, question2, question3];

executeQuiz();


function executeQuiz(){
    console.log('Welcome to the World\'s stupidest quiz!');

    question = questions[Math.floor(Math.random()*(3))]; 
    question.printQuestion();

    var ans = prompt('What is your answer?');
    if(ans === 'exit'){
        console.log('You have exited the game. Hope you had fun!');
    }else{
        question.checkAnswer(parseInt(ans));
        executeQuiz();
    }
    
}

/*
--- Expert level ---

8. After you display the result, display the next random question, so that the game never ends (Hint: write a function for this and call it right after displaying the result)

9. Be careful: after Task 8, the game literally never ends. So include the option to quit the game if the user writes 'exit' instead of the answer. In this case, DON'T call the function from task 8.

10. Track the user's score to make the game more fun! So each time an answer is correct, add 1 point to the score (Hint: I'm going to use the power of closures for this, but you don't have to, just do this with the tools you feel more comfortable at this point).

11. Display the score in the console. Use yet another method for this.
*/
