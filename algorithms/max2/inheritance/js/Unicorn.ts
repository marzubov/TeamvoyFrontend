class Unicorn extends Animal {
  constructor(name: string){
    super(9000,name);
  }
}
class Animal{
  public name: string;
  private positionX: number;
  private speed: number;
  constructor(speed: number,name: string){
    this.name = name;
    this.speed = speed;
  }
  public run(){
    this.positionX += this.speed;
  }
}
