function func() {
    var array = ["Volvo","Saab","Mercedes","Audi","Man","Ford","Chevrolet","BMW"];
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

    selectList.addEventListener("click", function (){console.log("native select clicked");});

    selectedSpan.addEventListener('keyup', function (){
        var item1 = $(this).closest('.select').children('.items')[0];
        //console.log(item1.childNodes);
        for (var i = item1.childNodes.length - 1; i >= 0; i--) {
            console.log(i);
            var temp = item1.childNodes[i];
            if (temp.innerHTML.indexOf(selectedSpan.innerHTML)==0)
            {
                temp.style.display = 'block';
            }
            else{
                temp.style.display = 'none';
            }
        }
    });

    selectedSpan.addEventListener("click", function (){
        if (itemsDiv.style.display == 'block') {
            itemsDiv.style.display = 'none';
            $(selectList).trigger("click");
        }
        else{
            itemsDiv.style.display = 'block';
            $(selectList).trigger("click");
            setTimeout(function () {
                window.onclick = function () {
                    itemsDiv.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }
        });

    arrowSpan.addEventListener("click", function (el){
        var itemsDiv1 = $(el.target).closest('.select').children('.items')[0];
        //console.log(itemsDiv1);
        if (itemsDiv1.style.display == 'block')
        {
            itemsDiv1.style.display = 'none';
            $(selectList).trigger("click");
        }
        else{
            itemsDiv1.style.display = 'block';
            $(selectList).trigger("click");
            setTimeout(function () {
                window.onclick = function () {
                    itemsDiv1.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }
    });

    var items = $(selectedSpan).closest('.select').children('.items');
    //console.log(items);
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
    }

}
