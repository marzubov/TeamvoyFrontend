var stringArray= [
    ['Evkakiy', 'Ignatovych', 'OOP', '2','true'],
    ['Gnat', 'Kozlovskiy', 'Mathematic', '5','false'],
    ['Ivan', 'Miladze', 'Facepalm', '1','true'],
    ['Afanasiy', 'Bylba', 'Alchoball', '100','false'],
    ['Kerry', 'King', 'Guitar', '666','true']];

var numberArray =Array.apply(null, {length: 100})
    .map(function(){
        return Array.apply(null, {length: 5})
            .map(function(){return Math.floor(Math.random()*1000);});
    });

var configObject= {
    'headers':['1','2','3','4','5'],
    'url':'http://localhost:8001',
    'loadByParts': true
};

var configObjectPartialLoading= {
    'headers':['1','2','3','4','5'],
    'url':'http://localhost:8001',
    'loadByParts': true
};

var configObjectFullLoading= {
    'headers':['1','2','3','4','5'],
    'url':'http://localhost:8001',
    'loadByParts': false
};

var maxRows = 5;