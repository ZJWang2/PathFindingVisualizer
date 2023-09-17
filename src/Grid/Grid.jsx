
import * as Constants from '../Settings/Constants.jsx';
import React from 'react';

export default class Grid {
    constructor(m, n, start, end){
        const grid = new Array(m);
        const refs = new Array(m);
        for(let i=0; i<m; i++){
            grid[i] = new Array(n);//.fill(Constants.UNVISITED);
            refs[i] = new Array(n);
            for(let j=0; j<n; j++){
                grid[i][j] = Constants.UNVISITED;
                refs[i][j] = React.createRef();
            }
        }
        
        this.start = start;
        this.end = end;
        this.grid = grid;
        this.refs = refs;
        
    }

    init() {
        const m = this.grid.length, n = this.grid[0].length;
        for(let i=0; i<m; i++)
            for(let j=0; j<n; j++)
                if(this.grid[i][j] !== Constants.BLOCK)
                    this.grid[i][j] = -1;
    }

    displaySquare(x, y, color) {
        this.refs[x][y].style.backgroundColor = color;
    }

    displayText(x, y, text) {
        this.refs[x][y].innerText = String(text);
        //this.refs[x][y].textContent = String(text);
    }

    displayBorder(x, y, border) {
        this.refs[x][y].style.border = border;
    }

    setSquare(x, y, val) {
        this.grid[x][y] = val;
    }

    getSquare(x, y) {
        return this.grid[x][y];
    }

    setStart(start) {
        this.start = start;
    }

    getStart() {
        return this.start;
    }

    setEnd(end) {
        this.end = end;
    }

    getEnd() {
        return this.end;
    }

    getGridSize() {
        return [this.grid.length, this.grid[0].length];
    }

    genMaze() {
        // to genetate a random maze
    }

    /*
    displayVisited(x, y, color = Constants.visitedColor) {
        this.refs[x][y].current.style.backgroundColor = color;
    }

    setVisited(x, y, visVal) {
        this.grid[x][y] = visVal;
    }

    displayBlock(x, y, color = Constants.blockColor) {
        this.refs[x][y].current.style.backgroundColor = color;
    }

    setBlock(x, y) {
        this.grid[x][y] = Constants.BLOCK;
    }

    removeBlock(x, y, color) {
        this.grid[x][y] = Constants.UNVISITED;
        this.refs[x][y].current.style.backgroundColor = color;
    }

    displayPath(x, y, color = Constants.pathColor){
        this.refs[x][y].current.style.backgroundColor = color;
    }

    setPath(x, y) {
        this.grid[x][y] = Constants.PATH;
    }

    displayStart(x, y, color = Constants.startColor){
        this.refs[x][y].current.style.backgroundColor = color;
    }

    displayEnd(x, y, color = Constants.endColor){
        this.refs[x][y].current.style.backgroundColor = color;
    }
    */

    

}
