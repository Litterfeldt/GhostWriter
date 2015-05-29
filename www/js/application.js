angular.module('ghostwriter', ['ionic', 'ghostwriter.localstorageFactory', 'ghostwriter.ghostApiFactory', 'ghostwriter.directives', 'ghostwriter.filters', 'ghostwriter.appController', 'ghostwriter.loginController', 'ghostwriter.postsController', 'ghostwriter.postController']).run(function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (StatusBar && statusbarTransparent) {
      statusbarTransparent.enable();
      StatusBar.show();
    } else if (StatusBar) {
      StatusBar.show();
    }
    return ionic.Platform.isFullScreen = true;
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  }).state('app.post', {
    url: '/post/:post_id',
    views: {
      menuContent: {
        templateUrl: 'templates/post.html',
        controller: 'PostCtrl'
      }
    }
  }).state('app.new_post', {
    url: '/post-new',
    views: {
      menuContent: {
        templateUrl: 'templates/new_post.html',
        controller: 'NewPostCtrl'
      }
    }
  }).state('app.posts', {
    url: '/posts',
    views: {
      menuContent: {
        templateUrl: 'templates/posts.html',
        controller: 'PostsCtrl'
      }
    }
  }).state('app.login', {
    url: '/login',
    views: {
      menuContent: {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  }).state('app.preview', {
    url: '/preview/:post_id',
    views: {
      menuContent: {
        templateUrl: 'templates/preview.html',
        controller: 'PreviewCtrl'
      }
    }
  });
  return $urlRouterProvider.otherwise('/app/posts');
});

angular.module('ghostwriter.appController', []).controller('AppCtrl', function($scope, $http, $ionicModal, $timeout, $localstorage, $state, $ghost_api) {
  $scope.loginData = {};
  $timeout((function() {
    return $scope.bodyclass = 'padded';
  }), 100);
  window.addEventListener('native.keyboardshow', (function(e) {
    return document.body.classList.add('keyboard-open');
  }));
  window.addEventListener('native.keyboardhide', (function(e) {
    return document.body.classList.remove('keyboard-open');
  }));
  $scope.login = function() {
    var auth, base, base1;
    auth = $localstorage.getObject('auth');
    (base = $scope.loginData).blog_url || (base.blog_url = auth.blog_url);
    (base1 = $scope.loginData).username || (base1.username = auth.username);
    return $state.go('app.login', {});
  };
  return $scope.doLogout = function() {
    var auth;
    auth = $localstorage.getObject('auth');
    auth.access_token = null;
    auth.refresh_token = null;
    $localstorage.setObject('auth', auth);
    return $timeout((function() {
      return $scope.login();
    }), 200);
  };
});

angular.module('ghostwriter.loginController', []).controller('LoginCtrl', function($scope, $rootScope, $state, $localstorage, $ghost_api, $timeout) {
  $scope.keyboardOpen = function() {
    var event;
    event = new CustomEvent("native.keyboardshow", {});
    window.dispatchEvent(event);
    return $scope.$apply();
  };
  $scope.keyboardClose = function() {
    var event;
    event = new CustomEvent("native.keyboardhide", {});
    return window.dispatchEvent(event);
  };
  $scope.blog_url = $localstorage.getObject('auth').blog_url;
  $rootScope.removeTopPadding = 'true';
  $scope.closeLogin = function() {
    $state.go('app.posts', {});
    return $rootScope.removeTopPadding = null;
  };
  return $scope.doLogin = function() {
    var auth, form;
    auth = $localstorage.getObject('auth');
    auth.access_token = null;
    auth.refresh_token = null;
    $localstorage.setObject('auth', auth);
    console.log('Doing login', $scope.loginData);
    form = $scope.loginData;
    return $ghost_api.login(form.blog_url, form.username, form.password).success(function(data) {
      data.blog_url = $scope.loginData.blog_url;
      data.username = $scope.loginData.username;
      $localstorage.setObject('auth', data);
      $timeout((function() {
        return $scope.closeLogin();
      }), 200);
      $scope.error = null;
      return console.log(data);
    }).error(function(error) {
      console.log(error);
      return $scope.error = error.errors[0].message;
    });
  };
});

