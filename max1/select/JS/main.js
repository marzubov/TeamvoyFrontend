function func() {
    var array = ["Volvo","Saab","Mercedes","Audi","Man","Ford","Chevrolet","BMW","Volkswagen"];
    var selectWrapperDiv = document.createElement("span");
    var selectList = document.createElement("select");
    selectWrapperDiv.className = "selectWrapper";
    var selectDiv = document.createElement("div");
    var selectedSpan = document.createElement('span');
    selectedSpan.contentEditable = true;
    var arrowSpan = document.createElement('span');
    var itemsWrapper = document.createElement('div');
    var itemsDiv = document.createElement('div');

    selectList.className = "mySelect";
    selectWrapperDiv.appendChild(selectList);

    selectDiv.className = "select";

    selectedSpan.className = "selected";
    selectedSpan.innerHTML = array[0];

    arrowSpan.innerHTML = '&#8629';
    arrowSpan.className = 'arrow';

    selectDiv.appendChild(selectedSpan);
    selectDiv.appendChild(arrowSpan);

    selectWrapperDiv.appendChild(selectDiv);

    itemsDiv.className = "items";

    selectDiv.appendChild(itemsDiv);

    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        var itemDiv = document.createElement('div');
        itemDiv.className = "item";
        itemDiv.innerHTML = array[i];
        itemDiv.setAttribute('value', array[i]);
        option.value = array[i];
        option.text = array[i];
        selectList.appendChild(option);
        itemsDiv.appendChild(itemDiv);
    }
    document.body.appendChild(selectWrapperDiv);

    selectList.addEventListener("click", function (){console.log("native select click triggered");});
    selectList.addEventListener("keyup", function (){console.log("native select keyup triggered");});

    selectedSpan.addEventListener('keyup', function (){
        var item1 = selectedSpan.parentNode.childNodes[2];

        for (var i = item1.childNodes.length - 1; i >= 0; i--) {
            var temp = item1.childNodes[i];
            if (temp.innerHTML.indexOf(selectedSpan.innerHTML)==0)
            {
                temp.style.display = 'block';
            }
            else{
                temp.style.display = 'none';
            }
        }
        if (item1.style.display=='none') {
            itemsDiv.style.display = 'block';

            setTimeout(function () {
                window.onclick = function () {
                    itemsDiv.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }

    });

    selectedSpan.addEventListener("click", function (){
        if (itemsDiv.style.display == 'block') {
            itemsDiv.style.display = 'none';
        }
        else{
            itemsDiv.style.display = 'block';

            setTimeout(function () {
                window.onclick = function () {
                    itemsDiv.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }
        });

    bindEl(selectedSpan);

    arrowSpan.addEventListener("click", function (el){
        var itemsDiv1 = selectedSpan.parentNode.childNodes[2];

        if (itemsDiv1.style.display == 'block')
        {
            itemsDiv1.style.display = 'none';

        }
        else{
            itemsDiv1.style.display = 'block';

            setTimeout(function () {
                window.onclick = function () {
                    itemsDiv1.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }
    });

    bindEl(arrowSpan);

    var items = selectedSpan.parentNode.childNodes[2].childNodes;

    for (var i = items.length - 1; i >= 0; i--) {

        items[i].onclick = function (el1) {
            selectedSpan.innerHTML = el1.target.getAttribute('value');

            for (var i= selectList.options.length; i-->0;) {
                if (selectList.options[i].value==el1.target.getAttribute('value')) {
                    selectList.selectedIndex= i;
                    return;
                }
            }
        }
        bindEl(items[i]);
    }

    function bindEl(el){
        el.addEventListener("click", function (){ selectList.click();});
        el.addEventListener("focus", function (){ if (selectList.focus) selectList.focus();});
        el.addEventListener("blur", function (){ if (selectList.blur) selectList.blur();});
        el.addEventListener("change", function (){ if (selectList.change) selectList.change();});
        el.addEventListener("dblclick", function (){ if (selectList.dblclick) selectList.dblclick();});
        el.addEventListener("mousedown", function (){if (selectList.mousedown)  selectList.mousedown();});
        el.addEventListener("mouseup", function (){ if (selectList.mouseup) selectList.mouseup();});
        el.addEventListener("mouseover", function (){ if (selectList.mouseover) selectList.mouseover();});
        el.addEventListener("mousemove", function (){ if (selectList.mousemove) selectList.mousemove();});
        el.addEventListener("mouseout", function (){ if (selectList.mouseout) selectList.mouseout();});
        el.addEventListener("keypress", function (){ if (selectList.keypress) selectList.keypress();});
        el.addEventListener("keydown", function (){ if (selectList.keydown) selectList.keydown();});
        el.addEventListener("keyup", function (){ if (selectList.keyup) selectList.keyup();});

    }
}
