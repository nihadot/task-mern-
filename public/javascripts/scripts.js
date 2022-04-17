function viewImageCategory(event) {
  document.getElementById("imgViewCat").src = URL.createObjectURL(
    event.target.files[0]
  );
}
function viewImageSubCategory(event) {
  document.getElementById("imgViewSubCat").src = URL.createObjectURL(
    event.target.files[0]
  );
}
$(document).ready(function () {
  $("#signupForm").validate({
    rules: {
      name: {
        required: true,
        minlength: 4, //for length of name,
        maxlength: 36,
      },
      password: {
        required: true,
        minlength: 6,
      },
      //   confirm_password: {
      //       required: true,
      //       minlength: 6,
      //       equalTo: "#password"
      //   },
      email: {
        required: true,
        email: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      name: {
        required: "Enter your Full Name",
        minlength: "Minimum 4 characters",
        maxlength: "Please enter no more than 36 characters.",
      },
      password: {
        required: "Please enter a password",
        minlength: "Password minimum 6 character.",
        maxlength: "Please enter no more than 16 characters.",
      },
      //   confirm_password: {
      //       required: "Please enter a password",
      //       minlength: "Password minimum 6 characters",
      //       equalTo: "Please enter the same password as above."
      //   },
      email: {
        required: "Enter your Email Address",
      },
      agree: {
        required: "You must agree with our Terms and Conditions",
      },
    },
  });


  $("#editProfile").validate({
    rules: {
      name: {
        required: true,
      },
      password: {
        // required: true,
        minlength: 6,
        maxlength:16
      },

      //   confirm_password: {
      //       required: true,
      //       minlength: 6,
      //       equalTo: "#password"
      //   },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      name: {
        required: " Name null",
        // minlength: "",
        // maxlength: "Please enter no more than 16 characters.",
      },
      password: {
        // required: "Password null",
        minlength: "Minimum 6 characters.",
        maxlength: "Please enter no more than 16 characters.",
      },
      //   confirm_password: {
      //       required: "Please enter a password",
      //       minlength: "Password minimum 6 characters",
      //       equalTo: "Please enter the same password as above."
      //   },
      email: {
        required: "E-mail",
      },
    },
  });


  $("#LoginForm").validate({
    // in 'rules' user have to specify all the constraints for respective fields
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      password: {
        required: "Please enter a password",
        minlength: "Password minimum 6 character",
        maxlength: "Please enter no more than 16 characters",
      },
      email: {
        required: "Enter your Email Address",
      },
    },
  });


  $('#TableFoRfillter').DataTable();
  $("#allUsers").DataTable();
  $("#subcategory").DataTable();  
  ReCount();


});

function ReCount() {
  $.ajax({
    url: "/admin/re_count",
    method: "post",
    success: (response) => {
        $("#sub_cat_count").html(response.obj.subcategories.length);
        $("#user_count").html(response.obj.userCount.length);
        $("#cat_count").html(response.obj.categories.length);
        $("#email_count").html(response.obj.emailAll.length);
    },
  });
}

function deleteCat(id, name) {
  let cfm = confirm("Are you want to delete " + name);
  if (cfm) {
    $.ajax({
      url: "/admin/delete-category/",
      method: "post",
      data: {
        id: id,
      },
      success: (response) => {
        if (response.status) {
          location.reload();
        } else {
          location.reload();
        }
      },
    });
  } else {
  }
}

function deleteSubCat(id, name) {
  let cfm = confirm("Are you want to delete " + name);
  if (cfm) {
    $.ajax({
      url: "/admin/delete-subcategory/",
      method: "post",
      data: {
        id: id,
      },
      success: (response) => {
        if (response.status) {
          if (response.delete) {
            location.reload();
          } else {
            location.reload();
          }
        } else {
          location.reload();
        }
      },
    });
  }
}
