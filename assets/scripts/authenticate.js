'use strict';
var Authenticator = (function(){
  var sa = '//localhost:3000';
  //var sa = 'https://young-citadel-2431.herokuapp.com';
  // var sa = 'http://10.13.108.54:3000';
  var token;
  var gameWatcher;

  var setLoginMessage = function(success) {
    if (success) {
      $("#result-login-message").addClass('bg-success message');
      $("#result-login-message").text('You have successfully logged in!');
    } else {
      $("#result-login-message").addClass('bg-danger message');
      $("#result-login-message").text('Incorrect username or password!');
    }
  };

  var init = function() {
    $("#load-login-btn").on("click", function() {
      console.log("load-login-btn clicked");
      var className = $("#result-login-message").attr("class");
      $("#result-login-message").removeClass(className);
      $("#result-login-message").text('');
    });

    $("#register").on('click', function(e) {
      $.ajax(sa + '/users', {
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
          credentials: {
            email: $('#email').val(),
            password: $('#password').val(),
            password_confirmation: $('#password').val()
          }
        }),
        dataType: 'json',
        method: 'POST'
      }).done(function(data, textStatus, jqxhr) {
        $('#result').val(JSON.stringify(data));
      }).fail(function(jqxhr, textStatus, errorThrown) {
        console.log("There was an error in authentication: " + jqxhr);
        $('#result').val('registration failed');
      });
    });

    $("#login").on('click', function(e) {
      console.log('login button clicked');

      $.ajax(sa + "/login", {
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
          credentials: {
            email: $('#email').val(),
            password: $('#password').val()
          }
        }),
        dataType: 'json',
        method: 'POST'
      }).done(function(data) {
        console.log("Successfully authenticated");
        simpleStorage.set('token', data.token);
        console.log(token);
        setLoginMessage(true);
        // $("#exampleModal").modal('hide');
        $('#account-btn').show();
        $('#load-login-btn').hide();
      }).fail(function(jqxhr, textStatus, errorThrown){
        console.log("There was an error in authentication: ");
        console.log(jqxhr);
        setLoginMessage(false);
      });
    });

    $("#list").on('click', function(e){
      $.ajax(sa + '/users', {
        dataType: 'json',
        method: 'GET',
        headers: {
          Authorization: 'Token token=' + token
        }
      }).done(function(data){
        $("#result").val(JSON.stringify(data));
      }).fail(function(){
        $("#result").val('list failed');
      });
    });

    $("#create").on('click', function(e){
      $.ajax(sa + '/games', {
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({}),
        dataType: 'json',
        method: 'POST',
        headers: {
          Authorization: 'Token token=' + token
        }
      }).done(function(data){
        $("#result").val(JSON.stringify(data));
      }).fail(function(){
        $("#result").val('create failed');
      });
    });

    $("#show").on("click", function(e){
      $.ajax(sa + '/games/' + $("#id").val(), {
        dataType: 'json',
        method: 'GET',
        headers: {
          Authorization: 'Token token=' + token
        }
      }).done(function(data, textStatus, jqxhr){
        $("#result").val("");
        $("#result").val(JSON.stringify(data));
      }).fail(function(jqxhr, textStatus, errorThrown){
        $("#result").val('show failed');
      });
    });

    $("#join").on("click", function(e){
      $.ajax(sa + '/games/' + $('#id').val(), {
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({}),
        dataType: 'json',
        method: 'PATCH',
        headers: {
          Authorization: 'Token token=' + token
        }
      }).done(function(data, textStatus, jqxhr){
        $("#result").val("");
        $("#result").val(JSON.stringify(data));
      }).fail(function(jqxhr, textStatus, errorThrown){
        $("#result").val('join failed');
      });
    });

    $("#move").on("click", function(e){
      $.ajax(sa + '/games/' + $('#id').val(), {
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
          game: {
            cell: {
              index: $("#index").val(),
              value: $("#value").val()
            }
          }
        }),
        dataType: 'json',
        method: 'PATCH',
        headers: {
          Authorization: 'Token token=' + token
        }
      }).done(function(data, textStatus, jqxhr){
        $("#result").val("");
        $("#result").val(JSON.stringify(data));
      }).fail(function(jqxhr, textStatus, errorThrown){
        $("#result").val('move failed');
      });
    });

    $("#watch").on("click", function(){
      gameWatcher = resourceWatcher(sa + "/games/" + $("#id").val() + "/watch", {
        Authorization: 'Token token=' + token
      });
      gameWatcher.on('change', function(data) {
        var parsedData = JSON.parse(data);
        // if (parsedData.timeout) { //not and error
        //   gameWatcher.close();
        //   return console.warn(parsedData.timeout);
        // }
        var gameData = parsedData.game;
        var cell = gameData.cell;

        $("#index").val(cell.index);
        $("#value").val(cell.value);
      });
      gameWatcher.on('error', function(e) {
        console.log("an error has occurred", e);
      });
    });
  };

  return {
    getToken: function(){ return token; },
    init: init
  };
})();
