
import * as Constants from '../Settings/Constants.jsx';

export default class MazeGenerator {
    constructor(m, n, grid) {
        
        this.DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        this.m = m;
        this.n = n;
        this.grid = grid;
        this.visited = new Array(m);
        for(let i=0; i<m; i++)
            this.visited[i] = new Array(n).fill(-1);
        // visited[i][j] -> grid[2*i][2*j]
    }

    gen() {
        this.gen_rDFS();
    }

    random4() {
        const arr = [0, 1, 2, 3];
        for(let i=3; i>=0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    _dfs(x, y){
        const indexes = this.random4();
        for(let i=0; i<4; i++){
            const [dx, dy] = this.DIRECTIONS[indexes[i]];
            const xx = x + dx, yy = y + dy;
            if(0 <= xx && xx < this.m && 0 <= yy && yy < this.n && this.visited[xx][yy] === -1){
                this.visited[xx][yy] = 1;
                this.grid.setSquare(xx*2, yy*2, Constants.UNVISITED);
                this.grid.setSquare(x + xx, y + yy, Constants.UNVISITED); // i'm freaking genius :D
                this._dfs(xx, yy);
            }
        }

    }

    gen_rDFS() {
        const [m, n] = this.grid.getGridSize();
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                this.grid.setSquare(i, j, Constants.BLOCK);
        for(let i=0; i<this.m; i++)
            for(let j=0; j<n; j++)
                this.visited[i][j] = -1;
        this.visited[0][0] = 1;
        this.grid.setSquare(0*2, 0*2, Constants.UNVISITED);
        this._dfs(0, 0);
    }

    gen_MST() {}

}
