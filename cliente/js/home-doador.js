angular.module('appIndex', ['ui-notification'])
.controller('indexCtrl', function($scope,$timeout,$http, Notification) {
    const server = localStorage.getItem("server");
    let doadorId = '';
   
    var init = function(){
      if(localStorage.getItem("server") ==  null || server == null){
        window.location.href = "index.html";
      }
      
      //redireciona para login caso não haja token
      if(localStorage.getItem("token") ==  null){
        window.location.href = "login.html";
      }

      payload = parseJwt(localStorage.getItem('token'))
      doadorId = payload['id']

      var now = new Date(),
      // minimum date the user can choose, in this case now and in the future
      minDate = now.toISOString().substring(0,10);

      $('#data').prop('min', minDate);
      
      console.log('servidor: '+server);

      $scope.urlLoadDoacoesUsuario = server+'/usuarios/'+doadorId+'/doacoes';

      loadDoacoes();
    }
    init();

    $scope.urlLogout = server+'/logout';
    $scope.urlCadastroDoacao = server+'/doacoes';

    function loadDoacoes(){
      $http({
        method: 'GET',
        url: $scope.urlLoadDoacoesUsuario,
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
    $scope.deletaDados = function(id){
      $http({
        method: 'DELETE',
        url: $scope.urlCadastroDoacao+'/'+id,
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
            Notification.error({message:'Não foi possivel deletar a doação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel deletar a doação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel deletar a doação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }
    
    $scope.setaDadosModal = function(id){
      console.log(id);
      $http({
        method: 'GET',
        url: $scope.urlCadastroDoacao+'/'+id,
        headers: {
           'token': localStorage.getItem("token")
         }
        }).
      then(function(response) {

          $scope.id = response.data.id

          console.log(response.status);
          console.log(response);

          if (response.status==200){
            Notification.success({message: 'Busca de doação efetuada com sucesso!', delay: 3000});
            
            document.getElementById('data').value = response.data.data;
            document.getElementById('local').value = response.data.local;
            document.getElementById('quantidade_total').value = response.data.quantidade_total;
            document.getElementById('quantidade_restante').value = response.data.quantidade_restante;
            $("input[type='radio'][name='tipo'][value='"+response.data.tipo_doacao+"']").prop("checked", true);

            $('#modaldoacao').modal('show');

          }else{
            Notification.error({message:'Não foi possivel efetuar a busca da doação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar a busca da doação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar a busca da doação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    $scope.cadastrarDoacao = function(){
      data = document.getElementById('data').value;
      local = document.getElementById('local').value;
      quantidade_total = document.getElementById('quantidade_total').value;
      quantidade_restante = document.getElementById('quantidade_restante').value;

      tipo_doacao = $("input[type='radio'][name='tipo']:checked").val();

      console.log(doadorId)

      console.log('cadastro - data: '+data+
                    ' local: '+local+
                    ' tipo_doacao: '+tipo_doacao+
                    ' quantidade_total: '+quantidade_total+
                    ' quantidade_restante: '+quantidade_restante
                );

      $http({
        method: 'POST',
        url: $scope.urlCadastroDoacao,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
            id: 0,
            doadorId: doadorId,
            data: data,
            local: local,
            tipo_doacao: tipo_doacao,
            quantidade_total: quantidade_total,
            quantidade_restante: quantidade_total,
            }
        }).
      then(function(response) {

          console.log(response.status);

          if (response.status==200){
            Notification.success({message: 'Cadastro de doação efetuado com sucesso!', delay: 3000});
            doacao = response.data;
            //recarrega a página para exibir a lista
            location.reload();

          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro da doação - '+response.data.mensagem, delay: 5000});
          }

        }, function(response) {

          if(response.data){
            Notification.error({message:'Não foi possivel efetuar o cadastro da doação - '+response.data.mensagem, delay: 5000});
          }else{
            Notification.error({message:'Não foi possivel efetuar o cadastro da doação - servidor inválido, por favor redefina o servidor', delay: 5000});
          }
          
          console.log(response.status);
        });
    }

    
    $scope.editarDoacao = function(){
      data = document.getElementById('data').value;
      local = document.getElementById('local').value;
      quantidade_total = document.getElementById('quantidade_total').value;
      quantidade_restante = document.getElementById('quantidade_restante').value;

      tipo_doacao = $("input[type='radio'][name='tipo']:checked").val();

      console.log(doadorId)

      console.log('cadastro - data: '+data+
                    ' local: '+local+
                    ' tipo_doacao: '+tipo_doacao+
                    ' quantidade_total: '+quantidade_total+
                    ' quantidade_restante: '+quantidade_restante
                );

      $http({
        method: 'PUT',
        url: $scope.urlCadastroDoacao,
        headers: {
           'token': localStorage.getItem("token")
         },
        data: {
            id: $scope.id,
            doadorId: doadorId,
            data: data,
            local: local,
            tipo_doacao: tipo_doacao,
            quantidade_total: quantidade_total,
            quantidade_restante: quantidade_restante,
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