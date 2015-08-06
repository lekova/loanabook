function showLoginForm() {
  $('#register-box').fadeOut('fast',function() {
      $('#login-box').fadeIn('fast');
      $('#modal-register-footer').fadeOut('fast',function() {
          $('#model-label-header').text('Login');
          $('#modal-login-footer').fadeIn('fast');
      });
  });
};

function showRegisterForm() {
  $('#login-box').fadeOut('fast',function() {
      $('#register-box').fadeIn('fast');
      $('#modal-login-footer').fadeOut('fast',function() {
          $('#model-label-header').text('Register');
          $('#modal-register-footer').fadeIn('fast');
      });
  });
};

var renderIndexPage = function() {
  var templatingFunction = Handlebars.compile($('#index-page-template').html());
  $.ajax({
    url: "http://localhost:3000/books",
    method: 'GET' //,
  }).done(function(books, textStatus, jqxhr){
    console.log(books);
    var html = templatingFunction(books);
    $("#page").html(html);
  }).fail(function(jqxhr, textStatus, errorThrown){
    console.log(books);
    console.log(textStatus);
    console.log(jqxhr.responseText);
  });
};

var booksPageTemplate = Handlebars.compile($("#books-page-template").html());

var displayBook = function() {

};

var renderCreateBookPage = function(title) {
  var templatingFunction = Handlebars.compile($('#create-book-template').html());
  var html = templatingFunction(title);
  $("#page").html(html);
};

