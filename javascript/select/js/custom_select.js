(function (global, document) {
    /**
     * Represents a custom select.
     * @constructor
     * @param {string} container - The tag where select must be located.
     * @param {string, array} options - The array of options or name of file, where options is located.
     * @param {object} config - default configuration for select
     */
    var CustomSelect = global.CustomSelect = function(container, options, config) {
        // OOP magic
        CustomSelect.superclass.constructor.call(this);

        this.config = {
            defaultOption: "Please Select Option",
            tabIndex: 0,
            idOfTag: "example"
        };
        this.options = options;
        this.containerForSelect = container;
        this.rootElement={};
        this.config.merge(config);
        this.getOptionsFromFile();
        this.render();

    };

    extend(CustomSelect,EventMachine);
    /**
     * get data from file or array and create custom select based on this data
     * @param {string} container - The tag where select must be located.
     * @param {string, array} options - The array of options or name of file, where options is located.
     * @param {object} config - default configuration for select
     */
    CustomSelect.prototype.getOptionsFromFile = function () {
        if (typeof this.options == "string") {
            var oReq = new XMLHttpRequest();
            var nameOfFile = this.options.substring(this.options.lastIndexOf("/") + 1, this.options.indexOf("."));
            oReq.onload = function () {
                var options = JSON.parse(this.responseText);
                var allSameFile = document.querySelectorAll("." + nameOfFile);
                for (var i = 0; i < allSameFile.length; i += 1) {
                    CustomSelect.updateOptions(allSameFile[i], options, allSameFile[i].getAttribute("data-tag"));
                    allSameFile[i].classList.remove(nameOfFile);
                }
            };
            oReq.open("POST", this.options, true);
            oReq.send();
            return oReq;
        }
    };

    /**
     * Create select element and all options inside it.
     */
    CustomSelect.prototype.render = function () {
        this.rootElement = document.createElement('div');
        if (typeof this.options == "string") {
            this.rootElement.classList.add(
                this.options.substring(this.options.lastIndexOf("/") + 1, this.options.indexOf(".")));
            this.rootElement.setAttribute("data-tag", this.config.idOfTag);
        }
        this.rootElement.tabIndex = 0;
        var elementsOfSelect = document.createDocumentFragment();
        elementsOfSelect = document.createElement('span');
        elementsOfSelect.innerHTML = this.config.defaultOption;
        elementsOfSelect.tabIndex = 0;
        this.addImageToSelectedElement(elementsOfSelect);
        this.rootElement.appendChild(elementsOfSelect);
        elementsOfSelect = document.createElement("div");
        elementsOfSelect.tabIndex = 0;
        elementsOfSelect.classList.add("options-not-active");
        if (typeof this.options != "string") {
            for (var i = 0; i < this.options.length; i++) {
                var option = document.createElement('div');
                if (typeof this.options[i] == "object") {
                    option.innerHTML = this.options[i].title;
                    option.setAttribute("data-value",this.options[i].value);
                }
                else {
                    option.innerHTML = this.options[i];
                    option.setAttribute("data-value",this.options[i]);
                }
                option.tabIndex = 0;
                elementsOfSelect.appendChild(option);
            }
        }
        this.rootElement.appendChild(elementsOfSelect);
        this.addClassesForSelect();
        this.addEventsForSelect();
        this.containerForSelect.appendChild(this.rootElement);
    };

    /**
     * Update all options inside indicated select
     * @param {object} myTagSelect - The tag select where we must update options
     * @param {array} options - The array of options.
     */
    CustomSelect.updateOptions = function (myTagSelect, options, tag) {
        var parentForOptions = myTagSelect.querySelector(".option");
        while (parentForOptions.firstChild) {
            parentForOptions.removeChild(parentForOptions.firstChild);
        }
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement('div');
            if (typeof options[i] == "object" ) {
                option.innerHTML = options[i].title;
                option.setAttribute("data-value",options[i].value);
            } else {
                option.innerHTML = options[i];
                option.setAttribute("data-value",options[i]);
            }
            option.tabIndex = 0;
            parentForOptions.appendChild(option);
        }
    };

    /**
     * Add classes for main elements of select
     */
    CustomSelect.prototype.addClassesForSelect = function () { //TODO: move to private (if possible).
        var myConfig = this.config;
        this.rootElement.classList.add('custom-select');
        this.rootElement.childNodes[0].classList.add("selected");
        this.rootElement.childNodes[1].classList.add("option");
        Array.prototype.forEach
                       .call(this.rootElement.childNodes, function (child) {
                child.tabIndex = myConfig.tabIndex;
            });
    };

    CustomSelect.prototype.clickOnOptions = function (that, target) {
        that.changeDisplayForOptions();
        that.rootElement.childNodes[0].innerHTML = target.innerHTML;
        that.addImageToSelectedElement(that.rootElement.childNodes[0]);
        document.getElementById(that.config.idOfTag).innerHTML = target.getAttribute("data-value");
    };

    /**
     * Add click, keydown, blur events for custom select
     */
    CustomSelect.prototype.addEventsForSelect = function () {
        var that = this;
        this.rootElement.addEventListener('click', function () {
            that.rootElement.childNodes[0].focus();
            that.rootElement.childNodes[0].classList.remove('keydown');
            that.changeDisplayForOptions();
        });
        this.rootElement.childNodes[1].addEventListener('mousedown', function (e){
            var event = e || window.event;
            var target = event.target || event.srcElement;
            that.clickOnOptions(that, target);
        });
        this.rootElement.addEventListener('keydown', function (e){
            var event = e || window.event;
            var target = event.target || event.srcElement;
            that.rootElement.childNodes[0].classList.add('keydown');
            that.getKeyCode(e, target);
            e.preventDefault(); e.stopPropagation(); return false;

        });
        Array.prototype.forEach
            .call(this.rootElement.childNodes, function (child) {
                child.addEventListener('blur', function (e) {
                    var event = e || window.event;
                    var target = event.target || event.srcElement;
                    if (target.classList.contains("keydown")) {
                        target.classList.remove('keydown');
                        return false;
                    }
                    console.log("blur");
                    var sel = that.rootElement.querySelector(".option");
                    sel.classList.remove("options-active");
                    sel.classList.add("options-not-active");
                });
            });
    };

    /**
     * Get next option
     * @param {object} option - For this option we search the next option
     */
    CustomSelect.prototype.getNextOption = function (option) {
        var index = Array.prototype.indexOf
            .call(option.parentNode.childNodes, option);
        if (index == option.parentNode.childNodes.length - 1) return option.parentNode.childNodes[0];
        return option.parentNode.childNodes[index + 1];
    };

    /**
     * Get previous option
     * @param {object} option - For this option we search the previous option
     */
    CustomSelect.prototype.getPreviousOption = function (option) {
        var index = Array.prototype.indexOf
            .call(option.parentNode.childNodes, option);
        if (index == 0) return option.parentNode.childNodes[option.parentNode.childNodes.length - 1];
        return option.parentNode.childNodes[index - 1];
    };

    /**
     * Open and hide select options
     */
    CustomSelect.prototype.changeDisplayForOptions = function () {
        console.log("change");
        var sel = this.rootElement.childNodes[1];
        if (sel.classList.contains("options-not-active")) {
            sel.classList.remove("options-not-active");
            sel.classList.add("options-active");
        }
        else {
            sel.classList.remove("options-active");
            sel.classList.add("options-not-active");
        }
    };

    CustomSelect.prototype.addImageToSelectedElement = function (span) {
        var image = document.createElement('img');
        image.src = "css/img/down.png";
        span.appendChild(image);
    };

    /**
     * Get all key codes for keydown event
     * @param {object} element - for this element we use keydown event
     * @param {event:customSelect} e - a custom select event
     */
    CustomSelect.prototype.getKeyCode = function (e, element) {
        console.log("keycode");
        switch (e.keyCode) {
            case 13://enter
                this.clickOnOptions(this, e.target);
                break;
            case 27://esc
                this.clickOnOptions(this, e.target);
                break;
            case 38://up
                if (!element.classList.contains("selected")) {
                    this.getPreviousOption(e.target).focus();
                }
                else {
                    this.rootElement.childNodes[1].childNodes[0].focus();
                }
                break;
            case 40://down
                if (!element.classList.contains("selected")) {
                    this.getNextOption(e.target).focus();
                }
                else {
                    this.rootElement.childNodes[1].childNodes[0].focus();
                }
                break;
            default:
                element.parentNode.focus();
                break;
        }
    };

    CustomSelect.prototype.getValue = function () {
        var nameOfFile = this.rootElement.childNodes[0].innerHTML.
                            substring(0, this.rootElement.childNodes[0].innerHTML.indexOf("<img"));
        return nameOfFile;
    };
})(window, document);