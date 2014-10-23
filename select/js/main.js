CustomSelect.createSelectByData(document.getElementById("one"), [1,2,3,4,5,6],
    {defaultOption: "data from array", idOfTag: "example1"});

CustomSelect.createSelectByData(document.getElementById("two"), "data_for_options/file1.json",
    {defaultOption: "data from file", idOfTag: "example2"});

CustomSelect.createSelectByData(document.getElementById("three"), "data_for_options/file2.json",
    {defaultOption: "data from file", idOfTag: "example3"});

CustomSelect.createSelectByData(document.getElementById("four"), [{title: "option1", value: 1}, {title: "option2", value: 2}],
    {defaultOption: "data from array with objects", idOfTag: "example4"});

var a = CustomSelect.createSelectByData(document.getElementById("five"), "data_for_options/file_with_object.json",
    {defaultOption: "data from file with objects", idOfTag: "example5"});
console.log(a.getValue());