$(document).ready(function() {
  Authenticator.init();

  $('#account-btn').hide();

  renderIndexPage("Books List");

  $("#page").on("click", "#thumbnail-btn", function() {
    var clicked = $(this).data('id');
    console.log("CLICKED BUTTON NUMBER " + clicked);
  });

  $("#create-a-book-dd-btn").on("click", function(){
    console.log("#create-a-book-dd-btn clicked");
    renderCreateBookPage("Create new book");
  });

  //create book with Ajax
  $("#page").on("click", "#book-create", function() {
    console.log("book create clicked");
    debugger;
    $.ajax({
      url: 'http://localhost:3000/books',
      method: 'POST',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') },
      data: {
        book: {
          title: $("#book-title").val(),
          author: $("#book-author").val(),
          year: $("#book-year").val(),
          price: $("#book-price").val(),
          // summary: $("book-summary").val(),
          url: $("#book-url").val()
        }
      }
    }).done(function(book, textStatus, jqxhr){
      console.log("Book created successfully");
      $("#book-title").text(book.title);
      $("#book-title").attr('readonly', 'readonly');
      $("#book-author").text(book.author);
      $("#book-year").text(book.year);
      $("#book-price").text(book.price);
      // $("#book-summary").text(book.summary);
      $("#book-url").text(book.url);
    }).fail(function(jqxhr, textStatus, errorThrown){

      console.log(textStatus);
      console.log(jqxhr.responseText);
    });
  });

  //show user books
  $("#my-books").on("click", function() {
    console.log("my books clicked");

    $.ajax({
      url: "http://localhost:3000/books?limit=me",
      method: 'GET',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(data, textStatus, jqxhr){
      $("#page").html(booksPageTemplate({heading: "My Books", books: data.books}));
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("There was an error while LISTING CURRENT USER'S books, error: " + jqxhr);
      $("#book-label").html(jqxhr.responseText);
    });
  });

  // show all boks
  $("#books-show").on("click", function() {
    $("#book-label").html();

    $.ajax({
      url: "http://localhost:3000/books",
      method: 'GET' //,
      // headers: { Authorization: 'Token token=' + $('#token').val()}
    }).done(function(data, textStatus, jqxhr){
      $("#page").html(booksPageTemplate({heading: "All Books", books: data.books}));
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("There was an error while LISTING ALL the books, error: " + jqxhr);
      $("#book-label").html(jqxhr.responseText);
    });
  });

  // update Book with Ajax
  $("#book-update").on("click", function() {
    $.ajax({
      url: 'http://localhost:3000/books/' + $("#book-id").val(),
      method: 'PATCH',
      headers: { Authorization: 'Token token=' + $('#token').val()},
      data: {
        book: {
          title: $("#book-title").val(),
          author: $("#book-author").val(),
          year: $("#book-year").val(),
          price: $("#book-price").val(),
          url: $("#book-url").val(),
          status: $("#book-status").val()
        }
      }
    }).done(function(book, textStatus, jqxhr) {
      $("#book-label").html(bookTemplate(book));
    }).fail(function(jqxhr, textStatus, errorThrown) {
      console.log("textStatus: " + textStatus);
      $("#book-label").html(jqxhr.responseText);
    });
  });

  //destroy Book with Ajax
  $("#book-destroy").on('click', function() {
   $.ajax({
     url: 'http://localhost:3000/books/' + $("#book-id").val(),
     method: 'DELETE'
   }).done(function(book, textStatus, jqxhr){
     console.log("Your book has been deleted, here is some data about it: " + data);
   }).fail(function(jqxhr, textStatus, errorThrown) {
    $("#book-label").html(jqxhr.responseText);
   });
  });

  // ------------------ Loan ---------------
  //create Loan with Ajax
  $("#loan-create").on('click', function() {
    $.ajax({
      url: 'http://localhost:3000/loans',
      method: 'POST',
      data: {
        loan: {
          name: $("#name").val(),
          born: $("#born").val(),
          died: $("#ded").val()
        }
      }
    }).done(function(book, textStatus, jqxhr){
      console.log("I'm a robot that created a person.");
    }).fail(function(jqxhr, textStatus, errorThrown) {
      $("#loan-label").html(jqxhr.responseText);
    });
  });

  //update Loan with Ajax
  $("#loan-update").on('click', function(){
    $.ajax({
      url: 'http://localhost:3000/loans/' + $("#user-id").val(),
      method: 'PATCH',
      data: {
        loan: {
          name: $("#name").val(),
          born: $("#born").val(),
          died: $("#died").val()
        }
      }
    }).done(function(book, textStatus, jqxhr){
      console.log("I'm a robot that UPDATED a person.");
    }).fail(function(jqxhr, textStatus, errorThrown) {
      $("#loan-label").html(jqxhr.responseText);
    });
  });

  //destroy Loan with Ajax
  $("#loan-destroy").on('click', function(){
    $.ajax({
      url: 'http://localhost:3000/loans/' + $("#user-id").val(),
      method: 'DELETE'
    }).done(function(book, textStatus, jqxhr){
      console.log("This loan has been added to your list of deleted loans.");
    }).fail(function(jqxhr, textStatus, errorThrown) {
      $("#loan-label").html(jqxhr.responseText);
    });
  });

  // ------------------ Role ---------------
  //create Role with Ajax
  $("#role-create").on('click', function(){
   $.ajax({
     url: '/roles',
     method: 'POST',
     data: {
       role: {
         name: $("#role-name").val(),
         movie_id: $("#role-movie-id").val(),
         person_id: $("#role-person-id").val()
       }
     }
   }).done(function(book, textStatus, jqxhr){
     console.log("I'm a robot that created a person.");
   }).fail(function(data){
     console.log("YOU DONE FUCKED UP NOW!");
   });
  });

  //update Role with Ajax
  $("#role-update").on('click', function(){
   $.ajax({
     url: '/roles/' + $("#role-id").val(),
     method: 'PATCH',
     data: {
       role: {
         name: $("#role-name").val(),
         movie_id: Number($("#role-movie-id").val()),
         person_id: Number($("#role-person-id").val())
       }
     }
   }).done(function(book, textStatus, jqxhr){
     console.log("Chris is crazy about updating some roles around.");
   }).fail(function(data){
     console.log("YOU FUCKED UP NOW!");
   });
  });

  //destroy Role with Ajax
  $("#role-destroy").on('click', function(){
   $.ajax({
     url: '/roles/' + $("#role-id").val(),
     method: 'DELETE'
   }).done(function(book, textStatus, jqxhr){
     console.log("Chris hated this ROLE and got it DELETED.");
   }).fail(function(data){
     console.log("YOU FUCKED UP NOW!");
   });
  });

  // ------------------ Review ---------------
  //create Review with Ajax
  $("#review-create").on("click", function() {
   $.ajax({
     url: '/reviews',
     method: 'POST',
     data: {
       review: {
         score: $("#review-score").val(),
         content: $("#review-content").val(),
         movie_id: $("#review-movie-id").val(),
         user_id: $("#review-user-id").val()
       }
     }
   }).done(function(book, textStatus, jqxhr){
    console.log("Chris is a robot that created a review");
   }).fail(function(date){
    console.log("Everything has gone to hell with creating review!");
   })
  });

  // update Review with Ajax
  $("#review-update").on("click", function() {
   $.ajax({
     url: '/reviews/' + $("#review-id").val(),
     method: 'PATCH',
     data: {
       review: {
         score: $("#review-score").val(),
         content: $("#review-content").val(),
         movie_id: Number($("#review-movie-id").val()),
         user_id: Number($("#review-user-id").val())
       }
     }
   }).done(function(book, textStatus, jqxhr){
    console.log("Chris is a robot that UPDATED a review");
   }).fail(function(date){
    console.log("Everything has gone to hell with Updating this review!");
   })
  });

  //destroy Review with Ajax
  $("#review-destroy").on('click', function(){
   $.ajax({
     url: '/reviews/' + $("#review-id").val(),
     method: 'DELETE'
   }).done(function(book, textStatus, jqxhr){
     console.log("I'm a robot that DELETED a review.");
   }).fail(function(data){
    console.log("Everything has gone to hell with deleting this review!");
   });
  });
});
