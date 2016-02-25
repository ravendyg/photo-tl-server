var MongoClient = require('mongodb').MongoClient;
// connect to db
MongoClient.connect('mongodb://localhost:27017/photo', function (err, db) { 
    // test data
    db.collection('photos').remove({}, function (err, docs) {
        console.log('removed');
        db.collection('photos').insert([{
                src: 'image1.jpg',
                title: 'Image 1',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploadedBy: 'vasya',
                uploaded: new Date(1455962397158),
                changedBy: 'masha',
                changed: new Date(1455962517158),
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
                src: 'image2.jpg',
                title: 'Image 2',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploadedBy: 'petya',
                uploaded: new Date(1455962399158),
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
                src: 'image3.jpg',
                title: 'Image 3',
                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережи',
                uploadedBy: 'q',
                uploaded: new Date(1455962099158),
                changedBy: 'q',
                changed: new Date(1455963518158),
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
            }], function (err, docs) {
                console.log('inserted');
                
                process.exit(0);
            });       
    });
});