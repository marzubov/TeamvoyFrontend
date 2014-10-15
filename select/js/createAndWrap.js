function createCustomSelect(select){
   
    var selectWrapperDiv = document.createElement("span");
    var selectDiv = document.createElement("div");
    var selectedSpan = document.createElement('span');
    var arrowSpan = document.createElement('span');
    var options = document.createElement('div');
    
    selectWrapperDiv.className = "selectWrapper";

    selectDiv.className = "select";
    selectDiv.tabIndex = -1;

    selectedSpan.className = "selected";
    selectedSpan.tabIndex = -1;
    selectedSpan.innerHTML = select.options[0].text;

    arrowSpan.innerHTML = '&#8629';
    arrowSpan.className = 'arrow';

    selectDiv.appendChild(selectedSpan);
    selectDiv.appendChild(arrowSpan);

    selectWrapperDiv.appendChild(selectDiv);

    options.className = "options";

    selectDiv.appendChild(options);

    for (var i = 0; i < select.options.length; i++) {        
        var option = document.createElement('div');
        option.className = "option";
        option.innerHTML = select.options[i].text;
        option.setAttribute('value', select.options[i].value);
        option.tabIndex = -1;
        
        options.appendChild(option);
    }
    wrapSelect.call(this,select,selectWrapperDiv,selectedSpan, arrowSpan, options);
}

function wrapSelect(select,selectWrapperDiv,selectedSpan,arrowSpan,options){
    var selectClone = document.createElement('select');
    selectClone = select.cloneNode(true);
    var tempID = select.id;
    if (tempID!='')selectClone.id = tempID;
    select.id = 'last';
    selectWrapperDiv.appendChild(selectClone);    
    var selectParent = select.parentNode;
    addEvents(selectedSpan,arrowSpan,options,selectClone);
    selectParent.replaceChild(selectWrapperDiv,select);
}