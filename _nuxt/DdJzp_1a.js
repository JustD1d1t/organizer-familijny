import{t as n,N as f,A as s,z as t,B as x,y as R,P as e,Q as P,aH as O,a7 as j,Y as N,ap as M,i as I,x as A,v as y,aC as V,l as E,aT as ge,T as ye,_ as F,aw as fe,M as U,R as C,S as B,ac as W,aM as he,aL as ve,aq as K,r as D,a1 as ke,a5 as Ie,U as Se,a4 as Ce,V as be,W as $e,$ as Le,ad as Be,ae as Ae,a0 as we}from"./DGn-Ul8E.js";import{k as xe,t as Re,a as ze,i as De}from"./CQt0DnLH.js";import{_ as Pe,a as Te,b as Me}from"./BiE536B2.js";import{_ as Oe}from"./BSUSWsBp.js";import{u as Ne}from"./C1Hjv0me.js";const je={__name:"PopoverItem",props:{label:{type:String,default:""},active:{type:Boolean,default:!1}},setup(c){return(h,l)=>{const p=O,o=j,r=N;return n(),f(r,null,{default:s(()=>[t(p,null,{default:s(()=>[x(R(c.label),1)]),_:1}),c.active?(n(),f(o,{key:0,slot:"end",icon:"ioniconsCheckmarkOutline"in h?h.ioniconsCheckmarkOutline:e(xe)},null,8,["icon"])):P("",!0)]),_:1})}}},Fe={__name:"sort-and-filter",props:{layout:{type:String,required:!0},dir:{type:String,required:!0},nameDir:{type:String,required:!0},lastSort:{type:String,required:!0}},emits:["changeLayout","sortByCategory","sortByName","openPantryModal","removeAllItems","removeSelectedItems","selectAllItems","deselectAllItems"],setup(c,{emit:h}){const l=h;return(p,o)=>{const r=je,g=Pe,m=Te;return n(),f(m,{sortId:"shopping-list-sort"},{default:s(()=>[t(r,{onClick:o[0]||(o[0]=a=>l("changeLayout","category")),label:"Widok kategorii",active:c.layout==="category"},null,8,["active"]),t(r,{onClick:o[1]||(o[1]=a=>l("changeLayout","products")),label:"Widok produktów",active:c.layout==="products"},null,8,["active"]),t(g,{label:"Sortuj po kategorii",onClick:o[2]||(o[2]=a=>l("sortByCategory")),type:"amount",dir:c.dir,active:c.lastSort==="category"},null,8,["dir","active"]),t(g,{label:"Sortuj po nazwie",onClick:o[3]||(o[3]=a=>l("sortByName")),type:"amount",dir:c.nameDir,active:c.lastSort==="name"},null,8,["dir","active"]),t(r,{onClick:o[4]||(o[4]=a=>l("openPantryModal")),label:"Dodaj zaznaczone produkty do spiżarni"}),t(r,{onClick:o[5]||(o[5]=a=>l("removeAllItems")),label:`Usuń wszystkie\r
        produkty`}),t(r,{onClick:o[6]||(o[6]=a=>l("removeSelectedItems")),label:"Usuń zakupione produkty"}),t(r,{onClick:o[7]||(o[7]=a=>l("selectAllItems")),label:"Zaznacz wszystkie produkty"}),t(r,{onClick:o[8]||(o[8]=a=>l("deselectAllItems")),label:"Odznacz wszystkie produkty"})]),_:1})}}},Ue={class:"flex flex-col grow ml-4"},We={class:"text-base"},He={class:"text-xs"},qe={key:0},Ve=["src"],G={__name:"item",props:{item:{type:Object,default:()=>{}}},setup(c){const{shoppingItems:h}=Ne(),l=c,p=M(),{removeItem:o,handleItemChange:r}=p,g=I(()=>{const m=h.find(a=>a.category===l.item.category);return m?m.icon:""});return(m,a)=>{const u=Oe;return n(),f(u,{item:l.item,"handle-item-change":()=>e(r)(l.item),removeItem:()=>e(o)(c.item)},{label:s(()=>[A("div",Ue,[A("span",We,R(c.item.name),1),A("span",He,R(c.item.category),1)]),e(g)?(n(),y("div",qe,[A("img",{src:e(g),alt:"category image",class:"w-8 h-8 mr-2"},null,8,Ve)])):P("",!0)]),_:1},8,["item","handle-item-change","removeItem"])}}},Q={__name:"recipe",props:{recipe:{type:Object,default:()=>{}},recipes:{type:Array,default:()=>[]}},setup(c){const h=M(),{setCurrentRecipe:l,removeRecipe:p,handleRecipeChange:o}=h,r=V(),g=c,m=I(()=>g.recipe.ingredients.every(u=>u.checked)),a=u=>{E(`/shopping-lists/${r.params.id}/recipe/${u}`),l(g.recipe)};return(u,i)=>{const d=ge,_=O,v=j,b=ye,L=N;return n(),f(L,{class:"border-0"},{default:s(()=>[t(d,{slot:"start",class:"mr-0","aria-label":"Toggle task completion",onIonChange:i[0]||(i[0]=z=>e(o)(z.detail.checked,g.recipe)),checked:e(m)},null,8,["checked"]),t(_,{class:"border-0 grow ml-4",onClick:i[1]||(i[1]=()=>a(c.recipe.id))},{default:s(()=>[x(R(c.recipe.name),1)]),_:1}),t(b,{slot:"end",onClick:i[2]||(i[2]=()=>e(p)(g.recipe.id)),size:"small",fill:"clear"},{default:s(()=>[t(v,{icon:"ioniconsTrash"in u?u.ioniconsTrash:e(Re)},null,8,["icon"])]),_:1})]),_:1})}}},Ee={};function Ke(c,h){return n(),y("span",null,[fe(c.$slots,"default",{},void 0,!0)])}const Y=F(Ee,[["render",Ke],["__scopeId","data-v-a302f0dd"]]),Ge={key:1},Qe={__name:"products",props:{nameDir:{type:String,default:""},dir:{type:String,default:""},lastSort:{type:String,default:""}},setup(c){const h=M(),l=c,{currentShoppingList:p}=U(h),o=I(()=>p?p.value.items:[]),r=I(()=>p.value?p.value.recipes:[]),g=I(()=>{if(o.value){let d=[...o.value];return l.lastSort==="category"?d=d.sort((_,v)=>l.dir==="asc"?_.category.localeCompare(v.category):v.category.localeCompare(_.category)):l.lastSort==="name"&&(d=d.sort((_,v)=>l.nameDir==="asc"?_.name.localeCompare(v.name):v.name.localeCompare(_.name))),d}return[]}),m=I(()=>g.value.filter(d=>!d.checked)),a=I(()=>g.value.filter(d=>d.checked)),u=I(()=>r.value.filter(d=>d.ingredients.every(_=>!_.checked))),i=I(()=>r.value.filter(d=>d.ingredients.every(_=>_.checked)));return(d,_)=>{const v=G,b=Q,L=Me,z=Y,S=W;return n(),y(C,null,[e(m).length||e(u).length?(n(),f(L,{key:0},{default:s(()=>[(n(!0),y(C,null,B(e(m),k=>(n(),f(v,{key:k,item:k},null,8,["item"]))),128)),(n(!0),y(C,null,B(e(u),k=>(n(),f(b,{key:k.id,recipe:k,recipes:e(r)},null,8,["recipe","recipes"]))),128))]),_:1})):P("",!0),e(a).length||e(i).length?(n(),y("div",Ge,[t(z,null,{default:s(()=>[x("Kupione")]),_:1}),t(S,{inset:!0,class:"overflow-auto py-2"},{default:s(()=>[(n(!0),y(C,null,B(e(a),k=>(n(),f(v,{key:k,item:k},null,8,["item"]))),128)),(n(!0),y(C,null,B(e(i),k=>(n(),f(b,{key:k.id,recipe:k,recipes:e(r)},null,8,["recipe","recipes"]))),128))]),_:1})])):P("",!0)],64)}}},Ye=F(Qe,[["__scopeId","data-v-08f51cd6"]]),Ze={class:"ion-padding",slot:"content"},Je={key:0},Xe={__name:"sorted-by-category",setup(c){const h=M(),{handleItemChange:l,removeItem:p}=h,{currentShoppingList:o}=U(h);I(()=>o.value?o.value.items:[]);const r=I(()=>o.value?o.value.recipes:[]),g=I(()=>{const m={};return o.value.items.forEach(a=>{m[a.category]||(m[a.category]={checked:[],unchecked:[]}),a.checked?m[a.category].checked.push(a):m[a.category].unchecked.push(a)}),m});return(m,a)=>{const u=O,i=N,d=G,_=W,v=Y,b=he,L=ve,z=Q;return n(),y(C,null,[t(L,null,{default:s(()=>[(n(!0),y(C,null,B(e(g),(S,k)=>(n(),f(b,{key:k,value:S},{default:s(()=>[t(i,{slot:"header",color:"light"},{default:s(()=>[t(u,null,{default:s(()=>[x(R(k),1)]),_:2},1024)]),_:2},1024),A("div",Ze,[t(_,{inset:!0,class:"overflow-auto"},{default:s(()=>[(n(!0),y(C,null,B(S.unchecked,$=>(n(),f(d,{key:$,item:$,onRemoveItem:()=>e(p)($),onHandleItemChange:()=>e(l)($)},null,8,["item","onRemoveItem","onHandleItemChange"]))),128))]),_:2},1024),S.checked.length?(n(),y("div",Je,[t(v,null,{default:s(()=>[x("Kupione")]),_:1}),t(_,{inset:!0,class:"overflow-auto"},{default:s(()=>[(n(!0),y(C,null,B(S.checked,$=>(n(),f(d,{key:$,item:$,onRemoveItem:()=>e(p)($),onHandleItemChange:()=>e(l)($)},null,8,["item","onRemoveItem","onHandleItemChange"]))),128))]),_:2},1024)])):P("",!0)])]),_:2},1032,["value"]))),128))]),_:1}),t(_,{inset:!0,class:"overflow-auto"},{default:s(()=>[(n(!0),y(C,null,B(e(r),S=>(n(),f(z,{key:S.id,recipe:S,recipes:e(r)},null,8,["recipe","recipes"]))),128))]),_:1})],64)}}},et=F(Xe,[["__scopeId","data-v-9565374f"]]),tt={class:"inner-content"},nt=A("h2",null,"wybierz spiżarnię",-1),ot=A("h2",null,"Twoje spiżarnie",-1),st={key:0},at={__name:"select-pantry-modal",props:{cancel:{type:Function,default:()=>{}},confirmModal:{type:Function,default:()=>{}}},setup(c){const h=K(),{pantries:l,collaboratedPantries:p}=h;return(o,r)=>{const g=O,m=N,a=W;return n(),y("div",tt,[nt,t(a,{lines:"none"},{default:s(()=>[ot,(n(!0),y(C,null,B(e(l),u=>(n(),f(m,{key:u.id,onClick:i=>c.confirmModal(u)},{default:s(()=>[t(g,null,{default:s(()=>[x(R(u.name),1)]),_:2},1024)]),_:2},1032,["onClick"]))),128)),e(p)&&e(p).length?(n(),y("h2",st," Spiżarnie do których Cię dodano ")):P("",!0),(n(!0),y(C,null,B(e(p),u=>(n(),f(m,{key:u.id,onClick:i=>c.confirmModal(u)},{default:s(()=>[t(g,null,{default:s(()=>[x(R(u.name),1)]),_:2},1024)]),_:2},1032,["onClick"]))),128))]),_:1})])}}},lt={class:"h-[90%]"},ct={key:0},it={key:1},pt={__name:"index",setup(c){const h=V(),l=K(),{handlePantryItemsFromShoppingList:p}=l,o=M(),{updateShoppingList:r,removeAllItems:g,selectAllItems:m,deselectAllItems:a,removeSelectedItems:u}=o,{currentShoppingList:i}=U(o),d=D("products"),_=D("asc"),v=D("asc"),b=D(""),L=D(!1),z=D(),S=()=>L.value=!1,k=async w=>{const H=i.value.items.filter(T=>T.checked);i.value.items=i.value.items.filter(T=>!T.checked),await p(H,w),await r({...i.value,items:i.value.items}),L.value=!1},$=I(()=>i!=null&&i.value?i.value.name:""),Z=()=>{_.value=_.value==="asc"?"desc":"asc",b.value="category"},J=()=>{v.value=v.value==="asc"?"desc":"asc",b.value="name"},X=w=>{d.value=w},ee=()=>{E(`/shopping-lists/${h.params.id}/add-item`)},te=()=>{L.value=!0};return(w,H)=>{const T=Ie,q=Se,ne=Ce,oe=Fe,se=be,ae=$e,le=Ye,ce=et,ie=at,re=Le,ue=j,de=Be,me=Ae,_e=we,pe=ke;return n(),f(pe,null,{default:s(()=>[t(ae,null,{default:s(()=>[t(se,null,{default:s(()=>[t(q,{slot:"start"},{default:s(()=>[t(T,{text:"",icon:"ioniconsArrowBackOutline"in w?w.ioniconsArrowBackOutline:e(ze)},null,8,["icon"])]),_:1}),t(ne,null,{default:s(()=>[x("Listy zakupowe")]),_:1}),t(q,{slot:"end"},{default:s(()=>[t(oe,{layout:e(d),dir:e(_),nameDir:e(v),lastSort:e(b),onChangeLayout:X,onSortByCategory:Z,onSortByName:J,onOpenPantryModal:te,onRemoveAllItems:e(g),onRemoveSelectedItems:e(u),onSelectAllItems:e(m),onDeselectAllItems:e(a)},null,8,["layout","dir","nameDir","lastSort","onRemoveAllItems","onRemoveSelectedItems","onSelectAllItems","onDeselectAllItems"])]),_:1})]),_:1})]),_:1}),t(_e,null,{default:s(()=>[A("div",lt,[A("h2",null,R(e($)),1),e(i).items.length||e(i).recipes.length?(n(),y("div",ct,[e(d)=="products"?(n(),f(le,{key:0,dir:e(_),nameDir:e(v),lastSort:e(b)},null,8,["dir","nameDir","lastSort"])):(n(),f(ce,{key:1}))])):(n(),y("h3",it,"Brak produktów na liście")),t(re,{class:"auto-height",ref_key:"modal",ref:z,"is-open":e(L),onWillDismiss:S},{default:s(()=>[t(ie,{cancel:S,confirmModal:k})]),_:1},8,["is-open"]),t(me,{slot:"fixed",vertical:"bottom",horizontal:"end"},{default:s(()=>[t(de,{onClick:ee},{default:s(()=>[t(ue,{icon:"ioniconsAddCircle"in w?w.ioniconsAddCircle:e(De),size:"large"},null,8,["icon"])]),_:1})]),_:1})])]),_:1})]),_:1})}}};export{pt as default};
