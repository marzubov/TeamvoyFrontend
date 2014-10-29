(function (global, document) {

    var CustomSelect = global.CustomSelect = function(container, config) {
        CustomSelect.superclass.constructor.call(this);
        var that=this;
        this.config = {
            options: [{}],
            defaultOption: "Please Select Option",
            idOfTag: "example"
        };
        this.container = container;
        this.rootElement={};
        this.config.merge(config);
        this.toggleOptions = function(){
            that.rootElement.querySelector('.options').classList.toggle('hide');
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
            var selector = document.createElement('input');
            selector.addClasses('custom-select selector');
            var options = document.createElement('div'),
                optionString='';
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
            that.rootElement.addEventListener('click', function(event){
                if(event.target.classList.contains('custom-select')){

                     if(event.target.classList.contains('option')){
                        that.rootElement.querySelector('.selector').value = event.target.dataset['value'];
                        that.toggleOptions();
                    }
                }
            });
            that.rootElement.querySelector('.selector').addEventListener('blur',function(){
                that.toggleOptions();
            });
            that.rootElement.querySelector('.selector').addEventListener('focus', function() {
                that.toggleOptions();
            });
        }
    };
    extend(CustomSelect,EventMachine);
})(window, document);