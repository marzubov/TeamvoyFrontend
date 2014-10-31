(function(document,window) {
    "use strict";
    var containerOne = document.getElementById("first");
    var containerTwo = document.getElementById("second");
    var firstSelect = new CustomSelect(containerOne, {
            optionsData: [
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
            defaultOption: "Wow, so default"
        }
    );
    var customSelect = new CustomSelect(containerTwo, {
        optionsData: [
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
        ],
        defaultOption: "click me"
    });

    firstSelect.on('change', function () {
        document.querySelector('#value').innerHTML = firstSelect.value;
    });

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
})(document,window);
