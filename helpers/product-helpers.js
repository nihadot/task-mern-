var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
var bcrypt = require("bcrypt");
const { Db } = require('mongodb')
const { response } = require('express');
const { reject } = require('bcrypt/promises');
module.exports = {

    AddCategories: async(data,dash, callback) => {
        let result = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({name:dash})
        if(result == null ){
            let getData
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            let obj = {
                name:dash,
                date:dateTime
            }
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(obj).then((data) => {
                 getData = 
                {
                    inserted_Id : data.insertedId,
                    status:true
                }
                callback(getData)
            })
        }else{
            getData = {
                message:'This name is already available',
                status: false
            }
            callback(getData)
        }
    },
    getAllCategories: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            obj = {
                categories,
                length : categories.length
            }
            resolve(obj)
        })
    },
    deleteCategory: (categoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({ _id: objectId(categoryID) }).then((response) => {
                db.get().collection(collection.SUBCATEGORY_COLLECTION).deleteMany({ category: objectId(categoryID) }).then((response) => {
                    resolve(response)
                })
            })
        })
    },
    deleteSubCategory: (subcategoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SUBCATEGORY_COLLECTION).deleteOne({ _id: objectId(subcategoryID) }).then((response) => {
                if(response.deletedCount == 1){
                    resolve({status:true})
                }else{
                    resolve({status:false})
                }
            })
        })
    },
    getCategoryDetails: (CategoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: objectId(CategoryID) }).then((response) => {
                resolve(response)
            })
        })
    },
    updateCategory: (CategoryID, CategoryDetails, name) => {
        return new Promise(async(resolve, reject) => {
            let obj
            let result = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({name:name})
            if(result){
                obj = {
                    status:false,
                    response:null
                }
                resolve(obj)
            }
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: objectId(CategoryID) }, {
                $set: {
                    name: name,
                    date:dateTime,
                }
            }).then((response) => {
                obj = {
                    status:true,
                    response
                }
                resolve(obj)
            })
        })
    },
    getUserDetails: () => {
        return new Promise(async (resolve, reject) => {
             db.get().collection(collection.USER_COLLECTION).find().toArray().then((response)=>{
                 let obj = {
                    length : response.length,
                    users : response   
                }
                resolve(obj)
             })
        })
    },
    addSubcategories: (data, CatID, name) => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        let obj = {
            name: name,
            link: data.link,
            category: objectId(CatID),
            date:dateTime,
        }
        return new Promise(async (resolve, reject) => {
            let resData
            let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).findOne({name:{'$in':[obj.name]},category:{'$in':[objectId(CatID)]}})
            if(result === null)
            {
                db.get().collection(collection.SUBCATEGORY_COLLECTION).insertOne(obj).then((data) => {
                    resData = {
                        inserted_Id : data.insertedId,
                        status: true
                    }
                    resolve(resData)
                })
            }else{
                resData = {
                    message : 'The name is already available',
                    status: false
                }
                resolve(resData)
            }
          
        })
    },
    getSubCategoryDetails: (suCategoryID) => {
        return new Promise(async (resolve, reject) => {
            let response = await db.get().collection(collection.SUBCATEGORY_COLLECTION).find({ category: objectId(suCategoryID) }).toArray()
            let obj
            if (response.length > 0) {
                obj = {
                    response,
                    status:true
                }
                resolve(obj)
            } else {
                obj = {
                    message: 'subcategory is not available',
                    status:false
                }
                resolve(obj)
            }
        })
    },
    getSubcategory: (id) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).findOne({ _id: objectId(id) })
            resolve(result)
        })
    },
    updateSubcategory: (id, data,name,SubCat_ID) => {
        return new Promise(async(resolve, reject) => {
            let obj 
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            db.get().collection(collection.SUBCATEGORY_COLLECTION).updateOne({ _id: objectId(id) }, {
                $set: {
                    name: name,
                    link: data.link,
                    date:dateTime,
                }
            }).then((response) => {
                obj = {
                    status:true,
                    response
                }
                resolve(obj)
            })
        })
    },
    getAdminData: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    updateProfile: (data, id) => {
        return new Promise(async (resolve, reject) => {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            let object
            if (data.password) {
                let obj = {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    date:dateTime,
                }
                obj.password = await bcrypt.hash(obj.password, 10);
                db.get().collection(collection.ADMIN_COLLECTION).updateOne({ _id: objectId(id) }, {
                    $set: {
                        email: obj.email,
                        password: obj.password,
                        name: obj.name
                    }
                }).then(async(response) => {
                    let admin =await db.get().collection(collection.ADMIN_COLLECTION).findOne({_id:objectId(id)})
                    admin._id = admin._id.toString()
                    object = {
                        admin,
                        status:true,
                        password:true
                    }
                    resolve(object)
                })
            } else {
                db.get().collection(collection.ADMIN_COLLECTION).updateOne({ _id: objectId(id) }, {
                    $set: {
                        email: data.email,
                        name: data.name
                    }
                }).then(async(response) => {
                    let admin =await db.get().collection(collection.ADMIN_COLLECTION).findOne({_id:objectId(id)})
                    admin._id = admin._id.toString()
                    object = {
                        admin,
                        status:true,
                        password:false
                    }
                    resolve(object)
                })
            }
        })
    },
    FoundEmail: (data) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: data.email })
            if (result !== null) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    ForgotPassword: (data, email) => {
        return new Promise(async (resolve, reject) => {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            let obj = {
                password: data.password
            }
            obj.password = await bcrypt.hash(obj.password, 10);
            db.get().collection(collection.ADMIN_COLLECTION).updateOne({ email: email }, {
                $set: {
                    password: obj.password,
                    date:dateTime,
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: userData.email });
            if (admin) {
                bcrypt.compare(userData.password, admin.password).then((status) => {
                    if (status) {
                        console.log("login successfully (line 29.54)");
                        response.admin = admin;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log("login failed (line 34.48)");
                        resolve({ status: false });
                    }
                });
            } else {
                console.log("Email not fonud (line 39.49)");
                resolve({ status: false });
            }
        });
    },
    confirmPass: (EnterPassword,password)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {};
                bcrypt.compare(EnterPassword,password).then((status) => {
                    if (status) {
                        console.log("login successfully (line 29.54)");
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log("login failed (line 34.48)");
                        response.status = false;
                        response.message = 'Password not matched'
                        resolve(response);
                    }
                });
        });
    },
    getSubCatAddedOneResult:(id)=>{
        return new Promise((resolve,reject)=>{
            let result = db.get().collection(collection.SUBCATEGORY_COLLECTION).findOne({ _id: id });
            resolve(result)
        })
    },
    getSubcategories:()=>{
        return new Promise(async(resolve,reject)=>{
            let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).find().toArray()
            obj = {
                length : result.length
            }
            resolve(obj)
        })
    },
    getEmails:()=>{
        return new Promise(async(resolve,reject)=>{
            let result =await db.get().collection(collection.USER_COLLECTION).find({},{email:1}).toArray()
            obj = {
                length: result.length
            }
            resolve(obj)
        })
    },
}