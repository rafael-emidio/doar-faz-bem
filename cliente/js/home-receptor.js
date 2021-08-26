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

      payload = parseJwt(localStorage.getItem('token'))
      receptorId = payload['id']

      var now = new Date(),
      // minimum date the user can choose, in this case now and in the future
      minDate = now.toISOString().substring(0,10);

      $('#data').prop('min', minDate);
      
      console.log('servidor: '+server);

      $scope.urlLoadSolicitacoesUsuario = server+'/usuarios/'+receptorId+'/solicitacoes';

      loadSolicitacoes();
      $scope.id = 0
    }
    init();

    $scope.urlLogout = server+'/logout';
    $scope.urlCadastroSolicitacao = server+'/solicitacoes';

    function loadSolicitacoes(){
      $http({
        method: 'GET',
        url: $scope.urlLoadSolicitacoesUsuario,
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

    $scope.deletaDadosSoli = function(id){
      if(!confirm('Deseja deletar a solicitação '+id+' ?')){
        return
      }
      $http({
        method: 'DELETE',
        url: $scope.urlCadastroSolicitacao+'/'+id,
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
            Notification.error({message:'Não foi possivel deletar a solicitação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel deletar a solicitação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel deletar a solicitação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    $('#modalsolicitacao').on('hidden.bs.modal', function () {
      $("input[type='radio'][name='tipo']").prop("checked", false);
      $scope.id = 0
      location.reload();
    })

    $scope.setaDadosModalSoli = function(id){
      console.log(id);
      $http({
        method: 'GET',
        url: $scope.urlCadastroSolicitacao+'/'+id,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

          $scope.id = response.data.id

          $scope.doacaoId = response.data.doacaoId

          $scope.data = response.data.data

          $scope.tipo_doacao = response.data.tipo_doacao

          $scope.status = response.data.status

          if (response.status==200){
            //Notification.success({message: 'Busca de solicitação efetuada com sucesso!', delay: 3000});
            
            $("input[type='radio'][name='tipo'][value='"+response.data.tipo_doacao+"']").prop("checked", true);

            $('#modalsolicitacao').modal('show');

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

    $scope.cadastrarSolicitacao = function(){
      var now = new Date(),
      // minimum date the user can choose, in this case now and in the future
      minDate = now.toISOString().substring(0,10);

      tipo_doacao = $("input[type='radio'][name='tipo']:checked").val();

      $http({
        method: 'POST',
        url: $scope.urlCadastroSolicitacao,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
            id: 0,
            receptorId: receptorId,
            data: minDate,
            tipo_doacao: tipo_doacao,
            status: false,
            doacaoId: 0
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Cadastro de solicitação efetuado com sucesso!', delay: 3000});
            solicitacao = response.data;
            //recarrega a página para exibir a lista
            location.reload();

          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro da solicitação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar o cadastro da solicitação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro da solicitação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    
    $scope.editarSolicitacao = function(){
      var now = new Date(),
      // minimum date the user can choose, in this case now and in the future
      minDate = now.toISOString().substring(0,10);

      tipo_doacao = $("input[type='radio'][name='tipo']:checked").val();

      if($scope.tipo_doacao == tipo_doacao){
        minDate = $scope.data
      }

      $http({
        method: 'PUT',
        url: $scope.urlCadastroSolicitacao,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
          id: $scope.id,
          receptorId: receptorId,
          data: minDate,
          tipo_doacao: tipo_doacao,
          status: $scope.status,
          doacaoId: $scope.doacaoId
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Editado com sucesso!', delay: 3000});
            //recarrega a página para exibir a lista
            location.reload();

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

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
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