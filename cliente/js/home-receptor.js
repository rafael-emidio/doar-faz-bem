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
    
    $scope.urlLogout = server+'/logout';

   $scope.logout = function(){
      
      $http({
        method: 'POST',
        headers: {
           'token': localStorage.getItem("token")
         },
        url: $scope.urlLogout
      }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Logout efetuado com sucesso!', delay: 1500});
            
          }else{
            Notification.error({message:'Não foi possivel efetuar logout - '+response.data.mensagem, delay: 1500});
          }

        }, function(response) {

          Notification.error({message:'Não foi possivel efetuar logout - '+response.data.mensagem, delay: 1500});
          console.log(response.status);
          return
        });

      localStorage.clear();
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }
    }

});