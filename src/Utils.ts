/// <reference path="../typings/tsd.d.ts" />

/**
 * Utils
 */
class Utils implements IUtils {
    constructor() {
        
    }
    
    public transformDate (num: number): string {
        return ''+num;
    }
    
    public sortNumericArray (arr: number [], order: number): number [] {
        if (Math.abs(order) !== 1) { order = 1};
        return arr.sort( (elem1, elem2) => {
                if (elem1 < elem2) return -order;
                if (elem1 > elem2) return order;
                return 0; 
            });
    }
}

export = new Utils();