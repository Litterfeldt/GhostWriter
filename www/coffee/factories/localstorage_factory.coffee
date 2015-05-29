angular.module('ghostwriter.localstorageFactory', [])
.factory('$localstorage', ($window) -> 
    get: (key, defaultValue) -> $window.localStorage[key] || defaultValue
    setObject: (key, value) -> $window.localStorage[key] = JSON.stringify(value)
    getObject: (key) -> JSON.parse($window.localStorage[key] || '{}')
)
