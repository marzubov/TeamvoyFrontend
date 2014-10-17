function customSelect(container,options,config){
    this.config = {
        style: "standard",
        multiple: "false",
        native: "false",
        replace: "false",
        tabIndex: "3"
    };
    this.initialization(options,config);
    container.appendChild(this.selectFragment);
}

customSelect.prototype.getCustomSelect = function(){
    return this.selectFragment;
}

customSelect.prototype.initialization = function(options,config){
    this.create(options);
    this.configure(config);
    this.events();
}

customSelect.prototype.create = function(options){
   this.selectFragment = document.createElement('div');
    this.selectFragment.tabIndex = 0;
   var anchor = document.createDocumentFragment();
   anchor = document.createElement('span');
    anchor.tabIndex=-1;
   anchor.innerHTML = "Please Select Option";
   this.selectFragment.appendChild(anchor);
   for (var i = 0; i < options.length; i ++) {
    anchor = document.createElement('div');
    anchor.innerHTML = options[i];
    anchor.tabIndex=1;
    anchor.style.display = 'none';
    this.selectFragment.appendChild(anchor);
   }
}

customSelect.prototype.configure = function(config){
    var that = this.config;
    Object.keys(that).forEach(function(key,index){
            if (config[index]){that[key] = config[index];}
    });
    this.selectFragment.className = 'custom-select';
    this.selectFragment.childNodes[0].className = 'custom-selected';
    Array.prototype.forEach.call(this.selectFragment.childNodes, function (child) {
        if (child.tagName == 'SPAN') return;

        child.className = 'custom-option';

    });
    if (this.config.style == 'white'){
        this.selectFragment.style.background = 'white';
    }
}

customSelect.prototype.events = function(){

    var that = this;
    this.selectFragment.addEventListener('click',function(e){
        Array.prototype.forEach.call(e.target.childNodes, function(child) {
        if((!child.style)||(!child.style.display)||(child.tagName=='SPAN')) return;
        if(child.style.display == 'none'){child.style.display = 'block';}
            else{child.style.display = 'none';}
        });
        e.preventDefault();
    });

    this.selectFragment.addEventListener('blur',function(){
        console.log('blur');
    });

    Array.prototype.forEach.call(this.selectFragment.childNodes, function(child) {
        child.addEventListener('click',function(){
            if(child.tagName != 'SPAN') this.parentNode.childNodes[0].innerHTML = this.innerHTML;
            this.parentNode.click();
        })
        child.addEventListener('keydown',function(e){
            console.log(this);
           switch (e.keyCode){
                case 13:
                    this.click();
                    break;
                case 27:
                   this.click();
                   break;
                case 38:
                    that.getPreviousOption(e.target).focus();
                    break;
                case 40:
                    that.getNextOption(e.target).focus();
                    break;
                default:
                    this.parentNode.focus();
                    break;
           }
            e.preventDefault();
            return;
        });
    });
}

customSelect.prototype.getNextOption = function(option){
    var index = Array.prototype.indexOf.call(option.parentNode.childNodes, option);
    if (index==option.parentNode.childNodes.length-1) return option.parentNode.childNodes[0];
    return option.parentNode.childNodes[index+1];
}

customSelect.prototype.getPreviousOption = function(option){
    var index = Array.prototype.indexOf.call(option.parentNode.childNodes, option);
    if (index==0) return option.parentNode.childNodes[option.parentNode.childNodes.length-1];
    return option.parentNode.childNodes[index-1];
}