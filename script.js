// LANDING PAGE

const firebaseConfig = {
  apiKey: "AIzaSyDIuwFm4uCipLHnyavmo5bXqv-x-mv5ksA",
  authDomain: "urbanthreadsstore-e8cba.firebaseapp.com",
  projectId: "urbanthreadsstore-e8cba",
  storageBucket: "urbanthreadsstore-e8cba.firebasestorage.app",
  messagingSenderId: "719032900571",
  appId: "1:719032900571:web:5eafe48d73c0c0b5ade5fe",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ── Navbar Auth State ──
auth.onAuthStateChanged((user) => {
  const infoEl = document.getElementById("nav-user-info");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const loginLink = document.getElementById("nav-login-link");
  if (user) {
    if (infoEl)
      infoEl.textContent = user.displayName || user.email.split("@")[0];
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginLink) loginLink.style.display = "none";
  } else {
    if (infoEl) infoEl.textContent = "";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
  }
  updateCartCount();
});
const logoutBtn1 = document.getElementById("nav-logout-btn");
if (logoutBtn1) {
  logoutBtn1.addEventListener("click", () => auth.signOut());
}

// ── Cart Count ──
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("ut_cart") || "[]");
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("nav-cart-count");
  if (el) el.textContent = total > 0 ? `(${total})` : "";
}

// ── Marquee ──
const words = [
  "HOODIES",
  "·",
  "T-SHIRTS",
  "·",
  "SNEAKERS",
  "·",
  "ACCESSORIES",
  "·",
  "NEW ARRIVALS",
  "·",
  "FREE SHIPPING OVER R1,388",
  "·",
];
const track = document.getElementById("marquee-track");
if (track) {
  const doubled = [...words, ...words];
  track.innerHTML = doubled
    .map((w) =>
      w === "·"
        ? `<span class="marquee-item marquee-dot">✦</span>`
        : `<span class="marquee-item">${w}</span>`,
    )
    .join("");
}

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
revealEls.forEach((el) => io.observe(el));

// LOGIN PAGE
// ── Redirect if already logged in ──
auth.onAuthStateChanged((user) => {
  if (user && window.location.pathname.includes("login.html")) {
    window.location.href = "shop.html";
  }
});

// ── Tab Switch ──
function switchTab(tab) {
  document
    .getElementById("form-login")
    .classList.toggle("active", tab === "login");
  document
    .getElementById("form-signup")
    .classList.toggle("active", tab === "signup");
  document
    .getElementById("tab-login")
    .classList.toggle("active", tab === "login");
  document
    .getElementById("tab-signup")
    .classList.toggle("active", tab === "signup");
  const greet = document.querySelector(".auth-greeting");
  const sub = document.querySelector(".auth-sub");
  if (tab === "signup") {
    greet.innerHTML = "JOIN THE <span>CREW</span>";
    sub.textContent = "Create your free account to start shopping.";
  } else {
    greet.innerHTML = "WELCOME <span>BACK</span>";
    sub.textContent = "Sign in to access your cart and orders.";
  }
}

// ── Login ──
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  const btn = document.getElementById("login-btn");
  const msg = document.getElementById("login-msg");
  msg.className = "auth-message";
  btn.disabled = true;
  btn.textContent = "SIGNING IN…";
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    // redirect handled by onAuthStateChanged
  } catch (err) {
    msg.textContent = friendlyError(err.code);
    msg.className = "auth-message error";
    btn.disabled = false;
    btn.textContent = "SIGN IN";
  }
}

