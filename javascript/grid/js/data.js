var stringArray = [
    ['Evkakiy', 'Ignatovych', 'OOP', '2', 'true'],
    ['Gnat', 'Kozlovskiy', 'Mathematic', '5', 'false'],
    ['Ivan', 'Miladze', 'Facepalm', '1', 'true'],
    ['Afanasiy', 'Bylba', 'Alchoball', '100', 'false'],
    ['Kerry', 'King', 'Guitar', '666', 'true']
];

var numberArray = Array.apply(null, {length: 100})
    .map(function () {
        return Array.apply(null, {length: 5})
            .map(function () {
                return Math.floor(Math.random() * 1000);
            });
    });

var configObject = {
    'headers': ['1', '2', '3', '4', '5'],
    'url': 'http://localhost:8001',
    'loadByParts': true,
    'withTemplates': false
};

var configObjectPartialLoading = {
    'headers': ['1', '2', '3', '4', '5'],
    'url': 'http://localhost:8001',
    'loadByParts': true,
    'withTemplates': true,
    'columnTemplates': {
        1 : Handlebars.compile("<b>{{age2}}</b>")
    }
};

var configObjectFullLoading = {
    'headers': ['1', '2', '3', '4', '5'],
    'url': 'http://localhost:8001',
    'loadByParts': false,
    'withTemplates': false
};

var configObjectFullLoadingWithTemplate = {
    'headers': ['1', '2', '3', '4', '5'],
    'url': 'http://localhost:8001',
    'loadByParts': false,
    'withTemplates': true,
    'columnTemplates': {
        1 : Handlebars.compile("<i><b>{{age2}}</b></i>"),
        4 : Handlebars.compile("<u>{{age5}}</u>")
    }
};


var maxRows = 5;