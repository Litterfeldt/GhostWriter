angular.module('ghostwriter.postsController', [])
.controller('PostsCtrl', ($scope, $state, $ionicPopover, $ionicPopup, $localstorage, $http, $timeout, $ghost_api, $filter) ->

  $timeout((-> $scope.bodyclass = 'padded'), 200)
  $scope.posts = []
  $scope.newPost = ->
    $timeout((->$state.go('app.new_post', {})), 500)

  $scope.goToPost = (id)->
    $timeout((->$state.go('app.post', {post_id: id})), 500)

  $scope.getImageFrom = (html)->
    img = /<img.+?src=[\"'](.+?)[\"'].*?>/.exec(html)
    if img 
      if img[1].substring(0,3) == "htt"
        img[1]
      else
        'http://'+ $localstorage.getObject('auth').blog_url + img[1] 
    else
      null

  $ionicPopover.fromTemplateUrl('templates/posts-popover.html', {
    scope: $scope,
  }).then((popover) ->
    $scope.popover = popover
  )

  $scope.refreshPosts = ->
    $scope.morePosts(true)
    $scope.$broadcast('scroll.refreshComplete')

  $scope.nextPage = ->
    if $scope.pageMeta
      if $scope.pageMeta.page + 1 < $scope.pageMeta.pages
        $scope.pageMeta.page + 1
      else
       0
    else
      1

  $scope.morePosts = (refresh=false)->
    auth = $localstorage.getObject('auth')
    $scope.posts = [] if refresh
    $scope.pageMeta = null if refresh
    console.log(this.nextPage())

    $ghost_api.blog_posts($scope.nextPage()).success(
      (data) ->
        posts = []
        angular.forEach(data.posts, (item) ->
          posts.push(item)
        )
        $scope.posts = posts
        $scope.pageMeta = data.meta.pagination
    ).error(
      (error) ->
        $scope.login()
    ) if auth.access_token && $scope.nextPage() > 0
    $timeout((-> $scope.$broadcast('scroll.infiniteScrollComplete')), 2000)

  $scope.delete = (id) ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Delete post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $ghost_api.delete_blog_post(id).success(
            (data) ->
              $scope.refreshPosts()
          ).error(
            (error) ->
              $scope.login()
          )
    )

  $scope.publish = (id) ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Publish post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $ghost_api.publish_blog_post(id).success(
            (data) ->
              $scope.refreshPosts()
          ).error(
            (error) ->
              $scope.login()
          )
    )
  $scope.unpublish = (id) ->
    confirmPopup = $ionicPopup.confirm(
      title: 'Unpublish post?'
    )
    confirmPopup.then(
      (res) ->
        if res 
          $ghost_api.unpublish_blog_post(id).success(
            (data) ->
              $scope.refreshPosts()
          ).error(
            (error) ->
              $scope.login()
          )
    )

  $scope.auth = $localstorage.getObject('auth')
  $scope.blog_url = $localstorage.getObject($scope.auth.blog_url)
  $timeout((-> $scope.login()), 200) unless $scope.auth.access_token
  $scope.refreshPosts()
)
