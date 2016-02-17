interface IEventEmmiter {
    emit (event: any): void;
    addListener (listener: any): number;
    setToken (tokenName: string, listenerId: number);
    getTokens (): any;
    startHandling (tokenName: string): void;
    stopHandling (tokenName: string): void;
    waitFor (tokens: string [], promise: any, owner: string): any;
}