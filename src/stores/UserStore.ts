/// <reference path="../../typings/tsd.d.ts" />

import {Dispatcher} from './../Dispatcher.ts';

class UserStore extends Dispatcher {
    private _users: any [];
    private _selectedUser;
    private _q;
    
    constructor ($q) {
        super();
        this._q = $q;
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
        var deferred = this._q.defer();
            setTimeout( function(self) {
                if (id < self._users.length) {
                    self._selectedUser = self._users[id];
                } else {
                    self._selectedUser = self._users[0];
                }
                deferred.resolve();
            }, 1000, this);
        return deferred.promise;
    }
    
    public deleteUser (id: number) {
        // remove user from the list
        var user = this._users.filter((i) => i.id === id )[0];
        var position = this._users.indexOf(user);
        this._users.splice(position, 1);
        
        // if deleted user was the selected one, need to select a new one
        if (this._selectedUser === user) {
            if (this._users.length > position) {
                this._selectedUser = this._users[position];
            } else if (this._users.length > 0) {
                this._selectedUser = this._users[position-1];
            } else {
                this._selectedUser = {};
            }
        }
    }
    
    public emitChange () {
        this.emit('change');
    }
}

export function UserStoreFactory (dispatcher: IDispatcher, $q) {
    var userStore = new UserStore ($q);
      
    dispatcher.setToken('UserStoreDispatchToken', 
        dispatcher.addListener(function (action) {
            dispatcher.startHandling('UserStoreDispatchToken');
            switch (action.type) {
                case 'SELECT_USER':
                    userStore.selectUser(action.userId)
                        .then( () => {
                            userStore.emitChange();
                            dispatcher.stopHandling('UserStoreDispatchToken');
                        });       
                break;
                case 'DELETE_USER':
                    userStore.deleteUser(action.userId);
                    userStore.emitChange();
                    dispatcher.stopHandling('UserStoreDispatchToken');
                break;
                default:
                    dispatcher.stopHandling('UserStoreDispatchToken');
            }
        })
    );
// console.log(dispatcher.getTokens());
    
    return {
        addListener: (foo) => userStore.addListener(foo),
        removeListener: (listenerId: number) => userStore.removeListener(listenerId),
        
        users: () => userStore.getUsers(),
        user: () => userStore.getUser()
    }
}
