angular.module('ghostwriter.loginController', [])
.controller('LoginCtrl', ($scope, $rootScope, $state, $localstorage, $ghost_api, $timeout) ->
  
  $scope.keyboardOpen = ->
    event = new CustomEvent("native.keyboardshow", {})
    window.dispatchEvent(event)
    $scope.$apply()

  $scope.keyboardClose = ->
    event = new CustomEvent("native.keyboardhide", {})
    window.dispatchEvent(event)

  $scope.blog_url = $localstorage.getObject('auth').blog_url
  $rootScope.removeTopPadding = 'true'

  $scope.closeLogin = ->
    $state.go('app.posts', {})
    $rootScope.removeTopPadding = null

  $scope.doLogin = ->
    auth = $localstorage.getObject('auth')
    auth.access_token = null
    auth.refresh_token = null
    $localstorage.setObject('auth', auth)

    console.log 'Doing login', $scope.loginData
    form = $scope.loginData

    $ghost_api.login(form.blog_url, form.username, form.password).success(
      (data) ->
        data.blog_url = $scope.loginData.blog_url
        data.username = $scope.loginData.username
        $localstorage.setObject('auth', data)
        $timeout((-> $scope.closeLogin()), 200)
        $scope.error = null
        console.log(data)
    ).error(
      (error) ->
        console.log(error)
        $scope.error = error.errors[0].message
    )
)
