var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectId;
const { response, request } = require("express");
const { PRODUCT_COLLECTION } = require("../config/collections");
module.exports = {
  
  // AllCatagories: () => {
  //   return new Promise(async (resolve, reject) => {
  //     let data = await db.get().collection(collection.CATEGORY_COLLECTION).find().sort({ name: 1 }).collation({ locale: "en", caseLevel: true }).toArray()
  //     resolve(data)
  //   })
  // },
  getAllDepartments: () => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection.DEPARTMENT).find().toArray()
      resolve(result)
    })
  },
  getAllDepartmentHeads: (id) => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection.DEPARTMENT_HEADERS).find({DeptChoosen:id+''}).toArray()
      resolve(result)
      // console.log(result)
    })
  },

}


