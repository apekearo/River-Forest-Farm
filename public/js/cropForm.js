$(document).ready(function () {
  // Getting jQuery references to the post body, title, form, and author select
  var blogContainer = $(".listings-container");
  var postCategorySelect = $("#cropAuthor");
  var cropNameInput = $("#cropName");
  var cropTotalInput = $("#tallyPlants");
  var cropFertzInput = $("#fertzUsed");
  var cropFertzCostInput = $("#fertzCost");
  var cropComments = $("#cropComments");
  var cropCms = $("#cropCms");
  var cropSubmit = $("#cropSubmit")
  var authorSelect = $("#cropAuthor");
  // Adding an event listener for when the form is submitted
  cropSubmit.on("click", function(){
    event.preventDefault()
    handleFormSubmit()
  });
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var postId;
  var authorId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId, "crops");
  }
  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  else if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
  }

  // Getting the authors, and their posts
  getAuthors();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
   
    // Wont submit the post if we are missing a body, title, or author
    if (!cropNameInput.val().trim() || !cropTotalInput.val().trim() || !cropFertzInput.val().trim() || !cropFertzCostInput.val().trim() || !authorSelect.val()) {
      alert("Please fill out all fields!");   
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      cropName: cropNameInput
        .val()
        .trim(),
      cropTotal: cropTotalInput
        .val()
        .trim(),
      cropFertz: cropFertzInput
        .val()
        .trim(),
      cropFertzCost: cropFertzCostInput
        .val()
        .trim(),
      cropComments: cropComments
        .val()
        .trim(),
      AuthorId: authorSelect.val()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    } else {
      console.log(newPost)
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    console.log(post)
    $.post("/api/crops", post, function () {
      window.location.href = "/blog";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id, type) {
    var queryUrl;
    switch (type) {
      case "crops":
        queryUrl = "/api/crops/" + id;
        break;
      case "author":
        queryUrl = "/api/authors/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function (data) {
      if (data) {
        console.log(data.AuthorId || data.id);
        // If this post exists, prefill our cms forms with its data
        cropNameInput.val(data.cropName);
        cropTotalInput.val(data.cropTotal);
        cropFertzInput.val(data.cropFertz);
        cropFertzCostInput.val(data.cropFertzCost);
        cropComments.val(data.cropComments);
        authorId = data.AuthorId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getAuthors() {
    $.get("/api/authors", renderAuthorList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderAuthorList(data) {
    if (!data.length) {
      window.location.href = "/authors";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createAuthorRow(data[i]));
    }
    authorSelect.empty();
    console.log(rowsToAdd);
    console.log(authorSelect);
    authorSelect.append(rowsToAdd);
    authorSelect.val(authorId);
  }

  // Creates the author options in the dropdown
  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.name);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    $.ajax({
        method: "PUT",
        url: "/api/crops",
        data: post
      })
      .then(function () {
        window.location.href = "/blog";
      });
  }
});