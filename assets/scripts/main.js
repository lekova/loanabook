if (simpleStorage.get('token')) {
  $('#account-btn').show();
} else {
  $('#load-login-btn').show();
}

var sa = 'https://loanabookapi.herokuapp.com/';

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
    url: sa + "/books",
    method: 'GET'
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

// ---------------------- Books --------------------------
var setCreateResultMessage = function(success) {
  if (success) {
    $('#create-book-result-message').addClass('bg-success message');
    $('#create-book-result-message').text('Your book was created successfully!');
    $("#create-book-result-message").css();
  } else {
    $("#create-book-result-message").addClass('bg-danger message');
    $("#create-book-result-message").text('Something went wrong!');
  }
}

var booksPageTemplate = Handlebars.compile($("#books-page-template").html());

var renderCreateBookPage = function(book) {
  var templatingFunction = Handlebars.compile($('#create-book-template').html());
  var html = templatingFunction(book);
  $("#page").html(html);
};

var renderDisplayBookPage = function(book) {
  var templatingFunction = Handlebars.compile($('#display-book-template').html());
  var html = templatingFunction(book);
  $("#page").html(html);
};

var renderUpdateBookPage = function(book) {
  var templatingFunction = Handlebars.compile($('#update-book-template').html());
  var html = templatingFunction(book);
  $("#page").html(html);
};

// ---------------------- Loans --------------------------

var renderCreateLoanPage = function(users, books) {
  var templatingFunction = Handlebars.compile($('#create-loan-template').html());
  var html = templatingFunction(users, books);
  $("#page").html(html);
};