angular.module('ghostwriter.postController', []).controller('PostCtrl', function($scope, $ionicPopover, $ionicPopup, $state, $localstorage, $timeout, $ghost_api, $stateParams, $q) {
  $ionicPopover.fromTemplateUrl('templates/post-popover.html', {
    scope: $scope
  }).then(function(popover) {
    return $scope.popover = popover;
  });
  $scope.api_save = function() {
    return $ghost_api.put_blog_post($scope.post).success(function(data) {
      console.log(data);
      $scope.saved = true;
      return $timeout((function() {
        return $scope.saved = false;
      }), 5000);
    }).error(function(error) {
      return console.log(error);
    });
  };
  $scope.changeTitle = function() {
    var titlePopup;
    return titlePopup = $ionicPopup.show({
      template: '<textarea rows="4" cols="50" type="text" ng-model="post.title"></textarea>',
      scope: $scope,
      cssClass: 'change-title-popup',
      buttons: [
        {
          text: '<b>Done</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.post.title) {
              return e.preventDefault();
            }
          }
        }
      ]
    });
  };
  $scope.preview = function() {
    return $scope.checkIfChanged().then((function(y) {
      var confirmPopup;
      confirmPopup = $ionicPopup.confirm({
        title: 'Save post?'
      });
      return confirmPopup.then(function(res) {
        if (res) {
          $scope.api_save();
          return $state.go('app.preview', {
            post_id: $scope.post.id
          });
        }
      });
    }), (function(n) {
      return $state.go('app.preview', {
        post_id: $scope.post.id
      });
    }));
  };
  $scope.back = function() {
    return $scope.checkIfChanged().then((function(y) {
      var confirmPopup;
      confirmPopup = $ionicPopup.confirm({
        title: 'Discard changes?'
      });
      return confirmPopup.then(function(res) {
        if (res) {
          return $state.go('app.posts', {});
        }
      });
    }), (function(n) {
      return $state.go('app.posts', {});
    }));
  };
  $scope.save = function() {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Save post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $scope.api_save();
      }
    });
  };
  $scope["delete"] = function() {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Delete post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $ghost_api.delete_blog_post($scope.post.id).success(function(data) {
          return $state.go('app.posts', {});
        }).error(function(error) {
          return $scope.login();
        });
      }
    });
  };
  $scope.publish = function() {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Publish post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $ghost_api.publish_blog_post($scope.post.id).success(function(data) {
          return $scope.refreshPost();
        }).error(function(error) {
          return $scope.login();
        });
      }
    });
  };
  $scope.unpublish = function() {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Unpublish post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $ghost_api.unpublish_blog_post($scope.post.id).success(function(data) {
          return $scope.refreshPost();
        }).error(function(error) {
          return $scope.login();
        });
      }
    });
  };
  $scope.getPost = function() {
    return $q(function(resolve, reject) {
      if ($localstorage.getObject('auth').access_token) {
        return $ghost_api.blog_post($stateParams.post_id).success(function(data) {
          return resolve(data.posts[0]);
        }).error(function(error) {
          return reject('failed');
        });
      }
    });
  };
  $scope.checkIfChanged = function() {
    return $q(function(y, n) {
      return $scope.getPost().then((function(post) {
        if ($scope.post.title === post.title && $scope.post.markdown === post.markdown) {
          return n(false);
        } else {
          return y(true);
        }
      }), (function(error) {
        return $scope.login();
      }));
    });
  };
  $scope.refreshPost = function() {
    return $scope.getPost().then((function(post) {
      return $scope.post = post;
    }), (function(error) {
      return $scope.login();
    }));
  };
  $scope.auth = $localstorage.getObject('auth');
  if (!$scope.auth.access_token) {
    $timeout((function() {
      return $scope.login();
    }), 200);
  }
  return $scope.refreshPost();
}).controller('PreviewCtrl', function($scope, $state, $localstorage, $timeout, $ghost_api, $stateParams) {
  $scope.back = function() {
    return $state.go('app.post', {
      post_id: $stateParams.post_id
    });
  };
  $scope.refreshPost = function() {
    if ($localstorage.getObject('auth').access_token) {
      $ghost_api.blog_post($stateParams.post_id).success(function(data) {
        console.log(data.posts[0]);
        return $scope.post = data.posts[0];
      }).error(function(error) {
        return $scope.login();
      });
    }
    return $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.auth = $localstorage.getObject('auth');
  if (!$scope.auth.access_token) {
    $timeout((function() {
      return $scope.login();
    }), 200);
  }
  return $scope.refreshPost();
}).controller('NewPostCtrl', function($scope, $ionicPopover, $ionicPopup, $state, $localstorage, $timeout, $ghost_api) {
  $scope.post = {
    title: 'Post Title',
    markdown: 'Markdown text'
  };
  $ionicPopover.fromTemplateUrl('templates/post-popover.html', {
    scope: $scope
  }).then(function(popover) {
    return $scope.popover = popover;
  });
  $scope.api_save = function() {
    return $ghost_api.new_blog_post($scope.post).success(function(data) {
      console.log(data);
      $scope.saved = true;
      return $state.go('app.posts');
    }).error(function(error) {
      return console.log(error);
    });
  };
  $scope.changeTitle = function() {
    var titlePopup;
    return titlePopup = $ionicPopup.show({
      template: '<textarea rows="4" cols="50" type="text" ng-model="post.title"></textarea>',
      scope: $scope,
      cssClass: 'change-title-popup',
      buttons: [
        {
          text: '<b>Done</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.post.title) {
              return e.preventDefault();
            }
          }
        }
      ]
    });
  };
  $scope.discard = function() {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Discard post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $state.go('app.posts', {});
      }
    });
  };
  $scope.save = function() {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Save post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $scope.api_save();
      }
    });
  };
  $scope.auth = $localstorage.getObject('auth');
  if (!$scope.auth.access_token) {
    return $timeout((function() {
      return $scope.login();
    }), 200);
  }
});

