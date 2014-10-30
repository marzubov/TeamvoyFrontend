(function (global, document) {
    var CustomSelect = global.CustomSelect = function (container, config) {
        CustomSelect.superclass.constructor.call(this);
        var that = this,
            selector = document.createElement('input'),
            hovered, //remembers selected option
            options = document.createElement('div'),
            optionsData = config.options;
        this.config = {
            options: [
                {}
            ],
            defaultOption: "Please Select Option"
        };
        this.value = {};
        this.container = container;
        this.rootElement = {};
        this.config.merge(config);
        selector.value = this.config.defaultOption;

        this.setSelected = function (value, title) {
            this.value = value;
            selector.value = title;
            this.trigger('change');
        };

        /**
         * Switch options show/hide
         */
        this.toggleOptions = function () {
            options.classList.toggle('hide');
            options.classList.contains('hide') ? this.trigger('hide'):
                this.trigger('show');
        };

        /**
         * Filter all options by title
         * @param searchString
         * @returns {*} Array of options with title and value
         */
        this.filter = function(searchString){
            this.config.options = optionsData.filter(function(option){
                return new RegExp(searchString,'i').test(option.title);
            });
            renderOptions();
            hovered = options.querySelector('.option');
            that.setSelected(hovered.dataset['value'], hovered.innerHTML);
            return this.config.options;
        };

        init(); // It`s all begins here!
        function init() {
            render();
            setEvents();
            that.toggleOptions();
        }

        // Change data in select options
        function renderOptions(){
            var optionString = '';
            that.config.options.forEach(function (option) {
                optionString += '<div data-value="' + option.value
                    + '" class="custom-select option">' + option.title + '</div>'
            });
            options.innerHTML = optionString;
        }
        // Generate whole element
        function render() {
            that.rootElement = document.createElement('div');
            that.rootElement.addClasses('custom-select');
            selector.addClasses('custom-select selector');
            options.addClasses('custom-select options');
            renderOptions();
            that.container.appendChild(that.rootElement);
            that.rootElement.appendChild(selector);
            that.rootElement.appendChild(options);
        }
        // Create listeners on selector and options
        function setEvents() {
            options.addEventListener('mousedown', function () {
                that.setSelected(hovered.dataset['value'], hovered.innerHTML)
            });
            options.addEventListener('mouseover', function (e) {
                hovered &&
                hovered.classList.remove('hover');
                hovered = e.target;
                hovered.classList.add('hover');
            });
            selector.addEventListener('blur', function () {
                options.classList.add('hide');
            });
            selector.addEventListener('click', function () {
                that.toggleOptions();
            });
            selector.addEventListener('keydown', function (e) {
                keyboardEvent(e);
            });
        }
        // Need for correct work with select from keyboard
        function keyboardEvent(e) {
            switch (e.keyCode) {
                case 13://enter
                    that.toggleOptions();
                    e.preventDefault();
                    break;
                case 27://esc
                    options.classList.add('hide');
                    e.preventDefault();
                    break;
                case 40://down
                    if (hovered) {
                        hovered.classList.remove('hover');
                        hovered = hovered.nextSibling ? hovered.nextSibling : hovered;
                        hovered.classList.add('hover');
                    } else {
                        hovered = options.querySelector('.custom-select .option');
                        hovered.classList.add('hover');
                    }
                    that.setSelected(hovered.dataset['value'], hovered.innerHTML);
                    e.preventDefault();
                    break;
                case 38://up
                    if (hovered) {
                        hovered.classList.remove('hover');
                        hovered = hovered.previousSibling ? hovered.previousSibling : hovered;
                        hovered.classList.add('hover');
                    } else {
                        hovered = options.querySelector('.custom-select .option');
                        hovered.classList.add('hover');
                    }
                    e.preventDefault();
                    that.setSelected(hovered.dataset['value'], hovered.innerHTML);
                    break;
                default :
                    options.classList.remove('hide');
                    break;
            }
        }
    };

    extend(CustomSelect, EventMachine);
})(window, document);