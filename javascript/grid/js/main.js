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
            'withFilter': false,
            'withDraggable': true,
            'columnTemplates': false
        };


        var configObjectPartialLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'withFilter': false,
            'withDraggable': false,
            'loadByParts': true,
            'columnTemplates': {
                1: "<b>{{age2}}</b>"
            }
        };

        var configObjectFullLoadingWithTemplate = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'withFilter': true,
            'withDraggable': true,
            'loadByParts': false,
            'columnTemplates': {
                1: "<i><b>{{age2}}</b></i>",
                4: "<u>{{age5}}</u>"
            }
        };

        var container = document.getElementById('withTemplate');
        fullDataTable = new SortableGrid(container, configObjectFullLoadingWithTemplate);

        container = document.getElementById('partialServerData');
        partDataTable = new SortableGrid(container, configObjectPartialLoading);
    }, 10);
})();
