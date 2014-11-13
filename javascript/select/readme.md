#Custom Select
Marvelous custom select with flexible configuration
<div id="first"></div>
##Syntax
To create custom select you need to call class CustomSelect.
```js
  /**
   * Creates custom select and inserts it to container
   * @param container {Element} - the place where select will be inserted
   * @param data {Array} - array of objects with data
   * @param config {Object} - the object which configure created element
   * @return {Object}
   */
    var CustomSelect = function (container, data, config)
```
The arguments of this class are:

* **container** - DOM element, custom select becomes child of the container. 
> Note: CustomSelect is block element (he takes 100% content).
* **data**  - array with objects of data, with any properties.

* **config** - object witch contains properties title, value  and *template*
> title - contains property name from data, that will be showed and filtered in selector.
> value - contains property name from data, that will be saved in selector value.
> template - HTML code with templates, that matches properties name in data array.

##Methods
The methods of this class are:

1. **show()** - show options of select.

2. **hide()** - hide options of select.

3. **toggle()** - show/hide options of select.

4. **selected(value, title)** - set new value and title to select, doesn't add new option.

5. **setData(newData)** - set new data for options, newData must contain same properties as [data](#syntax).
 
6. **on(eventName,callback)** - set listener of eventName, callback is the function that will be executed. Look to [event list](#events)

7. **off(eventName,callback)** - removes listener of eventName, callback is the function that will be removed.
>Note: you can't delete anonymous functions.

8. **trigger(eventName)** - call all functions that listens eventName.

##Events
The events called by this class are:

* **show** - occur after options of selector are showed;

* **hide** - occur after options of selector are hided;

* **filtered** - occur after options of selector are filtered;

* **change** - occur after user choose some option by click or keyboard;

##Example
Example of simple select with different title and value:
```js
  var container = document.getElementById("newData"),
      config = {
        title:'title',
        value: 'value'
      },
    monthArray = [
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
  select = new CustomSelect(container, monthArray
    ,config
  );
  newDataSelect.on('change', function(){
    document.querySelector("#output").innerHTML = 'Value: '+select.value;
  });
  document.querySelector("button").onclick = function(){
    select.model.length == monthArray.length ?
    select.setData(numberArray):
      select.setData(monthArray);
  };
```

<div class="half-page" id="newData"> <div id="output">Value: </div><button class="clicky">Change data!</button></div>
### Events in action
You can easily bind native and custom select with such code:
```js
var containerTwo = document.getElementById("second"),
    secondConfig = {
      title:'title',
      value: 'value'
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
<div id="first"></div>
 var nativeSelect = document.querySelector('#native');
    nativeSelect.addEventListener('mousedown',function(){
        customSelect.toggle();
    });
    customSelect.on('change', function () {
       nativeSelect.value = this.value;
    });
    nativeSelect.addEventListener('change',function(){
        customSelect.setSelected(nativeSelect.value,nativeSelect.value);
    });
```

<label><select style="width: 50%" id="native">
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</select></label>
<div id="second"></div>
### Work with templates
You can use templates to create nice look for you select:

```js
  templateConfig = {
    optionTemplate: '<div class="template"><img class="photo" src="{{image}}"><div class="text">{{text}}</div></div>',
    selectorTemplate: '<div class="template"><div class="text">{{text}}</div><img class="photo" src="{{image}}"></div>',
    title: 'text', //This field will be filtered by selector
    value: 'text'
  };
  container = document.getElementById('some-element');
   var dataUsers = [];
    for(var i=0;i<10;i++){
      dataUsers.push({
        "text": faker.name.findName().toUpperCase(), //Random data
        "image": faker.image.avatar()
      })
    }
  templateSelector = new CustomSelect(containerThree, dataUsers, templateConfig);
```
  <div id="third" style="padding-bottom: 200px;">
  </div>
<link rel="stylesheet" href="../css/custom_select.css" type="text/css">
<link rel="stylesheet" href="../css/template.css" type="text/css">
<link rel="stylesheet" href="../css/nice_aqua_select.css" type="text/css">
<script src="../../library/faker.min.js"></script>
<script src="../../library/helper.js"></script>
<script src="../../library/event_machine.js"></script>
<script src="../js/custom_select.js"></script>
<script src="../js/main.js"></script>
