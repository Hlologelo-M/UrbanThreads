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

## 🔥 Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `UrbanThreadsStore`
3. Disable Google Analytics (optional) → **Create project**

---

## 🔐 Step 2 — Enable Authentication

1. In the sidebar: **Build → Authentication → Get started**
2. Enable **Email/Password** provider
3. Enable **Google** provider (optional — needs OAuth consent screen)

---

## 🗃️ Step 3 — Create Firestore Database

1. In the sidebar: **Build → Firestore Database → Create database**
2. Choose **Start in test mode** (allows all reads/writes for 30 days)
3. Pick a location closest to you → **Done**

**Firestore Rules for Test Mode:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
> ⚠️ For production, tighten these rules so users can only read/write their own data.

---

## ⚙️ Step 4 — Get Your Config

1. In Firebase console: **Project Settings** (gear icon) → scroll to **Your apps**
2. Click **</>** (Web) → register app → copy the `firebaseConfig` object
3. Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. in **all 4 HTML files**

---

## 🌱 Step 5 — Seed Products into Firestore

Open `index.html` in a browser (with your real Firebase config). Then open DevTools Console and run:

```javascript
seedProducts()
```

This populates 12 products (Hoodies, T-Shirts, Sneakers, Accessories) into the `products` collection.

Or add products manually in Firestore console with these fields:
```json
{
  "name": "Oversized Hoodie",
  "price": 49.99,
  "category": "Hoodies",
  "description": "Soft cotton hoodie in oversized fit.",
  "imageURL": "https://example.com/hoodie.jpg",
  "stock": 20
}
```

---

## 🚀 Step 6 — Run the App

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

*Built as a student assignment. Urban Threads is a fictional brand.*
