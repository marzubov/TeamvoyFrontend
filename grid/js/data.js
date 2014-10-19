var stringArray= [
        ['Evkakiy', 'Ignatovych', 'OOP', '2'],
        ['Gnat', 'Kozlovskiy', 'Mathematic', '5'],
        ['Ivan', 'Miladze', 'Facepalm', '1'],
        ['Afanasiy', 'Bylba', 'Alchoball', '100'],
        ['Kerry', 'King', 'Guitar', '666']];

var numberArray =Array.apply(null, {length: 100})
        .map(function(){
           return Array.apply(null, {length: 5})
                .map(function(){return Math.floor(Math.random()*1000);});
        });

var configObject= {
            'headers':['1','2','3','4','5']
        };

var maxRows = 10;