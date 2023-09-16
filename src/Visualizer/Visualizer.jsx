import React, {Component} from 'react';
import * as Constants from '../Settings/Constants.jsx';
import BFS from '../Algorithm/BFS.ts';
import DFS from '../Algorithm/DFS.ts';
import Grid from '../Grid/Grid.jsx';
import './Visualizer.css';

export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: Constants.SET_BLOCKS, 
            start: [0, 0],
            end: [Constants.size_m-1, Constants.size_n-1]
        };
        this.grid = new Grid(Constants.size_m, Constants.size_n, Array.from(this.state.start), Array.from(this.state.end));
        //this.algo;

        this.size_m = Constants.size_m;
        this.size_n = Constants.size_n;        
        this.isDragging = false;
        this.unvisitedColor = "";
        this.lastColor = Constants.startColor;
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.clearVisited = this.clearVisited.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.runAlgo = this.runAlgo.bind(this);
    }

    render() {
        return (
            <div>
                <div>Path Finding Visualizer by ZJ</div>
                <button onClick={()=>{this.algo=new BFS(this.grid); this.runAlgo();}}>BFS</button>
                <button onClick={()=>{this.algo=new DFS(this.grid); this.runAlgo();}}>DFS</button>
                <button onClick={this.clearAll}>Clear All</button>
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
                <table id="grid">
                    {this.genTable()}
                </table>
                <table style={{margin: 20 + 'px'}}>
                    <td id="legend"></td>
                </table>
            </div>
        );
    }

    componentDidMount() {
        const legend = document.getElementById("legend");
        const color = window.getComputedStyle(legend).backgroundColor;
        this.unvisitedColor = color;
        this.lastColor = color;
        this.grid.displaySquare(this.state.start[0], this.state.start[1], Constants.startColor);
        this.grid.displaySquare(this.state.end[0], this.state.end[1], Constants.endColor);
    }

    //componentDidUpdate() {}

    genTable() {
        const m = this.size_m;
        const n = this.size_n;
        const table = [];

        for(let i=0; i<m; i++){
            const row = [];
            for(let j=0; j<n; j++)
                row.push(
                    <td
                    id = {`r${i}c${j}`}
                    ref = {this.grid.refs[i][j]}
                    onMouseDown = {this.handleMouseDown}
                    onMouseUp = {this.handleMouseUp}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    ></td>
                );
            table.push(<tr>{row}</tr>);
        }
        return table;
    }

    handleMouseDown(event) {
        event.preventDefault();
        this.isDragging = true;
        const id = event.target.id;
        const [x, y] = this.IDtoCoord(id);
        if(this.state.mode === Constants.SET_BLOCKS){
            if(x === this.state.start[0] && y === this.state.start[1]) return ;
            if(x === this.state.end[0] && y === this.state.end[1]) return ;
            this.grid.displaySquare(x, y, Constants.blockColor);
            this.grid.setSquare(x, y, Constants.BLOCK);
        }
        else if(this.state.mode === Constants.REMOVE_BLOCKS){
            if(x === this.state.start[0] && y === this.state.start[1]) return ;
            if(x === this.state.end[0] && y === this.state.end[1]) return ;
            this.grid.displaySquare(x, y, this.unvisitedColor);
            this.grid.setSquare(x, y, Constants.UNVISITED);
        }
        else if(this.state.mode === Constants.SET_START && (x !== this.state.end[0] || y !== this.state.end[1])){
            this.grid.displaySquare(this.state.start[0], this.state.start[1], this.unvisitedColor);
            this.grid.displaySquare(x, y, Constants.startColor);
            this.setState({start: [x, y]});
            this.grid.setStart([x, y]);
        }
        else if(this.state.mode === Constants.SET_END && (x !== this.state.start[0] || y !== this.state.start[1])){
            this.grid.displaySquare(this.state.end[0], this.state.end[1], this.unvisitedColor);
            this.grid.displaySquare(x, y, Constants.endColor);
            this.setState({end: [x, y]});
            this.grid.setEnd([x, y]);
        }
    }

    handleMouseUp(event) {
        event.preventDefault();
        this.isDragging = false;
        const id = event.target.id;
        const [x, y] = this.IDtoCoord(id);
        if(this.state.mode === Constants.SET_BLOCKS){
            if(x === this.state.start[0] && y === this.state.start[1]) return ;
            if(x === this.state.end[0] && y === this.state.end[1]) return ;
            this.grid.setSquare(x, y, Constants.BLOCK);
        }
        else if(this.state.mode === Constants.REMOVE_BLOCKS){
            if(x === this.state.start[0] && y === this.state.start[1]) return ;
            if(x === this.state.end[0] && y === this.state.end[1]) return ;
            this.grid.setSquare(x, y, Constants.UNVISITED);
        }
        else if(this.state.mode === Constants.SET_START){
            if(x === this.state.end[0] && y === this.state.end[1]) return ;
        }
        else if(this.state.mode === Constants.SET_END){
            if(x === this.state.start[0] && y === this.state.start[1]) return ;
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
            if(x === this.state.start[0] && y === this.state.start[1])
                this.grid.displaySquare(x, y, this.lastColor);
            else if(x === this.state.end[0] && y === this.state.end[1])
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

    clearVisited() {
        const m = this.size_m, n = this.size_n;
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                if(this.grid.getSquare(i, j) !== Constants.BLOCK)
                    this.grid.displaySquare(i, j, this.unvisitedColor);
        this.grid.displaySquare(this.state.start[0], this.state.start[1], Constants.startColor);
        this.grid.displaySquare(this.state.end[0], this.state.end[1], Constants.endColor);
    }

    clearAll() {
        const m = this.size_m, n = this.size_n;
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++){
                this.grid.displaySquare(i, j, this.unvisitedColor);
                this.grid.setSquare(i, j, Constants.UNVISITED);
            }
        this.grid.displaySquare(this.state.start[0], this.state.start[1], Constants.startColor);
        this.grid.displaySquare(this.state.end[0], this.state.end[1], Constants.endColor);
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
                        this.grid.displaySquare(this.state.end[0], this.state.end[1], Constants.endColor);
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
                        if(x === this.state.end[0] && y === this.state.end[1]) continue;
                        this.grid.displayBorder(x, y, Constants.addBorder);
                        this.grid.displaySquare(x, y, Constants.visitedColor);
                    }
                    if(i >= chunk) {
                        arr_last = res.slice(i - chunk, i);
                        for(let j=0; j<arr_last.length; j++){
                            const [x, y] = arr_last[j];
                            if(x === this.state.end[0] && y === this.state.end[1]) continue;
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

    IDtoCoord(id) {
        const regex = /r(\d+)c(\d+)/;
        const match = id.match(regex);
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }

}


