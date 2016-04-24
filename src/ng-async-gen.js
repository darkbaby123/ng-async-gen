'use strict'

const mod = angular.module('ng-async-gen', [])

.factory('asyncRun', ['$q', '$log', function($q, $log) {
  return function asyncRun(genFn, ctx, ...args) {
    return $q((resolve, reject) => {
      const gen = genFn.apply(ctx, args)
      onFulfilled()

      function onFulfilled(res) {
        try {
          const ret = gen.next(res)
          next(ret)
        } catch (e) {
          $log.error(e)
          return reject(e)
        }
      }

      function onRejected(err) {
        try {
          const ret = gen.throw(err)
          next(ret)
        } catch (e) {
          $log.error(e)
          return reject(e)
        }
      }

      function next(ret) {
        if (ret.done) return resolve(ret.value)
        $q.resolve(ret.value).then(onFulfilled, onRejected)
      }
    })
  }
}])

.factory('asyncFn', ['asyncRun', function(asyncRun) {
  return function asyncFn(genFn) {
    return function(...args) {
      return asyncRun(genFn, this, ...args)
    }
  }
}])

export default mod.name
