import{b as k,k as z,i as v,t as _,d as b,u as C,E as w,_ as A,o as B,w as P}from"./index.a9c20b32.js";import{d,h as N,C as i,v as D,o,c as p,f,u as n,$ as m,w as I,a0 as L,r as T,n as $,D as j}from"./index.ea4bb737.js";const q=k({size:{type:[Number,String],values:z,default:"",validator:a=>v(a)},shape:{type:String,values:["circle","square"],default:"circle"},icon:{type:_},src:{type:String,default:""},alt:String,srcSet:String,fit:{type:b(String),default:"cover"}}),F={error:a=>a instanceof Event},U=["src","alt","srcset"],V=d({name:"ElAvatar"}),G=d({...V,props:q,emits:F,setup(a,{emit:y}){const t=a,e=C("avatar"),c=N(!1),S=i(()=>{const{size:s,icon:l,shape:u}=t,r=[e.b()];return j(s)&&r.push(e.m(s)),l&&r.push(e.m("icon")),u&&r.push(e.m(u)),r}),h=i(()=>{const{size:s}=t;return v(s)?e.cssVarBlock({size:B(s)||""}):void 0}),E=i(()=>({objectFit:t.fit}));D(()=>t.src,()=>c.value=!1);function g(s){c.value=!0,y("error",s)}return(s,l)=>(o(),p("span",{class:$(n(S)),style:f(n(h))},[(s.src||s.srcSet)&&!c.value?(o(),p("img",{key:0,src:s.src,alt:s.alt,srcset:s.srcSet,style:f(n(E)),onError:g},null,44,U)):s.icon?(o(),m(n(w),{key:1},{default:I(()=>[(o(),m(L(s.icon)))]),_:1})):T(s.$slots,"default",{key:2})],6))}});var H=A(G,[["__file","avatar.vue"]]);const M=P(H);export{M as E};
