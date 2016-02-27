Generates random mazes.  Algorithm types:
  1) Aldous-Broder: Selects mazes uniformly from all possible mazes of the given size.
        Details at: http://weblog.jamisbuck.org/2011/1/17/maze-generation-aldous-broder-algorithm
  2) Sidewinder:  Does not select mazes uniformly, but mazes can be generated more quickly than Aldous-Broder.  
        All generated mazes have a connected top corridor.
        Details at: http://weblog.jamisbuck.org/2011/2/3/maze-generation-sidewinder-algorithm
  3) Binary Tree:  Does not select mazes uniformly, but mazes can be generated more quickly than Aldous-Broder.
        All generated mazes have a connected top corridor and a connected right corridor.
        Details at: http://weblog.jamisbuck.org/2011/2/1/maze-generation-binary-tree-algorithm
        
"Show colors" option colors each cell.  The middle cell is colored blue.  The cell that is the farthest from the 
center cell is colored red.  All other cell colors are interpolated between blue and red depending on their distance
from the center cell and the farthest cell from the center cell.