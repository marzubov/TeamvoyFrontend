(function (document, window) {
  "use strict";

  // First example
  var containerOne = document.getElementById("first"),
    firstConfig = {
      title:'title',
      value: 'value'
    };
    window.firstSelect = new CustomSelect(containerOne, [
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
  //New data example
  window.newDataContainer = document.getElementById("newData");
   var monthArray = [
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
    ],
    numberArray = [
      {
        "title": "first",
        "value": 1
      },
      {
        "title": "second",
        "value": 2
      },
      {
        "title": "third",
        "value": 3
      },
      {
        "title": "fourth",
        "value": 4
      },
      {
        "title": "fifth",
        "value": 5
      },
      {
        "title": "fifth",
        "value": 6
      }
    ],
  newDataSelect = new CustomSelect(newDataContainer, monthArray
    ,firstConfig
  );
  newDataSelect.on('change', function(){
    document.querySelector("#output").innerHTML = 'Value: '+newDataSelect.value;
  });
  document.querySelector(".clicky").onclick = function(){
    newDataSelect.model.length == monthArray.length ?
    newDataSelect.setData(numberArray):
      newDataSelect.setData(monthArray);
  };

  // Second example
  var containerTwo = document.getElementById("second"),
    secondConfig = {
      title:'number',
      value: 'number'
    },
    eventsSelect = new CustomSelect(containerTwo, [
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
  window.nativeSelect = document.querySelector('#native');
  nativeSelect.addEventListener('mousedown', function () {
    eventsSelect.toggle();
  });
  eventsSelect.on('change', function () {
    nativeSelect.value = this.value;
  });
  nativeSelect.addEventListener('change', function () {
    eventsSelect.selected(nativeSelect.value, nativeSelect.value);
  });

  // Third example
  window.templateConfig = {
    template: '<div class="template"><img class="photo" src="{{image}}"><div class="text">{{text}}</div></div>',
    title: 'text',
    value: 'text'
  };
  window.containerThree = document.getElementById('third');
   var dataUsers = [];
    for(var i=0;i<10;i++){
      dataUsers.push({
        "text": faker.name.findName().toUpperCase(),
        "image": faker.image.avatar()
      })
    }
  window.templateSelector = new CustomSelect(containerThree,dataUsers, templateConfig);

})(document, window);
