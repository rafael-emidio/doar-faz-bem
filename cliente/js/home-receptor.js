angular.module('appIndex', ['ui-notification'])
.controller('indexCtrl', function($scope,$timeout,$http, Notification) {
    const server = 'http://localhost:3001';
    
    var init = function(){
      //redireciona para login caso não haja token
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }
      console.log(server);
    }
    init();

   $scope.logout = function(){
      localStorage.clear();
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }
    }

});