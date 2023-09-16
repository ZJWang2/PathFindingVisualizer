
export default interface algorithm {
    
    step(depth);

    run();  // return process[], where process[i] is Array<point>

    findPath();

}
