angular.module('ghostwriter.directives', [])
.directive('elastic',($timeout) ->
  restrict: 'A'
  link: ($scope, element) ->
    resize = ->
      element[0].style.height = "" + element[0].scrollHeight + "px"
    element.on("blur keyup change focus native.keyboardshow", resize)
    $timeout(resize, 1000)
)
.directive('a', ->
  restrict: 'E',
  link: (scope, element, attrs) ->
      if !attrs.href
          return
      externalRe = new RegExp("^(http|https)://")
      url = attrs.href

      if externalRe.test(url)
          element.on('click', (e) ->
              e.preventDefault()
              if attrs.ngClick
                  scope.$eval(attrs.ngClick)
              window.open(encodeURI(url), '_system')
          )
)
