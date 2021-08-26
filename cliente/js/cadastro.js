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

      if(nome == '' ||
          cpf == '' ||
          email == '' ||
          telefone == '' ||
          endereco == '' ||
          senha == '' ||
          confirm_senha == ''
        ){
        return
      }

      if(senha != confirm_senha){
        Notification.warning({message:'A senha não pôde ser confirmada pois não são iguais, por favor confirme a senha novamente.', delay: 3000});
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
                    ' tipo: '+tipo
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
            tipo: tipo
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Cadastro efetuado com sucesso!', delay: 3000});
            usuario = response.data;
            //redirteciona usuario para login
            window.location.href = "login.html";

          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar o cadastro - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

});