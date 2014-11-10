(function (global, document) {
  global.Student = function Student(name, age, university) {
    //Person.call(this, name, age);   //2 method
    this.university = university;
  };
  Student.prototype = Person;   //3 method
  Student.prototype.information = function () {
    var information = "Hello! My name is " + this.name + ". I'm " + this.age + " old. I'm studying in "
                    + this.university + ".";
    console.log(information);
  };
})(window,document);
