import"./index.a9c20b32.js";import{E as T}from"./el-pagination.85de794d.js";import"./el-input.50d72e9c.js";import"./el-tag.7c2e4455.js";import"./el-select.cb0e3f15.js";/* empty css                 */import{E as M,a as S}from"./el-table-column.b79ffbe2.js";import{E as I}from"./el-progress.bf6bebc1.js";import{E as L}from"./el-button.a91e83f6.js";import{b as A}from"./bread-crumb.a2fc7854.js";import{t as N,b as U,u as V,f as R,r as g}from"./tips.7e7df5c8.js";import{b as $}from"./mitt.dc7cd694.js";import{_ as j,d as G,h as u,i as K,o as q,c as H,j as a,e as o,w as i,a as h,t as b,F as J,p as O,l as Q}from"./index.ea4bb737.js";import"./focus-trap.81366787.js";import"./use-form-item.94301b5b.js";import"./_initCloneObject.9d0b46bd.js";import"./strings.7bfc8dd9.js";import"./_baseClone.98dedeff.js";import"./el-overlay.a9414acf.js";const W=r=>(O("data-v-56462c45"),r=r(),Q(),r),X={class:"table-wrapped"},Y={class:"table-top"},Z={class:"table-header"},z=W(()=>o("div",null,null,-1)),ee={class:"upload-wrapped"},te={class:"table-content"},ae=["href","onClick"],oe={class:"table-footer"},le=G({__name:"index",setup(r){const f=u([]),F=u(),v=u({first:"\u6587\u4EF6\u7BA1\u7406",second:null}),p=u([]),C=e=>{};function E(e){if(!e)return"";var t=1024;if(e<t)return e+"KB";if(e<Math.pow(t,2))return(e/t).toFixed(2)+"MB";if(e<Math.pow(t,3))return(e/Math.pow(t,2)).toFixed(2)+"GB";if(e<Math.pow(t,4))return(e/Math.pow(t,3)).toFixed(2)+"TB"}const w=e=>{e.status==0&&((async()=>await U(localStorage.getItem("name"),e.url))(),d())},y=async(e,t)=>{await V(e,t)},m=u(),x=e=>{$.emit("deleteFileID",e),m.value.open()},n=K({fileTotal:1,filePageCount:1,fileCurrentPage:1});(async e=>{const t=await R();n.fileTotal=t.data.length,n.filePageCount=Math.ceil(n.fileTotal/10),e===1&&(n.fileCurrentPage=n.fileCurrentPage)})();const d=async()=>{const e=await g(1);p.value=e.data};d();const B=async e=>{const t=await g(e);p.value=t.data,n.fileCurrentPage=e};return(e,t)=>{const _=L,D=I,s=M,P=S,k=T;return q(),H(J,null,[a(A,{ref_key:"breadcrumb",ref:F,item:v.value},null,8,["item"]),o("div",X,[o("div",Y,[o("div",Z,[z,o("div",ee,[a(D,{"file-list":f.value,"onUpdate:fileList":t[0]||(t[0]=l=>f.value=l),class:"upload-demo",action:"http://127.0.0.1:3007/file/uploadFile",multiple:"",limit:3,"on-exceed":C,"on-success":w,"show-file-list":!1},{default:i(()=>[a(_,{type:"primary"},{default:i(()=>[h("\u4E0A\u4F20\u6587\u4EF6")]),_:1})]),_:1},8,["file-list"])])]),o("div",te,[a(P,{data:p.value,style:{width:"100%"}},{default:i(()=>[a(s,{prop:"file_name",label:"\u6587\u4EF6\u540D",width:"400"}),a(s,{prop:"file_size",label:"\u6587\u4EF6\u5927\u5C0F"},{default:i(({row:l})=>[o("div",null,b(E(l.file_size)),1)]),_:1}),a(s,{prop:"upload_person",label:"\u4E0A\u4F20\u7528\u6237"}),a(s,{prop:"download_number",label:"\u4E0B\u8F7D\u6B21\u6570"}),a(s,{prop:"upload_time",label:"\u4E0A\u4F20\u65F6\u95F4",width:"150"},{default:i(({row:l})=>{var c;return[o("div",null,b((c=l.upload_time)==null?void 0:c.slice(0,10)),1)]}),_:1}),a(s,{label:"\u64CD\u4F5C",width:"300"},{default:i(({row:l})=>[o("div",null,[a(_,{type:"success"},{default:i(()=>[o("a",{href:l.file_url,onClick:c=>y(l.download_number,l.id)},"\u4E0B\u8F7D\u6587\u4EF6",8,ae)]),_:2},1024),a(_,{type:"danger",onClick:c=>x(l)},{default:i(()=>[h("\u5220\u9664\u6587\u4EF6")]),_:2},1032,["onClick"])])]),_:1})]),_:1},8,["data"])])]),o("div",oe,[a(k,{"page-size":1,"current-page":n.fileCurrentPage,"pager-count":7,total:n.fileTotal,"page-count":n.filePageCount,onCurrentChange:B,layout:"prev, pager, next"},null,8,["current-page","total","page-count"])])]),a(N,{ref_key:"fileRef",ref:m,onSuccess:d},null,512)],64)}}});var xe=j(le,[["__scopeId","data-v-56462c45"]]);export{xe as default};
