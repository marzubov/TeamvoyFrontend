(function (global, document) {
  "use strict";

  /**
   * Creates custom select and inserts it to container
   * @param container {Element} - the place where select will be inserted
   * @param data {Array} - array of objects with data
   * @param config {Object} - the object which configure created element
   * @return {Object}
   */
  var CustomSelect = global.CustomSelect = function (container, data, config) {
    CustomSelect.superclass.constructor.call(this);
    var that = this,
      hovered = 0;
    this.config = config;
    this.model = data;

    this.hide = function () {
      this.options.classList.add('hide');
      this.selector.classList.add('hide');
      this.wrapper.classList.remove('hide');
      this.trigger('hide');
      return this;
    };

    this.show = function () {
      this.options.classList.remove('hide');
      this.selector.classList.remove('hide');
      this.wrapper.classList.add('hide');
      this.trigger('show');
      return this;
    };

    this.toggle = function () {
      if (this.options.classList.contains('hide')) {
        this.show();
      } else {
        this.hide();
      }
      return this;
    };

    /**
     * Set new value
     * @param data {Object} - object with data properties
     * @return {global.CustomSelect}
     */
    this.selected = function (data) {
      if (this.config.selectorTemplate) {
        this.wrapper.innerHTML = generateTemplateData(data, '', this.config.selectorTemplate);
      } else {
        this.wrapper.innerHTML = generateTemplateData(data, '');
      }
      this.value = data[config.value];
      that.trigger('change');
      return this;
    };

    /**
     * Updates data in selector
     * @param newData - object with properties title and value. Similar to argument data
     */
    this.setData = function (newData) {
      data = newData;
      var temp = {};
      temp[config.title] = '';
      this.selected(temp);
      this.filter('');
      this.trigger('change');
      return this;
    };

    /**
     * Filter all options by title
     * @param filterString
     * @returns {*} Array of options with title and value
     */
    this.filter = function (filterString) {
      this.model = data.filter(function (option) {
        return new RegExp('(' + filterString + ')', 'i').test(option[config.title]);
      });
      this.trigger('filtered');
      return renderOptions(this.options, filterString);
    };

    // Setter need for automatic remove of previous hover
    Object.defineProperty(this, 'hovered', {
      get: function () {
        return hovered;
      },
      set: function (element) {
        if (hovered) {
          hovered.classList.remove('hover');
        }
        hovered = element;
        if (hovered) {
          hovered.classList.add('hover');
        }
        return hovered;
      }
    });

    // Generate root element
    function render() {
      var mainElement = document.createElement('div');
      that.wrapper = document.createElement('button');
      mainElement.classList.add('custom-select');
      that.wrapper.classList.add('wrapper');
      mainElement.appendChild(that.wrapper);
      return mainElement;
    }

    // Generate data from template
    function generateTemplateData(data, textToMark, template) {
      var prop,
        result = data[config.title].toString().highLightText(textToMark);
      if (template) {
        result = template;
        for (prop in data) {
          if (data.hasOwnProperty(prop)) {
            if (prop === config.title) { // We need modify text but don't model data
              result = result.replace('{{' + prop + '}}', data[prop].toString().highLightText(textToMark));
            } else {
              result = result.replace('{{' + prop + '}}', data[prop]);
            }
          }
        }
      }
      return result;
    }

    // Generate data in select options
    function renderOptions(optionsElement, searchString) {
      var options = optionsElement || document.createElement('div');
      options.innerHTML = '';
      if (that.model.length) {
        that.selector.classList.remove('alert');
      } else {
        that.selector.classList.add('alert');
      }

      options.classList.add('options');
      that.model.forEach(function (option, i) {
        var optionElement = document.createElement('div'),
          prop;
        optionElement.classList.add('option');
        optionElement.data = {};
        for (prop in data[i]) {
          if (data[i].hasOwnProperty(prop)) {
            optionElement.data[prop] = data[i][prop];
          }
        }
        optionElement.innerHTML = generateTemplateData(option, searchString, that.config.optionTemplate);
        options.appendChild(optionElement);
      });
      return options;
    }

    // Generate selector input
    function renderSelector() {
      var selector = document.createElement('input');
      selector.classList.add('selector');
      return selector;
    }

    function listenUserActions() {
      that.wrapper.addEventListener('focus', function () {
        that.toggle();
        that.selector.focus();
      });
      that.wrapper.addEventListener('click', function () {
        that.toggle();
        that.selector.focus();
      });
      that.options.addEventListener('mousedown', function () {
        return that.hovered && that.selected(hovered.data);
      });
      that.options.addEventListener('mouseover', function (e) {
        that.hovered = e.target.firstElementContains('option');
      });
      that.selector.addEventListener('click', function () {
        that.hide();
      });
      that.selector.addEventListener('blur', function () {
        that.hide();
      });
      that.selector.addEventListener('input', function () {
        that.filter(that.selector.value);
        that.hovered = 0;
      });
      that.rootElement.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
          case 13://enter
            that.hide();
            that.hovered && that.selected(that.hovered.data);
            break;
          case 27://esc
            that.hide();
            break;
          case 40://down
            that.hovered = that.hovered.nextSibling || that.options.firstChild;
            break;
          case 38://up
            that.hovered = that.hovered.previousSibling || that.options.lastChild;
            break;
          default:
            that.show();
            break;
        }
      });
    }

    function init() {
      that.rootElement = render();
      that.rootElement.appendChild(that.selector = renderSelector());
      that.rootElement.appendChild(that.options = renderOptions());
      container.appendChild(that.rootElement);
      listenUserActions(that.rootElement);
      that.hide();
    }

    init(); // It`s all begins here!
  };
  CustomSelect.extend(EventMachine);
})(window, document);
