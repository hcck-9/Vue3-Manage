import{A as n}from"./index.a9c20b32.js";import{E}from"./el-overlay.a9414acf.js";import{E as g}from"./el-button.a91e83f6.js";import{b as c}from"./mitt.dc7cd694.js";import{d as x}from"./product.2542ae59.js";import{_ as D,d as F,h as d,ae as V,o as y,$ as I,w as a,e as _,j as p,a as i,p as w,l as A}from"./index.ea4bb737.js";import"./focus-trap.81366787.js";import"./use-form-item.94301b5b.js";const P=o=>(w("data-v-25f585f6"),o=o(),A(),o),b=P(()=>_("span",null,"\u8BF7\u8C28\u614E\u64CD\u4F5C\uFF0C\u5220\u9664\u540E\u5C06\u5931\u53BB\u672C\u4EA7\u54C1\u7684\u8BB0\u5F55",-1)),h={class:"dialog-footer"},k=F({__name:"deleteProduct",emits:["success"],setup(o,{expose:m,emit:f}){const e=d(!1);V(()=>{c.all.clear()});const u=d();c.on("deleteProductID",t=>{u.value=t});const v=f,C=async()=>{const t=await x(u.value);t.data.status===0?(n({message:t.data.message,type:"success"}),e.value=!1,v("success")):n.error("\u5220\u9664\u4EA7\u54C1\u5931\u8D25\uFF01")};return m({open:()=>{e.value=!0}}),(t,s)=>{const l=g,B=E;return y(),I(B,{modelValue:e.value,"onUpdate:modelValue":s[1]||(s[1]=r=>e.value=r),title:"\u5220\u9664\u4EA7\u54C1",width:"400px",center:"","align-center":""},{footer:a(()=>[_("span",h,[p(l,{onClick:s[0]||(s[0]=r=>e.value=!1)},{default:a(()=>[i(" \u53D6\u6D88 ")]),_:1}),p(l,{type:"primary",onClick:C},{default:a(()=>[i(" \u786E\u5B9A ")]),_:1})])]),default:a(()=>[b]),_:1},8,["modelValue"])}}});var z=D(k,[["__scopeId","data-v-25f585f6"]]);export{z as default};
