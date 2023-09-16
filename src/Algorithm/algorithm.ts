
export default interface algorithm {
    
    step(count);

    run();  // return process[], where process[i] is Array<point>

    findPath(visited_arr);

}
