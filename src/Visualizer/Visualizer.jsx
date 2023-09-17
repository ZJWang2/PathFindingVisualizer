import React, {Component, createRoot} from 'react';
//import ReactDOM from 'react-dom';
import * as Constants from '../Settings/Constants.jsx';
import BFS from '../Algorithm/BFS.ts';
import DFS from '../Algorithm/DFS.ts';
import MazeGenerator from '../Algorithm/MazeGenerator.jsx'
import Grid from '../Grid/Grid.jsx';
import './Visualizer.css';

export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: Constants.SET_BLOCKS, 
            //start: [0, 0],
            //end: [19, 19],
            _size_m: '15',
            _size_n: '15',
            change: 1
        };
        
        //this.algo;
        
        this.size_m = 15;
        this.size_n = 15;
        this.start = [0, 0];
        this.end = [14, 14];
        this.isDragging = false;
        this.unvisitedColor = "";
        this.lastColor = Constants.startColor;

        this.grid = new Grid(15, 15, Array.from(this.start), Array.from(this.end));
        this.maze = new MazeGenerator(8, 8, this.grid);
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this._setSize = this._setSize.bind(this);
        this.setSize = this.setSize.bind(this);
        this.clearVisited = this.clearVisited.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.runAlgo = this.runAlgo.bind(this);
        this.genMaze = this.genMaze.bind(this);
    }

    render() {
        console.log("Render");
        return (
            <div>
                <h1>Path Finding Visualizer by ZJ</h1>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <button onClick={()=>{this.algo=new BFS(this.grid); this.runAlgo();}}>BFS</button>
                    <button onClick={()=>{this.algo=new DFS(this.grid); this.runAlgo();}}>DFS</button>
                    <button onClick={this.clearAll}>Clear All</button>
                    <button onClick={this.genMaze}>Gen A Maze</button>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label htmlFor='setHeight'>Set Height:  </label>
                            <input type='text' id='setHeight' value={this.state._size_m} onChange={this._setSize}></input>
                        </div>
                        <div>
                            <label htmlFor='setWidth'>Set Width:  </label>
                            <input type='text' id='setWidth' value={this.state._size_n} onChange={this._setSize}></input>
                        </div>
                    </div>
                    <button onClick={this.setSize}>Set Size</button>
                </div>
                
                <div>
                    <input type='radio' id='setBlocks' name='mode' value={Constants.SET_BLOCKS} onChange={this.changeMode} checked={this.state.mode === Constants.SET_BLOCKS}></input>
                    <label htmlFor="setBlocks">Set Blocks</label>
                    <input type='radio' id='removeBlocks' name='mode' value={Constants.REMOVE_BLOCKS} onChange={this.changeMode} checked={this.state.mode === Constants.REMOVE_BLOCKS}></input>
                    <label htmlFor='removeBlocks'>Remove Blocks</label>
                    <input type='radio' id='setStart' name='mode' value={Constants.SET_START} onChange={this.changeMode} checked={this.state.mode === Constants.SET_START}></input>
                    <label htmlFor='setStart'>Set Start</label>
                    <input type='radio' id='setEnd' name='mode' value={Constants.SET_END} onChange={this.changeMode} checked={this.state.mode === Constants.SET_END}></input>
                    <label htmlFor='setEnd'>Set End</label>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <div style={{display: 'flex', flexDirection: 'column', width: 250 + 'px'}}>
                        <span style={{fontSize: 18}}>Only positive odd numbers will be accepted as width and height!</span>
                        <span style={{fontSize: 18, fontWeight: 800}}>MAX height and weight: 51</span>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <table><tr><td id="unvisited" ></td></tr></table>
                            <span>Unvisited</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <table><tr><td id="visited" style={{backgroundColor: Constants.visitedColor}}></td></tr></table>
                            <span>Visited</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <table><tr><td id="start" style={{backgroundColor: Constants.startColor}}></td></tr></table>
                            <span>Start</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <table><tr><td id="end" style={{backgroundColor: Constants.endColor}}></td></tr></table>
                            <span>End</span>
                        </div>
                    </div>
                    <table id="grid" style={{marginLeft: 'auto', marginRight: 'auto'}}></table>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const grid = document.getElementById("grid");
        const table = this.genTable(); 
        while(grid.firstChild) grid.removeChild(grid.firstChild);
        for(const row of table)
            grid.appendChild(row);
        const legend = document.getElementById("unvisited");
        const color = window.getComputedStyle(legend).backgroundColor;
        this.unvisitedColor = color;
        this.lastColor = color;
        
        this.grid.displaySquare(this.start[0], this.start[1], Constants.startColor);
        this.grid.displaySquare(this.end[0], this.end[1], Constants.endColor);
        
    }

    componentDidUpdate() {}

    genTable() {
        const m = this.size_m;
        const n = this.size_n;
        const table = [];

        for(let i=0; i<m; i++){
            const row = document.createElement('tr');
            for(let j=0; j<n; j++){
                const cell = document.createElement('td');
                cell.id = `r${i}c${j}`;
                cell.onmousedown = this.handleMouseDown;
                cell.onmouseup = this.handleMouseUp;
                cell.onmouseenter = this.handleMouseEnter;
                cell.onmouseleave = this.handleMouseLeave;
                this.grid.refs[i][j] = cell;
                row.appendChild(cell);
            }
            table.push(row);
        }
        return table;
    }

    handleMouseDown(event) {
        event.preventDefault();
        this.isDragging = true;
        const id = event.target.id;
        const [x, y] = this.IDtoCoord(id);
        if(this.state.mode === Constants.SET_BLOCKS){
            if(x === this.start[0] && y === this.start[1]) return ;
            if(x === this.end[0] && y === this.end[1]) return ;
            this.grid.displaySquare(x, y, Constants.blockColor);
            this.grid.setSquare(x, y, Constants.BLOCK);
        }
        else if(this.state.mode === Constants.REMOVE_BLOCKS){
            if(x === this.start[0] && y === this.start[1]) return ;
            if(x === this.end[0] && y === this.end[1]) return ;
            this.grid.displaySquare(x, y, this.unvisitedColor);
            this.grid.setSquare(x, y, Constants.UNVISITED);
        }
        else if(this.state.mode === Constants.SET_START && (x !== this.end[0] || y !== this.end[1])){
            this.grid.displaySquare(this.start[0], this.start[1], this.unvisitedColor);
            this.grid.displaySquare(x, y, Constants.startColor);
            this.grid.setSquare(x, y, Constants.UNVISITED);
            //this.setState({start: [x, y]});
            this.start = [x, y];
            this.grid.setStart([x, y]);
        }
        else if(this.state.mode === Constants.SET_END && (x !== this.start[0] || y !== this.start[1])){
            this.grid.displaySquare(this.end[0], this.end[1], this.unvisitedColor);
            this.grid.displaySquare(x, y, Constants.endColor);
            this.grid.setSquare(x, y, Constants.UNVISITED);
            //this.setState({end: [x, y]});
            this.end = [x, y];
            this.grid.setEnd([x, y]);
        }
    }

    handleMouseUp(event) {
        event.preventDefault();
        this.isDragging = false;
        const id = event.target.id;
        const [x, y] = this.IDtoCoord(id);
        if(this.state.mode === Constants.SET_BLOCKS){
            if(x === this.start[0] && y === this.start[1]) return ;
            if(x === this.end[0] && y === this.end[1]) return ;
            this.grid.setSquare(x, y, Constants.BLOCK);
        }
        else if(this.state.mode === Constants.REMOVE_BLOCKS){
            if(x === this.start[0] && y === this.start[1]) return ;
            if(x === this.end[0] && y === this.end[1]) return ;
            this.grid.setSquare(x, y, Constants.UNVISITED);
        }
        else if(this.state.mode === Constants.SET_START){
            if(x === this.end[0] && y === this.end[1]) return ;
        }
        else if(this.state.mode === Constants.SET_END){
            if(x === this.start[0] && y === this.start[1]) return ;
        }
        this.lastColor = event.target.style.backgroundColor;
    }

    handleMouseEnter(event) {
        event.preventDefault();
        const id = event.target.id;
        const [x, y] = this.IDtoCoord(id);
        this.lastColor = event.target.style.backgroundColor;
        if(this.state.mode === Constants.SET_BLOCKS)
            this.grid.displaySquare(x, y, Constants.blockColor);
        else if(this.state.mode === Constants.REMOVE_BLOCKS)
            this.grid.displaySquare(x, y, this.unvisitedColor);
        else if(!this.isDragging && this.state.mode === Constants.SET_START)
            this.grid.displaySquare(x, y, Constants.startColor);
        else if(!this.isDragging && this.state.mode === Constants.SET_END)
            this.grid.displaySquare(x, y, Constants.endColor);
    }

    handleMouseLeave(event) {
        event.preventDefault();
        const id = event.target.id;
        const [x, y] = this.IDtoCoord(id);
        if(! this.isDragging) {
            this.grid.displaySquare(x, y, this.lastColor);
        }
        else if(this.isDragging){
            if(x === this.start[0] && y === this.start[1])
                this.grid.displaySquare(x, y, this.lastColor);
            else if(x === this.end[0] && y === this.end[1])
                this.grid.displaySquare(x, y, this.lastColor);
            else{
                if(this.state.mode === Constants.SET_BLOCKS)
                    this.grid.setSquare(x, y, Constants.BLOCK);
                else if(this.state.mode === Constants.REMOVE_BLOCKS)
                    this.grid.setSquare(x, y, Constants.UNVISITED);
            }
        }
    }

    changeMode(event) {
        const mode = parseInt(event.target.value, 10);
        this.setState({mode: mode});
    }

    _setSize() {
        this.setState({_size_m: document.getElementById("setHeight").value, _size_n: document.getElementById("setWidth").value});
    }

    setSize() {
        const m = parseInt(this.state._size_m);
        const n = parseInt(this.state._size_n);
        if(isNaN(m) || m <= 2 || m%2 === 0 || m > Constants.MAX_HEIGHT){
            document.getElementById("setHeight").classList.add("error");
            console.log("Error on height");
            return ;
        }
        else{
            document.getElementById("setHeight").classList.remove("error");
        }
        if(isNaN(n) || n <= 2 || n%2 === 0 || n > Constants.MAX_WIDTH){
            document.getElementById("setWidth").classList.add("error");
            console.log("Error on width");
            return ;
        }
        else{
            document.getElementById("setWidth").classList.remove("error");
        }
        this.size_m = m;
        this.size_n = n;
        this.start = [0, 0];
        this.end = [this.size_m - 1, this.size_n - 1];
        this.grid = new Grid(m, n, Array.from(this.start), Array.from(this.end));
        this.maze = new MazeGenerator(1 + parseInt(m/2), 1 + parseInt(n/2), this.grid);
        
        const grid = document.getElementById("grid");
        const table = this.genTable();
        while(grid.firstChild) grid.removeChild(grid.firstChild);
        for(const row of table)
            grid.appendChild(row);
        this.grid.displaySquare(this.start[0], this.start[1], Constants.startColor);
        this.grid.displaySquare(this.end[0], this.end[1], Constants.endColor);
    }

    clearVisited() {
        const m = this.size_m, n = this.size_n;
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                if(this.grid.getSquare(i, j) !== Constants.BLOCK)
                    this.grid.displaySquare(i, j, this.unvisitedColor);
        this.grid.displaySquare(this.start[0], this.start[1], Constants.startColor);
        this.grid.displaySquare(this.end[0], this.end[1], Constants.endColor);
    }

    clearAll() {
        const m = this.size_m, n = this.size_n;
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++){
                this.grid.displaySquare(i, j, this.unvisitedColor);
                this.grid.setSquare(i, j, Constants.UNVISITED);
            }
        this.grid.displaySquare(this.start[0], this.start[1], Constants.startColor);
        this.grid.displaySquare(this.end[0], this.end[1], Constants.endColor);
    }

    runAlgo() {
        const res = this.algo.run(); //console.log(this.grid.grid);
        var duration;
        this.clearVisited();
        if(this.algo instanceof BFS){
            duration = res.length * Constants.BFS_SPEED;
            for(let i=1; i<=res.length; i++){
                setTimeout(() => {
                    for(let j=0; i<res.length && j<res[i].length; j++){
                        const [x, y] = res[i][j];
                        this.grid.displayBorder(x, y, Constants.addBorder);
                        this.grid.displaySquare(x, y, Constants.visitedColor);
                    }
                    for(let j=0; j<res[i-1].length; j++){
                        const [x, y] = res[i-1][j];
                        this.grid.displayBorder(x, y, Constants.removeBorder);
                    }
                    if(i == res.length-1)
                        this.grid.displaySquare(this.end[0], this.end[1], Constants.endColor);
                }, i * Constants.BFS_SPEED);
            }
        }
        else if(this.algo instanceof DFS){
            const chunk = 40;
            duration = parseInt((res.length+chunk)/chunk) * Constants.DFS_SPEED;
            for(let i=0; i<res.length+chunk; i+=chunk){
                setTimeout(() => {
                    var arr, arr_last;
                    arr = res.slice(i, i + chunk);
                    for(let j=0; j<arr.length; j++){
                        const [x, y] = arr[j];
                        if(x === this.end[0] && y === this.end[1]) continue;
                        this.grid.displayBorder(x, y, Constants.addBorder);
                        this.grid.displaySquare(x, y, Constants.visitedColor);
                    }
                    if(i >= chunk) {
                        arr_last = res.slice(i - chunk, i);
                        for(let j=0; j<arr_last.length; j++){
                            const [x, y] = arr_last[j];
                            if(x === this.end[0] && y === this.end[1]) continue;
                            this.grid.displayBorder(x, y, Constants.removeBorder);
                        }
                    }

                }, parseInt(i/chunk) * Constants.DFS_SPEED);
            }
        }
        
        const path = this.algo.findPath();
        for(let i=1; i<path.length-1; i++){
            setTimeout(() => {
                const [x, y] = path[i];
                this.grid.displaySquare(x, y, Constants.pathColor);
            }, duration + i * Constants.PATH_SPEED);
        }
        
    }

    genMaze() {
        
        this.maze.gen();
        
        const m = this.size_m;
        const n = this.size_n;
        this.grid.setSquare(this.start[0], this.start[1], Constants.UNVISITED);
        this.grid.setSquare(this.end[0], this.end[0], Constants.UNVISITED);
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                if(this.grid.getSquare(i, j) === Constants.UNVISITED)
                    this.grid.displaySquare(i, j, this.unvisitedColor);
                else 
                    this.grid.displaySquare(i, j, Constants.blockColor);
        this.grid.displaySquare(this.start[0], this.start[1], Constants.startColor);
        this.grid.displaySquare(this.end[0], this.end[1], Constants.endColor);
        //console.log(this.grid.grid);
    }

    IDtoCoord(id) {
        const regex = /r(\d+)c(\d+)/;
        const match = id.match(regex);
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }

}


