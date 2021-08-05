angular.module('appIndex', [])
.controller('indexCtrl', function($scope,$timeout,$http) {

    $(document).ready(function() {
        $('.select-multiple').select2({
          placeholder: "Selecione a doação",
          allowClear: true
        });
    });
    var init = function(){
      loadEntregas();
    }
    //init();

   $scope.urlAtualizaValor = 'php/entrega/atualizaValor.php';

    function loadEntregas(){
      $http.get('php/entrega/loadEntrega.php').
      then(function(response) {

          let status = response.status;
          $scope.entregas = response.data;

        }, function(response) {

          $scope.entregas = response.data || 'Request failed';
          let status = response.status;
       
        });
    }
    
    $scope.atualizarValor = function(id,valor){

      $http({method: 'POST', url: $scope.urlAtualizaValor,data: { id: id, valor: valor}}).
      then(function(response) {

          let status = response.status;
          console.log(response.data);
          if (response.data==1){
            Notification.success({message:'Valor da entrega #'+id+' atualizado com sucesso.', delay: 4000});
            loadEntregas();
          }else{
            Notification.error({message:'Não foi possível atualizar o valor da entrega #'+id+', tente novamente mais tarde.', delay: 5000});
          }

        }, function(response) {

          console.log(response.data+' - Request failed');
          let status = response.status;
          Notification.error({message:'Não foi possível atualizar o valor da entrega #'+id+', houve algum erro de conexão :(', delay: 5000});
       
        });
    }

    $scope.logOut = function(){
      
      $scope.url = 'php/login/logout.php';
      $http({
          method: 'POST',
          url: $scope.url,
      }).
          then(function (response) {
              let status = response.status;
              $scope.logout = response.data;
              console.log("data logout: ",$scope.logout);
              window.location =  'https://agenciafrato.com.br/projeto-coxinha/admin/login/';
          }, function (response) {

              $scope.logout = response.data || 'Request failed';
              let status = response.status;
              console.log("erro: " + status);
          });
  }
  

});