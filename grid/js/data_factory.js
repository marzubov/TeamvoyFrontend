function getStringArray() {
    return [
        ['Evkakiy', 'Ignatovych', 'OOP', '2'],
        ['Gnat', 'Kozlovskiy', 'Mathematic', '5'],
        ['Ivan', 'Miladze', 'Facepalm', '1'],
        ['Afanasiy', 'Bylba', 'Alchoball', '100'],
        ['Kerry', 'King', 'Guitar', '666']
    ];
}

function getNumberArray(){
    var result=[];
    for(var i=0;i<10;i++)
    result[i]=Array.apply(null, {length: 4}).map(Function.call, randomInt);
    return result;

    function randomInt(){
        return Math.floor(Math.random()*100);
    }
    }

function getConfig(){
        return  {
            'headers':['1','2','3','4']
        };
    }