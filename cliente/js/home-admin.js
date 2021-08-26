angular.module('appIndex', ['ui-notification'])
.controller('indexCtrl', function($scope,$timeout,$http, Notification) {
    const server = localStorage.getItem("server");
    $(document).ready(function() {
        $('.select-multiple').select2({
          placeholder: "Selecione a doação",
          allowClear: true
        });
    });

    $scope.id = 0

    var init = function(){
      if(localStorage.getItem("server") ==  null || server == null){
        window.location.href = "index.html";
      }
      console.log('servidor: '+server);
      $scope.urlLoadUsuarios = server+'/usuarios';
      $scope.urlLoadSolicitacoes = server+'/solicitacoes';
      $scope.urlLoadDoacoes = server+'/doacoes';
      loadUsuarios();
      loadSolicitacoes();
      loadDoacoes();
    }
    init();

    $scope.urlLogout = server+'/logout';
    $scope.urlCadastro = server+'/usuarios';
     $scope.urlSolicitacoes = server+'/solicitacoes';
     $scope.urlDoacoes = server+'/solicitacoes';
    
    $('#modalusuario').on('hidden.bs.modal', function () {
      document.getElementById('nome').value = '';
      document.getElementById('cpf').value = '';
      document.getElementById('email').value = '';
      document.getElementById('telefone').value = '';
      document.getElementById('endereco').value = '';
      document.getElementById('senha').value = '';
      document.getElementById('confirm_senha').value = '';
      $("input[type='radio'][name='tipo']").prop("checked", false);
      $scope.id = 0
    })

    function loadUsuarios(){
      $http({
        method: 'GET',
        url: $scope.urlLoadUsuarios,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

        if (response.status==200){
            $scope.usuarios = response.data;

          }else{
            Notification.error({message:'Não foi possivel carregar os usuários - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel carregar os usuários - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel carregar os usuários - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          console.log(response.status)
        });
      
    }

    function loadSolicitacoes(){
      $http({
        method: 'GET',
        url: $scope.urlLoadSolicitacoes,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

        if (response.status==200){
            $scope.solicitacoes = response.data;
          }else{
            Notification.error({message:'Não foi possivel carregar as solicitações - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel carregar as solicitações - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel carregar as solicitações - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          console.log(response.status)
        });
      
    }

    function loadDoacoes(){
      $http({
        method: 'GET',
        url: $scope.urlLoadDoacoes,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

        if (response.status==200){
            $scope.doacoes = response.data;

          }else{
            Notification.error({message:'Não foi possivel carregar as doações - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel carregar as doações - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel carregar as doações - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          console.log(response.status)
        });
      
    }

    $scope.confirmReceb = function(id, solic){
      console.log(id);
      $scope.solicitacaoAtual = solic;
      $http({
        method: 'GET',
        url: $scope.urlSolicitacoes+'/'+id+'/disponibilidade',
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

          if (response.status==200){
            //Notification.success({message: 'Busca de solicitação efetuada com sucesso!', delay: 3000});
            if(response.data==''){
              Notification.warning({message:'Não existem doações disponíveis para a solicitação', delay: 5000});
              return
            }
            $scope.doacoes = response.data;

            $('#modalconfirm').modal('show');

          }else{
            Notification.error({message:'Não foi possivel verificar a disponibilidade da solicitação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel verificar a disponibilidade da solicitação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel verificar a disponibilidade da solicitação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    $scope.selecionaDoacao = function(idDoacao, doacao){
       console.log(doacao)
      doacao.quantidade_restante = doacao.quantidade_restante - 1
      
      $http({
        method: 'PUT',
        url: $scope.urlDoacoes,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
            id: doacao.id,
            doadorId: doacao.doadorId,
            data: doacao.data,
            local: doacao.local,
            tipo_doacao: doacao.tipo_doacao,
            quantidade_total: doacao.quantidade_total,
            quantidade_restante: doacao.quantidade_restante,
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Doação atualizada com sucesso!', delay: 3000});
            //recarrega a página para exibir a lista
            //location.reload();

          }else{
            Notification.error({message:'Não foi possivel efetuar a edição da doação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar a edição da doação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar a edição da doação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });

      $http({
        method: 'PUT',
        url: $scope.urlSolicitacoes,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
          id: $scope.solicitacaoAtual.id,
          receptorId: $scope.solicitacaoAtual.receptorId,
          data: $scope.solicitacaoAtual.data,
          tipo_doacao: $scope.solicitacaoAtual.tipo_doacao,
          status: true,
          doacaoId: doacao.id
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Solicitação atualizada com sucesso!', delay: 3000});
            //recarrega a página para exibir a lista
            //location.reload();

          }else{
            Notification.error({message:'Não foi possivel efetuar a edição da doação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar a edição da doação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar a edição da doação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    $scope.cadastrarUsuario = function(){
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
            location.reload();

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

    $scope.setaDadosModalUser = function(id){
      console.log(id);
      $http({
        method: 'GET',
        url: $scope.urlLoadUsuarios+'/'+id,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

          $scope.id = response.data.id

          if (response.status==200){
            //Notification.success({message: 'Busca de solicitação efetuada com sucesso!', delay: 3000});
            document.getElementById('nome').value = response.data.nome;
            document.getElementById('cpf').value = response.data.cpf;
            document.getElementById('email').value = response.data.email;
            document.getElementById('telefone').value = response.data.telefone;
            document.getElementById('endereco').value = response.data.endereco;
            document.getElementById('senha').value = response.data.senha;
            document.getElementById('confirm_senha').value = response.data.senha;
            
            $("input[type='radio'][name='tipo'][value='"+response.data.tipo+"']").prop("checked", true);

            $('#modalusuario').modal('show');

          }else{
            Notification.error({message:'Não foi possivel efetuar a busca da solicitação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar a busca da solicitação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar a busca da solicitação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    $scope.editarUsuario = function(){
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

      console.log('editar - CPF: '+cpf+
                    ' telefone: '+telefone+
                    ' nome: '+nome+
                    ' email: '+email+
                    ' endereco: '+endereco+
                    ' senha: '+senha+
                    ' confirm_senha: '+confirm_senha+
                    ' tipo: '+tipo
                );

      $http({
        method: 'PUT',
        url: $scope.urlCadastro,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
            id: $scope.id,
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
            Notification.success({message: 'Atualização efetuada com sucesso!', delay: 3000});
            usuario = response.data;
            location.reload();

          }else{
            Notification.error({message:'Não foi possivel efetuar a atualização - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar a atualização - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar a atualização - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    $scope.deletaDadosUser = function(id){
      if(!confirm('Deseja deletar o usuário '+id+' ?')){
        return
      }
      $http({
        method: 'DELETE',
        url: $scope.urlLoadUsuarios+'/'+id,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

          if (response.status==200){
            Notification.success({message: 'Deletado com sucesso!', delay: 3000});
            //recarrega a página para exibir a lista
            location.reload();

          }else{
            Notification.error({message:'Não foi possivel deletar o usuário - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel deletar o usuário - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel deletar o usuário - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

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
            Notification.success({message: 'Logout efetuado com sucesso!', delay: 1500});
            
          }else{
            Notification.error({message:'Não foi possivel efetuar logout - '+response.data.mensagem, delay: 1500});
          }

        }, function(response) {

          Notification.error({message:'Não foi possivel efetuar logout - '+response.data.mensagem, delay: 1500});
          console.log(response.status);
          return
        });

      localStorage.removeItem('token');
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }
    }

});