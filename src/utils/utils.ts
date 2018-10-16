export interface IUtils {
    getRandom: () => number;
}

export const Utils: IUtils = {
    getRandom() {
        return Math.random();
    }
}
