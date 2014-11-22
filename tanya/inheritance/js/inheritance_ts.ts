class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getName() { console.log("My name is ", this.name); }
}

class Student extends Person {
  university: string;
  constructor(name: string, age: number, university: string) {
    super(name, age);
    this.university = university;
  }
  about() {
    var information = "Hello! My name is " + this.name + ". I'm " + this.age + " old. I'm studying in "
      + this.university + ".";
    console.log(information);
  }
}

var student = new Student("Tanya", 21, "LNU of I.Franko");
student.about();
