Object.prototype.renameProperty = function (oldName, newName) {
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (this.hasOwnProperty(oldName)) {
    this[newName] = this[oldName].replace(oldName + 1, newName + 1);
    delete this[oldName];
  }
  return this;
};

Object.prototype.swapProperty = function (oneName, twoName) {
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (this.hasOwnProperty(oneName) && this.hasOwnProperty(twoName)) {
    var data1 = this[oneName];
    var data2 = this[twoName];
    this[oneName] = data2.replace(twoName + 1, oneName + 1);
    this[twoName] = data1.replace(oneName + 1, twoName + 1);
  }
  return this;
};

function Draggable(grid) {
  var that, col1, col2, draggedColumn, draggedShadow, previousPos, enabled, dragButtons = [];
  this.arrayOfData = grid.dataArray;
  this.objectOfData = grid.dataObject;
  //onMouseDown
  function drag(e) {
    //if (e.target == this) return false;
    if (e.target.parentNode.parentNode.tagName == 'thead') console.log('header');
    //table.tabIndex = 0;
    document.addEventListener('mouseup', drop);
    grid.root.classList.add('.noselect');
    col1 = that.findColumnIndex(e.clientX);
    if (col1 == -1) return false;
    render(e);
    previousPos = e.clientX;
    e.preventDefault();
    return false;
  }

  this.changeData = function (dataArray, dataObject) {
    this.arrayOfData = dataArray;
    this.objectOfData = dataObject;
  }

  function renderDragButton(){
    var dragButton = document.createElement('button');
    dragButton.classList.add('drag-button');
    dragButton.innerText = "................";
    dragButton.addEventListener('mousedown', drag);
    return dragButton;
  }

  //rendering dragged column
  function render() {

    //current position
    var currentPosition = findPos(grid.root.rows[0].cells[col1]);

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
    draggedColumn = grid.root.cloneNode(true);

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
    draggedColumn.style.width = (grid.root.rows[0].cells[col1].offsetWidth+'px');
    draggedColumn.style.top = currentPosition.top.toString() + 'px';
    draggedColumn.style.left = currentPosition.left.toString() + 'px';
    grid.root.appendChild(draggedColumn);
  }

  function renderDraggedShadow(currentPosition){

    //creating and styling dragged column shadow
    draggedShadow = document.createElement('div');
    draggedShadow.classList.add('dragged-shadow');
    draggedShadow.style.width = (grid.root.rows[0].cells[col1].offsetWidth+'px');
    draggedShadow.style.height = (draggedColumn.offsetHeight+'px');
    draggedShadow.style.top = currentPosition.top.toString() + 'px';
    draggedShadow.style.left = currentPosition.left.toString() + 'px';
    grid.root.appendChild(draggedShadow);
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
      var currentPosition = findPos(grid.root.rows[0].cells[col1]);
      draggedShadow.style.top = currentPosition.top.toString() + 'px';
      draggedShadow.style.left = currentPosition.left.toString() + 'px';
    }
  }

  //onMouseUp
  function drop(e) {
    //console.log('dropped');
    if (!draggedColumn) return false;
    if (document.body.contains(draggedColumn)) {
      grid.root.removeChild(draggedColumn);
      grid.root.removeChild(draggedShadow);
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', drop);
    if (e.target == this) return false;
    grid.root.classList.remove('.noselect');
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
      targetTable = grid.root;
    }
    for (var i = 0; i < grid.root.rows[0].cells.length; i += 1){
      if ((target > findPos(grid.root.rows[0].cells[i]).left) &&
        (target < findPos(grid.root.rows[0].cells[i]).left + grid.root.rows[0].cells[i].offsetWidth)) {
        //console.log("position", i);
        return i;
      }
    }
    return -1;
  };

  //swapping table columns
  this.swapTableColumns = function (firstCol, secondCol, targetTable) {
    if (!targetTable) {
      targetTable = grid.root;
    }

    var rowLength = targetTable.rows.length, i = 0;

    for (i; i < rowLength; i++) {
      if (firstCol > secondCol) {
        targetTable.rows[i].cells[firstCol].parentNode.insertBefore(targetTable.rows[i].cells[firstCol], targetTable.rows[i].cells[secondCol]);
      } else {
        targetTable.rows[i].cells[secondCol].parentNode.insertBefore(targetTable.rows[i].cells[secondCol], targetTable.rows[i].cells[firstCol]);
      }
    }

  };

  //swapping array columns
  this.swapArrayColumns = function (firstCol, secondCol, targetArray) {
    while (Math.abs(secondCol - firstCol)) {
      if (secondCol > firstCol) {
        var second = secondCol, first = secondCol - 1;
      } else {
        var second = firstCol, first = firstCol - 1;
      }

      if (!targetArray) {
        targetArray = that.arrayOfData;
      }
      var rowLength = targetArray.length, i = 0, tempCell = 0;

      for (i; i < rowLength; i++) {
        tempCell = targetArray[i][first];
        targetArray[i][first] = targetArray[i][second];
        targetArray[i][second] = tempCell;
      }

      var tempPos = grid.arrayOfPositions[first];
      grid.arrayOfPositions[first] = grid.arrayOfPositions[second];
      grid.arrayOfPositions[second] = tempPos;
      console.log(grid.arrayOfPositions);

      var selectField = document.querySelector('.field-choosing-column');
      var tempIndex = selectField.options[first].getAttribute("data-column");
      selectField.options[first].setAttribute("data-column", selectField.options[second].getAttribute("data-column"));
      selectField.options[second].setAttribute("data-column", tempIndex);

      if (document.querySelector('.filterable-active')) {
        var searchFierld = document.querySelector('.filterable-active');
        var newAttrInField = searchFierld.getAttribute('column-index').replace(first + 1, second + 1);
        searchFierld.setAttribute('column-index', newAttrInField);
      }
      swapDataWithTemplates(first, second);
      swapTemplates(first, second);
      if (secondCol > firstCol) secondCol = first;
      else firstCol = first;
    }
    grid.arrayCheck = grid.arrayCheck.map(function(el) {
    for (var i = 0; i < selectField.options.length; i++) {

        if (selectField.options[i].getAttribute("data-column") == el) {
          document.getElementById("field"+el).value = selectField.options[i].text - 1;
          return (selectField.options[i].text - 1).toString();
        }

    };
    });
  };

  function swapDataWithTemplates(firstCol, secondCol) {
    var targetArray1 = that.objectOfData;
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
    for (var prop in grid.config.columnTemplates) {
      if (grid.config.columnTemplates.hasOwnProperty(prop)){
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
      grid.config.columnTemplates.swapProperty(firstCol, secondCol);
    }
    if (countWithTemplates == 1) {
      if (whatColumn == firstCol) { grid.config.columnTemplates.renameProperty(firstCol, secondCol); }
      else { grid.config.columnTemplates.renameProperty(getKeyByIndexColumn(secondCol), gfirstCol); }
    }
    //console.log(config.columnTemplates);
    //console.log(dataObject);
    //console.log(dataArray);
  }

  function getKeyByIndexColumn(index) {
    var i = 0, mykey, element;
    for (mykey in that.objectOfData[0]) {
      if (i == index) element = mykey;
      i++;
    }
    return element;
  }

  //binding events
  function bindEvents() {
    grid.root.rows[0].addEventListener('mousedown', drag);
    console.log('binded');
  }

  //init
  function init() {
    that = this;
    Array.prototype.slice.call(grid.root.rows[0].cells)
      .forEach(function (header) {
        dragButtons.push(renderDragButton());
        header.insertBefore(dragButtons.slice(-1).pop(), header.firstChild);
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
    grid.root.rows[0].removeEventListener('mousedown', drag);
    //console.log('disabled');
  }

  init.call(this);
  return this;
}
