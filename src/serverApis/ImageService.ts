/// <reference path="./../interfaces.d.ts" />
import {config} from './../config.ts';

export class ImageService implements IImageService {
    private _http: any;
    private _q: any;
    private _timeout: any;
    private _loggedInUser: any;
    
    constructor ($http, $q, $timeout) {
        this._http = $http;
        this._q = $q;
        this._timeout = $timeout;
    }
    
    public getImageData () {
        // real call to the server
        // return this._http({
        //     method: 'GET',
        //     url: '/'
        // });
        
        // mock data
        var deferred = this._q.defer();
        
        this._timeout( function () {
            deferred.resolve([{
                id: 1,
                src: 'image1.jpg',
                title: 'Image 1',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploadedBy: 'vasya',
                uploadedNum: 1455962397158,
                changedBy: 'masha',
                changedNum: 1455962517158,
                rating: 2.3,
                myRating: 3,
                views: 10,
                comments: [{
                    userName: 'vasya',
                    text: 'bla-bla-bla'
                },{
                    userName: 'petya',
                    text: 'bla-bla-bla-bla'
                }]
            },{
                id: 2,
                src: 'image2.jpg',
                title: 'Image 2',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploadedBy: 'petya',
                uploadedNum: 1455962399158,
                // changedNum: 1455963517158,
                rating: 4.3,
                myRating: 5,
                views: 100,
                comments: [{
                    userName: 'vasya',
                    text: 'bla-bla'
                },{
                    userName: 'petya',
                    text: 'bla-bla-bla-bla-bla'
                }]
            },{
                id: 3,
                src: 'image3.jpg',
                title: 'Image 3',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploadedBy: 'q',
                uploadedNum: 1455962099158,
                changedBy: 'q',
                changedNum: 1455963518158,
                rating: 4.9,
                myRating: 5,
                views: 23,
                comments: [{
                    userName: 'vasya',
                    text: 'bla-bla'
                },{
                    userName: 'petya',
                    text: 'bla-bla-bla-bla-bla'
                }]
            }]);
            }, 1000);
        
        return deferred.promise;
    }
    
    // sends a request to the server to delete specified image1// to be implemented
    public deleteImage (id: number): void {
console.log('server delete image');
        // this._http({
        //     method: 'DELETE',
        //     url: ''
        // })
    }
}