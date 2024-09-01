import{_ as A,t as l,N as b,A as o,B as I,y as m,a6 as oe,T as j,v as y,R as U,S as q,L as Q,M as H,i as k,z as e,P as n,Q as E,a7 as X,a8 as se,d as le,x as _,Y as ae,r as ie,a1 as ce,l as V,a9 as re,a4 as ue,a5 as de,U as _e,V as pe,W as me,aa as fe,ab as ve,ac as be,ad as xe,ae as he,a0 as ye,C as ke,D as Ce}from"./DGn-Ul8E.js";import{c as z,a as we,b as $e,f as Ie,d as ge}from"./CQt0DnLH.js";import{u as Se}from"./B74f_x4y.js";const Ne={__name:"filter-tab",props:{filter:{type:Object,required:!0},active:{type:String,required:!0}},emits:["click"],setup(a,{emit:p}){const s=p;return(x,f)=>{const c=j;return l(),b(c,{onClick:f[0]||(f[0]=r=>s("click",a.filter)),class:oe(["text-xl",{active:a.active===a.filter.value}]),size:"small",fill:"clear"},{default:o(()=>[I(m(a.filter.label),1)]),_:1},8,["class"])}}},Be=A(Ne,[["__scopeId","data-v-62c2c020"]]),Oe={class:"flex justify-between w-full mb-4"},Ee={__name:"filter-tabs",props:{filters:{type:Array,default:()=>[]},active:{type:String,default:"Wszystkie"}},emits:["click"],setup(a,{emit:p}){const s=p;return(x,f)=>{const c=Be;return l(),y("div",Oe,[(l(!0),y(U,null,q(a.filters,r=>(l(),b(c,{key:r,filter:r,active:a.active,onClick:i=>s("click",r)},null,8,["filter","active","onClick"]))),128))])}}},ze={class:"flex overflow-auto gap-2 w-full"},Fe={__name:"filter-pills",props:{filters:{type:Array,default:()=>[]}},setup(a){const p=Q(),{selectedPeriod:s,startDate:x,endDate:f,shopName:c,expenseName:r,startPrice:i,endPrice:v}=H(p),{queryExpenses:F,updatePeriod:P,updateEndDate:L,updateStartDate:D,updateStartPrice:T,updateEndPrice:S,updateShopName:M,updateExpenseName:t}=p,N=k(()=>s.value.label?s.value.label:x.value&&f.value?`${x.value} - ${f.value}`:""),B=k(()=>i.value&&v.value?`${i.value} - ${v.value}`:i.value?`od ${i.value}`:v.value?`do ${v.value}`:""),C=async u=>{switch(u){case"shopName":M("");break;case"expenseName":t("");break;case"priceRange":T(""),S("");break;case"selectedPeriod":P({value:"month",label:"Bieżący miesiąc"});break}await F()};return(u,d)=>{const h=X,w=j,$=se;return l(),y("div",ze,[e($,null,{default:o(()=>[I(m(n(N))+" ",1),n(s).value!=="month"?(l(),b(w,{key:0,fill:"clear",size:"small",onClick:d[0]||(d[0]=g=>C("selectedPeriod"))},{default:o(()=>[e(h,{icon:"ioniconsCloseOutline"in u?u.ioniconsCloseOutline:n(z)},null,8,["icon"])]),_:1})):E("",!0)]),_:1}),n(c)?(l(),b($,{key:0},{default:o(()=>[I(m(n(c))+" ",1),e(w,{fill:"clear",size:"small",onClick:d[1]||(d[1]=g=>C("shopName"))},{default:o(()=>[e(h,{icon:"ioniconsCloseOutline"in u?u.ioniconsCloseOutline:n(z)},null,8,["icon"])]),_:1})]),_:1})):E("",!0),n(r)?(l(),b($,{key:1},{default:o(()=>[I(m(n(r))+" ",1),e(w,{fill:"clear",size:"small",onClick:d[2]||(d[2]=g=>C("expenseName"))},{default:o(()=>[e(h,{icon:"ioniconsCloseOutline"in u?u.ioniconsCloseOutline:n(z)},null,8,["icon"])]),_:1})]),_:1})):E("",!0),n(B)?(l(),b($,{key:2},{default:o(()=>[I(m(n(B))+" ",1),e(w,{fill:"clear",size:"small",onClick:d[3]||(d[3]=g=>C("priceRange"))},{default:o(()=>[e(h,{icon:"ioniconsCloseOutline"in u?u.ioniconsCloseOutline:n(z)},null,8,["icon"])]),_:1})]),_:1})):E("",!0)])}}},Pe=A(Fe,[["__scopeId","data-v-daa54a85"]]),De={class:"flex h-full w-full justify-between items-start"},Te={class:"flex flex-col"},Me={class:"text-base expense-shop"},Ve={class:"text-lg font-bold expense-date"},Ae={class:"flex items-end font-bold"},je={class:"flex items-start"},Le={class:"text-3xl price-big"},Re={class:"text-sm price-small"},We=le({__name:"item",props:{expense:{}},emits:["openEditExpense","removeExpense"],setup(a,{emit:p}){const s=a,x=k(()=>parseInt(s.expense.value)),f=k(()=>(Number(s.expense.value)-Math.floor(Number(s.expense.value))).toFixed(2).toString().slice(2)),c=k(()=>s.expense.timestamp.seconds?new Date(s.expense.timestamp.seconds*1e3).toLocaleString("default",{day:"numeric",month:"numeric",year:"numeric"}):new Date(s.expense.timestamp).toLocaleString("default",{day:"numeric",month:"numeric",year:"numeric"}));return(r,i)=>{const v=ae;return l(),b(v,{class:"flex flex-col py-2 pl-6 pr-2 bg-white rounded-2xl shadow-lg"},{default:o(()=>[_("div",De,[_("div",Te,[_("p",Me,m(r.expense.shop)+" - "+m(r.expense.name),1),_("p",Ve,m(n(c)),1)]),_("div",Ae,[_("p",je,[_("span",Le,m(n(x)),1),_("span",Re,m(n(f)),1)])])])]),_:1})}}}),Y=a=>(ke("data-v-cb573d06"),a=a(),Ce(),a),Ue={key:0,class:"w-full flex justify-center items-center h-full"},qe={key:1},Qe=Y(()=>_("h2",null,"Brak wydatków",-1)),He={key:2,class:"h-full overflow-auto"},Xe={class:"text-2xl my-4 flex justify-between font-bold"},Ye=Y(()=>_("span",null,"Razem ",-1)),Ge={__name:"index",setup(a){const p=localStorage.getItem("uid"),s=Q(),{queryExpenses:x,setCurrentExpense:f}=s,{expenses:c,isLoading:r}=H(s),i=ie("all"),v=[{value:"all",label:"Wszystkie"},{value:"my",label:"Moje"},{value:"common",label:"Wspólne"}];Se(async()=>{await x()},"$biXQIOSgVL");const F=t=>{f(t),V(`/expenses/${t.id}`)},P=()=>{V("/expenses/new")},L=k(()=>parseFloat(D.value.reduce((t,N)=>Number(t)+Number(N.value),0)).toFixed(2)),D=k(()=>i.value==="all"?c.value:i.value==="my"?c.value.filter(t=>t.userId===p&&t.familyMembers.length===0):c.value.filter(t=>t.userId===p&&t.familyMembers.length>0||t.familyMembers.includes(p))),T=async()=>{await re.open("expense-filter")},S=t=>{t.label==="Wszystkie"?i.value="all":t.label==="Moje"?i.value="my":i.value="common"},M=()=>{V("/expenses/charts")};return(t,N)=>{const B=ue,C=de,u=_e,d=X,h=j,w=pe,$=me,g=fe,R=Ee,W=Pe,G=ve,J=We,K=be,Z=xe,ee=he,ne=ye,te=ce;return l(),b(te,null,{default:o(()=>[e($,null,{default:o(()=>[e(w,null,{default:o(()=>[e(B,null,{default:o(()=>[I("Wydatki")]),_:1}),e(u,{slot:"start"},{default:o(()=>[e(C,{text:"",icon:"ioniconsArrowBackOutline"in t?t.ioniconsArrowBackOutline:n(we)},null,8,["icon"])]),_:1}),e(u,{slot:"end"},{default:o(()=>[e(h,{fill:"clear",onClick:M},{default:o(()=>[e(d,{slot:"icon-only",icon:"ioniconsBarChartOutline"in t?t.ioniconsBarChartOutline:n($e)},null,8,["icon"])]),_:1}),e(h,{fill:"clear",onClick:T},{default:o(()=>[e(d,{slot:"icon-only",icon:"ioniconsFilter"in t?t.ioniconsFilter:n(Ie)},null,8,["icon"])]),_:1})]),_:1})]),_:1})]),_:1}),e(ne,{fullscreen:!0,class:"h-dvh overflow-hidden"},{default:o(()=>[n(r)?(l(),y("div",Ue,[e(g,{name:"lines-sharp"})])):!n(r)&&!n(c).length?(l(),y("div",qe,[e(R,{filters:v,active:n(i),onClick:S},null,8,["active"]),e(W),Qe])):(l(),y("div",He,[e(R,{filters:v,active:n(i),onClick:S},null,8,["active"]),e(W),_("div",Xe,[Ye,_("span",null,m(n(L))+" zł",1)]),e(G,{class:"mb-6"}),e(K,{lines:"none",class:"overflow-auto h-[70%]"},{default:o(()=>[(l(!0),y(U,null,q(n(D),O=>(l(),b(J,{key:`${O.name}-${O.id}`,expense:O,onClick:()=>F(O)},null,8,["expense","onClick"]))),128))]),_:1})])),e(ee,{slot:"fixed",vertical:"bottom",horizontal:"end"},{default:o(()=>[e(Z,{onClick:P},{default:o(()=>[e(d,{icon:"ioniconsAdd"in t?t.ioniconsAdd:n(ge)},null,8,["icon"])]),_:1})]),_:1})]),_:1})]),_:1})}}},en=A(Ge,[["__scopeId","data-v-cb573d06"]]);export{en as default};
