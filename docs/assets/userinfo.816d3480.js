import{al as a}from"./index.ea4bb737.js";import{g as r}from"./userinfo.7e0ce5ee.js";const s=a("UserInfo",{state:()=>({imageUrl:localStorage.getItem("imageUrl"),name:localStorage.getItem("name"),sex:"",department:localStorage.getItem("department"),identity:localStorage.getItem("identity"),account:"",email:""}),actions:{async userInfor(e){const t=await r(e);this.imageUrl=t.data.image_url,this.name=t.data.name,this.sex=t.data.sex,this.department=t.data.department,this.identity=t.data.identity,this.account=t.data.account,this.email=t.data.email}},getters:{}},{persist:{enabled:!0,key:"userInfor",Storage:localStorage}});export{s as u};