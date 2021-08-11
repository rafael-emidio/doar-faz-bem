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

    $scope.urlCadastro = server+'/usuarios';

    $scope.cadastrar = function(){
      nome = document.getElementById('nome').value;
      cpf = document.getElementById('cpf').value;
      email = document.getElementById('email').value;
      telefone = document.getElementById('telefone').value;
      endereco = document.getElementById('endereco').value;
      senha = document.getElementById('senha').value;
      confirm_senha = document.getElementById('confirm_senha').value;
      tipo = $("input[type='radio'][name='tipo']:checked").val();
      tipo_doacao = $("#tipo_doacao").val();
      tipo_doacao = tipo_doacao.join();

      // if(!isValidCPF(cpf)){
      //   Notification.warning({message:'Por favor digite um CPF válido para realizar o cadastro.', delay: 3000});
      //   return
      // }

      if(senha != confirm_senha){
        Notification.warning({message:'A senha não pôde ser confirmada pois não são iguais, por favor confirme a senha novamente.', delay: 3000});
        return
      }

      if(tipo_doacao == ''){
        Notification.warning({message:'Selecione pelo menos um tipo de doação.', delay: 3000});
        return
      }

      cpf = cpf.replace(/[\s.-]*/igm, '')
      telefone = telefone.replace(/[\s()-]*/igm, '')

      console.log('cadastro - CPF: '+cpf+
                    ' telefone: '+telefone+
                    ' nome: '+nome+
                    ' email: '+email+
                    ' endereco: '+endereco+
                    ' senha: '+senha+
                    ' confirm_senha: '+confirm_senha+
                    ' tipo: '+tipo+
                    ' tipo_doacao: '+tipo_doacao
                );

      $http({
        method: 'POST',
        url: $scope.urlCadastro,
        data: {
            id: 0,
            nome: nome,
            cpf: cpf,
            senha: senha,
            email: email,
            telefone: telefone,
            endereco: endereco,
            tipo: tipo,
            tipo_doacao: tipo_doacao,
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Cadastro efetuado com sucesso!', delay: 1500});
            usuario = response.data;
            //redirteciona usuario para login
            window.location.href = "login.html";

          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro - '+response.data.mensagem, delay: 1500});
          }

        }, function(response) {

          Notification.error({message:'Não foi possivel efetuar o cadastro - '+response.data.mensagem, delay: 1500});
          console.log(response.status);
        });
    }

   $scope.logout = function(){
      localStorage.clear();
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