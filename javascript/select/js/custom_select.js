(function (global, document) {
    var CustomSelect = global.CustomSelect = function (container, config) {
        CustomSelect.superclass.constructor.call(this);
        var that = this,
            optionsData = config.options,
            hovered = { //Remembers hovered element
                isDefined: function () { // Need for checking
                    return this.realElement
                },
                realElement: 0,
                get element() {
                    return this.realElement
                },
                set element(value) { //Delete previous hovered element
                    if(this.isDefined())
                    this.realElement.classList.remove('hover');
                    this.realElement = value;
                    this.realElement.classList.add('hover')
                }
            };
        this.config = config;

        /**
         * Hide options
         */
        this.hide = function(){
            this.options.classList.add('hide');
            that.trigger('hide')
        };

        /**
         * Show options
         */
        this.show = function(){
            this.options.classList.remove('hide');
            that.trigger('show');
        };

        /**
         * Toggle options
         */
        this.toggle = function(){
            this.options.classList.contains('hide') ? this.show()  : this.hide();
        };


        this.setSelected = function (value, title) {
            this.value = value;
            this.selector.value = title;
            this.trigger('change');
        };

        /**
         * Filter all options by title
         * @param searchString
         * @returns {*} Array of options with title and value
         */
        this.filter = function (searchString) {
            this.config.options = optionsData.filter(function (option) {
                return new RegExp(searchString, 'i').test(option.title);
            });
            return this.config.options;
        };

        init(); // It`s all begins here!
        function init() {
            that.rootElement = render();
            that.rootElement.appendChild(that.selector = renderSelector());
            that.rootElement.appendChild(that.options = renderOptions());
            container.appendChild(that.rootElement);
            listenUserActions(that.rootElement);
            that.hide();
        }

        // Generate root element
        function render() {
            var mainElement = document.createElement('div');
            mainElement.classList.add('custom-select');
            return mainElement;
        }

        // Generate data in select options
        function renderOptions() {
            var options = document.createElement('div');
            options.classList.add('custom-select', 'options');
            var optionString = '';
            that.config.optionsData.forEach(function (option) {
                optionString += '<div data-value="' + option.value
                    + '" class="custom-select option">' + option.title + '</div>'
            });
            options.innerHTML = optionString;
            return options;
        }

        // Generate selector input
        function renderSelector() {
            var selector = document.createElement('input');
            selector.classList.add('custom-select', 'selector');
            return selector;
        }

        // Create listeners on selector and options
        function listenUserActions() {
            that.options.addEventListener('mousedown', function () {
                that.setSelected(hovered.element.dataset['value'], hovered.element.innerHTML)
            });
            that.options.addEventListener('mouseover', function (e) {
                hovered.element = e.target;
            });
            that.selector.addEventListener('blur', function () {
                that.hide();
            });
            that.selector.addEventListener('click', function () {
                that.toggle();
            });
            that.selector.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case 13://enter
                        that.toggle();
                        break;
                    case 27://esc
                        that.hide();
                        break;
                    case 40://down
                        if(hovered.element.nextSibling){
                            hovered.element = hovered.element.nextSibling;
                            that.setSelected(hovered.element.dataset['value'], hovered.element.innerHTML);
                        }
                        break;
                    case 38://up
                        if(hovered.element.previousSibling){
                            hovered.element = hovered.element.previousSibling;
                            that.setSelected(hovered.element.dataset['value'], hovered.element.innerHTML);
                        }
                        break;
                    default :
                        that.show();
                        break;
                }
            });
        }
    };

    CustomSelect.extend(EventMachine);
})(window, document);