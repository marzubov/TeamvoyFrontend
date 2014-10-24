/**
 * Created by MU on 10/24/14.
 */
function dragColumn(table){
    var that, col1, col2;

    //onMouseDown
    function drag(e){
        if (e.target == this) return false;
        col1 = that.findColumnIndex(e.target);
    }

    //onMouseUp
    function drop(e){
        if (e.target == this) return false;
        col2 = that.findColumnIndex(e.target);
        if (col1 && col2) return false;
        if (col1 == col2) return false;
        that.swapColumns(col1, col2);
    }

    //finding column index
    this.findColumnIndex =  function (target, targetTable) {
        if (!targetTable) {
            targetTable = table;
        }

        //here goes logic of finding column
        return targetTable.cellIndex;
    };

    //swapping columns
    this.swapColumns = function (firstCol, secondCol, targetTable){
        if (!targetTable) {
            targetTable = table;
        }

        //here goes logic of swapping columns
        var rowLength = targetTable.rows.length, i = 0, tempCell = 0;
        for (i; i < rowLength; i++){
            tempCell = targetTable.rows[firstCol];
            targetTable.rows[firstCol] = targetTable.rows[secondCol];
            targetTable.rows[secondCol] = tempCell;
        }
    }

    //binding events
    function bindEvents(){
        table.addEventListener('mousedown', drag);
        table.addEventListener('mouseup', drop);
        console.log('binded');
    }

    //init
    function init(){
        that = this;
        console.log('binding');
        bindEvents();
    }
    init.call(this);
}

