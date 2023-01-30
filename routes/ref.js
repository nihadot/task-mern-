
// //  --------------------------------------------------------------------------------
// // | *************************************VIEW************************************* |
// //  --------------------------------------------------------------------------------
// //----------GET-VIEW-SUBCATEGORY----------//
// router.get("/subcategoryVIew/:id/:name", verifyLogin, async (req, res) => {
//     let _id = req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.id;
//     let name = req.session.Name_Show_Subcategory_View = req.params.name
//     let subCategories = await productHelpers.getSubCategoryDetails(req.params.id);
//     let Admin = req.session.admin;
//     if (subCategories.status) {
//       res.render(`${variable.admin_router}/subcategoryVIew`, 
//       {
//         admin,
//         Admin,  
//         subCategories:subCategories.response,
//         name,
//         _id
//       });
//     }else {
//       res.render(`${variable.admin_router}/subcategoryVIew`, {
//         admin,
//         name,
//         _id,
//         Admin,
//       });
//     }
//   });

  






//   //----------GET-ADD-CATEGORIES----------//
// router.get("/add-categories", verifyLogin, (req, res) => {
//     let Admin = req.session.admin;
//     let Response_For_AddCategories = req.session.Response_For_AddCategories
//     res.render(`${variable.admin_router}/add-categories`, {
//       admin,
//       Admin,
//       Response_For_AddCategories,
//     });
//     req.session.Response_For_AddCategories = null;
//   });
//   //----------POST-ADD-CATEGORIES----------//
//   router.post("/add-categories", verifyLogin, (req, res) => {
//     if(req.body.name === ''){
//       req.session.Response_For_AddCategories = 
//       {
//         message: 'Empty value',
//         status : false
//       }
//       res.redirect(`/${variable.admin_router}/add-categories`);
//     }else{
//       let CheckWhiteSpace = req.body.name;
//       let trimStr = CheckWhiteSpace.trim();
//     productHelpers.AddCategories(req.body, trimStr, (response) => {
//       if (response.status) {
//         if (req.files) {
//           let image = req.files.image;
//           image.mv("./public/category-images/" + response.inserted_Id + ".jpg", (err) => {
//             if (!err) {
//               req.session.Response_For_AddCategories = 
//               {
//                 message: 'Successfully submitted',
//                 status : true
//               }
//               res.redirect(`/${variable.admin_router}/add-categories`);
//             } else {
//               req.session.Response_For_AddCategories = 
//               {
//                 message: 'Error image ('+err+')',
//                 status : false
//               }
//             }
//           });
//         } else {
//           req.session.Response_For_AddCategories = 
//           {
//             message: 'Successfully submitted',
//             status : true
//           }
//           res.redirect(`/${variable.admin_router}/add-categories`);
//         }
//       } else {
//         req.session.Response_For_AddCategories = 
//         {
//           message : response.message,
//           status:false
//         };
//         res.redirect(`/${variable.admin_router}/add-categories`);
//       }
//     });
//   }
//   });



















// //  --------------------------------------------------------------------------------
// // | *************************************EDIT************************************* |
// //  --------------------------------------------------------------------------------

