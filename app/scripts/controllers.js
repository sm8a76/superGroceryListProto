'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', function ($scope, menuFactory, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showFavorites = false;
    $scope.showMenu = false;
    $scope.message = 'Loading ...';

    menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = 'appetizer';
        } else if (setTab === 3) {
            $scope.filtText = 'mains';
        } else if (setTab === 4) {
            $scope.filtText = 'dessert';
        } else {
            $scope.filtText = '';
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleFavorites = function () {
        $scope.showFavorites = !$scope.showFavorites;
    };
    
    $scope.addToFavorites = function(dishid) {
        console.log('Add to favorites', dishid);
        favoriteFactory.save({_id: dishid});
        $scope.showFavorites = !$scope.showFavorites;
    };
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: '',
        firstName: '',
        lastName: '',
        agree: false,
        email: ''
    };

    var channels = [{
        value: 'tel',
        label: 'Tel.'
    }, {
        value: 'Email',
        label: 'Email'
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel === '')) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: '',
                firstName: '',
                lastName: '',
                agree: false,
                email: ''
            };
            $scope.feedback.mychannel = '';
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('DishDetailController', ['$scope', '$state', '$stateParams', 'menuFactory', 'commentFactory', function ($scope, $state, $stateParams, menuFactory, commentFactory) {

    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = 'Loading ...';

    $scope.dish = menuFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
            }
        );

    $scope.mycomment = {
        rating: 5,
        comment: ''
    };

    $scope.submitComment = function () {

        commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: ''
        };
    };
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', '$state', function ($scope, $state) {
    
    $scope.search = function(){
        $state.go('app.searchresults', {}, {reload: true});
    };
    
}])

.controller('SearchResultsController', ['$scope', 'ngDialog', function ($scope, ngDialog){
    $scope.showDetails = true;
    
    $scope.results = [
        { _id: 0,
          name: 'Leche Entera Santa Clara', 
          description: 'Leche Entera Santa Clara',
          category: 'Lacteos', 
          price: 1500, 
          bestPriceAt: 'HEB',
          unit: 'Litros', 
          available: 'HEB, Soriana, WalMart',
          label: '-5%',
          image: '/images/leche-entera-santaclara.png'         
        },
        { _id: 1,
          name: 'Leche Entera Lala', 
          description: 'Leche Entera Lala',
          category: 'Lacteos', 
          price: 1350, 
          bestPriceAt: 'HEB',
          unit: 'Litros', 
          available: 'HEB, Soriana, WalMart',
          label: '',
          image: '/images/leche-entera-lala.jpeg'         
        },  
        { _id: 2,
          name: 'Leche Deslactosada Santa Clara', 
          description: 'Leche Deslactosada Santa Clara',
          category: 'Lacteos', 
          price: 1800, 
          bestPriceAt: 'WalMart',
          unit: 'Litros', 
          available: 'HEB, WalMart',
          label: '-5%',
          image: '/images/leche-deslactosada-santaclara.jpg'         
        },
        { _id: 3,
          name: 'Leche Deslactosada Parmalat', 
          description: 'Leche Deslactosada Parmalat',
          category: 'Lacteos', 
          price: 1650, 
          bestPriceAt: 'WalMart',
          unit: 'Litros', 
          available: 'HEB, Soriana, WalMart, SMart',
          label: '',
          image: '/images/leche-deslactosada-parmalat.jpg'         
        }
        
    ];
    
    $scope.addToList = function(id){
        console.log('Adding item ' + id);  
        $scope.currentItem = $scope.results[id];
        
        ngDialog.open({ template: 'views/addToList.html', scope: $scope, className: 'ngdialog-theme-default', controller:'AddToListController' });        
    };

    
    $scope.openAddToList = function (id) {
        console.log('Adding item... ' + id);  
        $scope.currentItem = $scope.results[id];
        
        ngDialog.open({ template: 'views/addToList.html', scope: $scope, className: 'ngdialog-theme-default', controller:'AddToListController' });
    };
        
    
    console.log('Entering SearchResultsController...');    
}])

