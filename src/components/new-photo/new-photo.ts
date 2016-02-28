/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
/// <reference path="../../interfaces.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export /**
 * LogInController
 */
class NewPhotoController {
    private _timeout: any;
    private _mdDialog: any;
    
    private _imageService: IImageService;
    private _socketService: ISocketService;
    
    private _newPhoto: any;
    private _fileInput: any;
    // private _user: IUser;
    // private _userInput: IUser;
    // private _mode: string;
    // private _submitText: string;
    // private _userDataStore: any;
    // private _userActions: any;
    // private _listenerId: number;
    // private _errorMessage: string;
    // private _mdDialog: any;
    
    // public loginForm: any;
    
    constructor ($scope: any, $timeout: any, self: any, imageService: IImageService, socketService: ISocketService) {
        this._timeout = $timeout;
        this._mdDialog = self;
        
        this._imageService = imageService;
        this._socketService = socketService;
        
        this._newPhoto = {
            src: 'assets/png/noimage.png',
            title: '',
            text: '',
            error: ''
        }
        
        // listen for the user to select file
        $scope.$watch("assignments", () => {
            this._fileInput = document.querySelector('#newPhotoFile');
            this._fileInput.onchange = () => {
                var reader = new FileReader();
                reader.onload = () => {
                    // display preview
                    this._newPhoto.src = reader.result;
                    this._timeout(()=>{});
                };
                if (this._fileInput.files[0] && this._fileInput.files[0].type.match(/image/)) {
                    reader.readAsDataURL(this._fileInput.files[0]);
                }
            };
        });
    }
    
    public doSubmit (): void {
        if (this._fileInput.files[0] && this._fileInput.files[0].type.match(/image/)) {
            // selected file
                this._imageService.uploadPhoto(this._fileInput.files[0])
                .then( (filename) => {
                            // tell server what to do with the uploaded file
                            this._socketService.uploadPhoto(filename, this._newPhoto.title, this._newPhoto.text);
                            // hide dialog
                            this._mdDialog.hide();
                        }, () => { console.error('error');});
        } else {
            this._newPhoto.error = `Выберите изображение`;
        }      
    }
    
    public cancel () {
        this._mdDialog.hide();
    }

}