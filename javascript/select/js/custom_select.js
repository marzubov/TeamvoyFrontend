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
      that.trigger('hide')
    };

    this.show = function () {
      this.options.classList.remove('hide');
      that.trigger('show');
    };

    this.toggle = function () {
      this.options.classList.contains('hide') ? this.show() : this.hide();
    };

    /**
     * Set new value
     * @param value {String}
     * @param title {String}
     */
    this.selected = function (value, title) {
      this.value = value;
      this.selector.value = title;
    };

    /**
     * Updates data in selector
     * @param newData - object with properties title and value. Similar to argument data
     */
    this.setData = function (newData) {
      data = newData;
      this.selected('','');
      that.trigger('change');
      this.filter('');
      return this;
    };

    /**
     * Filter all options by title
     * @param filterString
     * @returns {*} Array of options with title and value
     */
    this.filter = function (filterString) {
      this.model = data.filter(function (option) {
        return new RegExp(filterString, 'i').test(option[config.title]);
      });
      this.trigger('filtered');
      return renderOptions(this.options,filterString);
    };

    // Setter need for automatic remove of previous hover
    Object.defineProperty(this, 'hovered', {
      get: function () {
        return hovered;
      },
      set: function (element) {
        hovered && hovered.classList && (hovered.classList.remove('hover'));
        hovered = element;
        hovered && hovered.classList && (hovered.classList.add('hover'));
        return hovered;
      }
    });


    // Generate root element
    function render() {
      var mainElement = document.createElement('div'),
        img = document.createElement('div');
      mainElement.classList.add('custom-select');
      img.classList.add('img');
      mainElement.appendChild(img);
      return mainElement;
    }

    // Generate data from template
    function generateTemplateData(data,textToMark) {
      var prop,
        result = data[config.title].toString().highLightText(textToMark);
      if (that.config.template) {
        result = that.config.template;
        for (prop in data){
          if(data.hasOwnProperty(prop)){
            prop == config.title ? // We need modify text but don't model data
              result = result.replace('{{' + prop + '}}', data[prop].toString().highLightText(textToMark)):
              result = result.replace('{{' + prop + '}}', data[prop]);
          }
        }
      }
      return result;
    }

    // Generate data in select options
    function renderOptions(optionsElement,searchString) {
      var options = optionsElement ? optionsElement : document.createElement('div'),
        optionString = '';
      that.model.length ? that.selector.classList.remove('alert')
        : that.selector.classList.add('alert');
      options.classList.add('options');
      that.model.forEach(function (option) {
        optionString += '<div data-value="' + option[config.value]
        + '" data-title="' + option[config.title]
        + '" class="option">'
        + generateTemplateData(option,searchString)
        + '</div>'
      });
      options.innerHTML = optionString;
      return options;
    }

    // Generate selector input
    function renderSelector() {
      var selector = document.createElement('input');
      selector.classList.add('selector');
      return selector;
    }

    // Create listeners on selector and options
    function listenUserActions() {
      that.options.addEventListener('mousedown', function () {
        that.selected(hovered.dataset['value'], that.hovered.dataset['title']);
        that.trigger('change');
      });
      that.options.addEventListener('mouseover', function (e) {
        that.hovered = e.target.firstElementContains('option');
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
            that.hovered = that.hovered.nextSibling || that.options.firstChild;
            that.selected(that.hovered.dataset['value'], that.hovered.dataset['title']);
            break;
          case 38://up
            that.hovered = that.hovered.previousSibling || that.options.lastChild;
            that.selected(that.hovered.dataset['value'], that.hovered.dataset['title']);
            break;
          default :
            that.show();
            break;
        }
      });
    }

    init(); // It`s all begins here!
    function init() {
      that.rootElement = render();
      that.rootElement.appendChild(that.selector = renderSelector());
      that.rootElement.appendChild(that.options = renderOptions());
      container.appendChild(that.rootElement);
      listenUserActions(that.rootElement);
      that.hide();
    }
  };
  CustomSelect.extend(EventMachine);
})(window, document);
