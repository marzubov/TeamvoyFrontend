var GameOfLife = function(params){
  var num_cells_y = params["init_cells"].length,
      num_cells_x = params["init_cells"][0].length,
      cell_width  = params["cell_width"]  || 10,
      cell_height = params["cell_height"] || 10,
      init_cells  = params["init_cells"]  || [],
      canvas_id   = params["canvas_id"]   || "life",
      colourful   = params["colourful"] || params["colorful"] || false,
      cell_array = [],
      display = new GameDisplay(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id, this),
      interval = null;

    function init() {
      var length_y = init_cells.length,
        that = this,
        length_x,
        y, x;

      for (y = 0; y < length_y; y++) {
        length_x = init_cells[y].length;
        for (x = 0; x < length_x; x++) {
          var state = (init_cells[y][x] == 1) ? 'alive' : 'dead';
          init_cells[y][x] = new Cell(x, y, state);
        }
      }
      cell_array = init_cells;
      display.update(cell_array);

      document.getElementById(canvas_id).addEventListener("click", function (e) {
        e = e || window.event;
        var target =  e.target || e.srcElement;
        if (target.classList.contains("alive")) {
          target.classList.remove("alive");
          target.classList.add("dead");
        } else {
          target.classList.remove("dead");
          target.classList.add("alive");
        }
        var countChilds = 0;
        for (y = 0; y < length_y; y++) {
          length_x = cell_array[y].length;
          for (x = 0; x < length_x; x++) {
            var state = (document.getElementById(canvas_id).childNodes[countChilds++].classList.contains("alive")) ? 'alive' : 'dead';
            cell_array[y][x] = new Cell(x, y, state);
          }
        }
      });

    };

     function nextGenCells() {
      var current_gen = cell_array,
        next_gen = [],
        length_y = cell_array.length,
        length_x,
        y, x;
      for (y = 0; y < length_y; y++) {
        length_x = current_gen[y].length;
        next_gen[y] = [];
        for (x = 0; x < length_x; x++) {
          var cell = current_gen[y][x];
          var row_above = (y-1 >= 0) ? y-1 : length_y-1;
          var row_below = (y+1 <= length_y-1) ? y+1 : 0;
          var column_left = (x-1 >= 0) ? x-1 : length_x - 1;
          var column_right = (x+1 <= length_x-1) ? x+1 : 0;

          var neighbours = {
            top_left: current_gen[row_above][column_left].clone(),
            top_center: current_gen[row_above][x].clone(),
            top_right: current_gen[row_above][column_right].clone(),
            left: current_gen[y][column_left].clone(),
            right: current_gen[y][column_right].clone(),
            bottom_left: current_gen[row_below][column_left].clone(),
            bottom_center: current_gen[row_below][x].clone(),
            bottom_right: current_gen[row_below][column_right].clone()
          };

          var alive_count = 0;
          var dead_count = 0;
          for (var neighbour in neighbours) {
            if (neighbours[neighbour].getState() == "dead") {
              dead_count++;
            } else {
              alive_count++;
            }
          }

          var new_state = cell.getState();
          if (cell.getState() == "alive") {
            if (alive_count < 2 || alive_count > 3) {
              new_state = "dead";
            } else if (alive_count === 2 || alive_count === 3) {
              new_state = "alive";
            }
          } else {
            if (alive_count === 3) {
              new_state = "alive";
            }
          }
          next_gen[y][x] = new Cell(x, y, new_state);
        }
      }
      return next_gen;
    };

  init();

  return {
    step: function(){
      var next_gen = nextGenCells();
      cell_array = next_gen;
      display.update(cell_array);
    },
    setTheInterval: function(the_interval) {
      interval = the_interval;
    },
    getInterval: function() {
      return interval;
    },
    setNewFigure: function(array){
      var length_y = array.length,
        length_x, y, x;
      for (y = 0; y < length_y; y++) {
        length_x = array[y].length;
        for (x = 0; x < length_x; x++) {
          var state = (array[y][x] == 1) ? 'alive' : 'dead';
          array[y][x] = new Cell(x, y, state);
        }
      }
      cell_array = array;
      display.update(cell_array);
    }
  };
};


var GameDisplay = function(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id, that) {
  var canvas = document.getElementById(canvas_id),
      width_pixels = num_cells_x * cell_width + num_cells_x * 2,
      height_pixels = num_cells_y * cell_height + num_cells_y * 2;

  function updateCells(cell_array) {
     var allCells = document.createDocumentFragment();
     var length_y = cell_array.length,
          length_x, y, x;
     for (y = 0; y < length_y; y++) {
        length_x = cell_array[y].length;
        for (x = 0; x < length_x; x++) {
            allCells.appendChild(drawCell(cell_array[y][x]));
        }
     }
     canvas.style.width = width_pixels + "px";
     canvas.style.height = height_pixels + "px";
     canvas.innerHTML = "";
     canvas.appendChild(allCells);


  };

  function drawCell(cell) {
      var cells = document.createElement("div");
      if (cell.getState() == "alive") {
        cells.classList.add("alive");
      } else {
        cells.classList.add("dead");
      }
      return cells;
  };

  return {
    update: function(cell_array) {
      updateCells(cell_array);
    }
  };


};

var Cell = function(x_pos, y_pos, state) {
  return {
    x_pos: x_pos,
    y_pos: y_pos,
    state: state,
    getXPos: function() {
      return x_pos;
    },
    getYPos: function() {
      return y_pos;
    },
    getState: function() {
      return state;
    },
    setState: function(new_state) {
      state = new_state;
    },
    clone: function() {
      return new Cell(x_pos, y_pos, state);
    }
  };
};
