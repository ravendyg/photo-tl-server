interface IEventEmmiter {
    emit (event: any): void;
    addListener (listener: any): number; 
}