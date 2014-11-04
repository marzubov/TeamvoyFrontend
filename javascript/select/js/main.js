(function(document,window) {
  "use strict";
  var containerOne = document.getElementById("first");
  var containerTwo = document.getElementById("second");
  var firstSelect = new CustomSelect(containerOne, [
        {
          "title": "january",
          "value": 1
        },
        {
          "title": "february",
          "value": 2
        },
        {
          "title": "march",
          "value": 3
        },
        {
          "title": "april",
          "value": 4
        },
        {
          "title": "may",
          "value": 5
        }
      ]
  );
  var customSelect = new CustomSelect(containerTwo, [
      {
        "title": 1,
        "value": 1
      },
      {
        "title": 2,
        "value": 2
      },
      {
        "title": 3,
        "value": 3
      },
      {
        "title": 4,
        "value": 4
      },
      {
        "title": 5,
        "value": 5
      }
    ]);

  var nativeSelect = document.querySelector('#native');
  nativeSelect.addEventListener('mousedown',function(){
    customSelect.toggle();
  });
  customSelect.on('change', function () {
    nativeSelect.value = this.value;
  });
  nativeSelect.addEventListener('change',function(){
    customSelect.selected(nativeSelect.value,nativeSelect.value);
  });

  var templateConfig = {
    optionsData: [
      {
        "title": 'HTML',
        "value": 1
      },
      {
        "title": 'HTML',
        "value": 2
      },
      {
        "title": 'HTML',
        "value": 3
      },
      {
        "title": 'HTML',
        "value": 4
      }
    ],
    template:{
      HTML:'<div class="template img-circle"><img class="film-logo" src="{{image}}"><div class="text">{{text}}</div></div>',
      text: ['The Hobbit','Metallica Movie!','Terminator','Awesome face!!'],
      image: ['http://www.egmnow.com/wp-content/themes/egmnowv3/images/icons/renobadgeicon/The-Hobbit-An-Unexpected-Journey.png',
        'http://pyramida.info/2013/10/01/Metallica%2BThrough%2Bthe%2BNever%2BHD%2B%2BPNG.png',
        'http://icon.gamerzcraft.com/capas/Terminator_Salvation_%5B530-51-1202609%5D.png',
        'http://3.bp.blogspot.com/-f0NsmUHz2kM/T8GUGoydNpI/AAAAAAAAAfg/KnEkgnFPzpc/s1600/smiley.png']
    }
  };
  var containerThree =  document.getElementById('third');
  var selector = new CustomSelect(containerThree,templateConfig);
})(document,window);
