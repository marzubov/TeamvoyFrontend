require (["sortable_grid"], function(SortableGrid) {
  setTimeout(function () {
    var configObjectPartialLoading = {
      'headers': ['id', 'name', 'age', 'gender', 'email'],
      'maxRows': 5,
      'arrayOrURL': 'http://localhost:8001',
      'withFilter': false,
      'withDraggable': false,
      'withHidden': false,
      'loadByParts': true,
      'columnTemplates': {
        "name": "<b>{{name}}</b>"
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
        "name": "<i><b>{{name}}</b></i>",
        "email": "<a href='http://www.google.com.ua' target='_blank'>{{email}}</a>"
      }
    };

    var container = document.getElementById('withTemplate');
    new SortableGrid(container, configObjectFullLoadingWithTemplate);

    container = document.getElementById('partialServerData');
    new SortableGrid(container, configObjectPartialLoading);
  }, 10);
});
