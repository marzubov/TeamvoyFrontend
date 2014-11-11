var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Person = (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    Person.prototype.getName = function () {
        console.log("My name is ", this.name);
    };
    return Person;
})();
var Student = (function (_super) {
    __extends(Student, _super);
    function Student(name, age, university) {
        _super.call(this, name, age);
        this.university = university;
    }
    Student.prototype.about = function () {
        var information = "Hello! My name is " + this.name + ". I'm " + this.age + " old. I'm studying in " + this.university + ".";
        console.log(information);
    };
    return Student;
})(Person);
var student = new Student("Tanya", 21, "LNU of I.Franko");
student.about();
//# sourceMappingURL=inheritance_ts.js.map