$(document).ready(function () {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".listings-container");
  var postCategorySelect = $("#cropAuthor");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.submit", handlePostPost);
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  // Variable to hold our posts
  var posts;

  // The code below handles the case where we want to get blog posts for a specific author
  // Looks for a query param in the url for author_id
  var url = window.location.search;
  var authorId;
  if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
    getPosts(authorId);
  }
  // If there's no authorId we just get all posts as usual
  else {
    getPosts();
  }


  // This function grabs posts from the database and updates the view
  function getPosts(author) {
    authorId = author || "";
    if (authorId) {
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/crops" + authorId, function (data) {
      console.log("Crops", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty(author);
      } else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
        method: "DELETE",
        url: "/api/crops/" + id
      })
      .then(function () {
        getPosts(postCategorySelect.val());
      });
  }

  function createPost(id, c) {
    $.ajax({
        method: "POST",
        url: "/api/crops/",
        data: {
          cropName: cropNa,
          cropTotal: cropTo
        }

      })
      .then(function () {
        getPosts(postCategorySelect.val());
      });
  }
  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    blogContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    console.log(post);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostAuthor = $("<h5>");
    //changing posts to crops
    newPostAuthor.append("Written by: " + post.Author.name + "<br>" + "Post's ZipCode: " + post.Author.zip);
    newPostAuthor.css({
      float: "right",
      color: "blue",
      "margin-top": "-10px"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostTitle.text("Crop Name: " + post.cropName + " ");
    newPostBody.text("Number of Crops: " + post.cropTotal);
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);
    newPostCardHeading.append(deleteBtn);
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostAuthor);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("Crop", post);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostPost() {
    cropNa = $("#cropName").val()

    cropTo = $("#tallyPlants").val()

    createPost(cropNa, cropTo);
  }

  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("Crop");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms?post_id=" + currentPost.id;
  }

  // This function displays a message when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Author #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({
      "text-align": "center",
      "margin-top": "50px"
    });
    messageH2.html("<br>No posts yet" + partial + ", navigate <a href='/cms" + query +
      "'>here</a> in order to get started.");
    blogContainer.append(messageH2);
  }

});
