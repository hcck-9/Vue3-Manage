import{z as t}from"./index.a9c20b32.js";const a=()=>t({url:"/set/getAllSwiper",method:"POST"}),o=()=>t({url:"/set/getCompanyName",method:"POST"}),s=e=>t({url:"/set/changeCompanyName",method:"POST",data:{set_value:e}}),m=(e,r)=>t({url:"/set/changeCompanyIntroduce",method:"POST",data:{set_text:e,set_name:r}}),u=e=>t({url:"/set/getCompanyIntroduce",method:"POST",data:{set_name:e}}),c=()=>t({url:"/set/getAllCompanyIntroduce",method:"POST"}),d=e=>t({url:"/set/setDepartment",method:"POST",data:{set_value:e}}),l=()=>t({url:"/set/getDepartment",method:"POST"}),p=e=>t({url:"/set/setProduct",method:"POST",data:{set_value:e}}),g=()=>t({url:"/set/getProduct",method:"POST"});export{c as a,u as b,o as c,s as d,l as e,p as f,a as g,g as h,m as i,d as s};