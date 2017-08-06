import 'babel-polyfill'
import 'angular'
import ngAsyncGen from '../src/ng-async-gen'

angular.module('app', [ngAsyncGen])

.controller('UserCtrl', function($q, api, asyncRun, asyncFn) {
  const vm = this

  vm.getUser = function(userId) {
    return asyncRun(function*() {
      this.user = yield api.getUser(userId)
    }, vm)
  }

  vm.getUser2 = asyncFn(function*(userId) {
    this.user = yield api.getUser(userId)
    return this.user
  })

  // vm.getUser()
  vm.getUser(1).then(user => console.log(user))
})

.factory('api', function($q) {
  return {
    getUser() {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ id: 1, name: 'David' }), 500)
      })
    }
  }
})

/*
 * ========== Examples ==========
 */
// vm.getUser = asyncFn(function*(userId) {
//   const user = yield fetch(`/users/${userId}`)
//   vm.user = user
// })
//
// vm.getUser = (userId) => {
//   fetch(`/users/${userId}`).then(user => {
//     vm.user = user
//   })
// }
//
// class UserController {
//   constructor(asyncRun) {
//     this.asyncRun = asyncRun
//   }
//
//   getUser(userId) {
//     return this.asyncRun(function*() {
//       this.user = yield fetch(`/users/${userId}`)
//       return this.user
//     }, this)
//   }
// }