// ── Sign Up ──
async function handleSignup(e) {
  e.preventDefault();
  const fname = document.getElementById("signup-fname").value;
  const lname = document.getElementById("signup-lname").value;
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-password").value;
  const btn = document.getElementById("signup-btn");
  const msg = document.getElementById("signup-msg");
  msg.className = "auth-message";
  btn.disabled = true;
  btn.textContent = "CREATING ACCOUNT…";
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({
      displayName: fname + (lname ? " " + lname : ""),
    });
    // Save user profile to Firestore
    await db.collection("users").doc(cred.user.uid).set({
      firstName: fname,
      lastName: lname,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // redirect handled by onAuthStateChanged
  } catch (err) {
    msg.textContent = friendlyError(err.code);
    msg.className = "auth-message error";
    btn.disabled = false;
    btn.textContent = "CREATE ACCOUNT";
  }
}

// ── Google Sign-In ──
async function handleGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    // Save user to Firestore on first sign-in
    const user = result.user;
    const userRef = db.collection("users").doc(user.uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      await userRef.set({
        displayName: user.displayName,
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    // redirect handled by onAuthStateChanged
  } catch (err) {
    const msg = document.getElementById("login-msg");
    if (msg) {
      msg.textContent = friendlyError(err.code);
      msg.className = "auth-message error";
    }
  }
}

// ── Password Toggle ──
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
  btn.textContent = input.type === "password" ? "👁" : "🙈";
}

// ── Friendly Errors ──
function friendlyError(code) {
  const map = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests":
      "Too many failed attempts. Please wait and try again.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

// CART & CHECKOUT PAGES
let currentUser = null;
let cart = [];

// ── Auth ──
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  const infoEl = document.getElementById("nav-user-info");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const loginLink = document.getElementById("nav-login-link");

  if (user) {
    if (infoEl)
      infoEl.textContent = user.displayName || user.email.split("@")[0];
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginLink) loginLink.style.display = "none";
    // Try to load cart from Firestore; merge with localStorage
    await syncCartFromFirestore(user.uid);
  } else {
    if (infoEl) infoEl.textContent = "";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
  }
  renderCart(user);
});
const logoutBtn2 = document.getElementById("nav-logout-btn");
if (logoutBtn2) {
  logoutBtn2.addEventListener("click", () => auth.signOut());
}

// ── Sync cart from Firestore ──
async function syncCartFromFirestore(uid) {
  try {
    const snap = await db.collection("carts").doc(uid).get();
    if (snap.exists && snap.data().items) {
      const firestoreCart = snap.data().items;
      // Merge with localStorage cart
      const localCart = JSON.parse(localStorage.getItem("ut_cart") || "[]");
      const merged = mergeCartArrays(localCart, firestoreCart);
      localStorage.setItem("ut_cart", JSON.stringify(merged));
      await db
        .collection("carts")
        .doc(uid)
        .set({ items: merged }, { merge: true });
    }
  } catch (err) {
    console.warn("Could not sync cart from Firestore:", err);
  }
}

function mergeCartArrays(local, remote) {
  const map = {};
  [...remote, ...local].forEach((item) => {
    if (map[item.id]) map[item.id].qty = Math.max(map[item.id].qty, item.qty);
    else map[item.id] = { ...item };
  });
  return Object.values(map);
}

// ── Load & Render Cart ──
function loadCart() {
  return JSON.parse(localStorage.getItem("ut_cart") || "[]");
}
function saveCart(items) {
  localStorage.setItem("ut_cart", JSON.stringify(items));
  if (currentUser) {
    db.collection("carts").doc(currentUser.uid).set({ items }, { merge: true });
  }
}

