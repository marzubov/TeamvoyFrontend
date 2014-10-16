function customSelect(variables,config){
    this.config = {
        style: "standart"
    };
    this.initialization(variables,config);
}

customSelect.prototype.getCustomSelect = function(){
    return this.selectFragment;
}

customSelect.prototype.initialization = function(variables,config){
    this.create(variables);
    this.configure(config);
    this.events();
}

customSelect.prototype.create = function(variables){
   this.selectFragment = document.createElement('div');
   this.selectFragment.display = 'block';
   var anchor = document.createDocumentFragment();
   anchor = document.createElement('span');
   anchor.innerHTML = "Please Select";
   
   this.selectFragment.appendChild(anchor);
   for (var i = 0; i < variables.length; i ++) {
    anchor = document.createElement('div');
    anchor.innerHTML = variables[i];
    anchor.style.display = 'none';
    this.selectFragment.appendChild(anchor);
   }   
}

customSelect.prototype.configure = function(config){
    //console.log(config);
    //if ((!config)||(config==[])){
        this.selectFragment.className = 'custom-select';
        this.selectFragment.childNodes[0].className = 'custom-selected';
        Array.prototype.forEach.call(this.selectFragment.childNodes, function(child) {
            if(child.tagName!='span'){
                child.className = 'custom-option';
            }
        });    
    //}
}

customSelect.prototype.events = function(){
    this.selectFragment.addEventListener('click',function(e){Array.prototype.forEach.call(e.target.childNodes, function(child) {
        if((!child.style)||(!child.style.display)||(child.tagName=='span')) return;
        if(child.style.display == 'none'){child.style.display = 'block';}
            else{child.style.display = 'none';}
    })
    });
    Array.prototype.forEach.call(this.selectFragment.childNodes, function(child) {
        if(child.tagName == 'span') return;
            child.addEventListener('click',function(){
            this.parentNode.childNodes[0].innerHTML = this.innerHTML;
            this.parentNode.click();
        })
    });
}