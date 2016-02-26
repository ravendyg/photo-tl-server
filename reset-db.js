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
                averageRating: {val: 3.3, count: 3},
                rating: [
                    {user: 'vasya', val: 5},
                    {user: 'q', val: 1},
                    {user: 'w', val: 4}
                ],
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
                averageRating: {val: 4.6, count: 3},
                rating: [
                    {user: 'vasya', val: 5},
                    {user: 'q', val: 5},
                    {user: 'w', val: 4}
                ],
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
                averageRating: {val: 3.0, count: 2},
                rating: [
                    {user: 'vasya', val: 3},
                    {user: 'q', val: 3}
                ],
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