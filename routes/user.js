const { response } = require("express");
var express = require("express");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();


//----------SET-VARIABLE----------//
var user_header = true;
//----------CHECK-USER-LOGIN----------//
// const verifyLogin = (req, res, next) => {
//   if (req.session.userLoggedIn) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// };
//----------HOME-PAGE----------//
router.get("/", async function (req, res, next) {
  userHelpers.getAllDepartments().then((response) => {
    console.log(response)
    res.render("user/home", { user_header, DepartmentData:response });
  })
});

//----------GET-SUBCATEGORIES----------//
router.get('/getDeptData/:id', (req, res) => {
  let id = req.params.id
  productHelpers.getDepartmentDetailOne(req.params.id).then((data) => {

    // productHelpers.getAllDepartmentsHeads(data._id).then((ress)=>{   
      res.render('user/homeDetails', { DepartmentData:data,user_header })
    // })
  })
})

router.get("/getDeptHeads/:id", async function (req, res) {
  userHelpers.getAllDepartmentHeads(req.params.id).then((response) => {
    // console.log(response)
    res.render("user/viewHeads", { user_header, DepartmentHeadData:response });
  })
});


module.exports = router;