$(document).ready(function() {
  Authenticator.init();

  renderIndexPage("Books List");

  // thumbnail button preview book
  $("#page").on("click", "#thumbnail-preview-btn", function() {
    var clicked_id = $(this).data('id');
    console.log("Clicked button number " + clicked_id);
    $.ajax({
      url: sa + "/books/" + clicked_id,
      method: 'GET'
    }).done(function(book, textStatus, jqxhr){
      console.log(book);
      $("#page").html(renderDisplayBookPage(book));

    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(jqxhr.responseText);
    });
  });

  // thumbnail button update book
  $("#page").on("click", "#thumbnail-update-btn", function() {
    var clicked_id = $(this).data('id');
    console.log("Clicked button number " + clicked_id);
    $.ajax({
      url: sa + "/books/" + clicked_id,
      method: 'GET'
    }).done(function(book, textStatus, jqxhr){
      console.log(book);
      $("#page").html(renderUpdateBookPage(book));

    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(jqxhr.responseText);
    });
  });

  $("#create-a-book-dd-btn").on("click", function(){
    console.log("#create-a-book-dd-btn clicked");
    renderCreateBookPage();
  });

  //create book with Ajax
  $("#page").on("click", "#book-create", function() {
    var reader = new FileReader();

    reader.onload = function(event){
      $.ajax({
        url: sa + '/books',
        method: 'POST',
        headers: { Authorization: 'Token token=' + simpleStorage.get('token') },
        data: {
          book: {
            title: $("#book-title").val(),
            author: $("#book-author").val(),
            year: $("#book-year").val(),
            price: $("#book-price").val(),
            image: event.target.result,
            url: $("#book-url").val()
          }
        }
      }).done(function(book, textStatus, jqxhr){
        console.log("Book created successfully");
        $("#book-title").text(book.title);
        $("#book-title").attr('readonly', 'readonly');
        $("#book-author").text(book.author);
        $("#book-author").attr('readonly', 'readonly');
        $("#book-year").text(book.year);
        $("#book-year").attr('readonly', 'readonly');
        $("#book-price").text(book.price);
        $("#book-price").attr('readonly', 'readonly');
        $("#book-url").text(book.url);
        $("#book-url").attr('readonly', 'readonly');
        setCreateResultMessage(true);
      }).fail(function(jqxhr, textStatus, errorThrown){
        console.log(textStatus);
        console.log(jqxhr.responseText);
        setCreateResultMessage(false);
      });
    };

    reader.readAsDataURL($('#book-image-upload')[0].files[0]);

  });

  //show user books
  $("#my-books").on("click", function() {
    console.log("my books clicked");

    $.ajax({
      url: sa + "/books?limit=me",
      method: 'GET',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(data, textStatus, jqxhr){
      $("#page").html(booksPageTemplate({heading: "My Books", books: data.books}));
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("There was an error while LISTING CURRENT USER'S books, error: " + jqxhr);
      $("#book-label").html(jqxhr.responseText);
    });
  });

  // show my loaned books
  $("#my-loaned-books").on("click", function() {
    console.log("my loaned books clicked");

    $.ajax({
      url: sa + "/books/loaned",
      method: 'GET',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(data, textStatus, jqxhr){
      console.log(data);
      $("#page").html(booksPageTemplate({heading: "My Loaned Books", books: data.books}));
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("There was an error while LISTING CURRENT USER'S books, error: " + jqxhr);
      $("#book-label").html(jqxhr.responseText);
    });
  });

  // show my borrowed books
  $("#my-borrowed-books").on("click", function() {
    console.log("my borrowed books clicked");

    $.ajax({
      url: sa + "/books/borrowed",
      method: 'GET',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(data, textStatus, jqxhr){
      console.log(data);
      $("#page").html(booksPageTemplate({heading: "My Borrowed Books", books: data.books}));
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(jqxhr);
      $("#book-label").html(jqxhr.responseText);
    });
  });

  // show all books
  $("#books-show").on("click", function() {
    $("#book-label").html();

    $.ajax({
      url: sa + "/books",
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
  $("#page").on("click", "#book-update", function() {
    var id = $(this).data('id');

    $.ajax({
      url: sa + '/books/' + id,
      method: 'PATCH',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') },
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
      url: sa + '/books/' + $("#book-id").val(),
      method: 'DELETE'
    }).done(function(book, textStatus, jqxhr){
      console.log("Your book has been deleted, here is some data about it: " + data);
    }).fail(function(jqxhr, textStatus, errorThrown) {
      $("#book-label").html(jqxhr.responseText);
    });
  });

  // ------------------ Loan ---------------

  // show create loan page
  $("#create-a-loan-dd-btn").on("click", function() {
    console.log("#create-a-loan-dd-btn clicked");

    var users = {};
    var books = {};
    $('#page').load('partials/create-loan-form.html');
    $.ajax({
      url: sa + "/users",
      method: 'GET',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(data, textStatus, jqxhr){
      var templatingFunction = Handlebars.compile($('#create-user-select-template').html());
      var html = templatingFunction({users: data.users});
      $('#loan-borrower-combo').html(html);
      users = data;
      console.log(users);
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("Error in getting users");
      console.log(jqxhr.responseText);
    });

    $.ajax({
      url: sa + "/books?limit=me",
      method: 'GET',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(data, textStatus, jqxhr){
      var templatingFunction = Handlebars.compile($('#create-book-select-template').html());
      var html = templatingFunction({books: data.books});
      $('#loan-book-combo').html(html);
      books = data;
      console.log(books);
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log("Error in getting books");
      console.log(jqxhr.responseText);
    });
    $("#loan-date").datepicker({format: 'YYYY-MM-DD'});
  });

  //create Loan with Ajax
  $("#page").on('click', "#loan-create", function() {
    console.log("Loan create clicked");
    var borrowe_id = $('loan-borrower-combo').selected_value;
    var book_id =
    $.ajax({
      url: sa + '/loans',
      method: 'POST',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') },
      data: {
        loan: {
          borrower_id: $("#loan-borrower-combo").val(),
          book_id: $("#loan-book-combo").val(),
          date_loaned: $("#loan-date").val(),
          loan_duration: $("#loan_duration").val()
        }
      }
    }).done(function(book, textStatus, jqxhr){
      console.log("Book created successfully");
      $("#book-title").text(book.title);
      $("#book-title").attr('readonly', 'readonly');
      $("#book-author").text(book.author);
      $("#book-author").attr('readonly', 'readonly');
      $("#book-year").text(book.year);
      $("#book-year").attr('readonly', 'readonly');
      $("#book-price").text(book.price);
      $("#book-price").attr('readonly', 'readonly');
      $("#book-url").text(book.url);
      $("#book-url").attr('readonly', 'readonly');
      setCreateResultMessage(true);
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(textStatus);
      console.log(jqxhr.responseText);
      setCreateResultMessage(false);
    });
  });

  //update Loan with Ajax
  $("#loan-update").on('click', function(){
    $.ajax({
      url: sa + '/loans/' + $("#user-id").val(),
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
      url: sa + '/loans/' + $("#user-id").val(),
      method: 'DELETE'
    }).done(function(book, textStatus, jqxhr){
      console.log("This loan has been added to your list of deleted loans.");
    }).fail(function(jqxhr, textStatus, errorThrown) {
      $("#loan-label").html(jqxhr.responseText);
    });
  });
});
