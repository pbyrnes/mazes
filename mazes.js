//TODO:
// 1) convert "number of pixels per cell" to something better
// 2) multiple color options
// 3) color darker/lighter options
// 4) rainbow color option???  (for example, fade blue to red)
// 4.5) wall color options
// 5) button to generate new maze
// 6) Aldous-Broder statistics
// 7) constrained shapes (ideally type in name and fill a block style of name)
// 8) style the page
// 9) circular mazes
// 10) print the maze page (pdf???)
// 11) maze statistics (number of deadends)

var cellNum = 0;
var colorCheckBox;
var cellSize = 20;
var offset = 10;
var n = 35;
var g;

function Cell(x, y){
  this.row = x;
  this.column = y;
  this.links = {};
  this.id = cellNum++;
}

function Grid(a, b){
  this.numRows = a;
  this.numColumns = b;
  
  this.grid = [];
  for(var i=0; i<this.numRows; i++){
    this.grid[i] = [];
    for(var j=0; j<this.numColumns; j++)
      this.grid[i][j] = new Cell(i,j);
  }
  
  this.toString = function(){
    var output = '';
    var i,j;
    for(i=0; i<this.numRows; i++){
      for(j=0; j<this.numColumns; j++){
        output += this.grid[i][j].id;
        if(j <this.numColumns-1)
          output += ' ';
      }
      if(i < this.numRows-1)
        output += '\n';
    }
    output += '\n';
    for(i=0; i<this.numRows; i++)
      for(j=0; j<this.numColumns; j++){
        output += this.grid[i][j].id + " : ";
        if(this.grid[i][j].links.left)
          output += "left,";
        if(this.grid[i][j].links.right)
          output += "right,";
        if(this.grid[i][j].links.up)
          output += "up,";
        if(this.grid[i][j].links.down)
          output += "down,";
        output += '\n';
      }
    return output;
  };
  
  this.createBinaryTreeMaze = function(){
    //link upper and right corridors
    for(var j=0; j<this.numColumns; j++){
      if(j<this.numColumns-1)
        this.grid[0][j].links.right=true;
      if(j > 0)
        this.grid[0][j].links.left=true;
    }
    for(var i=0; i<this.numRows; i++){
      if(i<this.numRows-1)
        this.grid[i][this.numColumns-1].links.down = true;
      if(i > 0)
        this.grid[i][this.numColumns-1].links.up = true;
    }
    
    for(i=1; i<this.numRows; i++)
      for(j=0; j<this.numColumns-1; j++)
        if(Math.random() < 0.5){
          this.grid[i][j].links.up=true;
          this.grid[i-1][j].links.down=true;
        }
        else{
          this.grid[i][j].links.right=true;
          this.grid[i][j+1].links.left=true;
        }
  };
  
  this.createSidewinderMaze = function(){
    //link upper corridor
    for(var j=0; j<this.numColumns; j++){
      if(j<this.numColumns-1)
        this.grid[0][j].links.right=true;
      if(j > 0)
        this.grid[0][j].links.left=true;
    }
    for(var i=1; i<this.numRows; i++){
      var leftEnd = 0;
      var rightEnd = 0;
      for(j=0; j<this.numColumns; j++){
        if(j < this.numColumns-1 && Math.random() < 0.5){
          //extend run to the right
          this.grid[i][j].links.right = true;
          this.grid[i][j+1].links.left = true;
          rightEnd++;
        }
        else{
          //close out run
          var n = rightEnd-leftEnd+1;
          var upIndex = Math.floor(leftEnd + Math.random()*n);
          this.grid[i][upIndex].links.up = true;
          this.grid[i-1][upIndex].links.down = true;
          leftEnd = j+1;
          rightEnd = j+1;
        }
      }
    }
  };
  
  this.createAldousBroderMaze = function(){
    var x = Math.floor(Math.random()*this.numRows);
    var y = Math.floor(Math.random()*this.numColumns);
    var visited = [];
    for(var i=0; i<this.numRows; i++){
      visited[i] = [];
      for(var j=0; j<this.numColumns; j++)
        visited[i][j] = false;
    }
    var numLeftToVisit = this.numRows * this.numColumns;
    // noprotect
    while(numLeftToVisit > 0){
      var neighbors = [];
      if(x > 0)
        neighbors.push(0);
      if(x < this.numRows - 1)
        neighbors.push(1);
      if(y > 0)
        neighbors.push(2);
      if(y < this.numColumns - 1)
        neighbors.push(3);
      var nextX, nextY;
      var index = neighbors[Math.floor(Math.random()*neighbors.length)];
      if(index == 0){
        nextX = x-1;
        nextY = y;
      }
      if(index == 1){
        nextX = x+1;
        nextY = y;
      }
      if(index == 2){
        nextX = x;
        nextY = y-1;
      }
      if(index == 3){
        nextX = x;
        nextY = y+1;
      }
      if(!visited[nextX][nextY]){
        visited[nextX][nextY] = true;
        if(index == 0){
          this.grid[x][y].links.up = true;
          this.grid[x-1][y].links.down = true;
        }
        if(index == 1){
          this.grid[x][y].links.down = true;
          this.grid[x+1][y].links.up = true;
        }
        if(index == 2){
          this.grid[x][y].links.left = true;
          this.grid[x][y-1].links.right = true;
        }
        if(index == 3){
          this.grid[x][y].links.right = true;
          this.grid[x][y+1].links.left = true;
        }
        numLeftToVisit--;
      }
      x = nextX;
      y = nextY;
    }
  };

  this.drawSVG = function(){
      console.log("started drawSVG");
      var element;
      var svgElt = document.getElementsByTagName("svg")[0];
      svgElt.setAttribute("width",(this.numColumns*cellSize).toString());
      svgElt.setAttribute("height",(this.numRows*cellSize).toString());
  
      for(var i=0; i<this.numRows; i++)
        for(var j=0; j<this.numColumns; j++){
            //left side
            if(i+j !=0 && !this.grid[i][j].links.left){
                element = document.createElementNS("http://www.w3.org/2000/svg", "line");
                element.setAttribute("x1",(cellSize*j).toString());
                element.setAttribute("y1",(cellSize*i).toString());
                element.setAttribute("x2",(cellSize*j).toString());
                element.setAttribute("y2",(cellSize*(i+1)).toString());
                svgElt.appendChild(element);
            }
            //top side
            if(!this.grid[i][j].links.up){
                element = document.createElementNS("http://www.w3.org/2000/svg","line");
                element.setAttribute("x1",(cellSize*j).toString());
                element.setAttribute("y1",(cellSize*i).toString());
                element.setAttribute("x2",(cellSize*(j+1)).toString());
                element.setAttribute("y2",(cellSize*i).toString());
                svgElt.appendChild(element);
            }

            if(document.getElementById("colorCheckBox").checked){
                var rectElt = document.createElementNS("http://www.w3.org/2000/svg","rect");
                rectElt.setAttribute("width",(cellSize).toString());
                rectElt.setAttribute("height",(cellSize).toString());
                var opac = (this.distances[i][j]/this.maxDistance);
                var redAmt = Math.floor(opac*255);
                var blueAmt = Math.floor((1-opac)*255);
                opac = 1;
                rectElt.setAttribute("style","stroke-width:0;fill:rgb(" + redAmt + ",0," + blueAmt + ");fill-opacity:" +opac +";");
                rectElt.setAttribute("x",(cellSize*j).toString());
                rectElt.setAttribute("y",(cellSize*i).toString());
                svgElt.insertBefore(rectElt,svgElt.firstChild);
            }
       }

      element = document.createElementNS("http://www.w3.org/2000/svg","line");
      element.setAttribute("x1","0");
      element.setAttribute("y1",(cellSize*this.numRows).toString());
      element.setAttribute("x2",(cellSize*this.numColumns).toString());
      element.setAttribute("y2",(cellSize*this.numRows).toString());
      svgElt.appendChild(element);

      element = document.createElementNS("http://www.w3.org/2000/svg","line");
      element.setAttribute("x1",(cellSize*this.numColumns).toString());
      element.setAttribute("y1","0");
      element.setAttribute("x2",(cellSize*this.numColumns).toString());
      element.setAttribute("y2",(cellSize*(this.numRows-1)).toString());
      svgElt.appendChild(element);
  };

  this.solve = function(startX, startY){
    this.distances = [];
    var frontier = [];
    var next;
    
    for(var i=0; i<this.numRows; i++){
      this.distances[i] = [];
      for(var j=0; j<this.numColumns; j++)
        this.distances[i][j] = -1;
    }
    this.distances[startX][startY] = 0;
    this.maxDistance = 0;
    frontier.push({x:startX, y:startY});
    while(frontier.length > 0){
      next = frontier.pop();
      if(this.distances[next.x][next.y] > this.maxDistance)
        this.maxDistance = this.distances[next.x][next.y];
      if(this.grid[next.x][next.y].links.up && this.distances[next.x-1][next.y] < 0){
        this.distances[next.x-1][next.y] = this.distances[next.x][next.y]+1;
        frontier.push({x:next.x-1, y:next.y});
      }
      if(this.grid[next.x][next.y].links.down && this.distances[next.x+1][next.y] < 0){
        this.distances[next.x+1][next.y] = this.distances[next.x][next.y]+1;
        frontier.push({x:next.x+1, y:next.y});
      }
      if(this.grid[next.x][next.y].links.left && this.distances[next.x][next.y-1] < 0){
        this.distances[next.x][next.y-1] = this.distances[next.x][next.y]+1;
        frontier.push({x:next.x, y:next.y-1});
      }
      if(this.grid[next.x][next.y].links.right && this.distances[next.x][next.y+1] < 0){
        this.distances[next.x][next.y+1] = this.distances[next.x][next.y]+1;
        frontier.push({x:next.x, y:next.y+1});
      }
    }
  };
}

function createMaze(){
	if(document.getElementById("AldousBroder").checked)
		g.createAldousBroderMaze();
	if(document.getElementById("sidewinder").checked)
		g.createSidewinderMaze();
	if(document.getElementById("binaryTree").checked)
		g.createBinaryTreeMaze();
}

function updateMaze(){
  g = new Grid(document.getElementById("nRow").value, document.getElementById("nCol").value);

  createMaze();
  g.solve(Math.floor(document.getElementById("nRow").value/2),Math.floor(Math.floor(document.getElementById("nCol").value/2)));
  
  updateSVG();
}

function updateSVG(){
    var svgElt = document.getElementsByTagName("svg")[0];
    while(svgElt.hasChildNodes()){
        svgElt.removeChild(svgElt.lastChild);
    }
    cellSize = document.getElementById("cellSz").value;
    g.drawSVG();
}

function init(){
  cellSize = document.getElementById("cellSz").value;
  
  colorCheckBox = document.getElementById("colorCheckBox");

  document.getElementById("genMazeButton").onclick = updateMaze;
  document.getElementById("colorCheckBox").onchange = updateSVG;

  document.getElementById("cellSz").onchange = updateSVG;
}