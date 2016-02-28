/// <reference path="../../../typings/tsd.d.ts" />

import {AbstractPhotoController} from './../abstract-photo-controller.ts';
 
export class AllPhotoController extends AbstractPhotoController {
    
    private _mdDialog: any;
    private _mdMedia: any;
    
    constructor($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageService, socketService, userDataStore) {

        super ($scope, $state, imageStore, imageService, socketService, userDataStore);
 console.log(`all photo`);
           
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        
        this._resetImages(this);
        
        console.log(this._userName);
    }
    
    // show add photo form
    public startAddingPhoto ($event: any) {
        var useFullScreen = (this._mdMedia('sm') || this._mdMedia('xs'))  && this._scope.customFullscreen;
        this._mdDialog.show({
            controller: 'NewPhotoController as nPhCtrl',
            templateUrl: 'components/new-photo/new-photo.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            locals: {
                self: this._mdDialog
            }
        });
            
        this._scope.$watch( () => {
            return this._mdMedia('xs') || this._mdMedia('sm');
        }, (wantsFullScreen) => {
            this._scope.customFullscreen = (wantsFullScreen === true);
        });
    }
}