
"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  emoji: string;
  price: number;
  originalPrice: number;
  rating: number;
  discount: number;
  background: string;
};

const categories = [
  { name: "Fashion", emoji: "👕", description: "Korean & Japanese styles", tint: "#eee7ff" },
  { name: "Electronics", emoji: "🎧", description: "Everyday tech essentials", tint: "#dff9f5" },
  { name: "Footwear", emoji: "👟", description: "Step into something new", tint: "#fff0df" },
  { name: "Accessories", emoji: "🎒", description: "Details that stand out", tint: "#ffe7ef" },
];

const products: Product[] = [
  { id: 1, name: "Korean Oversized Streetwear Tee", category: "Fashion", emoji: "👕", price: 899, originalPrice: 1499, rating: 4.8, discount: 40, background: "#eee7ff" },
  { id: 2, name: "Wireless Headphones", category: "Electronics", emoji: "🎧", price: 1799, originalPrice: 2999, rating: 4.7, discount: 40, background: "#dff9f5" },
  { id: 3, name: "Minimal Everyday Sneakers", category: "Footwear", emoji: "👟", price: 1299, originalPrice: 2199, rating: 4.6, discount: 41, background: "#fff0df" },
  { id: 4, name: "Premium Everyday Backpack", category: "Accessories", emoji: "🎒", price: 1099, originalPrice: 1899, rating: 4.5, discount: 42, background: "#ffe7ef" },
  { id: 5, name: "Japanese Minimalist Overshirt", category: "Fashion", emoji: "🧥", price: 1499, originalPrice: 2499, rating: 4.8, discount: 40, background: "#e8f0ff" },
  { id: 6, name: "Compact Wireless Earbuds", category: "Electronics", emoji: "🎵", price: 999, originalPrice: 1699, rating: 4.4, discount: 41, background: "#fff1df" },
  { id: 7, name: "Classic Everyday Wristwatch", category: "Accessories", emoji: "⌚", price: 1299, originalPrice: 1999, rating: 4.6, discount: 35, background: "#e4f8ef" },
  { id: 8, name: "Modern Running Shoes", category: "Footwear", emoji: "👟", price: 1599, originalPrice: 2699, rating: 4.7, discount: 41, background: "#f0eaff" },
];

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState("");

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        (category === "Deals" && product.discount >= 40) ||
        product.category === category;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function goToProducts(selectedCategory?: string) {
    if (selectedCategory) setCategory(selectedCategory);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleWishlist(id: number) {
    const saved = wishlist.includes(id);
    setWishlist((current) =>
      saved ? current.filter((item) => item !== id) : [...current, id]
    );
    notify(saved ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <main className="site-shell">
      <div className="announcement">
        Discover your next favourite find. <strong>Fresh styles. Great vibes.</strong>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <a className="brand" href="#home" aria-label="NovaCart home">
            <span className="brand-mark">N</span>
            <span className="brand-copy">
              <span className="brand-name">Nova<span>Cart</span></span>
              <span className="brand-tagline">Discover more. Shop better.</span>
            </span>
          </a>

          <label className="search-box">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search fashion, gadgets, accessories..."
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="header-actions">
            <button className="header-action" onClick={() => notify(`Wishlist: ${wishlist.length} saved items`)}>
              <span className="action-icon">♡</span>
              <span className="action-label">Wishlist</span>
            </button>
            <button className="header-action cart-action" onClick={() => notify(`Your demo cart has ${cart} items`)}>
              <span className="action-icon">🛍</span>
              <span className="action-label">Cart</span>
              <span className="cart-count">{cart}</span>
            </button>
          </div>
        </div>

        <nav className="category-nav" aria-label="Product categories">
          {["All", ...categories.map((item) => item.name), "Deals"].map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => goToProducts(item)}
            >
              {item === "All" ? "All Products" : item === "Deals" ? "Today's Deals" : item}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="container">
          <div className="hero">
            <div className="hero-copy">
              <span className="eyebrow">✦ YOUR STYLE. YOUR WORLD.</span>
              <h1>Good finds.<br /><span>Great vibes.</span></h1>
              <p>
                From Korean streetwear to everyday tech, discover something
                new with a marketplace made for your style.
              </p>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => goToProducts("All")}>
                  Explore products →
                </button>
                <button className="button-light" onClick={() => goToProducts("Deals")}>
                  Shop the deals
                </button>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit" />
              <div className="hero-product">
                <span className="hero-product-emoji">🛍️</span>
              </div>
              <div className="floating-tag top">✨ Fresh finds<small>Something for everyone</small></div>
              <div className="floating-tag bottom">Up to 42% off<small>Selected demo products</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container benefit-strip" aria-label="Marketplace benefits">
        <div className="benefit"><div className="benefit-icon">🚚</div><div><strong>Easy shopping</strong><span>A simpler way to discover</span></div></div>
        <div className="benefit"><div className="benefit-icon">🛡️</div><div><strong>Shop confidently</strong><span>Designed for a better experience</span></div></div>
        <div className="benefit"><div className="benefit-icon">💜</div><div><strong>Unique discoveries</strong><span>Styles beyond the ordinary</span></div></div>
        <div className="benefit"><div className="benefit-icon">🏪</div><div><strong>Local sellers</strong><span>Discover new collections</span></div></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Find your something</div>
              <h2>Shop by category</h2>
              <p>Explore the things you love, all in one place.</p>
            </div>
            <button className="text-link" onClick={() => goToProducts("All")}>View all →</button>
          </div>

          <div className="category-grid">
            {categories.map((item) => (
              <button
                className="category-card"
                key={item.name}
                style={{ "--category-tint": item.tint } as React.CSSProperties}
                onClick={() => goToProducts(item.name)}
              >
                <span className="category-emoji">{item.emoji}</span>
                <span className="category-info">
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="deal-banner">
            <div>
              <div className="section-kicker">A little more for less</div>
              <h2>Find your next great deal.</h2>
              <p>Explore selected sample products with discounts of up to 42%.</p>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => goToProducts("Deals")}>Explore deals →</button>
              </div>
            </div>
            <div className="deal-art" aria-hidden="true">🎁</div>
          </div>
        </div>
      </section>

      <section className="section" id="products">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Picked for discovery</div>
              <h2>{category === "All" ? "Trending right now" : category === "Deals" ? "Deals you might love" : `${category} collection`}</h2>
              <p>Find your next favourite from our sample collection.</p>
            </div>
            <span className="text-link">{visibleProducts.length} items</span>
          </div>

          <div className="product-toolbar">
            <div className="filter-chips">
              {["All", "Deals", ...categories.map((item) => item.name)].map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter-chip active" : "filter-chip"}
                  onClick={() => setCategory(item)}
                >
                  {item === "All" ? "All products" : item}
                </button>
              ))}
            </div>
            <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => {
              const saved = wishlist.includes(product.id);
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image" style={{ "--product-bg": product.background } as React.CSSProperties}>
                    <span className="product-badge">{product.discount >= 40 ? "HOT DEAL" : "TOP PICK"}</span>
                    <button
                      className={saved ? "wishlist-button active" : "wishlist-button"}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={saved}
                    >
                      {saved ? "♥" : "♡"}
                    </button>
                    <span className="product-emoji" aria-hidden="true">{product.emoji}</span>
                  </div>
                  <div className="product-details">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating"><span className="rating-pill">★ {product.rating.toFixed(1)}</span><span>Customer rating</span></div>
                    <div className="product-pricing">
                      <span className="product-price">{formatPrice(product.price)}</span>
                      <span className="product-original">{formatPrice(product.originalPrice)}</span>
                      <span className="product-discount">{product.discount}% off</span>
                    </div>
                    <button className="add-cart-button" onClick={() => { setCart((count) => count + 1); notify(`${product.name} added to demo cart`); }}>
                      + Add to cart
                    </button>
                  </div>
                </article>
              );
            })}

            {visibleProducts.length === 0 && (
              <div className="empty-state">
                <span>🔎</span>
                <h3>No products found</h3>
                <p>Try another search or choose a different category.</p>
                <div className="hero-actions" style={{ justifyContent: "center" }}>
                  <button className="button-primary" onClick={() => { setSearch(""); setCategory("All"); }}>
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="seller-banner">
          <div>
            <div className="section-kicker" style={{ color: "#80f3df" }}>HAVE SOMETHING TO SELL?</div>
            <h2>Your store deserves a bigger stage.</h2>
            <p>
              NovaCart is being built to bring local vendors and international
              collections together in one marketplace. Get ready to grow with us.
            </p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => notify("Seller registration will be connected in a later step.")}>
                Become a seller →
              </button>
            </div>
          </div>
          <div className="seller-art" aria-hidden="true">🏪</div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="brand" href="#home">
                <span className="brand-mark">N</span>
                <span className="brand-copy">
                  <span className="brand-name">Nova<span>Cart</span></span>
                  <span className="brand-tagline">Discover more. Shop better.</span>
                </span>
              </a>
              <p className="footer-brand-copy">
                A fresh shopping destination for fashion, technology,
                accessories, and discoveries from sellers near and far.
              </p>
            </div>
            <div className="footer-column">
              <h3>Explore</h3>
              <a href="#products">Trending products</a>
              <a href="#products">Latest deals</a>
              <a href="#home">Our marketplace</a>
            </div>
            <div className="footer-column">
              <h3>For sellers</h3>
              <button onClick={() => notify("Vendor onboarding will be connected later.")}>Start selling</button>
              <button onClick={() => notify("Seller support will be connected later.")}>Seller support</button>
            </div>
            <div className="footer-column">
              <h3>Help & support</h3>
              <button onClick={() => notify("Help centre integration is not connected yet.")}>Help centre</button>
              <button onClick={() => notify("Order tracking will be available after backend integration.")}>Track an order</button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} NovaCart. All rights reserved.</span>
            <span>Made for better discoveries ✦</span>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="toast-notice" role="status" aria-live="polite">
          <span>✓</span>
          {toast}
        </div>
      )}
    </main>
  );
}