angular.module('ghostwriter.postsController', []).controller('PostsCtrl', function($scope, $state, $ionicPopover, $ionicPopup, $localstorage, $http, $timeout, $ghost_api, $filter) {
  $timeout((function() {
    return $scope.bodyclass = 'padded';
  }), 200);
  $scope.posts = [];
  $scope.newPost = function() {
    return $timeout((function() {
      return $state.go('app.new_post', {});
    }), 500);
  };
  $scope.goToPost = function(id) {
    return $timeout((function() {
      return $state.go('app.post', {
        post_id: id
      });
    }), 500);
  };
  $scope.getImageFrom = function(html) {
    var img;
    img = /<img.+?src=[\"'](.+?)[\"'].*?>/.exec(html);
    if (img) {
      if (img[1].substring(0, 3) === "htt") {
        return img[1];
      } else {
        return 'http://' + $localstorage.getObject('auth').blog_url + img[1];
      }
    } else {
      return null;
    }
  };
  $ionicPopover.fromTemplateUrl('templates/posts-popover.html', {
    scope: $scope
  }).then(function(popover) {
    return $scope.popover = popover;
  });
  $scope.refreshPosts = function() {
    $scope.morePosts(true);
    return $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.nextPage = function() {
    if ($scope.pageMeta) {
      if ($scope.pageMeta.page + 1 < $scope.pageMeta.pages) {
        return $scope.pageMeta.page + 1;
      } else {
        return 0;
      }
    } else {
      return 1;
    }
  };
  $scope.morePosts = function(refresh) {
    var auth;
    if (refresh == null) {
      refresh = false;
    }
    auth = $localstorage.getObject('auth');
    if (refresh) {
      $scope.posts = [];
    }
    if (refresh) {
      $scope.pageMeta = null;
    }
    console.log(this.nextPage());
    if (auth.access_token && $scope.nextPage() > 0) {
      $ghost_api.blog_posts($scope.nextPage()).success(function(data) {
        var posts;
        posts = [];
        angular.forEach(data.posts, function(item) {
          return posts.push(item);
        });
        $scope.posts = posts;
        return $scope.pageMeta = data.meta.pagination;
      }).error(function(error) {
        return $scope.login();
      });
    }
    return $timeout((function() {
      return $scope.$broadcast('scroll.infiniteScrollComplete');
    }), 2000);
  };
  $scope["delete"] = function(id) {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Delete post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $ghost_api.delete_blog_post(id).success(function(data) {
          return $scope.refreshPosts();
        }).error(function(error) {
          return $scope.login();
        });
      }
    });
  };
  $scope.publish = function(id) {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Publish post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $ghost_api.publish_blog_post(id).success(function(data) {
          return $scope.refreshPosts();
        }).error(function(error) {
          return $scope.login();
        });
      }
    });
  };
  $scope.unpublish = function(id) {
    var confirmPopup;
    confirmPopup = $ionicPopup.confirm({
      title: 'Unpublish post?'
    });
    return confirmPopup.then(function(res) {
      if (res) {
        return $ghost_api.unpublish_blog_post(id).success(function(data) {
          return $scope.refreshPosts();
        }).error(function(error) {
          return $scope.login();
        });
      }
    });
  };
  $scope.auth = $localstorage.getObject('auth');
  $scope.blog_url = $localstorage.getObject($scope.auth.blog_url);
  if (!$scope.auth.access_token) {
    $timeout((function() {
      return $scope.login();
    }), 200);
  }
  return $scope.refreshPosts();
});

