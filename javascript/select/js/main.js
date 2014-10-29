"use strict";
var containerOne = document.getElementById("one");

var firstSelect = new CustomSelect(containerOne, {
        options: [
            {
                "title" : "january",
                "value" : 1
            },
            {
                "title" : "february",
                "value" : 2
            },
            {
                "title" : "march",
                "value" : 3
            },
            {
                "title" : "april",
                "value" : 4
            },
            {
                "title" : "may",
                "value" : 5
            }
        ],
        defaultOption: "Wow, so default"
    }
);
var secondSelect = new CustomSelect(containerOne, {
    options: [
        {
            "title" : "january",
            "value" : 1
        },
        {
            "title" : "february",
            "value" : 2
        },
        {
            "title" : "march",
            "value" : 3
        },
        {
            "title" : "april",
            "value" : 4
        },
        {
            "title" : "may",
            "value" : 5
        }
    ],
    defaultOption: "click me"
});