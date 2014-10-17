function customSelect(container,options,config){
    this.config = {
        style: "standard",
        multiple: "false",
        native: "false",
        replace: "false",
        defaultOption: "Please Select Option",
        tabIndex: 0
    };
    this.init(options,config);
    container.appendChild(this.selectFragment);
}

customSelect.prototype.init = function(options,config){
    this.create(options);
    this.configure(config);
    this.events();
}

customSelect.prototype.create = function(options){
    this.selectFragment = document.createElement('div');
    this.selectFragment.tabIndex = 0;
    var anchor = document.createDocumentFragment();

    anchor = document.createElement('span');
    anchor.tabIndex=0;
    //anchor.innerHTML = "Please Select Option";
    this.selectFragment.appendChild(anchor);
    for (var i = 0; i < options.length; i ++) {
    anchor = document.createElement('div');
    anchor.innerHTML = options[i];
    anchor.tabIndex=0;
    anchor.style.display = 'none';
    this.selectFragment.appendChild(anchor);
   }
}

customSelect.prototype.configure = function(config){
    var myConfig = this.config;
    //obtaining new config data
    Object.keys(myConfig).forEach(function(key,index){
            if (config[index]){myConfig[key] = config[index];}
    });
    //applying config data to our custom select
    this.selectFragment.className = 'custom-select';
    this.selectFragment.childNodes[0].className = 'custom-selected';
    this.selectFragment.childNodes[0].innerHTML = myConfig.defaultOption;
    Array.prototype.forEach
        .call(this.selectFragment.childNodes, function (child) {
        child.tabIndex = myConfig.tabIndex;
        if (child.tagName == 'SPAN') return;
        child.className = 'custom-option';
    });
}

customSelect.prototype.events = function(){
    var that = this;
    //click event on our select
    this.selectFragment.addEventListener('click',function(e){
        Array.prototype.forEach
            .call(e.target.childNodes, function(child) {
        if((!child.style)||(!child.style.display)||(child.tagName=='SPAN')) return;
        if(child.style.display == 'none'){child.style.display = 'block';}
            else{child.style.display = 'none';}
        });
        e.preventDefault();
    });

    Array.prototype.forEach
        .call(this.selectFragment.childNodes, function(child) {
        //click events on options and one for span
        child.addEventListener('click',function(){
            if(child.tagName != 'SPAN') this.parentNode.childNodes[0].innerHTML = this.innerHTML;
            this.parentNode.click();
        });
        //key events for options and span
        child.addEventListener('keydown',function(e){
           switch (e.keyCode){
                case 13://enter
                    this.click();
                    break;
                case 27://esc
                   this.click();
                   break;
                case 38://up
                    that.getPreviousOption(e.target).focus();
                    break;
                case 40://down
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
    var index = Array.prototype.indexOf
        .call(option.parentNode.childNodes, option);
    if (index==option.parentNode.childNodes.length-1) return option.parentNode.childNodes[0];
    return option.parentNode.childNodes[index+1];
}

customSelect.prototype.getPreviousOption = function(option){
    var index = Array.prototype.indexOf
        .call(option.parentNode.childNodes, option);
    if (index==0) return option.parentNode.childNodes[option.parentNode.childNodes.length-1];
    return option.parentNode.childNodes[index-1];
}