angular.module('ghostwriter.directives', []).directive('elastic', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, element) {
      var resize;
      resize = function() {
        return element[0].style.height = "" + element[0].scrollHeight + "px";
      };
      element.on("blur keyup change focus native.keyboardshow", resize);
      return $timeout(resize, 1000);
    }
  };
}).directive('a', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var externalRe, url;
      if (!attrs.href) {
        return;
      }
      externalRe = new RegExp("^(http|https)://");
      url = attrs.href;
      if (externalRe.test(url)) {
        return element.on('click', function(e) {
          e.preventDefault();
          if (attrs.ngClick) {
            scope.$eval(attrs.ngClick);
          }
          return window.open(encodeURI(url), '_system');
        });
      }
    }
  };
}).directive('textarea', function() {
  return {
    restrict: 'E',
    scope: {
      'noIonic': '='
    },
    link: function(scope, element, attr) {
      if (scope.noIonic) {
        return element.bind('touchend  touchmove touchstart', function(e) {
          return e.stopPropagation();
        });
      }
    }
  };
});

angular.module('ghostwriter.ghostApiFactory', []).factory('$localstorage', function($window) {
  return {
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      return $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}).factory('$ghost_api', function($localstorage, $http) {
  return {
    get: function(url, params) {
      var auth;
      if (params == null) {
        params = {};
      }
      auth = this.loginData();
      return $http({
        method: 'GET',
        url: 'https://' + auth.blog_url + url,
        params: params,
        headers: {
          'Authorization': auth.token_type + ' ' + auth.access_token
        }
      });
    },
    post: function(url, data) {
      return this.http('POST', url, data);
    },
    put: function(url, data) {
      return this.http('PUT', url, data);
    },
    "delete": function(url, data) {
      return this.http('DELETE', url, data);
    },
    http: function(method, url, data) {
      var auth, blog_url;
      blog_url = this.loginData().blog_url;
      auth = this.loginData();
      return $http({
        method: method,
        url: 'https://' + blog_url + url,
        headers: {
          'Authorization': auth.token_type + ' ' + auth.access_token
        },
        data: data
      });
    },
    login: function(blog_url, username, password) {
      return $http({
        method: 'POST',
        url: 'https://' + blog_url + '/ghost/api/v0.1/authentication/token',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=password&client_id=ghost-admin&password=' + password + '&username=' + username
      });
    },
    blog_posts: function(page) {
      if (page == null) {
        page = 1;
      }
      return this.get('/ghost/api/v0.1/posts', {
        page: page,
        status: 'all'
      });
    },
    blog_post: function(id) {
      return this.get('/ghost/api/v0.1/posts/' + id, {
        status: 'all'
      });
    },
    put_blog_post: function(data) {
      return this.put('/ghost/api/v0.1/posts/' + data.id, {
        posts: [data]
      });
    },
    delete_blog_post: function(id) {
      return this["delete"]('/ghost/api/v0.1/posts/' + id, {});
    },
    publish_blog_post: function(id) {
      return this.put('/ghost/api/v0.1/posts/' + id, {
        posts: [
          {
            status: 'published'
          }
        ]
      });
    },
    unpublish_blog_post: function(id) {
      return this.put('/ghost/api/v0.1/posts/' + id, {
        posts: [
          {
            status: 'draft'
          }
        ]
      });
    },
    new_blog_post: function(data) {
      return this.post('/ghost/api/v0.1/posts/', {
        posts: [data]
      });
    },
    loginData: function() {
      return $localstorage.getObject('auth');
    }
  };
});

angular.module('ghostwriter.localstorageFactory', []).factory('$localstorage', function($window) {
  return {
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      return $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
});

angular.module('ghostwriter.filters', []).filter('htmlToPlaintext', function() {
  return function(text) {
    return String(text).replace(/<[^>]+>/gm, '');
  };
});
