var dog = new Dog('Beethoven');
var cat = new Cat('Vivaldi');
var snake = new Snake('Chaykovsky');

console.log('================','Inheritance by call Dog>Animal, Dog>EventMachine, Animal.prototype.func will not work');
dog.makeSound();
dog.makeSound();
dog.run();
console.log('================','Inheritance by for in loop Cat>Animal, Cat>EventMachine, Animal.prototype.func will not work');
cat.makeSound();
cat.run();
console.log('================','Inheritance by prototype Snake>Animal>EventMachine, Animal.prototype.func will work');
Snake.prototype.bite = function(){
  console.error('Snake bites you, you will die in few days')
};
snake.bite();
snake.makeSound();
snake.run();
