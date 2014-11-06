(function () {
    setTimeout(function () {
        var container = document.getElementById('draggable');

        var draggableTable, filteredTable, fullDataTable, partDataTable;
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
            'maxRows': 5,
            'arrayOrURL' : numberArray,
            'columnTemplates': false
        };

        var configObject2 = {
          'headers': ['1', '2', '3', '4', '5'],
          'maxRows': 5,
          'arrayOrURL' : stringArray,
          'columnTemplates': false
        };

        var configObjectPartialLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'loadByParts': true,
            'columnTemplates': {
                1: Handlebars.compile("<b>{{age2}}</b>")
            }
        };

        var configObjectFullLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'loadByParts': false,
            'columnTemplates': false
        };

        var configObjectFullLoadingWithTemplate = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'loadByParts': false,
            'columnTemplates': {
                1: Handlebars.compile("<i><b>{{age2}}</b></i>"),
                4: Handlebars.compile("<u>{{age5}}</u>")
            }
        };

        draggableTable = new SortableGrid(container, configObject).getCreatedElement();
        var draggable = new Draggable(draggableTable.getRoot(), draggableTable.getData());

        container = document.getElementById('filterable');
        filteredTable = new SortableGrid(container, configObject2).getCreatedElement();
        var filterable = new Filterable(container, filteredTable.getRoot());
        filterable.enableSearchField(2);

        container = document.getElementById('fullServerData');
        fullDataTable = new SortableGrid(container, configObjectFullLoading).getCreatedElement();

        container = document.getElementById('withTemplate');
        fullDataTable = new SortableGrid(container, configObjectFullLoadingWithTemplate).getCreatedElement();

        container = document.getElementById('partialServerData');
        partDataTable = new SortableGrid(container, configObjectPartialLoading).getCreatedElement();
    }, 10);
})();
