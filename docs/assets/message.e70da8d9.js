import{al as d}from"./index.ea4bb737.js";import{z as s}from"./index.a9c20b32.js";const c=(t,e)=>s({url:"/dm/getDepartmentMsg",method:"POST",data:{id:t,department:e}}),n=t=>s({url:"/dm/getDepartmentMsgList",method:"POST",data:{department:t}}),i=t=>s({url:"/dm/getReadListAndStatus",method:"POST",data:{id:t}}),g=(t,e)=>s({url:"/dm/clickDelete",method:"POST",data:{id:t,readId:e}}),l=(t,e)=>s({url:"/dm/changeUserReadList",method:"POST",data:{newid:t,department:e}}),u=(t,e)=>s({url:"/dm/changeUserReadListButDelete",method:"POST",data:{deleteid:t,department:e}}),h=d("messageinfor",{state:()=>({read_list:[],message_list:[]}),actions:{async returnReadList(t){this.read_list=[],this.message_list=[];const e=localStorage.getItem("department"),a=await i(t),r=await n(e);this.read_list=a.data?JSON.parse(a.data[0].read_list):[],this.message_list=r.data}},getters:{}},{persist:!0});export{n as a,c as b,g as c,l as d,u as e,i as g,h as u};