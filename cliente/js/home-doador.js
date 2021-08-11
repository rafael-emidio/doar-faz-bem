angular.module('appIndex', ['ui-notification'])
.controller('indexCtrl', function($scope,$timeout,$http, Notification) {
    const server = localStorage.getItem("server");
    
    var init = function(){
      if(localStorage.getItem("server") ==  null || server == null){
        window.location.href = "index.html";
      }
      
      //redireciona para login caso não haja token
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }
      
      console.log('servidor: '+server);
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

          if (response.status==204){
            Notification.success({message: 'Logout efetuado com sucesso!', delay: 3000});
            
          }else{
            Notification.error({message:'Não foi possivel efetuar logout - '+response.data.mensagem, delay: 3000});
          }

        }, function(response) {

          Notification.error({message:'Não foi possivel efetuar logout - '+response.data.mensagem, delay: 3000});
          console.log(response.status);
          return
        });

      localStorage.removeItem('token');
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }
    }

});