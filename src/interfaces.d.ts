interface IEventEmmiter {
    emit (event: any): void;
    addListener (listener: any): number;
    removeListener (listenerId: number): void;
    setToken (tokenName: string, listenerId: number);
    getTokens (): any;
    startHandling (tokenName: string): void;
    stopHandling (tokenName: string): void;
    waitFor (tokens: string [], promise: any, owner: string): any;
}

interface IUser {
    name: string,
    pas?: string,
    pas2?: string,
    rem?: boolean,
    error?: string
}