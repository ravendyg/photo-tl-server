/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export /**
 * LogInController
 */
class LogInController {
    private _user: IUser;
    private _mode: string;
    private _submitText: string;
    private _userDataStore: any;
    private _userActions: any;
    private _listenerId: number;
    
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
        if (this._user.error) {
            window.alert(this._user.error);
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
        if (this._verifyInput()) {
            // proceed
            if (this._submitText === 'Войти') {
                // send login request
                this._userActions.signin();
            } else {
                //send signup request
                this._userActions.signup({
                    name: this._user.name,
                    pas: this._user.pas,
                    rem: this._user.rem
                });
            }    
        }        
    }
    
    private _verifyInput (): boolean {  
        return true;
    }

}