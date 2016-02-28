/// <reference path="../../../typings/tsd.d.ts" />

export /**
 * LogInController
 */
class LogInController {
    private _user: IUser;
    private _userInput: IUser;
    private _mode: string;
    private _submitText: string;
    private _userDataStore: any;
    private _userActions: IUserActions;
    private _errorMessage: string;
    private _mdDialog: any;
    
    // public loginForm: any;
    
    constructor ($scope: any, $mdDialog: any, mode: string,
                userDataStore: any, userActions: IUserActions) {
        // set up vars
        this._userDataStore = userDataStore;
        this._userActions = userActions;
        this._mdDialog = $mdDialog;
        
        // set up view
        if (mode === 'in') {
            this._submitText = 'Войти';
        } else {
            this._submitText = 'Зарегистрироваться';
        }       
        
        // register with the emmiter
        var self = this;
        function _resetUser () {self._resetUser(self);} // bind to this
        userDataStore.addListener(_resetUser);
        
        // unregister
        $scope.$on('$destroy', () => {
            userDataStore.removeListener(_resetUser);
        });
        
        // load initial state
        this._resetUser(this);
    }
    
    private _resetUser (self) {
        self._user = self._userDataStore.getLoggedInUser();
        if (self._user.name && !self._user.error) {
            self._mdDialog.hide();
        }
        self._userInput = {name: '', pas: '', pas2: '', rem: false, error: self._user.error};
        self._user.error = '';
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
        if (this._userInput.pas.match(/^\s*$/)) {
            this._userInput.error = 'Пароль не может быть пустым';
            return;
        }
        if (this._verifyInput()) {
            // proceed
            if (this._submitText === 'Войти') {
                // send login request
                this._userActions.signin({
                    name: this._userInput.name,
                    pas: this._userInput.pas,
                    rem: this._userInput.rem
                });
            } else {
                //send signup request
                if (this._userInput.pas !== this._userInput.pas2) {
                    this._userInput.error = 'Пароли не совпадают';
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
        this._mdDialog.hide();
    }
    
    private _verifyInput (): boolean {  
        return true;
    }

}