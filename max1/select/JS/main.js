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
    selectDiv.tabIndex = -1;

    selectedSpan.className = "selected";
    selectedSpan.innerHTML = array[0];
    selectedSpan.tabIndex = -1;

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
        itemDiv.tabIndex = -1;
        option.value = array[i];
        option.text = array[i];
        selectList.appendChild(option);
        itemsDiv.appendChild(itemDiv);
    }
    document.body.appendChild(selectWrapperDiv);

    selectList.addEventListener("click", function (){console.log("native select click triggered");});
    selectList.addEventListener("keyup", function (){console.log("native select keyup triggered");});

    selectedSpan.addEventListener('keydown',function(e){

        var item1 = this.parentNode.childNodes[2];
        console.log(this);
        console.log(item1);
        if (e.keyCode == '38'){
            console.log("ez1");
            for (var i = item1.childNodes.length - 1; i >= 0; i--) {

                var temp = item1.childNodes[i];
                console.log(temp.style.display);
                if (temp.style.display == 'block') {
                    setTimeout(temp.focus(), 100);
                    console.log("focused");
                    return;
                }
            }
        }

        if (e.keyCode == '40'){
            console.log("ez2");
            for (var i = 0; i < item1.childNodes.length; i++) {

                var temp = item1.childNodes[i];
                console.log(temp.style.display);
                if (temp.style.display == 'block') {
                    setTimeout(temp.focus(), 100);
                    console.log(temp);
                    console.log("focused");
                    return;
                }
            }
        }
    });

    selectedSpan.addEventListener('keyup', function (e){

        var item1 = this.parentNode.childNodes[2];
        var k=0;
        var l=0;
        if (e.keyCode == '38') {return;}
        if (e.keyCode == '40') { return;}

        //console.log("not returned");
        for (var i = item1.childNodes.length - 1; i >= 0; i--) {
            var temp = item1.childNodes[i];
            if (temp.innerHTML.indexOf(selectedSpan.innerHTML)==0)
            {
                //console.log(temp.style.display);
                temp.style.display = 'block';
            }
            else{
                temp.style.display = 'none';
                k++;
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
        if (k==(item1.childNodes.length)) {console.log("a");item1.style.display = 'none';}

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



    arrowSpan.addEventListener("click", function (el){
        var itemsDiv1 = selectedSpan.parentNode.childNodes[2];

        if (itemsDiv1.style.display == 'block')
        {
            itemsDiv1.style.display = 'none';

        }
        else {
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
    bindEl(selectedSpan);

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
        };
        items[i].onkeydown = function(e){
            console.log(this);
            console.log(items);
            var tempItems = items;
            for (var i=tempItems.length -1; i>=0; i--)
            {
                if (this == tempItems[i]){ break;}
            }
            if (e.keyCode == '13') {
                selectedSpan.innerHTML = e.target.getAttribute('value');
                for (var i= selectList.options.length; i-->0;) {
                    if (selectList.options[i].value==e.target.getAttribute('value')) {
                        selectList.selectedIndex= i;
                        //selectedSpan.click();
                        return;
                    }
                }
            }
            if (e.keyCode == '38') {
                if (i!=0) tempItems[i-1].focus();
                else tempItems[tempItems.length-1].focus();
            }
            if (e.keyCode == '40') {
                if (i!=tempItems.length-1) tempItems[i+1].focus();
                else tempItems[0].focus();
            }
        };

        bindEl(items[i]);
    }

    function bindEl(el){
        el.addEventListener("click", function (){ if (selectList.focus) selectList.click();});
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
