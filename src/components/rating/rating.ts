/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
/// <reference path="../../interfaces.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export /**
 * LogInController
 */
class RatingController {
    private _rating: number;
    private _ratingRender: any [];
    
    private _scope: any;
    
    constructor ($scope) {
        this._scope = $scope;
        this._rating = parseFloat($scope.rating);
        this._ratingRender = []

        for (var i=1; i<=5; i++) {
            if ( i <= Math.floor(this._rating) ) {
                this._ratingRender.push({i, val:``});       
            } else {
                if (i === Math.ceil(this._rating)) {
                    this._ratingRender.push({i, val:`-half-o`});  
                } else {
                    this._ratingRender.push({i, val:`-o`});
                }  
            }
        }
    }
    
    public show () {
        console.log(this._scope);
        console.log(this._ratingRender);
    }
}