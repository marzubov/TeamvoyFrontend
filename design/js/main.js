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
  })
})(document,window);