.controller('AddToListController', ['$scope', 'ngDialog', function ($scope,ngDialog){
   $scope.quantity = 1;
   $scope.whichList = {};
    
    $scope.addToList = function() {
        ngDialog.close();
    };
    
     $scope.closeThisDialog = function() {
        ngDialog.close();
    };      
    
   $scope.myLists = [ 
        { _id: 0,
          name: 'WeeklyList',
          theList:         [
                { _id: 0,
                  name: 'Leche Entera Santa Clara', 
                  category: 'Lacteos', 
                  price: 1500, 
                  bestPriceAt: 'HEB',
                  quantity: 4,
                  unit: 'Litros', 
                  available: 'HEB, Soriana, WalMart',
                  label: '-5%',
                  image: '/images/leche-entera-santaclara.png'         
                },
                { _id: 1,
                  name: 'Azucar Mascabado BlackSugar', 
                  description: 'Azucar Mascabado BlackSugar',
                  category: 'Azucar', 
                  price: 2450, 
                  bestPriceAt: 'WalMart',
                  quantity: 1,
                  unit: 'Kilos', 
                  available: 'HEB, Soriana, WalMart',
                  label: '',
                  image: '/images/azucar-mascabado.jpg'         
                },  
                { _id: 2,
                  name: 'Tomates', 
                  description: 'Tomates',
                  category: 'Frutas y Verduras', 
                  price: 950, 
                  bestPriceAt: 'WalMart',
                  quantity: 1,
                  unit: 'Kilos', 
                  available: 'HEB, Soriana, WalMart',
                  label: '-5%',
                  image: '/images/tomates.jpg'         
                },
                { _id: 3,
                  name: 'Limones', 
                  description: 'Limones',
                  category: 'Frutas y Verduras', 
                  price: 2850, 
                  bestPriceAt: 'Soriana',
                  quantity: 1,
                  unit: 'Kilos', 
                  available: 'HEB, Soriana, WalMart, SMart',
                  label: '',
                  image: '/images/limones.jpg'         
                }
    ]
    }];
}])

.controller('MyListsController', ['$scope', function ($scope){
    $scope.showDetails = true;
    
    $scope.superMarkets = [
        { name: 'HEB'},
        { name: 'Soriana'},
        { name: 'WalMart'},
        { name: 'SMart'}
    ];
    
    $scope.currentList = {};
    $scope.currentSuperMarket = {};
    
    $scope.myLists = [ 
        { _id: 0,
          name: 'WeeklyList',
          theList:         [
                { _id: 0,
                  name: 'Leche Entera Santa Clara', 
                  category: 'Lacteos', 
                  price: 1500, 
                  bestPriceAt: 'HEB',
                  quantity: 4,
                  unit: 'Litros', 
                  available: 'HEB, Soriana, WalMart',
                  label: '-5%',
                  image: '/images/leche-entera-santaclara.png'         
                },
                { _id: 1,
                  name: 'Azucar Mascabado BlackSugar', 
                  description: 'Azucar Mascabado BlackSugar',
                  category: 'Azucar', 
                  price: 2450, 
                  bestPriceAt: 'WalMart',
                  quantity: 1,
                  unit: 'Kilos', 
                  available: 'HEB, Soriana, WalMart',
                  label: '',
                  image: '/images/azucar-mascabado.jpg'         
                },  
                { _id: 2,
                  name: 'Tomates', 
                  description: 'Tomates',
                  category: 'Frutas y Verduras', 
                  price: 950, 
                  bestPriceAt: 'WalMart',
                  quantity: 1,
                  unit: 'Kilos', 
                  available: 'HEB, Soriana, WalMart',
                  label: '-5%',
                  image: '/images/tomates.jpg'         
                },
                { _id: 3,
                  name: 'Limones', 
                  description: 'Limones',
                  category: 'Frutas y Verduras', 
                  price: 2850, 
                  bestPriceAt: 'Soriana',
                  quantity: 1,
                  unit: 'Kilos', 
                  available: 'HEB, Soriana, WalMart, SMart',
                  label: '',
                  image: '/images/limones.jpg'         
                }
    ]
    }];
        
    
    $scope.addToList = function(id){
        console.log('Adding item ' + id);  
    };
    
    console.log('Entering MyListsController...');    
}])


.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

    $scope.leaders = corporateFactory.query();

}])

.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = 'Loading ...';

    favoriteFactory.query(
        function (response) {
            $scope.dishes = response.dishes;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = 'appetizer';
        } else if (setTab === 3) {
            $scope.filtText = 'mains';
        } else if (setTab === 4) {
            $scope.filtText = 'dessert';
        } else {
            $scope.filtText = '';
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.deleteFavorite = function(dishid) {
        console.log('Delete favorites', dishid);
        favoriteFactory.delete({id: dishid});
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:'LoginController' });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe){
           $localStorage.storeObject('userinfo',$scope.loginData);
        }

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:'RegisterController' });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;