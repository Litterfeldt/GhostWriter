angular.module('ghostwriter.appController', [])
.controller('AppCtrl', ($scope, $http, $ionicModal, $timeout, $localstorage, $state, $ghost_api) ->
  $scope.loginData = {}

  $timeout((-> $scope.bodyclass = 'padded'), 100)

  window.addEventListener('native.keyboardshow', ((e) -> document.body.classList.add('keyboard-open')))
  window.addEventListener('native.keyboardhide', ((e) -> document.body.classList.remove('keyboard-open')))

  $scope.login = ->
    auth = $localstorage.getObject('auth')
    $scope.loginData.blog_url ||= auth.blog_url
    $scope.loginData.username ||= auth.username
    $state.go('app.login', {})

  $scope.doLogout = ->
    auth = $localstorage.getObject('auth')
    auth.access_token = null
    auth.refresh_token = null
    $localstorage.setObject('auth', auth)

    $timeout((-> $scope.login()), 200)
)
