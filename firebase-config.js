// =============================================
// URBAN THREADS — Firebase Configuration
// =============================================
// INSTRUCTIONS: Replace the config below with
// your own Firebase project credentials from:
// https://console.firebase.google.com
// =============================================

// const firebaseConfig = {
//   apiKey: "AIzaSyDIuwFm4uCipLHnyavmo5bXqv-x-mv5ksA",
//   authDomain: "urbanthreadsstore-e8cba.firebaseapp.com",
//   projectId: "urbanthreadsstore-e8cba",
//   storageBucket: "urbanthreadsstore-e8cba.firebasestorage.app",
//   messagingSenderId: "719032900571",
//   appId: "1:719032900571:web:5eafe48d73c0c0b5ade5fe",
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// =============================================
// FIRESTORE SEED DATA
// Run this function once to populate products.
// Call seedProducts() from browser console.
// =============================================

async function seedProducts() {
  const products = [
    {
      name: "Oversized Hoodie",
      price: 49.99,
      category: "Hoodies",
      description:
        "Heavyweight 400gsm cotton hoodie in a relaxed oversized fit. Perfect for layering.",
      imageURL:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
      stock: 20,
    },
    {
      name: "Acid Wash Hoodie",
      price: 54.99,
      category: "Hoodies",
      description:
        "Vintage acid-wash treatment on premium fleece. One-of-a-kind look every time.",
      imageURL:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
      stock: 15,
    },
    {
      name: "Zip-Up Hoodie",
      price: 59.99,
      category: "Hoodies",
      description:
        "Classic zip-up with kangaroo pockets. Brushed interior for all-day comfort.",
      imageURL:
        "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80",
      stock: 18,
    },

    {
      name: "Drop Shoulder Tee",
      price: 29.99,
      category: "T-Shirts",
      description:
        "Ultra-soft 200gsm jersey with a drop-shoulder cut. Streetwear staple.",
      imageURL:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      stock: 30,
    },
    {
      name: "Graphic Print Tee",
      price: 34.99,
      category: "T-Shirts",
      description:
        "Bold graphic on heavyweight cotton. Screen-printed with water-based inks.",
      imageURL:
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      stock: 25,
    },
    {
      name: "Washed Pocket Tee",
      price: 27.99,
      category: "T-Shirts",
      description: "Garment-washed for a broken-in feel. Chest pocket detail.",
      imageURL:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      stock: 28,
    },

    {
      name: "Chunky Runners",
      price: 89.99,
      category: "Sneakers",
      description:
        "Exaggerated sole runner with mesh upper. Inspired by 2000s trail shoes.",
      imageURL:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      stock: 12,
    },
    {
      name: "Low-Top Canvas",
      price: 64.99,
      category: "Sneakers",
      description:
        "Clean canvas low-top. Vulcanised sole. The perfect blank canvas.",
      imageURL:
        "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80",
      stock: 20,
    },
    {
      name: "High-Top Leather",
      price: 109.99,
      category: "Sneakers",
      description:
        "Premium leather high-top with padded collar and ankle strap.",
      imageURL:
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
      stock: 10,
    },

    {
      name: "Beanie — Ribbed Knit",
      price: 19.99,
      category: "Accessories",
      description:
        "Fine-gauge ribbed knit beanie. One size fits all. 100% acrylic.",
      imageURL:
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
      stock: 40,
    },
    {
      name: "Crossbody Bag",
      price: 39.99,
      category: "Accessories",
      description:
        "Compact crossbody in waxed canvas. Adjustable strap, YKK zippers.",
      imageURL:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      stock: 22,
    },
    {
      name: "5-Panel Cap",
      price: 24.99,
      category: "Accessories",
      description:
        "Structured 5-panel with embroidered logo. Adjustable snapback.",
      imageURL:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
      stock: 35,
    },
  ];

  for (const product of products) {
    await db.collection("products").add(product);
    console.log("Added:", product.name);
  }
  console.log("✅ All products seeded!");
}
