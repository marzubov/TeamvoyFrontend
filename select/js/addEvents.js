function addEvents(selectedSpan,arrowSpan,options,select){
    addClickEventOnSelectedSpan.call(this,selectedSpan,options);
    addClickEventOnArrow.call(this,arrowSpan,options);
    bindCustomSelect.call(this,selectedSpan,select);
    arrowSpan.addEventListener('click',select.click);
    addClickEventOnOptions.call(this,selectedSpan,options.childNodes,select);
    for (var i = 0; i < options.length; i++) {
        bindCustomSelect.call(this,options[i],select.options[i])
    };
}

function addClickEventOnSelectedSpan(selectedSpan,options){
    selectedSpan.addEventListener("click", function (){
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
        if (options.style.display == 'block')
        {
            options.style.display = 'none';

        }
        else {
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

function addClickEventOnOptions(selectedSpan,options,select){
    for (var i = options.length - 1; i >= 0; i--) {

        options[i].onclick = function (el1) {
            selectedSpan.innerHTML = el1.target.getAttribute('value');
            for (var i= select.options.length; i-->0;) {

                if (select.options[i].value==el1.target.getAttribute('value')) {
                    select.selectedIndex= i;
                    return;
                }
            }
        };
    }
}

function bindCustomSelect(el, target){
    console.log(target);
    el.addEventListener("click", function (){ if (target.click) target.click();});
    el.addEventListener("focus", function (){ if (target.focus) target.focus();});
    el.addEventListener("blur", function (){ if (target.blur) target.blur();});
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