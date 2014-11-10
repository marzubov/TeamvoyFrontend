(function(document,window){
  window.menu = new CustomSelect(document.querySelector('.menu'),[
    {
      option: 'NEWS'
    },
    {
      option: 'BLOG'
    },
    {
      option: 'ABOUT'
    },
    {
      option: 'CONTACT'
    }
  ],{title: 'option', value:'option'});
  window.menu.show();
  window.menu.on('hide',function(){
    this.show();
  });
  window.menu.on('change',function(){
    window.location.replace('index.html#' + window.menu.value);
  });

   var  dataUsers = [];
  for(var i=0;i<10;i++){
    dataUsers.push({
      "text": faker.name.findName().toUpperCase()
    })
  }
  window.search = new CustomSelect(document.querySelector('.search'),dataUsers,{title: 'text', value:'text'});

})(document,window);
