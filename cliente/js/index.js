angular.module('appIndex', ['ui-notification'])
.controller('indexCtrl', function($scope,$timeout,$http, Notification) {
    
    var init = function(){
      //redireciona para login caso não haja token
      if(localStorage.getItem("server") ==  null){
        Notification.warning({message:'Defina um servidor', delay: 3000});
        console.log("server é nulo, defina um novo servidor");
      }else{
        $scope.server = localStorage.getItem("server");
      }
      
    }
    init();

   $scope.defineServer = function(){
      
      server = document.getElementById('server').value;

      if(server == ''){
        Notification.warning({message:'O servidor não pode ser vazio', delay: 3000});
        return
      }
      
      if(server.includes('http://')){
        server = server.replace("http://","");
      }
      
      localStorage.setItem("server", 'http://'+server.trim());
      window.location.href = "login.html";
    }

    $scope.reDefineServer = function(){
      localStorage.clear();
      $scope.server = localStorage.getItem("server");
    }
});