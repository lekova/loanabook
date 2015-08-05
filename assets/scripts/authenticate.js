//jQuery.ajax
$(function(){
  'use strict';
  var sa = '//localhost:3000';
  //var sa = 'https://young-citadel-2431.herokuapp.com';
  // var sa = 'http://10.13.108.54:3000';
  var token;
  var gameWatcher;

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

  $("#login").on('click', function(e){
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
    }).done(function(data){
      console.log("Successfully authenticated");
      token = data.token;
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("There was an error in authentication: " + jqxhr);
      $('#result').val('login failed');
    });
  });

  $("#list").on('click', function(e){
    $.ajax(sa + '/users', {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
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
        Authorization: 'Token token=' + $('#token').val()
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
        Authorization: 'Token token=' + $('#token').val()
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
        Authorization: 'Token token=' + $('#token').val()
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
        Authorization: 'Token token=' + $('#token').val()
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
      Authorization: 'Token token=' + $('#token').val()
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
});
