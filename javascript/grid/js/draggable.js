/**
 * Created by MU on 10/24/14.
 */
 function Draggable(table, dataArray) {
    var that, col1, col2, draggedColumn, draggedShadow, previousPos, enabled;

    //onMouseDown
    function drag(e) {
        if (e.target == this) return false;
        if (e.target.parentNode.parentNode.tagName == 'thead') console.log('header');
        //table.tabIndex = 0;
        document.addEventListener('mouseup', drop);
        table.classList.add('.noselect');
        col1 = that.findColumnIndex(e.target);
        render(e);
        previousPos = e.clientX;
        e.preventDefault();
        return false;
    }

    //rendering dragged column
    function render() {

        //current position
        var currentPosition = findPos(table.rows[0].cells[col1]);

        //saving current position of the mouse
        previousPos = currentPosition.left.toString();

        //rendering dragged column and its shadow
        renderDraggedColumn(currentPosition);
        renderDraggedShadow(currentPosition);

        //adding mouse move event to the table
        table.addEventListener('mousemove', onMouseMove);
    }

    function renderDraggedColumn(currentPosition){
        var cellIndex;

        //cloning table, and removing unnecessary columns
        draggedColumn = table.cloneNode(true);

        Array.prototype.slice.call(draggedColumn.rows)
            .forEach(function (el) {
                cellIndex = 0;
                Array.prototype.slice.call(el.cells)
                    .forEach(function (el1) {
                        if (cellIndex != col1){
                            el.removeChild(el1);
                        }
                        cellIndex++;
                    });

            });

        //styling dragged column
        draggedColumn.classList.add('dragged');
        draggedColumn.classList.add('column');
        draggedColumn.style.width = (table.rows[0].cells[col1].offsetWidth+'px');
        draggedColumn.style.top = currentPosition.top.toString() + 'px';
        draggedColumn.style.left = currentPosition.left.toString() + 'px';
        table.appendChild(draggedColumn);
    }

    function renderDraggedShadow(currentPosition){

        //creating and styling dragged column shadow
        draggedShadow = document.createElement('div');
        draggedShadow.classList.add('dragged-shadow');
        draggedShadow.style.width = (table.rows[0].cells[col1].offsetWidth+'px');
        draggedShadow.style.height = (draggedColumn.offsetHeight+'px');
        draggedShadow.style.top = currentPosition.top.toString() + 'px';
        draggedShadow.style.left = currentPosition.left.toString() + 'px';
        table.appendChild(draggedShadow);
    }

    function onMouseMove(e){
        if (!draggedColumn) return false;
        var newPos = draggedColumn.offsetLeft - previousPos;
        newPos += e.clientX;

        draggedColumn.style.left = (newPos).toString() + 'px';
        previousPos = e.clientX;
        col2 = that.findColumnIndex(e.target);

        if ((col1!=col2)&&(e.target != draggedShadow)){

            that.swapTableColumns(col1,col2);
            that.swapArrayColumns(col1,col2);
            col1 = col2;
            var currentPosition = findPos(table.rows[0].cells[col1]);
            draggedShadow.style.top = currentPosition.top.toString() + 'px';
            draggedShadow.style.left = currentPosition.left.toString() + 'px';
        }
    }

    //onMouseUp
    function drop(e) {
        console.log('dropped');
        if (!draggedColumn) return false;
        if (document.body.contains(draggedColumn)) {
            table.removeChild(draggedColumn);
            table.removeChild(draggedShadow);
        }
        table.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', drop);
        if (e.target == this) return false;
        table.classList.remove('.noselect');
        col2 = that.findColumnIndex(e.target);
        if ((!col2)&&(col2!=0)) return false;
        if (col1 == col2) return false;

        that.swapTableColumns(col1, col2);
        that.swapArrayColumns(col1, col2);
    }

    //finding column index
    this.findColumnIndex = function (target, targetTable) {
        if (!targetTable) {
            targetTable = table;
        }
        return target.cellIndex;
    };

    //swapping table columns
    this.swapTableColumns = function (firstCol, secondCol, targetTable) {
        if (!targetTable) {
            targetTable = table;
        }

        var rowLength = targetTable.rows.length, i = 0;

        for (i; i < rowLength; i++) {
            var tempCellStyle1 = targetTable.rows[i].cells[firstCol].cloneNode(true);

            var tempCellStyle2 = targetTable.rows[i].cells[secondCol].cloneNode(true);

            targetTable.rows[i].cells[firstCol].parentNode.replaceChild(tempCellStyle2, targetTable.rows[i].cells[firstCol]);
            targetTable.rows[i].cells[secondCol].parentNode.replaceChild(tempCellStyle1, targetTable.rows[i].cells[secondCol]);
        }
    };

    //swapping array columns
    this.swapArrayColumns = function (firstCol, secondCol, targetArray) {
        if (!targetArray) {
            targetArray = dataArray;
        }
        var rowLength = targetArray.length, i = 0, tempCell = 0;

        for (i; i < rowLength; i++) {
            tempCell = targetArray[i][firstCol];
            targetArray[i][firstCol] = targetArray[i][secondCol];
            targetArray[i][secondCol] = tempCell;
        }
    };

    //binding events
    function bindEvents() {
        table.rows[0].addEventListener('mousedown', drag);
        console.log('binded');
    }

    //init
    function init() {
        that = this;
        console.log('binding');
        that.enable();
    }

    function findPos(elem) {
        var top=0, left=0;
        while(elem) {
            top = top + parseInt(elem.offsetTop);
            left = left + parseInt(elem.offsetLeft);
            elem = elem.offsetParent;       
        }
        return {top: top, left: left};
    }

    this.enable = function(){
        enabled = true;
        table.rows[0].addEventListener('mousedown', drag);
        console.log('enabled');
    }

    this.disable = function(){
        enabled = false;
        table.rows[0].removeEventListener('mousedown', drag);
        console.log('disabled');
    }
    init.call(this);
}