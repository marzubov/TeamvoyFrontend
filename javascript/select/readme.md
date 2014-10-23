#Custom Select component

Select is created with function createSelectByData of the class CustomSelect.

The arguments of this function are:

1. container (string) - The tag where select must be located, for example - document.getElementById("example");

2. options (string or array) - The array of options or name of file, where options is located, for example - ```[1,2,3,4,5,6]``` or path to file
   Array - can be array of number or string, and also can be array of object [{"title" : "january", "value" : 1},...] where title is showed in options and value is returned in tag written in idOfTag in config.
   Path to file - full path to file, where located simple array or array of object

3. config (object) - default configuration for select, for example - { defaultOption: "data from array", idOfTag: "example1" }
   idOfTag - id of element, where we return the data from select
   defaultOption - the first option of select
Example of using this function -

```javascript
CustomSelect.createSelectByData(document.getElementById("one"), [1,2,3,4,5,6], {defaultOption: "data from array", idOfTag: "example1"});
CustomSelect.createSelectByData(document.getElementById("four"), [{title: "option1", value: 1}, {title: "option2", value: 2}], {defaultOption: "data from array with objects", idOfTag: "example4"});
CustomSelect.createSelectByData(document.getElementById("two"), "data_for_options/file1.json", {defaultOption: "data from file", idOfTag: "example2"});
```