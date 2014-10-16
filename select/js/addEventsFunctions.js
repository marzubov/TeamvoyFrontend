function addEvents(selectedSpan,arrowSpan,options,select){
    addClickEventOnSelectedSpan.call(this,selectedSpan,options);
    addClickEventOnArrow.call(this,arrowSpan,options);
    arrowSpan.addEventListener('click',function(){select.click();});
    bindCustomSelect.call(this,selectedSpan,select);
    addClickAndKeyPressEventsOnOptions.call(this,selectedSpan,options.childNodes,select);
    addClickEventOnSearch.call(this,options.childNodes[0],options);
    addKeyEventsOnSelectedSpan(selectedSpan,options);
    addKeyUpEventOnSearch.call(this,options.childNodes[0].childNodes[0],options.childNodes);
    for (var i = 1; i < options.length; i++) {
        bindCustomSelect.call(this,options[i],select.options[i])
    };

}

function addClickEventOnSelectedSpan(selectedSpan,options){
    selectedSpan.addEventListener("click", function (event){
        if (options.style.display == 'block') {
            options.style.display = 'none';
        }
        else{
            options.style.display = 'block';
            setTimeout(function () {
                window.onclick = function () {
                    options.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }
        });
}

function addClickEventOnArrow(arrowSpan,options){
    arrowSpan.addEventListener("click", function (el){
        if (options.style.display == 'block') {
            options.style.display = 'none';
        }
        else{
            options.style.display = 'block';

            setTimeout(function () {
                window.onclick = function () {
                    options.style.display = 'none';
                    window.onclick = "";
                }
            }, 0);
        }
    });
}

function addClickEventOnSearch(search,options) {
    search.addEventListener('click',function(event){
        event.stopPropagation();
    })
}

function addKeyUpEventOnSearch(search,options) {
    search.addEventListener('keyup', function (e) {
        if(e.keyCode == '38') {
            for (var i = 1; i < options.length; i--) {
                if (options[i].style.display == 'block') {
                    options[i].focus();
                    return;
                }
            }
        }
        if(e.keyCode == '40') {
            for (var i = options.length - 1; i >= 1; i--) {
                if (options[i].style.display == 'block') {
                    options[i].focus();
                    return;
                }
            }
        }
        for (var i = options.length - 1; i >= 1; i--) {
            if (search.innerHTML == "") {
                options[i].style.display = 'block';
                continue;
            }
            if (options[i].innerHTML.toLowerCase().indexOf(search.innerHTML.toLowerCase())!=-1) {
                options[i].style.display = 'block';
            }
            else {
                options[i].style.display = 'none';
            }
        }
    });

}

function addClickAndKeyPressEventsOnOptions(selectedSpan,options,select){
    for (var i = options.length - 1; i >= 1; i--) {
        addCLickEventOnOption(options[i],selectedSpan,select);
        addKeyEventsOnOption(options[i],options[1],options[options.length-1],options[0]);
    }

}

function addKeyEventsOnSelectedSpan(selectedSpan,options){
    selectedSpan.addEventListener('keyup',function(e){
        if ((e.keyCode == '38')||(e.keyCode == '40')){
            options.style.display = 'block';
            //if(selectedSpan.innerHTML == ''){options.childNodes[0].focus(); return};
            for (var i = options.childNodes.length - 1; i >= 0; i--) {
                var option = options.childNodes[i];
                if(option.innerHTML == selectedSpan.innerHTML) {
                    option.focus();
                    return;
                }
            }
        }
    });
}

function addKeyEventsOnOption(option,firstOption,lastOption,search){
    option.addEventListener('keydown',function(e){

        if (e.keyCode == '38'){
            if (option.previousSibling != search) option.previousSibling.focus();
            else lastOption.focus();
        }
        if (e.keyCode == '40'){
            if (option.nextSibling) option.nextSibling.focus();
            else firstOption.focus();
        }
        if (e.keyCode == '13'){
            option.click();
        }
    });
}

function addCLickEventOnOption(option,selectedSpan,select){
    option.addEventListener('click', function (el1) {
            selectedSpan.innerHTML = el1.target.getAttribute('value');
            for (var i= select.options.length; i-->0;) {

                if (select.options[i].value==el1.target.getAttribute('value')) {
                    select.selectedIndex= i;
                    return;
                }
            }
        }
    );
}

function bindCustomSelect(el, target){
    el.addEventListener("click", function (){ if (target.click) target.click();});
    //el.addEventListener("focus", function (){ if (target.focus) target.focus();});
    //el.addEventListener("blur", function (){ if (target.blur) target.blur();});
    el.addEventListener("change", function (){ if (target.change) target.change();});
    el.addEventListener("dblclick", function (){ if (target.dblclick) target.dblclick();});
    el.addEventListener("mousedown", function (){if (target.mousedown)  target.mousedown();});
    el.addEventListener("mouseup", function (){ if (target.mouseup) target.mouseup();});
    el.addEventListener("mouseover", function (){ if (target.mouseover) target.mouseover();});
    el.addEventListener("mousemove", function (){ if (target.mousemove) target.mousemove();});
    el.addEventListener("mouseout", function (){ if (target.mouseout) target.mouseout();});
    el.addEventListener("keypress", function (){ if (target.keypress) target.keypress();});
    el.addEventListener("keydown", function (){ if (target.keydown) target.keydown();});
    el.addEventListener("keyup", function (){ if (target.keyup) target.keyup();});
}

//function findNextSiblingWithBlockDisplay(option, startOption) {
//    if (option.nextSibling){
//        if (option.nextSibling.style.display == 'block') {
//            option.nextSibling.focus();
//            return;
//        }
//        else{
//            if (option == startOption) return;
//        }
//    }
//    else{
//
//    }
//}