function DataFactory(){
    this.getStringArray=stringArray;
    this.getNumberArray=numberArray;
    this.getConfigObject=configObject;


    function stringArray() {
        return  [
            ['Evkakiy', 'Gnat', 'OOP', '2'],
            ['Kozlovskiy', 'Ignatovych', 'Mathematic', '5'],
            ['Ivan', 'Miladze', 'Facepalm', '1'],
            ['Afanasiy', 'Bylba', 'Alchoball', '100'],
            ['Kerry', 'King', 'Guitar', '666']
    ];
    }

    function numberArray(){
        var result =[];

        for(var i=0;i<7;i++) {
            var row=[];
            for (var j = 0; j < 4; j++) {

                row[j] = Math.floor(Math.random() * 100);
            }
            result[i] =row;
        }
        return result;
    }

    function configObject(){
        return  {
            'headers':['1','2','3','4']
        };
    }
}