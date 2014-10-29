(function (global, document) {
    var CustomSelect = global.CustomSelect = function(container, config) {
        CustomSelect.superclass.constructor.call(this);
        var that=this,
            selector = document.createElement('input'),
            hovered, //remembers hovered options by arrow
            options = document.createElement('div');
        this.config = {
            options: [{}],
            defaultOption: "Please Select Option",
            idOfTag: "example"
        };
        this.container = container;
        this.rootElement={};
        this.config.merge(config);
        this.value={};
        this.setSelected = function(value,title){
            this.value=value;
            selector.value=title;
        };
        this.toggleOptions = function(){
            options.classList.toggle('hide');
        };
        init();

        function init(){
            render();
            setEvents();
            that.toggleOptions();
        }

        function render(){
            that.rootElement = document.createElement('div');
            that.rootElement.addClasses('custom-select');
            selector.addClasses('custom-select selector');
            var optionString='';
            options.addClasses('custom-select options');
            that.config.options.forEach(function(option){
                optionString += '<div data-value="'+ option.value
                    +'" class="custom-select option">' + option.title + '</div>'
            });
            options.innerHTML=optionString;

            that.rootElement.appendChild(selector);
            that.rootElement.appendChild(options);
            that.container.appendChild(that.rootElement);
        }

        function setEvents(){
            options.addEventListener('mousedown', function(e){
                     if(e.target.classList.contains('option')){
                        that.setSelected(e.target.dataset['value'],e.target.innerHTML)
                    }
            });
            options.addEventListener('mouseover', function(e){
                hovered.classList.remove('hover');
                hovered = e.target;
                hovered.classList.add('hover');
            });
            selector.addEventListener('blur',function(){
                options.classList.add('hide');
            });
            selector.addEventListener('click', function() {
                that.toggleOptions();
            });
            selector.addEventListener('keydown', function(e) {
                switch (e.keyCode) {
                    case 13://enter
                        that.toggleOptions();
                        break;
                    case 27://esc
                        options.classList.add('hide');
                        break;
                    case 40://down
                        if(hovered){
                            hovered.classList.remove('hover');
                            hovered = hovered.nextSibling ? hovered.nextSibling : hovered;
                            hovered.classList.add('hover');
                        }
                        else{
                            hovered = options.querySelector('.custom-select .option');
                            hovered.classList.add('hover');
                        }
                        that.setSelected(hovered.dataset['value'],hovered.innerHTML);
                        break;
                    case 38://up
                        if(hovered){
                            hovered.classList.remove('hover');
                            hovered = hovered.previousSibling ? hovered.previousSibling : hovered;
                            hovered.classList.add('hover');
                        }
                        else{
                            hovered = options.querySelector('.custom-select .option');
                            hovered.classList.add('hover');
                        }
                        that.setSelected(hovered.dataset['value'],hovered.innerHTML);
                        break;
                }
            });
        }
    };

    extend(CustomSelect,EventMachine);
})(window, document);