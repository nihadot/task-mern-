function viewImageCategory(event) {
  document.getElementById('imgViewCat').src = URL.createObjectURL(event.target.files[0])
}
function viewImageSubCategory(event) {
  document.getElementById('imgViewSubCat').src = URL.createObjectURL(event.target.files[0])
}
$().ready(function () {
  $("#signupForm").validate({




      rules: {
          name: {
              required: true,
              minlength: 4 , //for length of name,
              maxlength: 36
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
              email: true
          },
          agree:{
              required:true
          }
      },
      messages: {
          name: {
              required: "Enter your Full Name",
              minlength: "Minimum 4 characters",
              maxlength:'Please enter no more than 36 characters.'
          },
          password: {
              required: "Please enter a password",
              minlength: "Password minimum 6 character.",
              maxlength:'Please enter no more than 16 characters.'
          },
        //   confirm_password: {
        //       required: "Please enter a password",
        //       minlength: "Password minimum 6 characters",
        //       equalTo: "Please enter the same password as above."
        //   },
          email:{
              required:'Enter your Email Address'
          },
          agree:{
            required: 'You must agree with our Terms and Conditions'
        }
      }
  });
});

$().ready(function () {
  $("#LoginForm").validate({
      // in 'rules' user have to specify all the constraints for respective fields
      rules: {
          password: {
              required: true,
              minlength: 6
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
              maxlength:'Please enter no more than 16 characters'
          },
          email:{
              required:'Enter your Email Address'
          }
      }
  });
});
$(document).ready(function () {
  $('#ViewOnSubCat').DataTable();
});



function submit() {

  console.log('hy friends')
}

function hy (){

  e.preventDefault()
  $.ajax({
    url: '/admin/mailVerify',
    method: 'post',
    success: (response) => {
      console.log(response)
      location.href=response.location
        
      if (response.status) {
        //   let count = $('#cart-increase-count').html()
        //   count = parseInt(count) + 1
      //   $('#cart-increase-count').html(count)
      // alert('hyy')
      }else{
        //alert('else')
       
      }
    }
  })
      }