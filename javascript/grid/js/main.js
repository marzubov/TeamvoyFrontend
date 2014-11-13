(function () {
    setTimeout(function () {
        var fullDataTable, partDataTable;

        var configObjectPartialLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'withFilter': false,
            'withDraggable': false,
            'withHidden': false,
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
            'withHidden': true,
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
