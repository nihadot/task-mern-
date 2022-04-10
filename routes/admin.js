const { response, json } = require("express");
var express = require("express");
var { Auth } = require("two-step-auth");
const messages = require("../config/messages");
var variable = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();

//----------SET-VARIABLE----------//
var admin = true;
//----------LOGIN-CHECK----------//
const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect(`/${variable.admin_router}/login`);
  }
};

//  --------------------------------------------------------------------------------
// | *************************************HOME************************************* |
//  --------------------------------------------------------------------------------

//----------HOME-PAGE----------//
router.get("/", verifyLogin, function (req, res, next) {
  productHelpers.getAllCategories().then((Categories) => {
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/view-categories`, {
      admin,
      Categories,
      Admin,
    });
  });
});

//  --------------------------------------------------------------------------------
// | *************************************HOME************************************* |
//  --------------------------------------------------------------------------------

//  --------------------------------------------------------------------------------
// | *************************************USERS************************************ |
//  --------------------------------------------------------------------------------
//----------ALL-USERS----------//
router.get("/all-users", verifyLogin, (req, res) => {
  productHelpers.getUserDetails().then((userData) => {
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/all-users`, {
      admin,
      userData,
      Admin,
    });
  });
});
//  --------------------------------------------------------------------------------
// | ************************************DELETE************************************ |
//  --------------------------------------------------------------------------------
//----------DELETE-CATEGORY----------//
router.get("/delete-category/:id", (req, res) => {
  let categoryId = req.params.id;
  productHelpers.deleteCategory(categoryId).then((response) => {
    res.redirect(`/${variable.admin_router}/`);
  });
});
//----------DELETE-SUB-CATEGORY----------//
router.get("/delete-subcategory/:id", (req, res) => {
  let subcategoryId = req.params.id;
  productHelpers.deleteSubCategory(subcategoryId).then((response) => {
    let id = req.session.RedirectPurposeStoreID__DeleteSubCategory;
    res.redirect(`/${variable.admin_router}/subcategoryVIew/${id}`);
  });
});
//  --------------------------------------------------------------------------------
// | *************************************EDIT************************************* |
//  --------------------------------------------------------------------------------
//----------GET-EDIT-CATEGORY----------//
router.get("/edit-category/:id", verifyLogin, async (req, res) => {
  let category = await productHelpers.getCategoryDetails(req.params.id);
  let Admin = req.session.admin;
  res.render(`${variable.admin_router}/edit-category`, {
    category,
    admin,
    Admin,
  });
});
//----------POST-EDIT-CATEGORY----------//
router.post("/edit-category/:id", verifyLogin, (req, res) => {
  productHelpers.updateCategory(req.params.id, req.body).then(() => {
    if (req.files) {
      let id = req.params.id;
      let image = req.files.image;
      image.mv("./public/category-images/" + id + ".jpg");
      res.redirect(`/${variable.admin_router}`);
      res.end();
    } else {
      res.redirect(`/${variable.admin_router}`);
      res.end();
    }
  });
});
//----------GET-EDIT-SUBCATEGORY----------//
router.get("/edit-subcategory/:id", verifyLogin, (req, res) => {
  let id = (req.session.RedirectPurposeStoreID__EditSubCategory =
    req.params.id);
  productHelpers.getSubcategory(req.params.id).then((response) => {
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/edit-subcategory`, {
      admin,
      response,
      Admin,
    });
  });
});
//----------POST-EDIT-SUBCATEGORY----------//
router.post("/edit-subcategory/:id", verifyLogin, (req, res) => {
  productHelpers.updateSubcategory(req.params.id, req.body).then((response) => {
    if (req.files) {
      let id = req.params.id;
      let image = req.files.image;
      image.mv("./public/sub-category-images/" + id + ".jpg");
    }
    let id = req.session.RedirectPurposeStoreID__EditSubCategory;
    res.redirect(`/${variable.admin_router}/edit-subcategory/${id}`);
  });
});
//----------GET-EDIT-PROFILE----------//
router.get("/edit-profile", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  productHelpers.getAdminData(req.session.admin._id).then((data) => {
    res.render(`${variable.admin_router}/edit-profile`, { admin, data, Admin });
  });
});
//----------POST-EDIT-PROFILE----------//
router.post("/edit-profile", verifyLogin, async (req, res) => {
  let value = req.body;
  req.session.value = value;
  let email = req.body.email;
  res.render(`${variable.admin_router}/verifyPass`, { email });
});
//----------VERIFYING-PROFILE-EDIT----------//
router.post("/verifyPass", verifyLogin, (req, res) => {
  productHelpers
    .confirmPass(req.body.password, req.session.admin.password)
    .then((response) => {
      if (response.status) {
        productHelpers
          .updateProfile(req.session.value, req.session.admin._id)
          .then(() => {
            res.redirect(`/${variable.admin_router}/edit-profile`);
          });
      } else {
        // console.log(response)
        let PassError = (req.session.PassError = response.message + "");
        console.log(PassError);

        req.session.PassError = null;
        res.render(`${variable.admin_router}/verifyPass`, { PassError });
      }
    });
});
//  --------------------------------------------------------------------------------
// | ************************************ADDING************************************ |
//  --------------------------------------------------------------------------------
//----------GET-ADD-SUBCATEGORIES----------//
router.get("/add-subcategories/:id", verifyLogin, (req, res) => {
  req.session.SubCat = req.params.id;
  let Admin = req.session.admin;
  res.render(`${variable.admin_router}/add-subcategories`, { admin, Admin });
});
//----------POST-ADD-SUBCATEGORIES----------//
router.post("/add-subcategories", verifyLogin, (req, res) => {
  let SubCatID = req.session.SubCat;
  productHelpers.addSubcategories(req.body, SubCatID).then((id) => {
    let Admin = req.session.admin;
    if (req.files) {
      let image = req.files.image;
      image.mv("./public/sub-category-images/" + id + ".jpg", (err) => {
        if (!err) {
          res.render(`${variable.admin_router}/add-subcategories`, {
            admin,
            Admin,
          });
        } else {
          console.log(err);
        }
      });
    } else {
      res.render(`${variable.admin_router}/add-subcategories`, {
        admin,
        Admin,
      });
    }
  });
});
//----------GET-ADD-CATEGORIES----------//
router.get("/add-categories", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  res.render(`${variable.admin_router}/add-categories`, {
    admin,
    Admin,
    Error: req.session.NameError,
  });
  req.session.NameError = null;
});
//----------POST-ADD-CATEGORIES----------//
router.post("/add-categories", verifyLogin, (req, res) => {
  let CheckWhiteSpace = req.body.name;
  let trimStr = CheckWhiteSpace.trim();
  productHelpers.AddCategories(req.body, trimStr, (id) => {
    if (id) {
      if (req.files) {
        let image = req.files.image;
        image.mv("./public/category-images/" + id + ".jpg", (err) => {
          if (!err) {
            res.redirect(`/${variable.admin_router}/add-categories`);
          } else {
            console.log(err);
          }
        });
      } else {
        res.redirect(`/${variable.admin_router}/add-categories`);
      }
    } else {
      req.session.NameError = "This name is already available";
      res.redirect(`/${variable.admin_router}/add-categories`);
    }
  });
});
//  --------------------------------------------------------------------------------
// | *************************************VIEW************************************* |
//  --------------------------------------------------------------------------------
//----------GET-VIEW-SUBCATEGORY----------//
router.get("/subcategoryVIew/:id", verifyLogin, async (req, res) => {
  req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.id;
  let subCategories = await productHelpers.getSubCategoryDetails(req.params.id);
  let Admin = req.session.admin;
  if (subCategories == false) {
    res.render(`${variable.admin_router}/subcategoryVIew`, { admin, Admin });
  } else {
    res.render(`${variable.admin_router}/subcategoryVIew`, {
      admin,
      subCategories,
      Admin,
    });
  }
});
//  --------------------------------------------------------------------------------
// | ******************************** LOGIN SESSION ******************************* |
//  --------------------------------------------------------------------------------
//----------GET-LOGIN----------//
router.get("/login", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect(`/${variable.admin_router}`, { admin });
  } else {
    let RESPONSE_FOR_FORGOT_PASSWORD = req.session.RESPONSE_FOR_FORGOT_PASSWORD
    res.render(`${variable.admin_router}/login`, {
      adminLogErr: req.session.adminLogErr,
      RESPONSE_FOR_FORGOT_PASSWORD,
      static:true
    });
    req.session.adminLogErr = false;
    req.session.RESPONSE_FOR_FORGOT_PASSWORD = null
  }
});
// //----------POST-LOGIN----------//
router.post("/login", (req, res) => {
  productHelpers.doLogin(req.body).then(async (response) => {
    if (response.status) {
      let email = req.body.email;
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;

      productHelpers.getAllCategories().then((Categories) => {
        let Admin = req.session.admin;
        res.render(`${variable.admin_router}/view-categories`, {
          admin,
          Categories,
          Admin,
        });
      });
    } else {
      req.session.adminLogErr = "Invalid Password or Username";
      res.redirect(`/${variable.admin_router}/login`);
    }
  });
});
// //----------LOG-OUT----------//
router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = null;
  res.redirect(`/${variable.admin_router}/login`);
});

/*  --------------------------------------------------------------------------------
   | ************************ IF USER CLICK FORGOT PASSWORD *********************** |
    --------------------------------------------------------------------------------  */
//----------GET-FORGOT-PASSWORD----------//
router.get("/forgot-password", (req, res) => {
  let sess = req.session
  let RESPONSE_FOR_ENTER_EMAIL = sess.RESPONSE_FOR_ENTER_EMAIL;
  let RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR;
  res.render(`${variable.admin_router}/forgot-password`, { RESPONSE_FOR_ENTER_EMAIL , RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR ,static:true});
  sess.RESPONSE_FOR_ENTER_EMAIL = null;
  sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = null;
});
//----------POST-FORGOT-PASSWORD----------//
router.post("/forgot-password", (req, res) => {
  let sess = req.session
  if (req.body.email === "" ) {
    sess.RESPONSE_FOR_ENTER_EMAIL = obj = 
    {
      heading: `${messages.Heading_For_Empty_Value_That_Email}`,
      paragraph: `${messages.Paragraph_For_Empty_Value_That_Email}`,
    };
    res.redirect(`/${variable.admin_router}/forgot-password`);
  } else {
    productHelpers.FoundEmail(req.body).then(async (response) => {
      if (response.status == true) {
        try {
          const resForLogin = await Auth(req.body.email, "AHLBYT");
          sess.ELIGIBLE_FOR_SENT_0TP = {
            resForLogin,
            status: true,
          };
          sess.ELIGIBLE_FOR_SENT_0TP_STATUS = true;
          res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
        } catch (error) {
          sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = error;
          res.redirect(`/${variable.admin_router}/forgot-password`);
        }
      } else {
        sess.RESPONSE_FOR_ENTER_EMAIL = obj = 
        {
          heading: `${messages.Heading_For_NotFound_Value_That_Email}`,
          paragraph: `${messages.Paragraph_For_NotFound_Value_That_Email}`,
        };
        res.redirect(`/${variable.admin_router}/forgot-password`);
      }
    });
  }
});
//----------GET-CONFIRM-OTP----------//
router.get("/verifyOtpForgetPass", (req, res) => {
  let sess = req.session
  if (sess.ELIGIBLE_FOR_SENT_0TP_STATUS) {
    let email = sess.ELIGIBLE_FOR_SENT_0TP.resForLogin.mail;
    let RESPONSE_FOR_ENTER_OTP = sess.RESPONSE_FOR_ENTER_OTP;
    res.render(`${variable.admin_router}/verifyOtpForgetPass`, {
      email,
      RESPONSE_FOR_ENTER_OTP,
      static:true
    });
    sess.RESPONSE_FOR_ENTER_OTP = null;
  } else {
    res.redirect(`/${variable.admin_router}/forgot-password`);
  }
});
//----------POST-CONFIRM-OTP----------//
router.post("/verifyOtpForgetPass", async (req, res) => {
  let sess = req.session
  let USER_OTP = sess.ELIGIBLE_FOR_SENT_0TP.resForLogin.OTP + "";
  // console.log(USER_OTP, "server otp");
  if (req.body.security_code === "") {
    sess.RESPONSE_FOR_ENTER_OTP = `${messages.Empty_OTP_Is_Response}`;
    res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
  } else {
    if (req.body.security_code === USER_OTP) {
      sess.Update_Password_Route_Status = true;
      res.redirect(`/${variable.admin_router}/forgotPassword`);
      sess.ELIGIBLE_FOR_SENT_0TP_STATUS = null
    } else {
      sess.RESPONSE_FOR_ENTER_OTP = `${messages.OTP_Invalid}`;
      res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
    }
  }
});

//----------AFTER-OTP-CONFIRM-UPDATE-PASSWORD----------//

//----------GET-UPDATE-PASSWORD----------//
router.get("/forgotPassword", (req, res) => {
  let sess = req.session
  if (sess.Update_Password_Route_Status) {
    let RESPONSE_FOR_ENTER_PASSWORD = sess.RESPONSE_FOR_ENTER_PASSWORD;
    res.render(`${variable.admin_router}/forgotPassword`, {
      RESPONSE_FOR_ENTER_PASSWORD,
      static:true,
    });
    sess.RESPONSE_FOR_ENTER_PASSWORD = null;
  } else {
    res.redirect(`/${variable.admin_router}/forgot-password`);
  }
});
//----------POST-UPDATE-PASSWORD----------//
router.post("/forgotPassword", (req, res) => {
  let sess = req.session
  if (req.body.password === "") {
    sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.Empty_New_Password}`;
    res.redirect(`/${variable.admin_router}/forgotPassword`);
  } else if (req.body.password.length >= 6) {
    if (req.body.password.length <= 16) {
      let ForgetPassEmail = sess.ELIGIBLE_FOR_SENT_0TP.resForLogin.mail;
      productHelpers.ForgotPassword(req.body, ForgetPassEmail).then((response) => {
        if(response.modifiedCount === 1){
          sess.Update_Password_Route_Status = null
          sess.RESPONSE_FOR_FORGOT_PASSWORD = obj = 
          {
            message: `${messages.Password_Reset_Successful}` ,
            status: true,
          }
          res.redirect(`/${variable.admin_router}/login`);
        }else{
          sess.RESPONSE_FOR_FORGOT_PASSWORD = obj=
          {
            message: `${messages.Password_Reset_Failed}`,
            status:false,
          }
          res.redirect(`/${variable.admin_router}/login`);
        }
        });
    } else {
      sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.No_MoreThan_Restricted_Characters}`;
      res.redirect(`/${variable.admin_router}/forgotPassword`);
    }
  } else {
    sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.Enter_Minimum_Restricted_Characters}`;
    res.redirect(`/${variable.admin_router}/forgotPassword`);
  }
});

module.exports = router;
