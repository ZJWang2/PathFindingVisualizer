
import algorithm from './algorithm';
import Grid from '../Grid/Grid.jsx'
import * as Constants from '../Settings/Constants.jsx';

export default class BFS implements algorithm {
    
    private grid: Grid;
    private parent: Array<Array<Array<number>>>;
    private start: Array<number>;
    private end: Array<number>;

    private q: Array<Array<number>>;

    constructor(grid){
        this.grid = grid;
        this.start = Array.from(this.grid.getStart());
        this.end = Array.from(this.grid.getEnd());
        this.q = [];

        this.parent = [];
        const [m, n] = this.grid.getGridSize();
        for(let i=0; i<m; i++){
            const row: Array<Array<number>> = [];
            for(let j=0; j<n; j++)
                row.push([]);
            this.parent.push(row);
        }

        this.run = this.run.bind(this);
        this.step = this.step.bind(this);
        this.findPath = this.findPath.bind(this);
    }

    run() : Array<Array<Array<number>>> {

        var res: Array<Array<Array<number>>> = [];
        var count = 0;

        this.grid.init();
        this.parentInit();
        this.start = Array.from(this.grid.getStart());
        this.end = Array.from(this.grid.getEnd());
        const x = this.start[0], y = this.start[1];

        this.q.push([x, y]);
        this.grid.setSquare(x, y, 0);
        while(this.q.length > 0){
            res.push(this.step(count));
            count += 1;
        }
        return res;
    }

    step(depth) : Array<Array<number>> {
        const [m, n] = this.grid.getGridSize();
        var _q = this.q.map(row => row.slice());
        var res = this.q.map(row => row.slice());
        this.q = [];
        while(_q.length > 0){
            const point = _q.pop();
            if(!point) continue;
            const [x, y] = point;
            if(x === this.end[0] && y === this.end[1]) {
                this.q = [];
                return res;
            }
            
            if (x + 1 < m && this.grid.getSquare(x + 1, y) === Constants.UNVISITED) {
                this.grid.setSquare(x + 1, y, depth + 1);
                this.parent[x + 1][y] = [x, y];
                this.q.push([x + 1, y]);
            }

            if (x - 1 >= 0 && this.grid.getSquare(x - 1, y) === Constants.UNVISITED) {
                this.grid.setSquare(x - 1, y, depth + 1);
                this.parent[x - 1][y] = [x, y];
                this.q.push([x - 1, y]);
            }

            if (y + 1 < n && this.grid.getSquare(x, y + 1) === Constants.UNVISITED) {
                this.grid.setSquare(x, y + 1, depth + 1);
                this.parent[x][y + 1] = [x, y];
                this.q.push([x, y + 1]);
            }

            if (y - 1 >= 0 && this.grid.getSquare(x, y - 1) === Constants.UNVISITED) {
                this.grid.setSquare(x, y - 1, depth + 1);
                this.parent[x][y - 1] = [x, y];
                this.q.push([x, y - 1]);
            }

        }
        return res;
    }

    findPath() : Array<Array<number>> {
        const res: Array<Array<number>> = [];
        var point = Array.from(this.end);
        while(point[0] !== -1){
            res.push(Array.from(point));
            const [x, y] = point;
            point = Array.from(this.parent[x][y]);
        }
        return res;
    }

    parentInit() {
        const [m, n] = this.grid.getGridSize();
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                this.parent[i][j] = [-1, -1];
    }

    /*
    setStart(start) {
        this.start = start;
    }

    setEnd(end) {
        this.end = end;
    }
    */

}


