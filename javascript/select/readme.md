#Custom Select
Marvelous custom select with flexible configuration
<div id="first"></div>
##Syntax
To create custom select you need to call class CustomSelect.
```js
    /**
     * Creates custom select and inserts it to container
     * @param container {Element} - the place where select will be inserted
     * @param config {Object} - the object which configure created element
     * @return {Object}
     */
    var CustomSelect = function (container, config)
```
The arguments of this class are:

* **container** - DOM element, custom select becomes child of the container. 
> Note: CustomSelect is block element (he takes 100% content).

* **config** - object witch contains properties *optionsData* and *template*
> optionsData - TODO!
>
> template - TODO!

##Methods
The methods of this class are:

1. **show()** - show options of select.

2. **hide()** - hide options of select.

3. **toggle()** - show/hide options of select.

4. **setSelected(title,value)** - set new title and value to select, doesn't add new option.

5. **setOptionsData(newData)** - set new data for options, newData must contain same properties as [optionsData](#syntax).
 
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
You can easily bind native and custom select with such code:
```js
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
<div id="second"></div>
<label><select id="native">
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</select></label>
<div id="second"></div>
You can use templates to create nice look for you select:
  <div id="third">
  </div>
```js
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
```
<link rel="stylesheet" href="../css/custom_select.css" type="text/css">
<link rel="stylesheet" href="../css/template.css" type="text/css">
<link rel="stylesheet" href="../css/nice_aqua_select.css" type="text/css">
<script src="../../library/helper.js"></script>
<script src="../../library/event_machine.js"></script>
<script src="../js/custom_select.js"></script>
<script src="../js/main.js"></script>
