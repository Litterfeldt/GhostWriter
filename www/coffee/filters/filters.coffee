angular.module('ghostwriter.filters', [])
.filter('htmlToPlaintext', ->
  (text) ->
    String(text).replace(/<[^>]+>/gm, '')
)
