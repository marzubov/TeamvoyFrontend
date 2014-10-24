/**
 * Created by MU on 10/24/14.
 */
function DragColumn(table, dataArray, sortableGrid) {
    var that, col1, col2, draggedColumn;

    //onMouseDown
    function drag(e) {
        if (e.target == this) return false;
        if (e.target.parentNode.parentNode.tagName == 'thead') console.log('header');
        document.addEventListener('mouseup', drop);
        table.classList.add('.noselect');
        col1 = that.findColumnIndex(e.target);
        renderDraggedColumn(e);
        e.preventDefault();
        return false;
    }

    function handleMove(e) {
        if (e.target == this) table.removeChild(draggedColumn);
    }

    //rendering dragged column
    function renderDraggedColumn(e) {
        draggedColumn = table.cloneNode(true);
//        Array.prototype.slice.call(draggedColumn.rows)
//            .forEach(function (el) {
//                Array.prototype.slice.call(el)
//                    .forEach(function (el) {
//                        if (el.index != col1) el.hidden = true;
//                            });
//            });
        for (var i = 0; i < draggedColumn.rows.length; i++) {
            for (var j = 0; j<draggedColumn.rows[i].cells.length; j++)
            {
                if (j != col1) {
                    console.log("yeah");
                    draggedColumn.rows[i].cells[j].hidden = true;
                    //draggedColumn.rows[i].removeChild(draggedColumn.rows[i].cells[j]);
                }
            }
        }

        draggedColumn.classList.add('dragged');
        draggedColumn.style.left = (e.clientX + 10).toString() + 'px';
        draggedColumn.style.top = e.clientY.toString() + 'px';
        document.addEventListener('mousemove', function onmousemove(e) {
            if (!draggedColumn) return false;
            draggedColumn.style.left = (e.clientX + 10).toString() + 'px';
            //draggedColumn.style.top = e.clientY.toString() + 'px';
        });
        table.addEventListener('mouseout', function onmouseout(e) {
            if (e.target == this){
                table.removeChild(draggedColumn);
                document.removeEventListener('mousemove', onmousemove);
                document.removeEventListener('mouseup', drop);
            }
        });
        table.parentNode.appendChild(draggedColumn);
    }

    //onMouseUp
    function drop(e) {
        if (!draggedColumn) return false;
        if (table.contains(draggedColumn)) table.removeChild(draggedColumn);
        document.removeEventListener('mousemove', onmousemove);
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
        //here goes logic of finding column
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
        bindEvents();
    }

    init.call(this);
}