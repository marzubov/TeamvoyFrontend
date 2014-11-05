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
            'withTemplates': false
        };

        var configObjectPartialLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'url': 'http://localhost:8001',
            'loadByParts': true,
            'withTemplates': true,
            'columnTemplates': {
                1: Handlebars.compile("<b>{{age2}}</b>")
            }
        };

        var configObjectFullLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'url': 'http://localhost:8001',
            'loadByParts': false,
            'withTemplates': false
        };

        var configObjectFullLoadingWithTemplate = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'url': 'http://localhost:8001',
            'loadByParts': false,
            'withTemplates': true,
            'columnTemplates': {
                1: Handlebars.compile("<i><b>{{age2}}</b></i>"),
                4: Handlebars.compile("<u>{{age5}}</u>")
            }
        };

        draggableTable = new SortableGrid(container, numberArray, configObject).getCreatedElement();
        var draggable = new Draggable(draggableTable.getRoot(), draggableTable.getData());

        container = document.getElementById('filterable');
        filteredTable = new SortableGrid(container, stringArray, configObject).getCreatedElement();
        var filterable = new Filterable(container, filteredTable.getRoot());
        filterable.enable(2);

        container = document.getElementById('fullServerData');
        fullDataTable = new SortableGrid(container, null, configObjectFullLoading).getCreatedElement();

        container = document.getElementById('withTemplate');
        fullDataTable = new SortableGrid(container, null, configObjectFullLoadingWithTemplate).getCreatedElement();

        container = document.getElementById('partialServerData');
        partDataTable = new SortableGrid(container, null, configObjectPartialLoading).getCreatedElement();
    }, 10);
})();
