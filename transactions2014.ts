import * as readline from 'readline';

class Person {
    private name: string;
    private amount: number;
    private transactions: DateAndNarrative[] = [];

    public constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }

    public getName(): string {
        return this.name;
    }

    public getAmount(): number {
        return this.amount;
    }

    public setAmount(amount: number) {
        this.amount = amount;
    }

    public addNewTransaction(date: string, narrative: string) {
        let newTransaction = new DateAndNarrative(date, narrative);
        this.transactions.push(newTransaction);
    }

    public listAccount() {
        for (let index = 0; index < this.transactions.length; index++) {
            console.log("Date: " + this.transactions[index].getDate() +
                        "; Narrative: " + this.transactions[index].getNarrative());
        }
    }
}

class Transaction {
    private date: string;
    private fromPerson: Person;
    private toPerson: Person;
    private narrative: string;
    private amount: number;

    public constructor(date: string, fromPerson: Person, toPerson: Person, narrative: string, amount: number) {
        this.date = date;
        this.fromPerson = fromPerson;
        this.toPerson = toPerson;
        this.narrative = narrative;
        this.amount = amount;
    }

    public listTransaction() {
        console.log(this);
    }
}

class DateAndNarrative {
    private date: string;
    private narrative: string;

    public constructor(date: string, narrative: string) {
        this.date = date;
        this.narrative = narrative;
    }

    public getDate(): string {
        return this.date;
    }

    public getNarrative(): string {
        return this.narrative;
    }
}

function readFile(filename: string) {
    let fs = require("fs");
    let textByLine = fs.readFileSync(filename).toString().split("\n");
    return textByLine.map((line: string) => line.split(","));
}

function main() {
    let allTransactions: Transaction[] = [];
    let allPeople: Person[] = [];

    let table = readFile("Transactions2014.csv");
    for (let i = 1; i < table.length - 1; i++) {
        let date = table[i][0];
        let fromPerson = table[i][1];
        let toPerson = table[i][2];
        let narrative = table[i][3];
        let amount = parseFloat(table[i][4]);

        let transaction = new Transaction(date, fromPerson, toPerson, narrative, amount);
        allTransactions.push(transaction);

        let foundFromPerson = 0;
        let foundToPerson = 0;
        for (let i = 0; i < allPeople.length; i++) {
            if (allPeople[i].getName() === fromPerson) {
                foundFromPerson = 1;
                let personAmount = allPeople[i].getAmount();
                personAmount -= amount;
                allPeople[i].setAmount(personAmount);
                allPeople[i].addNewTransaction(date, narrative);
            }

            if (allPeople[i].getName() === toPerson) {
                foundToPerson = 1;
                let personAmount = allPeople[i].getAmount();
                personAmount += amount;
                allPeople[i].setAmount(personAmount);
            }

            if (foundFromPerson && foundToPerson) {
                break;
            }
        }

        if (foundFromPerson == 0) {
            let person = new Person(fromPerson, 100 - amount);
            person.addNewTransaction(date, narrative);
            allPeople.push(person);
        }

        if (foundToPerson == 0) {
            let person = new Person(toPerson, 100 + amount);
            allPeople.push(person);
        }
    }

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Your command: ', (answer) => {
        if (answer === "List All") {
            for (let index = 0; index < allTransactions.length; index++) {
                allTransactions[index].listTransaction();
            }
        } else {
            let delimitation: string = ' ';
            let namePerson = answer.split(delimitation);

            for (let index = 0; index < allPeople.length; index++) {
                if (allPeople[index].getName() === answer.substring(namePerson[0].length + 1)) {
                    allPeople[index].listAccount();
                }
            }
        }

        rl.close();
    });
}

main();
