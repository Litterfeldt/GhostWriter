angular.module('ghostwriter.ghostApiFactory', [])
.factory('$localstorage', ($window) -> 
    get: (key, defaultValue) -> $window.localStorage[key] || defaultValue
    setObject: (key, value) -> $window.localStorage[key] = JSON.stringify(value)
    getObject: (key) -> JSON.parse($window.localStorage[key] || '{}')
)
.factory('$ghost_api', ($localstorage, $http) -> {
  get: (url, params={}) ->
    auth = this.loginData()
    $http(
      method: 'GET'
      url: 'https://'+ auth.blog_url + url
      params: params
      headers:
        'Authorization': auth.token_type + ' ' + auth.access_token
    )
  post: (url, data) ->
    this.http('POST', url, data)
  put: (url, data) ->
    this.http('PUT', url, data)
  delete: (url, data) ->
    this.http('DELETE', url, data)
  http: (method, url, data) ->
    blog_url = this.loginData().blog_url
    auth = this.loginData()
    $http(
      method: method
      url: 'https://' + blog_url + url
      headers:
        'Authorization': auth.token_type + ' ' + auth.access_token
      data: data
    )
  login: (blog_url, username, password) ->
    $http(
      method: 'POST'
      url: 'https://' + blog_url + '/ghost/api/v0.1/authentication/token'
      headers:
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      data: 'grant_type=password&client_id=ghost-admin&password=' + password + '&username=' + username
    )
  blog_posts: (page = 1) ->
    this.get('/ghost/api/v0.1/posts', {page: page, status: 'all'})
  blog_post: (id) ->
    this.get('/ghost/api/v0.1/posts/'+id, {status: 'all'})
  put_blog_post: (data) ->
    this.put(
      '/ghost/api/v0.1/posts/'+data.id,
      { posts: [data] }
    )
  delete_blog_post: (id) ->
    this.delete('/ghost/api/v0.1/posts/'+id, {})
  publish_blog_post: (id) ->
    this.put(
      '/ghost/api/v0.1/posts/'+id,
      { posts: [{status: 'published'}] }
    )
  unpublish_blog_post: (id) ->
    this.put(
      '/ghost/api/v0.1/posts/'+id,
      { posts: [{status: 'draft'}] }
    )
  new_blog_post: (data) ->
    this.post(
      '/ghost/api/v0.1/posts/',
      { posts: [data] }
    )
  loginData: () ->
    $localstorage.getObject('auth')
})
