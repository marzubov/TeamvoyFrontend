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
                1: "<b>{{name}}</b>"
            }
        };

        var configObjectFullLoadingWithTemplate = {
            'headers': ['id', 'name', 'age', 'gender', 'email'],
            'maxRows': 5,
            'arrayOrURL': 'http://localhost:8001',
            'withFilter': true,
            'withDraggable': true,
            'withHidden': true,
            'loadByParts': false,
            'columnTemplates': {
                1: "<i><b>{{name}}</b></i>",
                4: "<a href='http://www.google.com.ua' target='_blank'>{{email}}</a>"
            }
        };

        var container = document.getElementById('withTemplate');
        fullDataTable = new SortableGrid(container, configObjectFullLoadingWithTemplate);

        container = document.getElementById('partialServerData');
        partDataTable = new SortableGrid(container, configObjectPartialLoading);
    }, 10);
})();
