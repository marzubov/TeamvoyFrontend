(function (global, document) {
  global.Person = function Person(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  };
  Person.prototype.getName = function() {
    console.log("Name", this.name);
  };
})(window,document);

