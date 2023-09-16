import algorithm from './algorithm';
import Grid from '../Grid/Grid.jsx'
import * as Constants from '../Settings/Constants.jsx';

export default class DFS implements algorithm {
    
    private grid: Grid;
    private parent: Array<Array<Array<number>>>;
    private start: Array<number>;
    private end: Array<number>;

    private visited_points: Array<Array<number>>;
    
    constructor(grid){
        this.grid = grid;
        this.start = Array.from(this.grid.getStart());
        this.end = Array.from(this.grid.getEnd());

        this.parent = [];
        const [m, n] = this.grid.getGridSize();
        for(let i=0; i<m; i++){
            const row: Array<Array<number>> = [];
            for(let j=0; j<n; j++)
                row.push([-1, -1]);
            this.parent.push(row);
        }
    }

    run() : Array<Array<number>>{
        this.visited_points = [];
        this.parentInit();
        this.grid.init();
        const [x, y] = this.start;
        this.grid.setSquare(x, y, 0);
        this.dfs(x, y, 0);
        return this.visited_points;
    }
    
    step(depth){
        // function overloading is not supported in ts
        // so ... dfs(x, y, depth) is used  :(( 
    }
    
    findPath() : Array<Array<number>> {
        const res: Array<Array<number>> = [];
        var point = Array.from(this.end);
        while(point[0] !== -1){
            //console.log("Push", point);
            res.push(Array.from(point));
            const [x, y] = point;
            point = Array.from(this.parent[x][y]);
        }
        //console.log("res", res);
        return res;
    }

    parentInit() {
        const [m, n] = this.grid.getGridSize();
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                this.parent[i][j] = [-1, -1];
    }

    dfs(x, y, depth) : boolean {
        const [m, n] = this.grid.getGridSize();
        //if(x === this.end[0] && y === this.end[1])
        //    return true;
        
        if(x + 1 < m){
            const cur = this.grid.getSquare(x + 1, y);
            if(cur === Constants.UNVISITED  || cur > depth + 1){
                this.visited_points.push([x + 1, y]);
                this.grid.setSquare(x + 1, y, depth + 1);
                this.parent[x + 1][y] = [x, y];
                if(this.dfs(x + 1, y, depth + 1))
                    return true;
            }
        }
    
        if(x - 1 >= 0){
            const cur = this.grid.getSquare(x - 1, y);
            if(cur === Constants.UNVISITED || cur > depth + 1){
                this.visited_points.push([x - 1, y]);
                this.grid.setSquare(x - 1, y, depth + 1);
                this.parent[x - 1][y] = [x, y];
                if(this.dfs(x - 1, y, depth + 1))
                    return true;
            }
        }
        
        if(y + 1 < n){
            const cur = this.grid.getSquare(x, y + 1);
            if(cur === Constants.UNVISITED || cur > depth + 1){
                this.visited_points.push([x, y + 1]);
                this.grid.setSquare(x, y + 1, depth + 1);
                this.parent[x][y + 1] = [x, y];
                if(this.dfs(x, y + 1, depth + 1))
                    return true;
            }
        }

        if(y - 1 >= 0){
            const cur = this.grid.getSquare(x, y - 1);
            if(cur === Constants.UNVISITED || cur > depth + 1){
                this.visited_points.push([x, y - 1]);
                this.grid.setSquare(x, y - 1, depth + 1);
                this.parent[x][y - 1] = [x, y];
                if(this.dfs(x, y - 1, depth + 1))
                    return true;
            }
        }

        return false;
    }
}