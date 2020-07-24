
/*
//The Map Quiz practice
const ques = new Map();
ques.set('ques', 'What is your first name?');
ques.set(1, 'Bipul');
ques.set(2, 'Kumar');
ques.set(3, 'Lohia');
ques.set('correct', 1);
ques.set(true, 'Well done boy! You played well :)');
ques.set(false, 'You need to get better!!!');

console.log(ques.get('ques'));
for(let [key, val] of ques.entries()){
    if(typeof(key) === 'number'){
        console.log(`Option ${key}: ${val}`);
    }
}
const ans = parseInt(prompt('What is the correct ans?'));
console.log('Answer recieved: ' + ques.get(ans));
console.log(ques.get(ques.get('correct') === ans));
*/

/*
---ES5 Classes---

function human(name, age){
    this.name = name;
    this.age = age;
}

human.prototype.calcBirthYear = function(){
    return 2020-this.age;
}

const bipul = new human('Bipul', 25);
console.log(bipul);

function asians(name, age, country, region = 'SEA'){
    human.call(this, name, age);
    this.country = country;
    this.region = region;
}

asians.prototype = Object.create(human.prototype);

const lohia = new asians('Lohia', 25, 'India', 'CA');
console.log(lohia);

---ES6 Classes---

class human{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }

    calcBirthYear(){
        return 2020-this.age;
    }
}

const bipul = new human('Bipul', 25);

class asians extends human{
    constructor(name, age, country, region = 'SEA'){
        super(name, age);
        this.country = country;
        this.region = region;
    }
}
const lohia = new asians('Lohia', 26, 'India');
*/


//---Section Challenge---

class Street{
    constructor(name, buildYear, streetLength, streetSize = 'normal'){
        this.name = name;
        this.buildYear = buildYear;
        this.streetLength = streetLength;
        this.streetSize = () => {
            const size = this.streetLength*this.streetLength;
            let sizeName = '';
            size > 40 ? sizeName = 'Huge' : (size > 30 ? sizeName = 'Big' : (size > 20 ? sizeName = 'Normal' : (size > 10 ? sizeName = 'Small' : sizeName = 'Tiny')));
            return sizeName;
        }
    }
}

class Park extends Street{
    constructor(name, buildYear, treeCount, parkArea){
        super(name, buildYear);
        this.treeCount = treeCount;
        this.parkArea = parkArea;
        this.parkAge = 2020-this.buildYear;
        this.treeDensity = this.treeCount/this.parkArea;
    }
}

const streetsMap = new Map();
streetsMap.set(1, new Street('Vikas Nagar', 2004, 4.5));
streetsMap.set(2, new Street('Subhash Nagar', 2001, 6));
streetsMap.set(3, new Street('Costa Nagar', 1997, 15));
streetsMap.set(4, new Street('Las Vegas Nagar', 2009, 9.3));

const parksMap = new Map();
parksMap.set(1, new Park('Jawahar Park', 2001, 48, 5));
parksMap.set(2, new Park('Natwar Park', 2005, 102, 9));
parksMap.set(3, new Park('Jindal Park', 2011, 35, 3));


console.log(`***--- PARKS REPORT ---***`);
let sumAge = 0;
for(const [key, val] of parksMap.entries()){
    console.log(`${val.name} has a tree density of ${val.treeDensity} per sq. km`);
    sumAge += val.parkAge;
}

console.log(`Avg. age of the towns of the park: ${sumAge/parksMap.size} years`);

console.log(`***--- STREETS REPORT ---***`);
let sumLength = 0;
for(const [key, val] of streetsMap.entries()){
    console.log(`${val.name}, built in ${val.buildYear}, is a ${val.streetSize()} street`);
    sumLength += val.streetLength;
}
console.log(`Our ${streetsMap.size} streets have a total length of ${sumLength} kms and avg length of ${sumLength/streetsMap.size} kms`);

