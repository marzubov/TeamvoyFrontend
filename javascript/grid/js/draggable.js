Object.prototype.renameProperty = function (oldName, newName) {
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (this.hasOwnProperty(oldName)) {
    this[newName] = this[oldName];
    delete this[oldName];
  }
  return this;
};
Object.prototype.swapProperty = function (oneName, twoName) {
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (this.hasOwnProperty(oneName) && this.hasOwnProperty(twoName)) {
    var data1 = this[oneName];
    var data2 = this[twoName];
    this[oneName] = data2;
    this[twoName] = data1;
  }
  return this;
};

function Draggable(table, dataArray, dataObject, config) {
  var that, col1, col2, draggedColumn, draggedShadow, previousPos, enabled, dragButtons = [];

  //onMouseDown
  function drag(e) {
    //if (e.target == this) return false;
    if (e.target.parentNode.parentNode.tagName == 'thead') console.log('header');
    //table.tabIndex = 0;
    document.addEventListener('mouseup', drop);
    table.classList.add('.noselect');
    col1 = that.findColumnIndex(e.clientX);
    if (col1 == -1) return false;
    render(e);
    previousPos = e.clientX;
    e.preventDefault();
    return false;
  }

  function renderDragButton(){
    var dragButton = document.createElement('button');
    dragButton.classList.add('drag-button');
    dragButton.addEventListener('mousedown', drag);
    return dragButton;
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
    document.addEventListener('mousemove', onMouseMove);
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
    col2 = that.findColumnIndex(e.clientX);
    if ((col1 == -1)||(col2 == -1)) return false;

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
    //console.log('dropped');
    if (!draggedColumn) return false;
    if (document.body.contains(draggedColumn)) {
      table.removeChild(draggedColumn);
      table.removeChild(draggedShadow);
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', drop);
    if (e.target == this) return false;
    table.classList.remove('.noselect');
    col2 = that.findColumnIndex(e.clientX);
    if ((col1 == -1)||(col2 == -1)) return false;
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
    for (var i = 0; i < table.rows[0].cells.length; i += 1){
      if ((target > findPos(table.rows[0].cells[i]).left) &&
        (target < findPos(table.rows[0].cells[i]).left + table.rows[0].cells[i].offsetWidth)) {
        //console.log("position", i);
        return i;
      }
    }
    return -1;
  };

  //swapping table columns
  this.swapTableColumns = function (firstCol, secondCol, targetTable) {
    if (!targetTable) {
      targetTable = table;
    }

    var rowLength = targetTable.rows.length, i = 0;

    for (i; i < rowLength; i++) {
      targetTable.rows[i].cells[firstCol].parentNode.insertBefore(targetTable.rows[i].cells[firstCol],targetTable.rows[i].cells[secondCol]);
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

    var selectField = document.querySelector('.field-choosing-column');
    var tempIndex = selectField.options[firstCol].getAttribute("data-column");
    selectField.options[firstCol].setAttribute("data-column", selectField.options[secondCol].getAttribute("data-column"));
    selectField.options[secondCol].setAttribute("data-column", tempIndex);

    swapDataWithTemplates(firstCol, secondCol);
    swapTemplates(firstCol, secondCol);
  };

  function swapDataWithTemplates(firstCol, secondCol) {
    var targetArray1 = dataObject;
    var rowLength = targetArray1.length, i = 0, tempCell = 0;
    for (i; i < rowLength; i++) {
      var first = getKeyByIndexColumn(firstCol),
        second = getKeyByIndexColumn(secondCol);
      tempCell = targetArray1[i][first];
      targetArray1[i][first] = targetArray1[i][second];
      targetArray1[i][second] = tempCell;
    }
  }

  function swapTemplates(firstCol, secondCol) {
    var countWithTemplates = 0, whatColumn = 0;
    for (var prop in config.columnTemplates) {
      if (config.columnTemplates.hasOwnProperty(prop)){
        if (prop == firstCol) {
          countWithTemplates++;
          whatColumn = firstCol;
        }
        if (prop == secondCol) {
          countWithTemplates++;
          whatColumn = secondCol;
        }
      }
    }
    if (countWithTemplates == 2) {
      config.columnTemplates.swapProperty(firstCol, secondCol);
    }
    if (countWithTemplates == 1) {
      if (whatColumn == firstCol) { config.columnTemplates.renameProperty(firstCol, secondCol); }
      else { config.columnTemplates.renameProperty(secondCol, firstCol); }
    }
  }

  function getKeyByIndexColumn(index) {
    var i = 0, mykey, element;
    for (mykey in dataObject[0]) {
      if (i == index) element = mykey;
      i++;
    }
    return element;
  }

  //binding events
  function bindEvents() {
    table.rows[0].addEventListener('mousedown', drag);
    console.log('binded');
  }

  //init
  function init() {
    that = this;
    Array.prototype.slice.call(table.rows[0].cells)
      .forEach(function (header) {
        dragButtons.push(renderDragButton());
        header.appendChild(dragButtons.slice(-1).pop());
      });
    //console.log('binding');
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

    //table.rows[0].addEventListener('mousedown', drag);
    //console.log('enabled');
  }

  this.disable = function(){
    enabled = false;
    table.rows[0].removeEventListener('mousedown', drag);
    //console.log('disabled');
  }
  init.call(this);
}
