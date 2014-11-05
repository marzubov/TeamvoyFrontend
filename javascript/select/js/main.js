(function (document, window) {
  "use strict";

  // First example
  var containerOne = document.getElementById("first"),
    firstConfig = {
      title:'title',
      value: 'value'
    },
    firstSelect = new CustomSelect(containerOne, [
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
      ,firstConfig
    );

  // Second example
  var containerTwo = document.getElementById("second"),
    secondConfig = {
      title:'number',
      value: 'number'
    },
    customSelect = new CustomSelect(containerTwo, [
      {
        "number": 1
      },
      {
        "number": 2
      },
      {
        "number": 3
      },
      {
        "number": 4
      },
      {
        "number": 5
      }
    ],secondConfig);

  // Event example
  var nativeSelect = document.querySelector('#native');
  nativeSelect.addEventListener('mousedown', function () {
    customSelect.toggle();
  });
  customSelect.on('change', function () {
    nativeSelect.value = this.value;
  });
  nativeSelect.addEventListener('change', function () {
    customSelect.selected(nativeSelect.value, nativeSelect.value);
  });

  // Third example
  var templateConfig = {
    template: '<div class="template img-circle"><img class="film-logo" src="{{image}}"><div class="text">{{text}}</div></div>',
    title: 'text',
    value: 'text'
  };
  var containerThree = document.getElementById('third');
  var templateSelector = new CustomSelect(containerThree, [
    {
      "text": 'The Hobbit',
      "image": 'http://www.egmnow.com/wp-content/themes/egmnowv3/images/icons/renobadgeicon/The-Hobbit-An-Unexpected-Journey.png'
    },
    {
      "text": 'Metallica Movie!',
      "image": 'http://pyramida.info/2013/10/01/Metallica%2BThrough%2Bthe%2BNever%2BHD%2B%2BPNG.png'
    },
    {
      "text": 'Terminator',
      "image": 'http://icon.gamerzcraft.com/capas/Terminator_Salvation_%5B530-51-1202609%5D.png'
    },
    {
      "text": 'Awesome face!!',
      "image": 'http://3.bp.blogspot.com/-f0NsmUHz2kM/T8GUGoydNpI/AAAAAAAAAfg/KnEkgnFPzpc/s1600/smiley.png'
    }
  ], templateConfig);
})(document, window);
