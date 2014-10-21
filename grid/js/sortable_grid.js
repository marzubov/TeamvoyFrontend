function SortableGrid(container, dataArray, config, maxRows) {
    var element;
    var pages;
    var maxDataLength;
    var pagesData = new Array();
    this.getCreatedElement=function(){return element;};
    var sortedColumn;
    var pageIndex = 1;
    init();

    function init(){
        element = document.createElement('table');
        pages = document.createElement('table');
        container.appendChild(element);
        container.appendChild(pages);

        if (dataArray == null){
            console.log('dataArray == null');
            getData(config.url,0,maxRows);
        }
        else{
            createTable();
        }
    }

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }

    function getData(url,start,end){
        url+='/getdata';
        if ((start)||(end)){
            url+='_'+start+'_'+end;
        }

        console.log(url);

        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        // Response handlers.
        xhr.onload = function(){
            xhrOnLoad(xhr);
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };

        xhr.send();
    }

    function xhrOnLoad(xhr){
        var receivedText = xhr.responseText.split('__objectmaxlength__');
        var receivedObject = JSON.parse(receivedText[0]);
        maxDataLength = receivedText[1];
        console.log("response object ", receivedObject);
        console.log("response object max length", receivedText[1]);

        //tempData and tempArray for temporary storing data
        var tempData = new Array();
        Array.prototype.slice.call(receivedObject)
            .forEach(function(el){
                var tempArray = new Array();
                Object.keys(el).forEach(function(key,index){
                    tempArray.push(el[key]);
                });
                tempData.push(tempArray);
            });
        dataArray = tempData;
        pagesData[pageIndex-1] = tempData;
        if (!element.innerHTML) {
            if (maxDataLength==dataArray.length) createTable(false);
            else createTable(true);
        }
        else changeData(true);
        //alert('Response from CORS request to' + url + ': ' + xhr.responseText);
        return(xhr.responseText);
    }

    function reInit(){
        changeData();
    }

    //private methods
    function sortArray(cellIndex,reverse){
        dataArray.sort(function(current,next){

            if(parseFloat(current[cellIndex]))
                return current[cellIndex] - next[cellIndex];
            else
                return current[cellIndex]>next[cellIndex];
        });
        reverse=='desc'?dataArray.reverse():0;
        reInit();
    }

    function createTable(sortable){
        // Make headers
        var tableString = '<thead><tr><td>' + config.headers.join('</td><td>') + '</td></thead>';
        // Make body
        tableString +='<tbody class="data-body">';
        if(!maxRows) maxRows = dataArray.length;
        if (!maxDataLength) maxDataLength = dataArray.length;
        for (var i=0;i<maxRows;i++)tableString += '<tr><td>' + dataArray[i].join('</td><td>') + '</td></tr>';

        tableString+='</tbody>';
        element.innerHTML+=tableString;

        var headCells=element.querySelector('thead').querySelector('tr').querySelectorAll('td');
        headCells=Array.prototype.slice.call(headCells);
        headCells.forEach(function(el){
            el.className+=' table-header';
            if (!sortable) el.addEventListener('click',headClicked);
        });
        // Places arrow in  head cell
        function headClicked() {

            var reverse;
            if(this.classList.contains('asc')){
                this.classList.add('desc');
                this.classList.remove('asc');
                reverse='desc';
            }
            else if(this.classList.contains('desc')){
                this.classList.add('asc');
                this.classList.remove('desc');
                reverse='asc';
            }
            // Sort new column
            else{
                reverse='asc';
                deleteArrows();
                this.classList.add('asc');
            }
            sortedColumn=this.cellIndex;
            sortArray(sortedColumn, reverse);
        }

        // When another cell clicked
        function deleteArrows() {
            // CAN BE ZERO THEN TRUE
            if(sortedColumn != undefined) {
                headCells[sortedColumn].classList.remove('desc');
                headCells[sortedColumn].classList.remove('asc');
            }
        }
        //Make pages
        createPages();
    }

    function createPages(){
        var pagesString = '<tbody><tr>'+'<td><-</td>';
        for (var i = 1; i <= (maxDataLength/maxRows).toFixed(0); i++) pagesString += '<td>' + i + '</td>';;
        pages.innerHTML+=pagesString + '<td>'+'->'+'</td>'+'</tbody>';
        Array.prototype.slice.call(pages.querySelectorAll('td'))
            .forEach(function(el){

                el.className = 'page';

                if (el.innerHTML == '1') {
                    el.className = 'page-active';
                }
                var i = Array.prototype.indexOf.call(el.parentNode.children, el);
                if((el.innerHTML!="&lt;-")&&(el.innerHTML!="-&gt;")){
                    el.hidden = !!((i < (1 - 5)) || (i - 4 > 1));
                }

                el.addEventListener('click',pageClick);
            });
    }

    function pageClick(){
        el = this;
        console.log(this.innerHTML);
        if (el.innerHTML=="&lt;-"){
//            if (el.parentNode.childNodes[pageIndex-1].innerHTML != "&lt;-"){
//                //pageIndex--;
//                //pageClick.call(el.parentNode.children[pageIndex-1]);
//
//            }
            return;
        }
        else{
           if (el.innerHTML=="-&gt;") {
               return;
           }
        }
        var newPageIndex = this.innerHTML;
        Array.prototype.slice.call(this.parentNode.parentNode.querySelectorAll('td'))
            .forEach(function(el){
                el.className = 'page';
                var i = Array.prototype.indexOf.call(el.parentNode.children, el);
                if((el.innerHTML!="&lt;-")&&(el.innerHTML!="-&gt;")) {
                    el.hidden = !!((i < (newPageIndex - 4)) || (i - 3 > newPageIndex));
                }
            });
        pageIndex = newPageIndex;
        if (dataArray.length==maxDataLength){
            changeData();
        }
        else{
            if (!pagesData[el.innerHTML-1]){
                console.log("we need new request");
                getData(config.url,(el.innerHTML-1)*maxRows,el.innerHTML*maxRows);
            }
            else changeData(true);
        }

        this.className = 'page-active';
    }

    // dynamically changing data of the table
    function changeData(fromPagesData) {
        var data;
        if (!fromPagesData) { data = dataArray;}
        else{
            data = pagesData[pageIndex-1];
        }
        var dataBody = element.querySelector('.data-body');
        var dataString = '';

        var maxRowIndex = maxRows + (pageIndex - 1) * maxRows;
        if (maxRows + (pageIndex - 1) * maxRows > data.length) maxRowIndex = data.length;
        if (!fromPagesData) {
            for (var i = 0 + (pageIndex - 1) * maxRows; i < pageIndex * maxRows; i++) {
                dataString += '<tr><td>' + data[i].join('</td><td>') + '</td></tr>';
            }
        }
        else{
            for (var i = 0; i < maxRows; i++) {
                dataString += '<tr><td>' + data[i].join('</td><td>') + '</td></tr>';
            }
        }
        dataBody.innerHTML = dataString;
    }
}