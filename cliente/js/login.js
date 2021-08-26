angular.module('appIndex', ['ui-notification'])
.controller('indexCtrl', function($scope,$timeout,$http, Notification) {
    const server = localStorage.getItem("server");
    $(document).ready(function() {
        $('.select-multiple').select2({
          placeholder: "Selecione a doação",
          allowClear: true
        });
    });

    var init = function(){
      if(localStorage.getItem("server") ==  null || server == null){
        window.location.href = "index.html";
      }
      console.log('servidor: '+server);
    }

    init();

    $scope.urlLogin = server+'/login';

    $scope.login = function(){
      cpf = document.getElementById('cpf').value;
      senha = document.getElementById('senha').value;

      if(cpf == ''){
        return
      }

      // if(!isValidCPF(cpf)){
      //   Notification.warning({message:'Por favor digite um CPF válido para realizar o login.', delay: 3000});
      //   return
      // }

      cpf = cpf.replace(/[\s.-]*/igm, '')
      console.log('login - CPF: '+cpf);

      $http({method: 'POST', url: $scope.urlLogin,data: { cpf: cpf, senha: senha}}).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Login efetuado com sucesso!', delay: 3000});
            res = response.data;
            usuario = res.usuario;
            localStorage.setItem("token", res.token);
            //redirteciona usuario de acordo com o tipo
            if(usuario.tipo == 0){
              window.location.href = "home-doador.html";
            }else if(usuario.tipo == 1) {
              window.location.href = "home-receptor.html";
            }else if(usuario.tipo == 2) {
              window.location.href = "home-admin.html";
            }

          }else{
            Notification.error({message:'Não foi possivel efetuar login - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {
          if(response.data){
            Notification.error({message:'Não foi possivel efetuar login - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar login - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

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
    
    function isValidCPF(cpf) {
      if (typeof cpf !== "string") return false
      cpf = cpf.replace(/[\s.-]*/igm, '')
      if (
          !cpf ||
          cpf.length != 11 ||
          cpf == "00000000000" ||
          cpf == "11111111111" ||
          cpf == "22222222222" ||
          cpf == "33333333333" ||
          cpf == "44444444444" ||
          cpf == "55555555555" ||
          cpf == "66666666666" ||
          cpf == "77777777777" ||
          cpf == "88888888888" ||
          cpf == "99999999999" 
      ) {
          return false
      }
      var soma = 0
      var resto
      for (var i = 1; i <= 9; i++) 
          soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
      resto = (soma * 10) % 11
      if ((resto == 10) || (resto == 11))  resto = 0
      if (resto != parseInt(cpf.substring(9, 10)) ) return false
      soma = 0
      for (var i = 1; i <= 10; i++) 
          soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
      resto = (soma * 10) % 11
      if ((resto == 10) || (resto == 11))  resto = 0
      if (resto != parseInt(cpf.substring(10, 11) ) ) return false
      return true
  } 

});