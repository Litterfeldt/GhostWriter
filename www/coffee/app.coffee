# Ionic Starter App
# angular.module is a global place for creating, registering and retrieving Angular modules
# 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
# the 2nd parameter is an array of 'requires'
# 'starter.controllers' is found in controllers.js

angular.module('ghostwriter', [
  'ionic'
  'ghostwriter.localstorageFactory',
  'ghostwriter.ghostApiFactory',
  'ghostwriter.directives',
  'ghostwriter.filters',
  'ghostwriter.appController',
  'ghostwriter.loginController',
  'ghostwriter.postsController',
  'ghostwriter.postController'
])

.run(($ionicPlatform) ->
  $ionicPlatform.ready ->
    # Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    # for form inputs)
    if window.cordova and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true

    if(StatusBar && statusbarTransparent) 
          statusbarTransparent.enable()
          StatusBar.show()
      else if (StatusBar) 
          StatusBar.show()

    ionic.Platform.isFullScreen = true
)

.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
    .state('app',
      url: '/app'
      abstract: true
      templateUrl: 'templates/menu.html'
      controller: 'AppCtrl'
    )

    .state('app.post',
      url: '/post/:post_id',
      views:
        menuContent:
          templateUrl: 'templates/post.html'
          controller: 'PostCtrl'
    )

    .state('app.new_post',
      url: '/post-new',
      views:
        menuContent:
          templateUrl: 'templates/new_post.html'
          controller: 'NewPostCtrl'
    )

    .state('app.posts',
      url: '/posts',
      views:
        menuContent:
          templateUrl: 'templates/posts.html'
          controller: 'PostsCtrl'
    )

    .state('app.login',
      url: '/login',
      views:
        menuContent:
          templateUrl: 'templates/login.html'
          controller: 'LoginCtrl'
    )

    .state('app.preview',
      url: '/preview/:post_id',
      views:
        menuContent:
          templateUrl: 'templates/preview.html'
          controller: 'PreviewCtrl'
    )

  # if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise '/app/posts'
