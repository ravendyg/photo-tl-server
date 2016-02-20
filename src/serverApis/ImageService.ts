import {config} from './../config.ts';

export class ImageService {
    private _http: any;
    private _q: any;
    private _loggedInUser: any;
    
    constructor ($http, $q) {
        this._http = $http;
        this._q = $q;
    }
    
    public getImageData () {
        // real call to the server
        // return this._http({
        //     method: 'GET',
        //     url: '/'
        // });
        
        // mock data
        var deferred = this._q.defer();
        
        setTimeout( function () {
            deferred.resolve([{
                src: '/user-data/images/image1.jpg',
                title: 'Image 1',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploaded: 1455962397158,
                changed: 1455962517158,
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
                src: '/user-data/images/image2.jpg',
                title: 'Image 2',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploaded: 1455962399158,
                changed: 1455963517158,
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
            }]);
            }, 1000);
        
        return deferred.promise;
    } 
}