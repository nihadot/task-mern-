var db = require("../config/connection");
var collection = require("../config/collections");
var objectId = require("mongodb").ObjectId;
var bcrypt = require("bcrypt");
const { Db } = require("mongodb");
const { response } = require("express");
const { reject } = require("bcrypt/promises");
const async = require("hbs/lib/async");

module.exports = {
  getAllDepartments: () => {
    return new Promise(async(resolve, reject) => {
      let response = await db.get().collection(collection.DEPARTMENT).find().toArray()
        resolve(response)
    });
  },
  deleteDepartment: (depaartmentId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.DEPARTMENT).deleteOne({ _id: objectId(depaartmentId) }).then((response) => {
          resolve(true)
        });
    });
  },
getDepaartmentDetails: (getDepId) => {
    return new Promise(async (resolve, reject) => {
      let obj;
      let result = await db.get().collection(collection.DEPARTMENT).findOne({ _id: objectId(getDepId) });
      console.log(result)
      resolve(result)
    });
  },
  updateDepartment: (data,id) => {
    return new Promise(async (resolve, reject) => {
    db.get().collection(collection.DEPARTMENT).updateOne(
          { _id: objectId(id) },
          {
            $set: {
                DepartmentName: data.DepartmentName,
                YearFounded: data.YearFounded,
                Description:data.Description,
            },
          }
        ).then(async(response) => {
        let res =await db.get().collection(collection.DEPARTMENT).findOne({_id:objectId(id)})
          resolve(res);
        })
    });
  },
  addingDepartment: (data) => {
    return new Promise(async (resolve, reject) => {
      db.get().collection(collection.DEPARTMENT).insertOne(data).then((data) => {
          resData = {
            inserted_Id: data.insertedId,
            status: true,
          };
          resolve(resData);
        });
    });
  },
  getAdminData: (id) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
          resolve(response);
        });
    });
  },
  updateProfile: (data,id) => {
    return new Promise(async (resolve, reject) => {
      let object;
      if (data.password) {
     obj={
        name:data.name,
        email:data.email,
        password:data.password,
     }
        obj.password = await bcrypt.hash(data.password, 10);
        db.get().collection(collection.ADMIN_COLLECTION).updateOne(
            { _id: objectId(id) },
            {
              $set: {
                email: obj.email,
                password: obj.password,
                name: obj.name,
              },
            }
          ).then(async (response) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) });
            resolve(admin);
          });
      } else {
        db.get().collection(collection.ADMIN_COLLECTION).updateOne(
            { _id: objectId(id) },
            {
              $set: {
                email: data.email,
                name: data.name,
              },
            }
          )
          .then(async (response) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) });
            resolve(admin);
          });
      }
    });
  },
  doLogin: (userData) => {
    // get data by { userData }
    return new Promise(async (resolve, reject) => {
      let response = {};
      let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: userData.email });
      // if email wrong admin = num , then execute else case of the statement
      if (admin) {
        bcrypt.compare(userData.password, admin.password).then((status) => {
          if (status) {
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            reject({ status: false, message: "Password is wrong" });
          }
        });
      } else {
        reject({ status: false, message: "Email not found" });
      }
    });
  },
  getAllDepartmentsFieldOnly: () => {
    return new Promise(async(resolve, reject) => {
     let result =await db.get().collection(collection.DEPARTMENT).aggregate([
         {
             $project:{
                 _id:1,
                 DepartmentName:1
             }
         }
     ]).toArray()
    resolve(result)
    });
  },
  addingDepartmentHeders: (data) => {
    return new Promise(async(resolve, reject) => {
        db.get().collection(collection.DEPARTMENT_HEADERS).insertOne(data).then((data) => {
            resData = {
              inserted_Id: data.insertedId,
              status: true,
            };
            resolve(resData);
          });
    });
  },
  getDepartmentDetailOne: (data) => {
    return new Promise(async(resolve, reject) => {
        let result =await db.get().collection(collection.DEPARTMENT).findOne({_id:objectId(data)})
        // .then((data) => {
            // resData = {
            //   inserted_Id: data.insertedId,
            //   status: true,
            // };
            // console.log(result,'data')
            resolve(result);
          // });
    });
  },
  
  getAllDepartmentsHeads: (id) => {
    return new Promise(async(resolve, reject) => {
      
      let result =await db.get().collection(collection.DEPARTMENT_HEADERS).find({DeptChoosen:id+''}).toArray()
      console.log(result,'ressults')
      resolve(result)
    });
  },
  getDeptHeads: (id) => {
    return new Promise(async(resolve, reject) => {
      db.get().collection(collection.DEPARTMENT_HEADERS).findOne({_id:objectId(id)}).then((result)=>{
        resolve(result)
      })
    });
  },
  
  updateDepartmentsHeads: (data) => {
    return new Promise(async (resolve, reject) => {
      console.log(data,'data')
        db.get().collection(collection.DEPARTMENT_HEADERS).updateOne(
            { _id: objectId(data._id) },
            {
              $set: {
                DepartmentHeadsName: data.DepartmentHeadsName,
                EmployeeNum: data.EmployeeNum,
                Age: data.Age,
                Description: data.Description,
              },
            }
          )
          .then(async (response) => {
            let admin = await db.get().collection(collection.DEPARTMENT_HEADERS).findOne({ _id: objectId(data._id) });
            resolve(admin);
            console.log(admin)
          });
    });
  },
  
  deleteDepartmentHeads: (deprtHeadId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.DEPARTMENT_HEADERS).deleteOne({ _id: objectId(deprtHeadId) }).then((response) => {
          resolve(true)
        });
    });
  },
};
