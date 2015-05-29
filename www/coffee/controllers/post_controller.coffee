angular.module('ghostwriter.postController', [])
.controller('PostCtrl', ($scope, $ionicPopover, $ionicPopup, $state, $localstorage, $timeout, $ghost_api, $stateParams, $q) ->

  $ionicPopover.fromTemplateUrl('templates/post-popover.html', {
    scope: $scope,
  }).then((popover) ->
    $scope.popover = popover
  )
  $scope.api_save = ->
    $ghost_api.put_blog_post($scope.post).success(
      (data) ->
        console.log(data)
        $scope.saved = true
        $timeout((-> $scope.saved = false), 5000)
    ).error(
      (error) ->
        console.log(error)
    )
  $scope.changeTitle = ->
    titlePopup = $ionicPopup.show(
      template: '<textarea rows="10" cols="50" type="text" ng-model="post.title"></textarea>',
      scope: $scope,
      buttons: [{
        text: '<b>Done</b>',
        type: 'button-positive',
        onTap: (e) ->
          if !$scope.post.title
            e.preventDefault()
      }]
    )

  $scope.preview = ->
    $scope.checkIfChanged().then(
      ((y) ->
        confirmPopup = $ionicPopup.confirm(
          title: 'Save post?'
        )
        confirmPopup.then(
          (res) ->
            if res 
              $scope.api_save()
              $state.go('app.preview', {post_id: $scope.post.id})
        )
      ),
      ((n) -> $state.go('app.preview', {post_id: $scope.post.id}))
    )

  $scope.back = ->
    $scope.checkIfChanged().then(
      ((y) ->
        confirmPopup = $ionicPopup.confirm(
          title: 'Discard changes?'
        )
        confirmPopup.then(
          (res) ->
            if res
              $state.go('app.posts', {})
        )
      ),
      ((n) -> $state.go('app.posts', {}))
    )

  $scope.save = ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Save post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $scope.api_save()
     )

  $scope.delete =  ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Delete post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $ghost_api.delete_blog_post($scope.post.id).success(
            (data) ->
              $state.go('app.posts', {})
          ).error(
            (error) ->
              $scope.login()
          )
    )

  $scope.publish = ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Publish post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $ghost_api.publish_blog_post($scope.post.id).success(
            (data) ->
              $scope.refreshPost()
          ).error(
            (error) ->
              $scope.login()
          )
    )
  $scope.unpublish = ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Unpublish post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $ghost_api.unpublish_blog_post($scope.post.id).success(
            (data) ->
              $scope.refreshPost()
          ).error(
            (error) ->
              $scope.login()
          )
    )

  $scope.getPost = ->
    $q((resolve, reject) ->
      $ghost_api.blog_post($stateParams.post_id).success(
        (data) ->
          resolve(data.posts[0])
      ).error(
        (error) ->
          reject('failed')
      ) if $localstorage.getObject('auth').access_token
    )

  $scope.checkIfChanged = ->
    $q((y,n) ->
      $scope.getPost().then(
        (
          (post) ->
            if $scope.post.title == post.title && $scope.post.markdown == post.markdown
              n(false)
            else
              y(true)
        ),
        ((error) -> $scope.login())
      )
    )

  $scope.refreshPost = ->
    $scope.getPost().then(
      ((post) -> $scope.post = post),
      ((error) -> $scope.login())
    )

  $scope.auth = $localstorage.getObject('auth')
  $timeout((-> $scope.login()), 200) unless $scope.auth.access_token
  $scope.refreshPost()

)
.controller('PreviewCtrl', ($scope, $state, $localstorage, $timeout, $ghost_api, $stateParams) ->
  $scope.back = ->
    $state.go('app.post', {post_id: $stateParams.post_id})
  $scope.refreshPost = ->
    $ghost_api.blog_post($stateParams.post_id).success(
      (data) ->
        console.log(data.posts[0])
        $scope.post = data.posts[0]
    ).error(
      (error) ->
        $scope.login()
    ) if $localstorage.getObject('auth').access_token

    $scope.$broadcast('scroll.refreshComplete')

  $scope.auth = $localstorage.getObject('auth')
  $timeout((-> $scope.login()), 200) unless $scope.auth.access_token
  $scope.refreshPost()

)
.controller('NewPostCtrl', ($scope, $ionicPopover, $ionicPopup, $state, $localstorage, $timeout, $ghost_api) ->
  $scope.post =
    title: 'Post Title'
    markdown: 'Markdown text'

  $ionicPopover.fromTemplateUrl('templates/post-popover.html', {
    scope: $scope,
  }).then((popover) ->
    $scope.popover = popover
  )
  $scope.api_save = ->
    $ghost_api.new_blog_post($scope.post).success(
      (data) ->
        console.log(data)
        $scope.saved = true
        $state.go('app.posts')
    ).error(
      (error) ->
        console.log(error)
    )

  $scope.changeTitle = ->
    titlePopup = $ionicPopup.show(
      template: '<textarea rows="10" cols="50" type="text" ng-model="post.title"></textarea>',
      scope: $scope,
      buttons: [{
        text: '<b>Done</b>',
        type: 'button-positive',
        onTap: (e) ->
          if !$scope.post.title
            e.preventDefault()
      }]
    )

  $scope.discard = ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Discard post?'
    )
    confirmPopup.then(
      (res) ->
        if res
          $state.go('app.posts', {})
    )

  $scope.save = ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Save post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $scope.api_save()
     )

  $scope.auth = $localstorage.getObject('auth')
  $timeout((-> $scope.login()), 200) unless $scope.auth.access_token
)
