const { response, json } = require("express");
var express = require("express");
var { Auth } = require("two-step-auth");
const messages = require("../config/messages");
var variable = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();

//----------SET-VARIABLE----------//
// var admin = true;
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

router.get("/", verifyLogin, function (req, res, next) {
  res.redirect(`/${variable.admin_router}/home`)
});

// home page
router.get('/home',verifyLogin,(req,res)=>{
  productHelpers.getAllDepartments().then((response) => {
    res.render(`${variable.admin_router}/home`, {
      AdminDashBoardHeader:true,
      DepartmentData:response,
      admin:req.session.admin
    });
  });
})

//  --------------------------------------------------------------------------------
// | ************************************ADDING************************************ |
//  --------------------------------------------------------------------------------

router.get("/addingDepartment", verifyLogin, (req, res) => {
  console.log(1)
  res.render(`${variable.admin_router}/addingDept`, 
    {
      AdminDashBoardHeader:true,
      admin:req.session.admin
    });
    console.log(1)
});

router.post("/addingDepartment", verifyLogin, (req, res) => {
    productHelpers.addingDepartment(req.body).then((response)=>{
      if(req.files){
        let image = req.files.image
        image.mv("./public/departmentPic/" + response.inserted_Id + ".jpg",(err)=>{
            res.redirect(`/${variable.admin_router}/addingDepartment`); 
        })
      }else{
        res.redirect(`/${variable.admin_router}/addingDepartment`); 
      }
    })
});

//----------GET-EDIT-CATEGORY----------//
router.get("/editDepartment/:id/", verifyLogin, async (req, res) => {
  let department = await productHelpers.getDepaartmentDetails(req.params.id);
  res.render(`${variable.admin_router}/editDepartment`, {
    department,
    AdminDashBoardHeader:true,
    admin:req.session.admin
  });
});
//----------POST-EDIT-CATEGORY----------//
router.post("/editDepartment/:id", verifyLogin, (req, res) => {
  console.log(req.body)
  let id = req.params.id;
    productHelpers.updateDepartment(req.body,id).then((response) => {
      if(req.files){
        let image = req.files.image
        image.mv("./public/departmentPic/" +id+ ".jpg",(err)=>{
            res.redirect(`/${variable.admin_router}/editDepartment/${id}`); 
        })
      }else{
        res.redirect(`/${variable.admin_router}/editDepartment/${id}`); 
      }
    })
});

  //----------DELETE-CATEGORY----------//
  router.delete("/deleteDepartment", (req, res) => {
    productHelpers.deleteDepartment(req.body.id).then((response) => {
      res.json({status:true})
    });
  });



//----------GET-EDIT-PROFILE----------//
router.get("/edit-profile", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  // let Edit_Response = req.session.Response_For_Edit_Profile
  productHelpers.getAdminData(req.session.admin._id).then((data) => {
    // console.log('data,',data)
    res.render(`${variable.admin_router}/edit-profile`, {AdminDashBoardHeader:true,data,admin:req.session.admin });
    // req.session.Response_For_Edit_Profile = null
  });
});
//----------POST-EDIT-PROFILE----------//
router.post("/edit-profile", verifyLogin, async (req, res) => {
  // req.session.Edit_Profile_Data_For_Input = req.body;
  console.log(req.body)
  productHelpers.updateProfile(req.body,req.session.admin._id).then((response)=>{
    req.session.admin = null;
    // req.session.adminLoggedIn = ;
    
    req.session.admin = response;
    req.session.adminLoggedIn = true;
    // console.log(response,'response')
      
    res.redirect(`/${variable.admin_router}/edit-profile`);
  })
});







// ///////////////////////////////////////////////////////////////





router.get("/addingDepartmentHeads", verifyLogin, (req, res) => {
  productHelpers.getAllDepartmentsFieldOnly().then((deps)=>{
    console.log(2)

    res.render(`${variable.admin_router}/addingDeptHeads`, {AdminDashBoardHeader:true,admin:req.session.admin,deps});
  })
});

