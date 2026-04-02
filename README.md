# 🧵 Urban Threads — Setup Guide

A complete streetwear e-commerce app built with Firebase + Vanilla JS.

---

## 📁 Files
```
urban-threads/
├── index.html          ← Landing page
├── shop.html           ← Product listing (reads from Firestore)
├── login.html          ← Login & Sign Up (Firebase Auth)
├── cart.html           ← Cart & Checkout
└── firebase-config.js  ← Reference config + seed data script
```

---



## 🚀 Run the App

Open `index.html` in a browser. Since Firebase is loaded via CDN, you **don't need a build step**.

For best results, serve with a local server:
```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code — use Live Server extension
```

Then visit: `http://localhost:8000`

---

## 🗂️ Firestore Collections Created

| Collection | Purpose |
|---|---|
| `products` | All shop items |
| `users` | User profiles (created on sign-up) |
| `carts` | Per-user cart items |
| `orders` | Placed orders (created on checkout) |

---

## ✅ Feature Checklist

- [x] Firebase Authentication (Email/Password + Google)
- [x] Sign Up / Login / Logout
- [x] Auth state in navbar (shows username)
- [x] Protected cart (requires login)
- [x] Firestore product fetch with real-time display
- [x] Category filtering
- [x] Add to Cart / Remove / Quantity control
- [x] Cart persisted in localStorage + synced to Firestore
- [x] Order summary with subtotal, shipping, VAT, total
- [x] Order saved to Firestore on checkout
- [x] Responsive design (mobile-friendly)
- [x] Promo code input field

---

## 🎨 Design Details

- **Font:** Bebas Neue (display) + DM Sans (body)
- **Palette:** Black `#0a0a0a` · Orange `#e8500a` · Cream `#f5f0eb`
- **Style:** Bold streetwear editorial — asymmetric hero, marquee strip, category grid

---
