/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/others.d.ts" />
// from the new app
(function(){
'use strict';
angular.module('photoAlbum')
     .service('userService', [UserService]);    

// Users DataService

function UserService(){
    var self = this;
    
    var user = null;

  return {
    loggedInUser: user
  }
}
})();



(function () {
'use strict';

class EventEmmiter {
    private _listeners;
    
    constructor () {
        this._listeners = [];
    }
    
    public emit (event) {
        for (var i=0; i<this._listeners.length; i++) {
            this._listeners[i](event);    
        }
    }
    
    public addListener (listener) {
        this._listeners.push(listener);
        return this._listeners.length - 1;
    }
}

angular.module( 'photoAlbum')
    .service('dispatcher', EventEmmiter);

// stores
class UserStore extends EventEmmiter {
    private _users;
    private _selectedUser;
    
    constructor () {
        super();
        this._users = [
                    {
                        id: 0,
                        name: 'Lia Lugo',
                        avatar: 'svg-1',
                        content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
                    },
                    {
                        id: 1,
                        name: 'George Duke',
                        avatar: 'svg-2',
                        content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
                    },
                    {
                        id: 2,
                        name: 'Gener Delosreyes',
                        avatar: 'svg-3',
                        content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumberhungry Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
                    },
                    {
                        id: 3,
                        name: 'Lawrence Ray',
                        avatar: 'svg-4',
                        content: 'Scratch the furniture spit up on light gray carpet instead of adjacent linoleum so eat a plant, kill a hand pelt around the house and up and down stairs chasing phantoms run in circles, or claw drapes. Always hungry pelt around the house and up and down stairs chasing phantoms.'
                    },
                    {
                        id: 4,
                        name: 'Ernesto Urbina',
                        avatar: 'svg-5',
                        content: 'Webtwo ipsum dolor sit amet, eskobo chumby doostang bebo. Bubbli greplin stypi prezi mzinga heroku wakoopa, shopify airbnb dogster dopplr gooru jumo, reddit plickers edmodo stypi zillow etsy.'
                    },
                    {
                        id: 5,
                        name: 'Gani Ferrer',
                        avatar: 'svg-6',
                        content: "Lebowski ipsum yeah? What do you think happens when you get rad? You turn in your library card? Get a new driver's license? Stop being awesome? Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac lectus. You don't go out and make a living dressed like that in the middle of a weekday. Quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada suscipit malesuada."
                    }
                ];
        this._selectedUser = this._users[0];
    }
    
    public getUsers () {
        return this._users;
    }
    
    public getUser () {
        return this._selectedUser;
    }
    
    public selectUser (id: number) {
        var promise = new Promise ( (resolve, reject) => {
            setTimeout( function(self) {
                if (id < self._users.length) {
                    self._selectedUser = self._users[id];
                } else {
                    self._selectedUser = self._users[0];
                }
                resolve();
            }, 1000, this);
        });
        return promise;
    }
    
    public emitChange () {
        this.emit('change');
    }
}

angular.module( 'photoAlbum')
    .factory('userActions', function (dispatcher: EventEmmiter) {
        function selectUser (userId) {
            dispatcher.emit({
                type: 'SELECT_USER',
                userId: userId 
            });
        }
            
        return {
            selectUser: selectUser
        }
    });

angular.module( 'photoAlbum')
    .factory('userStore', function (dispatcher: EventEmmiter) {
        
        var userStore = new UserStore();
        
        dispatcher.addListener(function (action) {
            switch (action.type) {
                case 'SELECT_USER':
                    userStore.selectUser(action.userId)
                        .then( () => {
                            userStore.emitChange();
                        });       
                break;
            }
        });
        
        return {
            addListener: (foo) => userStore.addListener(foo),
            users: () => userStore.getUsers(),
            user: () => userStore.getUser()
        }
});
})();