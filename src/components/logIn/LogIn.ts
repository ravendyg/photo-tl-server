/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
/// <reference path="../../interfaces.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export /**
 * LogInController
 */
class LogInController {
    private _user: IUser;
    private _userInput: IUser;
    private _mode: string;
    private _submitText: string;
    private _userDataStore: any;
    private _userActions: any;
    private _listenerId: number;
    private _errorMessage: string;
    
    // public loginForm: any;
    
    constructor ($scope: any, $mdDialog: any, mode: string,
                userDataStore: any, userActions: any) {
        // set up vars
        this._userDataStore = userDataStore;
        this._userActions = userActions;
        
        // set up view
        if (mode === 'in') {
            this._submitText = 'Войти';
        } else {
            this._submitText = 'Зарегистрироваться';
        }       
        
        this._resetUser();
        
        // register with the dispatcher
        this._listenerId = userDataStore.addListener( (q) => this._resetUser() );
        
        // unregister
        $scope.$on('$destroy', () => {
            userDataStore.removeListener(this._listenerId);
        });
    }
    
    private _resetUser () {
        this._user = this._userDataStore.getLoggedInUser();
        this._userInput = {name: '', pas: '', pas2: '', rem: false, error: ''};
        if (this._user.error) {
            // report an error, but only once
            window.alert(this._user.error);
            this._user.error = '';
        }
    }
    
    public getUser (): IUser {
        return this._user;
    }
    
    public getSubmitText (): string {
        return this._submitText;
    }
    
    public doSubmit (): void {
        // check input for correctness
        if (this._userInput.name.match(/[^0-1a-zA-Z\s]/)) {
            this._userInput.error = 'Имя пользователя содержит недопустимые символы';
            return;
        }
        if (this._userInput.name.match(/^\s*$/)) {
            this._userInput.error = 'Имя пользователя не может быть пустым';
            return;
        }
        if (this._verifyInput()) {
            // proceed
            if (this._submitText === 'Войти') {
                // send login request
                this._userActions.signin();
            } else {
                //send signup request
                if (this._userInput.pas !== this._userInput.pas2) {
                    this._userInput.error = 'Пароли не совпадают';
                    return;
                }
                if (this._userInput.pas.match(/^\s*$/)) {
                    this._userInput.error = 'Пароль не может быть пустым';
                    return;
                }
                this._userActions.signup({
                    name: this._userInput.name,
                    pas: this._userInput.pas,
                    pas2: this._userInput.pas2,
                    rem: this._userInput.rem
                });
            }    
        }        
    }
    
    private _verifyInput (): boolean {  
        return true;
    }

}