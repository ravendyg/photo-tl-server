/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices)
import {AbstractPhotoController} from './../abstract-photo-controller.ts';
 
export class AllPhotoController extends AbstractPhotoController {
    
    constructor($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService
                ) {
        super ($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService);
        this.resetImages();
console.log(`all photo`); 
    }
}