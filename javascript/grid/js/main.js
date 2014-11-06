(function () {
    setTimeout(function () {
        var draggableTable, fullDataTable, partDataTable;

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
            'changeData': false,
            'withFilter': false,
            'columnTemplates': false
        };


        var configObjectPartialLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'changeData': false,
            'withFilter': false,
            'loadByParts': true,
            'columnTemplates': {
                1: Handlebars.compile("<b>{{age2}}</b>")
            }
        };

        var configObjectFullLoadingWithTemplate = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'withFilter': true,
            'changeData': false,
            'loadByParts': false,
            'columnTemplates': {
                1: Handlebars.compile("<i><b>{{age2}}</b></i>"),
                4: Handlebars.compile("<u>{{age5}}</u>")
            }
        };

        var container = document.getElementById('draggable');
        draggableTable = new SortableGrid(container, configObject).getCreatedElement();
        var draggable = new Draggable(draggableTable.getRoot(), draggableTable.getData());

        container = document.getElementById('withTemplate');
        fullDataTable = new SortableGrid(container, configObjectFullLoadingWithTemplate).getCreatedElement();

        container = document.getElementById('partialServerData');
        partDataTable = new SortableGrid(container, configObjectPartialLoading).getCreatedElement();
    }, 10);
})();