router.post("/addingDepartmentHeads", verifyLogin, (req, res) => {
  console.log(req.body)
  // productHelpers.getDepartmentDetailOne(req.body.DeptChoosen).then((response)=>{

    productHelpers.addingDepartmentHeders(req.body).then((response)=>{
      
      
      if(req.files){
        let image = req.files.image
        image.mv("./public/deptHeaders/" + response.inserted_Id + ".jpg",(err)=>{
            res.redirect(`/${variable.admin_router}/addingDepartmentHeads`); 
        })
      }else{
        res.redirect(`/${variable.admin_router}/addingDepartmentHeads`); 
      }
    })
  // })
});


router.get("/listDeptHeads", verifyLogin, (req, res) => {
  productHelpers.getAllDepartmentsHeads().then((deps)=>{
    productHelpers.getDepartmentDetailOne(deps.DeptChoosen).then((deptName)=>{
      console.log(deps,'deps')
      console.log(deptName)
      res.render(`${variable.admin_router}/listDeptHeaders`, {AdminDashBoardHeader:true,admin:req.session.admin,deps,deptName});
    })
  })
});
// /////////////

router.get("/editDepartmentHeads/:id", verifyLogin, (req, res) => {
  console.log(1)
  productHelpers.getDeptHeads(req.params.id).then((getDeptHeads)=>{
    console.log(1)
    productHelpers.getDepartmentDetailOne(getDeptHeads.DeptChoosen).then((resp)=>{
      productHelpers.getAllDepartmentsFieldOnly().then((deptName)=>{
        // console.log(deptName)
        res.render(`${variable.admin_router}/editDeptHeads`, {AdminDashBoardHeader:true,admin:req.session.admin,resp,getDeptHeads,Id:req.params.id,deptName});
      })
    })
  })

});



router.delete("/deleteDeptHeads", (req, res) => {
  productHelpers.deleteDepartmentHeads(req.body.id).then((response) => {
    res.json({status:true})
  });
  // console.log(req.body.id,'hyy')
});



router.post("/editDepartmentHeads", verifyLogin, (req, res) => {
  console.log(req.body,'post data')
  productHelpers.updateDepartmentsHeads(req.body).then((deps)=>{
 
  //     console.log(deps,'deps')
  //     console.log(deptName)
  //     res.render(`${variable.admin_router}/listDeptHeaders`, {AdminDashBoardHeader:true,admin:req.session.admin,deps,deptName});
      
  if(req.files){
    let image = req.files.image
    image.mv("./public/deptHeaders/" +req.body._id+ ".jpg",(err)=>{
      res.redirect(`/${variable.admin_router}/editDepartmentHeads/${req.body._id}`);  
    })
  }else{
    res.redirect(`/${variable.admin_router}/editDepartmentHeads/${req.body._id}`); 
  }
})
});



























































//  --------------------------------------------------------------------------------
// | ******************************** LOGIN SESSION ******************************* |
//  --------------------------------------------------------------------------------
//----------GET-LOGIN----------//
router.get("/login", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect(`/${variable.admin_router}/view-categories`);
  } else {
    res.render(`${variable.admin_router}/login`, {
      // show error message
      adminLogErr: req.session.adminLogErr,
      AdminDefaultHeader: true,
      admin:req.session.admin
    });
    req.session.adminLogErr = false;
  }
});
// //----------POST-LOGIN----------//
router.post("/login", (req, res) => {
  // login form data available { req.body }
  productHelpers.doLogin(req.body).then(async (response) => {
    // get data response
    if (response) {
      let email = req.body.email;
      // assign data to cookies
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect(`/${variable.admin_router}/home`);
    } 
  }).catch((err)=>{
    req.session.adminLogErr = err.message;
    console.log(err)
    res.redirect(`/${variable.admin_router}/login`);
  }  );
});
// //----------LOG-OUT----------//
router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = null;
  res.redirect(`/${variable.admin_router}/login`);
});

module.exports = router;
