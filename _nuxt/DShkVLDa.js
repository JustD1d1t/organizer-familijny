import{u as T,ap as B,M as h,r as p,i as R,N as d,A as e,aC as j,a1 as A,t as _,z as n,B as f,P as u,af as P,Q as D,v as E,a4 as F,V as H,W as O,X as Q,Y as U,T as W,a0 as X}from"./DGn-Ul8E.js";import{_ as Y}from"./BKjco2TI.js";const $={key:2,class:"flex justify-center"},K={__name:"index",setup(q){j();const I=T(),v=B(),{editShoppingList:k,leaveList:g}=v,{currentShoppingList:l}=h(v),w=p(),m=R(()=>localStorage.getItem("uid")!==l.value.ownerId),s=p(m.value?[]:l.value.members),i=p(m.value?[]:l.value.membersIds),r=p(l.value.name),y=async()=>{await k(r.value,s.value,i.value),I.back()},x=a=>{s.value.find(o=>o.id===a.id)?(s.value=s.value.filter(o=>o.id!==a.uid),i.value=i.value.filter(o=>o!==a.uid)):(s.value.push(a),i.value.push(a.uid))};return(a,t)=>{const o=F,M=H,L=O,S=Q,V=U,z=Y,b=W,C=X,N=A;return _(),d(N,null,{default:e(()=>[n(L,null,{default:e(()=>[n(M,null,{default:e(()=>[n(o,null,{default:e(()=>[f("Listy zakupowe")]),_:1})]),_:1})]),_:1}),n(C,{fullscreen:!0},{default:e(()=>[u(l)?(_(),d(V,{key:0,class:"mb-4"},{default:e(()=>[n(S,{label:"Nazwa listy zakupowej","label-placement":"floating",ref_key:"input",ref:w,type:"text",modelValue:u(r),"onUpdate:modelValue":t[0]||(t[0]=c=>P(r)?r.value=c:null)},null,8,["modelValue"])]),_:1})):D("",!0),u(m)?(_(),E("div",$,[n(b,{expand:"block",class:"w-1/2",size:"small",onClick:t[2]||(t[2]=c=>u(g)())},{default:e(()=>[f(" Opuść listę ")]),_:1})])):(_(),d(z,{key:1,members:u(s),onToggleMember:t[1]||(t[1]=c=>x(c))},null,8,["members"])),n(b,{expand:"block",onClick:y,class:"my-6"},{default:e(()=>[f("Aktualizuj listę")]),_:1})]),_:1})]),_:1})}}};export{K as default};
