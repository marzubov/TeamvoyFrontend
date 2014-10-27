(function () {
    "use strict";
    var containerOne = document.getElementById("one");


    new CustomSelect(containerOne, [1, 2, 3, 4, 5, 6],
        {
            defaultOption: "data from array",
            idOfTag: "example1"
        }
    );

    new CustomSelect(document.getElementById("two"), "data_for_options/file1.json",
        {
            defaultOption: "data from file",
            idOfTag: "example2"
        }
    );

    new CustomSelect(document.getElementById("three"), "data_for_options/file2.json",
        {
            defaultOption: "data from file",
            idOfTag: "example3"
        }
    );

    new CustomSelect(document.getElementById("four"),
        [
            {title: "option1", value: 1},
            {title: "option2", value: 2}
        ],
        {
            defaultOption: "data from array with objects",
            idOfTag: "example4"
        }
    );

    var selectTestInstance = new CustomSelect(document.getElementById("five"), "data_for_options/file_with_object.json",
        {
            defaultOption: "data from file with objects",
            idOfTag: "example5"
        }
    );
    selectTestInstance.on("change", function() { console.log("Hello"); });
    selectTestInstance.on("change", function() { console.log("1111111"); });
    selectTestInstance.off("change", function() { console.log("Hello"); });
    selectTestInstance.trigger("change");


    console.log(selectTestInstance.getValue());
})()
