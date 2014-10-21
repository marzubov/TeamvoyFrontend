/**
 * Merge two object.
 * @param {object} obj - The object that we must merge
 */
Object.prototype.merge = function (obj) {
    "use strict";
    var key;
    for (key in obj) {
        if (this.hasOwnProperty(key)) { this[key] = obj[key]; }
    }
};

/**
 * get data from file or array and create custom select based on this data
 * @param {string} container - The tag where select must be located.
 * @param {string, array} options - The array of options or name of file, where options is located.
 * @param {object} config - default configuration for select
 */
CustomSelect.createSelectByData = function (container, data, config) {
    if (typeof data == "string") {
        var select = new CustomSelect(container, [], config);
        select.myTagSelect.classList.add(data);
        if (!CustomSelect.selectCache[data]) {
            CustomSelect.selectCache[data] = data;
            var oReq = new XMLHttpRequest();
            oReq.onload = function () {
                var options = JSON.parse(this.responseText);
                var allSameFile = document.querySelectorAll("." + data);
                for (var i = 0; i < allSameFile.length; i += 1) {
                    CustomSelect.UpdateOptions(allSameFile[i], options);
                    allSameFile[i].classList.remove(data);
                }
            }
            oReq.open("POST", "data_for_options/" + data + ".json", true);
            oReq.send();
        }
    }
    else {
        var select = new CustomSelect(container, data, config);
    }
};

/**
 *
 * @type {Array} selectCache - cache for saving name of file to make an ajax request once
 */
CustomSelect.selectCache = [];

/**
 * Represents a custom select.
 * @constructor
 * @param {string} container - The tag where select must be located.
 * @param {string, array} options - The array of options or name of file, where options is located.
 * @param {object} config - default configuration for select
 */
function CustomSelect(container,options,config){
    this.config = {
        style: "standard",
        multiple: "false",
        native: "false",
        replace: "false",
        defaultOption: "Please Select Option",
        tabIndex: 0
    };
    this.options = options;
    this.containerForSelect = container;
    this.myTagSelect;
    this.config.merge(config);
    this.createSelect();
};

/**
 * Create select element and all options inside it.
 */
CustomSelect.prototype.createSelect = function(){
    this.myTagSelect = document.createElement('div');
    this.myTagSelect.tabIndex = 0;

    var elementsOfSelect = document.createDocumentFragment();
    elementsOfSelect = document.createElement('span');
    elementsOfSelect.tabIndex=0;

    this.myTagSelect.appendChild(elementsOfSelect);
    elementsOfSelect = document.createElement("div");
    elementsOfSelect.tabIndex=0;
    elementsOfSelect.classList.add("options-not-active");
    for (var i = 0; i < this.options.length; i ++) {
    var option = document.createElement('div');
        option.innerHTML = this.options[i];
        option.tabIndex=0;
        elementsOfSelect.appendChild(option);
   }
    this.myTagSelect.appendChild(elementsOfSelect);

    this.addClassesForSelect();
    this.addEventsForSelect();
    this.containerForSelect.appendChild(this.myTagSelect);
};

/**
 * Update all options inside indicated select
 * @param {object} myTagSelect - The tag select where we must update options
 * @param {array} options - The array of options.
 */
CustomSelect.UpdateOptions = function (myTagSelect, options) {
    var parentForOptions = myTagSelect.querySelector(".custom-option");
    while (parentForOptions.firstChild) {
        parentForOptions.removeChild(parentForOptions.firstChild);
    }
    for (var i = 0; i < options.length; i ++) {
        var option = document.createElement('div');
        option.innerHTML = options[i];
        option.tabIndex=0;
        parentForOptions.appendChild(option);
    }
}

/**
 * Add classes for main elements of select
 */
CustomSelect.prototype.addClassesForSelect = function(){
    var myConfig = this.config;
    this.myTagSelect.className = 'custom-select';
    this.myTagSelect.childNodes[0].className = 'custom-selected';//span
    this.myTagSelect.childNodes[0].innerHTML = myConfig.defaultOption;
    Array.prototype.forEach
        .call(this.myTagSelect.childNodes, function (child) {
        child.tabIndex = myConfig.tabIndex;
        if (child.tagName == 'SPAN') return;
        child.classList.add('custom-option');
    });
};

/**
 * Add click keydown events for custom select
 */
CustomSelect.prototype.addEventsForSelect = function(){
    var that = this;
    this.myTagSelect.addEventListener('click',function(){ that.changeDisplayForOptions(); });
    Array.prototype.forEach
                   .call(this.myTagSelect.childNodes[1].childNodes, function(child) {
        child.addEventListener('click',function(){
            if(child.tagName != 'SPAN') this.parentNode.parentNode.childNodes[0].innerHTML = this.innerHTML;
        });
        child.addEventListener('keydown',function(e){
           that.getKeyCode(e, child);
           e.preventDefault();
           return;
        });
        child.parentNode.parentNode.childNodes[0].addEventListener('keydown',function(e){
            that.getKeyCode(e, child.parentNode.parentNode.childNodes[0]);
            e.preventDefault();
            return;
        });

    });
};

/**
 * Get next option
 * @param {object} option - For this option we search the next option
 */
CustomSelect.prototype.getNextOption = function(option){
    var index = Array.prototype.indexOf
        .call(option.parentNode.childNodes, option);
    if (index==option.parentNode.childNodes.length-1) return option.parentNode.childNodes[0];
    return option.parentNode.childNodes[index+1];
};

/**
 * Get previous option
 * @param {object} option - For this option we search the previous option
 */
CustomSelect.prototype.getPreviousOption = function(option){
    var index = Array.prototype.indexOf
        .call(option.parentNode.childNodes, option);
    if (index==0) return option.parentNode.childNodes[option.parentNode.childNodes.length-1];
    return option.parentNode.childNodes[index-1];
};

/**
 * Open and hide select options
 */
CustomSelect.prototype.changeDisplayForOptions = function () {
    var sel = this.myTagSelect.querySelector(".custom-option");
    if(sel.classList.contains("options-not-active")){
        sel.classList.remove("options-not-active");
        sel.classList.add("options-active");
    }
    else {
        sel.classList.remove("options-active");
        sel.classList.add("options-not-active");
    }
};

/**
 * Get all key codes for keydown event
 * @param {object} element - for this element we use keydown event
 * @param {event:customSelect} e - a custom select event
 */
CustomSelect.prototype.getKeyCode = function(e, element) {
    switch (e.keyCode){
        case 13://enter
            element.click();
            break;
        case 27://esc
            element.click();
            break;
        case 38://up
            if (element.tagName != 'SPAN') { this.getPreviousOption(e.target).focus(); }
            else { this.myTagSelect.childNodes[1].childNodes[0].focus(); }
            break;
        case 40://down
            if (element.tagName != 'SPAN') { this.getNextOption(e.target).focus(); }
            else { this.myTagSelect.childNodes[1].childNodes[0].focus(); }
            break;
        default:
            element.parentNode.focus();
            break;
    }
};