function renderCart(user) {
  const body = document.getElementById("cart-body");
  const count = document.getElementById("cart-item-count");

  // Exit early if cart elements don't exist on this page
  if (!body || !count) {
    return;
  }

  cart = loadCart();

  // Not logged in
  if (!user) {
    count.textContent = "";
    body.innerHTML = `
        <div class="login-gate">
          <h2 class="login-gate-title">SIGN IN TO VIEW YOUR <span>CART</span></h2>
          <p class="login-gate-sub">Your cart is waiting. Sign in to view your saved items, manage your bag, and checkout securely.</p>
          <a href="login.html" class="login-gate-btn">SIGN IN / CREATE ACCOUNT</a>
        </div>`;
    return;
  }

  // Empty cart
  if (!cart.length) {
    count.textContent = "0 items";
    body.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">🛍️</div>
          <p class="empty-title">YOUR BAG IS EMPTY</p>
          <p class="empty-sub">Looks like you haven't added anything yet.</p>
          <a href="shop.html" class="shop-now-btn">SHOP NOW</a>
        </div>`;
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  count.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;

  body.innerHTML = `
      <div class="cart-layout">
        <!-- ITEMS -->
        <div class="cart-main">
          <div class="cart-items" id="cart-items-list">
            ${cart
              .map(
                (item, idx) => `
              <div class="cart-item" id="item-${item.id}" style="animation-delay:${idx * 0.06}s">
                <img class="cart-item-img"
                  src="${item.imageURL || "https://via.placeholder.com/90x90/1c1c1c/555?text=?"}"
                  alt="${item.name}"
                  onerror="this.src='https://via.placeholder.com/90x90/1c1c1c/555?text=?'"
                />
                <div>
                  <p class="cart-item-name">${item.name}</p>
                  <p class="cart-item-price">R${Number(item.price).toFixed(2)} each</p>
                  <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                    <span class="qty-display" id="qty-${item.id}">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                  </div>
                  <button class="remove-btn" onclick="removeItem('${item.id}')">✕ Remove</button>
                </div>
                <div>
                  <span class="cart-item-total" id="total-${item.id}">R${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <!-- SIDEBAR -->
        <div class="cart-sidebar">
          <h2 class="summary-title">ORDER <span>SUMMARY</span></h2>
          <div class="summary-lines">
            <div class="summary-line">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value" id="summary-sub">R${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span class="summary-label">Shipping</span>
              <span class="summary-value" id="summary-ship">${shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span class="summary-label">VAT (15%)</span>
              <span class="summary-value" id="summary-tax">R${tax.toFixed(2)}</span>
            </div>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-total-line">
            <span class="summary-total-label">TOTAL</span>
            <span class="summary-total-value" id="summary-total">R${total.toFixed(2)}</span>
          </div>
          ${shipping > 0 ? `<p style="font-size:.75rem;color:rgba(245,240,235,.35);margin-top:8px;letter-spacing:.04em;">Add R${(1388 - subtotal).toFixed(2)} more for free shipping</p>` : ""}

          <div class="promo-wrap">
            <input type="text" class="promo-input" placeholder="PROMO CODE" id="promo-input" />
            <button class="promo-apply" onclick="applyPromo()">APPLY</button>
          </div>

          <button class="checkout-btn" onclick="handleCheckout()">CHECKOUT →</button>
          <a href="shop.html" class="continue-btn">CONTINUE SHOPPING</a>

          <div class="secure-note">🔒 Secure checkout · SSL Encrypted</div>
        </div>
      </div>`;
}

// ── Qty Change ──
function changeQty(id, delta) {
  cart = loadCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  // Update DOM without full re-render
  const qtyEl = document.getElementById(`qty-${id}`);
  const totalEl = document.getElementById(`total-${id}`);
  if (qtyEl) qtyEl.textContent = item.qty;
  if (totalEl) totalEl.textContent = `R${(item.price * item.qty).toFixed(2)}`;
  updateSummary();
  updateNavCount();
}

// ── Remove ──
function removeItem(id) {
  cart = loadCart().filter((i) => i.id !== id);
  saveCart(cart);
  const el = document.getElementById(`item-${id}`);
  if (el) {
    el.style.transition = "opacity .25s,transform .25s";
    el.style.opacity = "0";
    el.style.transform = "translateX(20px)";
    setTimeout(() => renderCart(currentUser), 280);
  }
  updateNavCount();
}

// ── Update Summary Without Full Render ──
function updateSummary() {
  cart = loadCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subEl = document.getElementById("summary-sub");
  const shipEl = document.getElementById("summary-ship");
  const taxEl = document.getElementById("summary-tax");
  const totEl = document.getElementById("summary-total");
  const countEl = document.getElementById("cart-item-count");
  if (subEl) subEl.textContent = `R${subtotal.toFixed(2)}`;
  if (shipEl)
    shipEl.textContent = shipping === 0 ? "FREE" : `R${shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `R${tax.toFixed(2)}`;
  if (totEl) totEl.textContent = `R${total.toFixed(2)}`;
  if (countEl)
    countEl.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
}

// ── Promo ──
function applyPromo() {
  const code = document
    .getElementById("promo-input")
    .value.trim()
    .toUpperCase();
  const valid = ["URBAN10", "THREADS20", "FIRSTDROP"];
  if (valid.includes(code)) {
    alert("✓ Promo code applied! (Demo — no actual discount in this build)");
  } else {
    alert("❌ Invalid promo code. Try: URBAN10");
  }
}

// ── Checkout ──
async function handleCheckout() {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  cart = loadCart();
  if (!cart.length) return;

  try {
    // Save order to Firestore
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 75 ? 0 : 9.99;
    const tax = subtotal * 0.15;
    await db.collection("orders").add({
      userId: currentUser.uid,
      email: currentUser.email,
      items: cart,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: "confirmed",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // Clear cart
    saveCart([]);
    updateNavCount();
    document.getElementById("order-confirm").classList.add("show");
  } catch (err) {
    console.error(err);
    alert("There was a problem placing your order. Please try again.");
  }
}

function closeConfirm() {
  document.getElementById("order-confirm").classList.remove("show");
  renderCart(currentUser);
}

// ── Nav Cart Count ──
function updateNavCount() {
  const c = loadCart();
  const total = c.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("nav-cart-count");
  if (el) el.textContent = total > 0 ? `(${total})` : "";
}

// SHOP PAGE
let allProducts = [];
let activeCategory = "All";

// ── Read URL param for category ──
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("category")) activeCategory = urlParams.get("category");

// ── Auth ──
auth.onAuthStateChanged((user) => {
  currentUser = user;
  const infoEl = document.getElementById("nav-user-info");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const loginLink = document.getElementById("nav-login-link");
  if (user) {
    if (infoEl)
      infoEl.textContent = user.displayName || user.email.split("@")[0];
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginLink) loginLink.style.display = "none";
  } else {
    if (infoEl) infoEl.textContent = "";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
  }
  updateCartCount();
});
const logoutBtn3 = document.getElementById("nav-logout-btn");
if (logoutBtn3) {
  logoutBtn3.addEventListener("click", () => auth.signOut());
}

// ── Fetch Products from Firestore ──
async function fetchProducts() {
  try {
    const snap = await db.collection("products").get();
    allProducts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setActiveFilter(activeCategory);
  } catch (err) {
    console.error(err);
    const productGrid = document.getElementById("product-grid");
    if (productGrid) {
      productGrid.innerHTML = `
        <div class="state-msg">
          <div class="state-icon">⚠</div>
          <p class="state-text">CONNECTION ERROR</p>
          <p class="state-sub">Check your Firebase config and Firestore rules.</p>
        </div>`;
    }
  }
}

// ── Render Products ──
function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  const countEl = document.getElementById("product-count");

  // Exit early if shop page elements don't exist
  if (!grid || !countEl) {
    return;
  }

  if (!products.length) {
    grid.innerHTML = `<div class="state-msg"><div class="state-icon">👀</div><p class="state-text">NOTHING HERE YET</p><p class="state-sub">Try a different category or add products in Firestore.</p></div>`;
    countEl.textContent = "0 products";
    return;
  }
  countEl.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;
  grid.innerHTML = products
    .map(
      (p) => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img-wrap">
          <img class="product-img" src="${p.imageURL || "https://via.placeholder.com/400x400/1c1c1c/555?text=No+Image"}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400/1c1c1c/555?text=Image+Error'" />
          <span class="product-category-badge">${p.category}</span>
        </div>
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-desc">${p.description || ""}</p>
          <div class="product-footer">
            <span class="product-price">R${Number(p.price).toFixed(2)}</span>
            <button class="add-to-cart-btn" onclick="addToCart('${p.id}', this)">ADD TO CART</button>
          </div>
        </div>
      </div>
    `,
    )
    .join("");
}

// ── Filter ──
function setActiveFilter(category) {
  activeCategory = category;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.cat === category);
  });
  const filtered =
    category === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === category);
  renderProducts(filtered);
}
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => setActiveFilter(btn.dataset.cat));
});

// ── Add to Cart (localStorage) ──
function addToCart(productId, btn) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;
  const cart = JSON.parse(localStorage.getItem("ut_cart") || "[]");
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      imageURL: product.imageURL,
      qty: 1,
    });
  }
  localStorage.setItem("ut_cart", JSON.stringify(cart));

  // Also save to Firestore if logged in
  if (currentUser) {
    db.collection("carts")
      .doc(currentUser.uid)
      .set({ items: cart }, { merge: true });
  }

  // Visual feedback
  const orig = btn.textContent;
  btn.textContent = "✓ ADDED";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove("added");
  }, 1400);
  showToast(product.name);
  updateCartCount();
}

// ── Toast ──
let toastTimer;
function showToast(name) {
  const t = document.getElementById("toast");
  if (t) {
    t.textContent = `✓  "${name}" added to cart`;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
  }
}

// ── Cart Count ──
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("ut_cart") || "[]");
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("nav-cart-count");
  if (el) el.textContent = total > 0 ? `(${total})` : "";
}

fetchProducts();