//   //----------GET-EDIT-SUBCATEGORY----------//
//   router.get("/edit-subcategory/:id/:name", verifyLogin, (req, res) => {
//     let _id = req.session.SubCat_Id = req.params.id;
//     let SubCat_id = req.session.RedirectPurposeStoreID__DeleteSubCategory
//     let name = req.session.SubCat_Name = req.params.name; //
//     let SubCatName = req.session.Name_Show_Subcategory_View
//     let Admin = req.session.admin;
//     let Response_For_Edit_Category = req.session.Response_For_Edit_Category
//     productHelpers.getSubcategory(req.params.id).then((response) => {
//       res.render(`${variable.admin_router}/edit-subcategory`, {
//         admin,
//         response,
//         Admin,
//         name,
//         SubCatName,
//         SubCat_id,
//         Response_For_Edit_Category,
//       });
//     });
//     req.session.Response_For_Edit_Category = null
//   });
//   //----------POST-EDIT-SUBCATEGORY----------//
//   router.post("/edit-subcategory/:id", verifyLogin, (req, res) => {
//     let SubCat_Edit_Item_id = req.session.SubCat_Id
//     let SubCat_Name = req.session.SubCat_Name
//     if(req.body.name === '' ){
//       req.session.Response_For_Edit_Category = {
//         message : 'Empty name',
//         status : false,
//         image : false,
//       }
//       res.redirect(`/${variable.admin_router}/edit-subcategory/${SubCat_Edit_Item_id}/${SubCat_Name}`);
//     }else{  
//     let CheckWhiteSpace = req.body.name;
//     let trimStr = CheckWhiteSpace.trim();
//     let SubCat_ID = req.session.RedirectPurposeStoreID__DeleteSubCategory
//     productHelpers.updateSubcategory(req.params.id, req.body,trimStr,SubCat_ID).then((response) => {
//       if (req.files) {
//         let id = req.params.id;
//         let image = req.files.image;
//         image.mv("./public/sub-category-images/" + id + ".jpg");
//         req.session.Response_For_Edit_Category = {
//           message : 'Successfully updated',
//           status : true,
//           image : true
//         }
//         res.redirect(`/${variable.admin_router}/edit-subcategory/${SubCat_Edit_Item_id}/${trimStr}`);
//       }else{
//         req.session.Response_For_Edit_Category = {
//           message : 'Successfully updated',
//           status : true,
//           image : false
//         }
//         res.redirect(`/${variable.admin_router}/edit-subcategory/${SubCat_Edit_Item_id}/${trimStr}`);
//       }
//     });
//   }
    
//   });
  
//   //----------VERIFYING-PROFILE-EDIT----------//
//   router.get('/verifyPass',verifyLogin, (req, res)=>{
//     let Admin = req.session.admin;
//     let email = req.session.Edit_Profile_Data_For_Input.email
//     let value = req.session.Edit_Profile_Data_For_Input
//     let Response = req.session.Response_For_Edit_Profile
//     res.render(`${variable.admin_router}/verifyPass`, { admin,Admin,Response });
//     req.session.Response_For_Edit_Profile = null
//   })
//   router.post("/verifyPass", verifyLogin, (req, res) => {
//     if(req.body.password === '') {
//       req.session.Response_For_Edit_Profile = {
//         message : 'Password is null',
//         status : false,
//       }
//       res.redirect(`/${variable.admin_router}/verifyPass`);
//     }
//     else if(req.body.password){
//       productHelpers.confirmPass(req.body.password, req.session.admin.password).then((response) => {
//         if (response.status) {
//           productHelpers.updateProfile(req.session.Edit_Profile_Data_For_Input, req.session.admin._id).then((Response_Update) => { 
//             req.session.admin = Response_Update.admin
//             req.session.Response_For_Edit_Profile = {
//               message : 'Successfully updated',
//               status : true,
//             }
//               res.redirect(`/${variable.admin_router}/edit-profile`);
//             });
//         } else {
//           req.session.Response_For_Edit_Profile = {
//             message : response.message,
//             status : false,
//           }
//           res.redirect(`/${variable.admin_router}/verifyPass`);
//         }
//       });
//     }
//   });
  









// //  --------------------------------------------------------------------------------
// // | *************************************USERS************************************ |
// //  --------------------------------------------------------------------------------
// //----------ALL-USERS----------//
// router.get("/all-users", verifyLogin, (req, res) => {
//     productHelpers.getUserDetails().then((userData) => {
//       userData = userData.users
//       let Admin = req.session.admin;
//       res.render(`${variable.admin_router}/all-users`, {
//         admin,
//         userData,
//         Admin,
//       });
//     });
//   });
  
  
  
  
  
  
  
  
  
  
//   //  --------------------------------------------------------------------------------
//   // | ************************************DELETE************************************ |
//   //  --------------------------------------------------------------------------------

//   //----------DELETE-SUB-CATEGORY----------//
//   router.post("/delete-subcategory/", (req, res) => {
//     if(req.session.adminLoggedIn){
//       let subcategoryId = req.body.id;
//     let name = req.session.Name_Show_Subcategory_View
//     productHelpers.deleteSubCategory(subcategoryId).then((response) => {
//       if(response.status){
//         let id = req.session.RedirectPurposeStoreID__DeleteSubCategory;
//         res.json({status:true,delete:true})
//       }else{
//         let id = req.session.RedirectPurposeStoreID__DeleteSubCategory;
//         res.json({status:true,delete:false})
//       }
//     });
//     }else{
//       res.json({status:false,delete:null})
//     }
//   });
  
  
  




