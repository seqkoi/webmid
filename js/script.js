const products = [
  {id:1,name:"Intel Core i5-14600K",category:"CPU",price:185000,icon:"⚙️",desc:"14-core desktop processor for gaming and productivity."},
  {id:2,name:"AMD Ryzen 7 7800X3D",category:"CPU",price:210000,icon:"⚙️",desc:"High-performance gaming processor with 3D V-Cache."},
  {id:3,name:"NVIDIA RTX 4070 SUPER",category:"GPU",price:365000,icon:"🎮",desc:"Powerful graphics card for modern high-resolution gaming."},
  {id:4,name:"AMD Radeon RX 7800 XT",category:"GPU",price:295000,icon:"🎮",desc:"Strong 1440p graphics performance with 16GB memory."},
  {id:5,name:"Kingston Fury 32GB DDR5",category:"RAM",price:52000,icon:"💾",desc:"32GB high-speed DDR5 memory kit."},
  {id:6,name:"Corsair Vengeance 64GB DDR5",category:"RAM",price:98000,icon:"💾",desc:"64GB DDR5 kit for demanding workloads."},
  {id:7,name:"ASUS TUF 27 180Hz",category:"Monitor",price:145000,icon:"🖥️",desc:"27-inch QHD gaming monitor with a fast refresh rate."},
  {id:8,name:"LG UltraGear 24 180Hz",category:"Monitor",price:99000,icon:"🖥️",desc:"Fast Full HD gaming monitor for competitive play."},
  {id:9,name:"Lenovo Legion 5",category:"Laptop",price:520000,icon:"💻",desc:"Gaming laptop with a powerful CPU and dedicated graphics."},
  {id:10,name:"ASUS Vivobook 16",category:"Laptop",price:310000,icon:"💻",desc:"Versatile laptop for study, work and everyday tasks."}
];

const money = n => new Intl.NumberFormat("en-US").format(n) + " ₸";
const getCart = () => JSON.parse(localStorage.getItem("techstore-cart") || "[]");
const saveCart = cart => localStorage.setItem("techstore-cart", JSON.stringify(cart));

function updateCartCount(){
  const count = getCart().reduce((sum,item)=>sum+item.qty,0);
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count);
}

function productCard(p){
  return `<article class="product-card">
    <div class="product-visual">${p.icon}</div>
    <div class="product-info">
      <small class="eyebrow">${p.category}</small>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${money(p.price)}</div>
      <div class="product-actions">
        <a class="btn btn-outline" href="product.html?id=${p.id}">Details</a>
        <button class="btn btn-primary add-cart" data-id="${p.id}">Add</button>
      </div>
    </div>
  </article>`;
}

function renderProducts(list=products){
  const grid=document.getElementById("products-grid");
  if(grid) grid.innerHTML=list.length ? list.map(productCard).join("") : `<div class="empty" style="grid-column:1/-1"><h2>No products found</h2><p>Try another search or category.</p></div>`;
}

function addToCart(id){
  const cart=getCart();
  const existing=cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1});
  saveCart(cart); updateCartCount();
}

document.addEventListener("click", e=>{
  if(e.target.classList.contains("add-cart")){
    addToCart(Number(e.target.dataset.id));
    e.target.textContent="Added!";
    setTimeout(()=>e.target.textContent="Add",800);
  }
});

function setupProducts(){
  const params=new URLSearchParams(location.search);
  const category=params.get("category");
  const search=document.getElementById("search-input");
  const filter=document.getElementById("category-filter");
  const sort=document.getElementById("sort-select");
  if(category && filter){filter.value=category}
  function apply(){
    let list=[...products];
    const q=(search?.value||"").toLowerCase();
    const cat=filter?.value||"All";
    if(q) list=list.filter(p=>(p.name+" "+p.category+" "+p.desc).toLowerCase().includes(q));
    if(cat!=="All") list=list.filter(p=>p.category===cat);
    if(sort?.value==="low") list.sort((a,b)=>a.price-b.price);
    if(sort?.value==="high") list.sort((a,b)=>b.price-a.price);
    renderProducts(list);
  }
  [search,filter,sort].forEach(el=>el?.addEventListener("input",apply));
  apply();
}

function setupFeatured(){
  const grid=document.getElementById("featured-products");
  if(grid) grid.innerHTML=products.slice(0,4).map(productCard).join("");
}

function setupProductDetail(){
  const box=document.getElementById("product-detail");
  if(!box)return;
  const id=Number(new URLSearchParams(location.search).get("id"))||1;
  const p=products.find(x=>x.id===id)||products[0];
  box.innerHTML=`<div class="product-detail">
    <div class="detail-visual">${p.icon}</div>
    <div class="detail-info">
      <small class="eyebrow">${p.category}</small>
      <h1>${p.name}</h1>
      <p>${p.desc}</p>
      <div class="price">${money(p.price)}</div>
      <button class="btn btn-primary add-cart" data-id="${p.id}">Add to cart</button>
      <a class="btn btn-outline" href="products.html">Back to products</a>
    </div>
  </div>`;
}

function renderCart(){
  const box=document.getElementById("cart-content");
  if(!box)return;
  const cart=getCart();
  if(!cart.length){box.innerHTML=`<div class="empty"><h2>Your cart is empty</h2><p>Add some products from our catalog.</p><br><a class="btn btn-primary" href="products.html">Browse products</a></div>`;return}
  const items=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-item">
      <div class="cart-item-visual">${p.icon}</div>
      <div class="cart-item-info"><h3>${p.name}</h3><p>${money(p.price)} each</p></div>
      <div class="qty"><button data-action="minus" data-id="${p.id}">−</button><strong>${item.qty}</strong><button data-action="plus" data-id="${p.id}">+</button></div>
      <strong>${money(p.price*item.qty)}</strong>
      <button class="remove-btn" data-action="remove" data-id="${p.id}">Remove</button>
    </div>`;
  }).join("");
  const total=cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+p.price*item.qty},0);
  box.innerHTML=`<div class="cart-layout"><div>${items}</div><aside class="summary"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><strong>${money(total)}</strong></div><div class="summary-row"><span>Delivery</span><strong>Free</strong></div><div class="summary-row summary-total"><span>Total</span><strong>${money(total)}</strong></div><button id="checkout" class="btn btn-primary" style="width:100%;margin-top:18px">Checkout</button></aside></div>`;
}

document.addEventListener("click",e=>{
  const action=e.target.dataset.action;
  if(!action)return;
  const id=Number(e.target.dataset.id),cart=getCart(),item=cart.find(x=>x.id===id);
  if(action==="plus")item.qty++;
  if(action==="minus"){item.qty--;if(item.qty<=0)cart.splice(cart.indexOf(item),1)}
  if(action==="remove")cart.splice(cart.indexOf(item),1);
  saveCart(cart);updateCartCount();renderCart();
  if(e.target.id==="checkout"){alert("Demo checkout: your order has been received!");}
});

document.addEventListener("DOMContentLoaded",()=>{
  updateCartCount();setupFeatured();setupProducts();setupProductDetail();renderCart();
  const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav-links");
  menu?.addEventListener("click",()=>nav.classList.toggle("open"));
  const form=document.getElementById("contact-form");
  form?.addEventListener("submit",e=>{e.preventDefault();document.getElementById("form-message").textContent="Thank you! Your message has been sent.";form.reset()});
});