function addCustomSelect(container,variables,config){
    var customSelect = new customSelect(variables,config);
    container.appendChild(customSelect.getComponent());
}

function customSelect(variables,config){
    this.create();
    this.configure();
    this.addVariables();
}

customSelect.getComponent = function(){
    //return (this.customSelect);
    console.log("getComponent");
}
customSelect.addVariables = function(){
    //return (this.customSelect);
    console.log("getComponent");
}
customSelect.configure = function(){
    //return (this.customSelect);
    console.log("getComponent");
}
customSelect.create = function(){
    //return (this.customSelect);
    console.log("getComponent");
}
//function createCustomSelect(variables,config){
//
//    var selectWrapperDiv = document.createElement("span");
//    var selectDiv = document.createElement("div");
//    var selectedSpan = document.createElement('span');
//    var arrowSpan = document.createElement('span');
//    var options = document.createElement('div');
//    var searchDiv = document.createElement('div');
//    var searchFieldSpan = document.createElement('span');
//    var searchIcon = document.createElement('span');
//    selectWrapperDiv.className = "selectWrapper";
//
//    selectDiv.className = "select";
//    selectDiv.tabIndex = -1;
//
//    selectedSpan.className = "selected";
//    selectedSpan.tabIndex = -1;
//    selectedSpan.innerHTML = select.options[0].text;
//    arrowSpan.innerHTML = '&#8629';
//    arrowSpan.className = 'arrow';
//
//    selectDiv.appendChild(selectedSpan);
//    selectDiv.appendChild(arrowSpan);
//
//    selectWrapperDiv.appendChild(selectDiv);
//
//    options.className = "options";
//    searchDiv.className = "search";
//    searchFieldSpan.className = 'searchField';
//    searchFieldSpan.contentEditable = true;
//    searchIcon.className = "searchIcon";
//    searchIcon.innerHTML = 's';
//    selectDiv.appendChild(options);
//    searchDiv.appendChild(searchFieldSpan);
//    searchDiv.appendChild(searchIcon);
//    options.appendChild(searchDiv);
//
//    for (var i = 0; i < variables.length; i++) {
//        var option = document.createElement('div');
//        option.className = "option";
//        option.innerHTML = variables[i].text;
//        option.setAttribute('value', [i].value);
//        option.tabIndex = -1;
//        options.appendChild(option);
//    }
//}