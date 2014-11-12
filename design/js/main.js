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
  window.search.selector.placeholder = 'SEARCH';

  window.dropbox = new CustomSelect(document.querySelector('.dropbox'),[
    {
      option: 'YOUR PROFILE',
      action: 'profile'
    },
    {
      option: 'SETTINGS',
      action: 'settings'
    },
    {
      option: 'LOGOUT',
      action: 'logout'
    }
  ], {title: 'option', value:'action'});
  var image = faker.image.avatar();
  var userTemplate ='<div class="template"><img class="user-avatar" src="'+image+'"><div class="text">'+ faker.name.findName() +'</div></div>';
  window.dropbox.wrapper.innerHTML = userTemplate;
  window.dropbox.on('change', function(){
    window.dropbox.wrapper.innerHTML = userTemplate;
    window.location.replace('index.html#' + window.dropbox.value);
    window.dropbox.hide();
  });
  window.dropbox.on('show', function(){
    window.dropbox.wrapper.classList.remove('hide');
    window.dropbox.selector.classList.add('hide');
  });
  Array.prototype.slice.call(document.querySelectorAll('.user-avatar'))
    .forEach(function(e){
    e.src = image;
  });
})(document,window);
