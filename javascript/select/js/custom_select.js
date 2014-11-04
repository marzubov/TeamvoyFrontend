(function (global, document) {
  /**
   * Creates custom select and inserts it to container
   * @param container {Element} - the place where select will be inserted
   * @param config {Object} - the object which configure created element
   * @return {Object}
   */
  var CustomSelect = global.CustomSelect = function (container, config) {
    CustomSelect.superclass.constructor.call(this);
    var that = this,
      optionsData = config.optionsData,
      hovered = 0;
    this.config = config;

    /**
     * Hide options
     */
    this.hide = function () {
      this.options.classList.add('hide');
      that.trigger('hide')
    };

    /**
     * Show options
     */
    this.show = function () {
      this.options.classList.remove('hide');
      that.trigger('show');
    };

    /**
     * Toggle options
     */
    this.toggle = function () {
      this.options.classList.contains('hide') ? this.show() : this.hide();
    };

    /**
     * Set new value
     * @param value {String}
     * @param title {String}
     */
    this.setSelected = function (value, title) {
      if (this.value != value) {
        this.value = value;
        this.selector.value = title;
      }
    };
    /**
     *
     * @param newData - object with properties title and value. Similar to config.optionsData
     */
    this.setOptionsData = function (newData) {
      optionsData = newData;
      return this.filter('');
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
      this.trigger('filtered');
      return renderOptions(this.options, searchString);
    };

    Object.defineProperty(this, 'hovered', {
      get: function () {
        return hovered;
      },
      set: function (value) {
        hovered && (hovered.classList.remove('hover'));
        hovered = value;
        hovered && (hovered.classList.add('hover'));
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
      var mainElement = document.createElement('div'),
        img = document.createElement('div');
      mainElement.classList.add('custom-select');
      img.classList.add('custom-select', 'img');
      mainElement.appendChild(img);
      return mainElement;
    }

    function generateOptionsData(searchString, option, index) { //take data from template or from array
      return  that.config.template ?
        that.config.template.HTML
          .replace('{{image}}', that.config.template.image[index])
          .replace('{{text}}', that.config.template.text[index]) :
        option.title.toString().replace(searchString, '<span class="highlighted">' + searchString + '</span>');
    }

    // Generate data in select options
    function renderOptions(optionsElement, searchString) {
      var options = optionsElement ? optionsElement : document.createElement('div'),
        optionString = '';
      that.config.optionsData.length ? that.selector.classList.remove('alert')
        : that.selector.classList.add('alert');
      options.classList.add('options');
      that.config.optionsData.forEach(function (option, i) {
        optionString += '<div data-value="' + option.value
          + '" data-title="' + option.title
          + '" class="custom-select option">'
          + generateOptionsData(searchString, option, i)
          + '</div>'
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
        that.setSelected(hovered.dataset['value'], that.hovered.dataset['title']);
        that.trigger('change');
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
      that.selector.addEventListener('input', function () {
        that.filter(that.selector.value);
        that.hovered = 0;
      });
      that.selector.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
          case 13://enter
            that.hide();
            that.trigger('change');
            break;
          case 27://esc
            that.hide();
            break;
          case 40://down
            that.hovered = that.hovered ?
              that.hovered.nextSibling || that.hovered :
              that.options.querySelector('.option');
            that.setSelected(that.hovered.dataset['value'], that.hovered.dataset['title']);
            break;
          case 38://up
            that.hovered = that.hovered ?
              that.hovered.previousSibling || that.hovered :
              that.options.querySelector('.option');
            that.setSelected(that.hovered.dataset['value'], that.hovered.dataset['title']);
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
