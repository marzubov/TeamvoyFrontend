(function (global, document) {
    var CustomSelect = global.CustomSelect = function (container, config) {
        CustomSelect.superclass.constructor.call(this);
        var that = this,
            optionsData = config.optionsData,
            hovered = 0;
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
            if(this.value != value){
            this.value = value;
            this.selector.value = title;
            this.trigger('change');
            }
        };

        /**
         * Filter all options by title
         * @param searchString
         * @returns {*} Array of options with title and value
         */
        this.filter = function (searchString) {
            this.config.optionsData = optionsData.filter(function (option) {
                return new RegExp(searchString, 'i').test(option.title);
            });
            return renderOptions(this.options);
        };

        Object.defineProperty(this,'hovered',{
            get: function () {
                return hovered;
            },
            set: function (value) {
               hovered && (hovered.classList.remove('hover'));
                hovered = value;
                hovered.classList.add('hover');
                return hovered;
            }
        });

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
        function renderOptions(optionsElement) {
            var options = optionsElement ? optionsElement : document.createElement('div');
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
                that.setSelected(hovered.dataset['value'], hovered.innerHTML)
            });
            that.options.addEventListener('mouseover', function (e) {
                that.hovered = e.target;
            });
            that.selector.addEventListener('blur', function () {
                that.hide();
            });
            that.selector.addEventListener('click', function () {
                that.toggle();
            });
            that.selector.addEventListener('input', function(){
                that.filter(that.selector.value);
                that.hovered = 0;
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
                        that.hovered = that.hovered ?
                            that.hovered.nextSibling || that.hovered :
                            that.options.querySelector('.option');
                        that.setSelected(that.hovered.dataset['value'], that.hovered.innerHTML);
                        break;
                    case 38://up
                        that.hovered = that.hovered ?
                            that.hovered.previousSibling || that.hovered:
                            that.options.querySelector('.option');
                        that.setSelected(that.hovered.dataset['value'], that.hovered.innerHTML);
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