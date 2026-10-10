
"use client";

import { useEffect, useMemo, useState } from "react";

const categories = [
  { name: "Fashion", subtitle: "Everyday essentials", emoji: "👕", style: "mint" },
  { name: "Electronics", subtitle: "Smart accessories", emoji: "🎧", style: "lavender" },
  { name: "Footwear", subtitle: "Step into style", emoji: "👟", style: "sand" },
  { name: "Accessories", subtitle: "The finishing touch", emoji: "👜", style: "rose" },
];

const products = [
  { id: 1, name: "Korean Oversized T-Shirt", category: "Fashion", price: 1099, oldPrice: 1499, rating: "4.8", reviews: "124", emoji: "👕", bg: "#e2eee4", tag: "BESTSELLER" },
  { id: 2, name: "Wireless Studio Headphones", category: "Electronics", price: 1899, oldPrice: 2499, rating: "4.7", reviews: "86", emoji: "🎧", bg: "#e8e4f0", tag: "POPULAR" },
  { id: 3, name: "Everyday Street Sneakers", category: "Footwear", price: 2299, oldPrice: 2999, rating: "4.6", reviews: "92", emoji: "👟", bg: "#f0e7d8", tag: "TRENDING" },
  { id: 4, name: "Minimal Everyday Backpack", category: "Accessories", price: 1499, oldPrice: 1999, rating: "4.5", reviews: "58", emoji: "🎒", bg: "#eee4dd", tag: "NEW ARRIVAL" },
  { id: 5, name: "Classic Casual Shirt", category: "Fashion", price: 1299, oldPrice: 1799, rating: "4.6", reviews: "73", emoji: "👔", bg: "#dfe9ec", tag: "JUST IN" },
  { id: 6, name: "Compact Wireless Earbuds", category: "Electronics", price: 999, oldPrice: 1499, rating: "4.4", reviews: "105", emoji: "🎵", bg: "#eee4df", tag: "GREAT VALUE" },
  { id: 7, name: "Premium Daily Sneakers", category: "Footwear", price: 1999, oldPrice: 2699, rating: "4.7", reviews: "61", emoji: "👞", bg: "#e4eadf", tag: "TOP RATED" },
  { id: 8, name: "Modern Everyday Watch", category: "Accessories", price: 1799, oldPrice: 2399, rating: "4.5", reviews: "47", emoji: "⌚", bg: "#e5e6ed", tag: "EDITOR'S PICK" },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(8 * 60 * 60 + 24 * 60 + 35);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  function chooseCategory(category: string) {
    setActiveCategory(category);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  function addToCart(productName: string) {
    setCartCount((count) => count + 1);
    setToast(`${productName} added to your demo cart`);
  }

  function toggleFavorite(productId: number, productName: string) {
    const alreadySaved = favorites.includes(productId);

    setFavorites((current) =>
      alreadySaved
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );

    setToast(
      alreadySaved
        ? `${productName} removed from your wishlist`
        : `${productName} saved to your wishlist`
    );
  }

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        Discover something special with NovaCart
        <span>·</span>
        <a href="#deals">Explore current offers ↗</a>
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="NovaCart home">
          <span className="brand-mark">N.</span>
          <span className="brand-name">
            Nova<span>Cart</span>
          </span>
        </a>

        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            document.getElementById("products")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search fashion, electronics and more..."
            aria-label="Search products"
          />
          {search && (
            <button
              className="clear-search"
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button className="search-submit" type="submit">
            Search
          </button>
        </form>

        <div className="header-actions">
          <a className="account-link" href="#account">
            <span className="action-icon" aria-hidden="true">♙</span>
            <span>Account</span>
          </a>
          <a className="cart-link" href="#products" aria-label={`Demo cart, ${cartCount} items`}>
            <span className="action-icon" aria-hidden="true">♧</span>
            <span>Cart</span>
            <span className="cart-count">{cartCount}</span>
          </a>
        </div>
      </header>

      <nav className="category-nav" aria-label="Product categories">
        <div className="category-nav-inner">
          <button
            className={`nav-category ${activeCategory === "All" ? "selected" : ""}`}
            onClick={() => chooseCategory("All")}
          >
            <span>✳</span> All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`nav-category ${activeCategory === category.name ? "selected" : ""}`}
              onClick={() => chooseCategory(category.name)}
            >
              <span>{category.emoji}</span>
              {category.name}
            </button>
          ))}
          <a className="nav-category" href="#deals">
            <span>✦</span> Deals
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            THE NOVACART EDIT
          </div>
          <h1>
            Find your
            <br />
            next <span>favourite.</span>
          </h1>
          <p>
            Thoughtfully picked fashion, everyday technology and
            accessories to make your everyday a little more extraordinary.
          </p>

          <div className="hero-buttons">
            <a className="button-primary" href="#products">
              Explore collection <span>↗</span>
            </a>
            <a className="button-text" href="#deals">
              Discover offers <span>→</span>
            </a>
          </div>

          <div className="hero-proof">
            <div className="proof-avatars" aria-hidden="true">
              <span>N</span><span>V</span><span>C</span>
            </div>
            <div>
              <strong>A marketplace made for you</strong>
              <small>Fashion · Tech · Everyday essentials</small>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Featured fashion product illustration">
          <div className="hero-orbit" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-decoration decoration-one">✳</div>
          <div className="hero-decoration decoration-two">✦</div>

          <div className="hero-product">
            <div className="hero-product-emoji" aria-hidden="true">👕</div>
            <div className="hero-product-caption">
              <span>THE DAILY EDIT</span>
              <strong>Everyday, elevated.</strong>
            </div>
          </div>

          <div className="hero-sticker">
            <span>MADE FOR</span>
            <strong>YOUR<br />STYLE</strong>
          </div>

          <div className="hero-floating-card floating-top">
            <span className="floating-icon">✦</span>
            <div>
              <strong>Fresh finds</strong>
              <small>Explore the latest edit</small>
            </div>
          </div>

          <div className="hero-floating-card floating-bottom">
            <span className="floating-check">✓</span>
            <div>
              <strong>Shop with confidence</strong>
              <small>Your next find awaits</small>
            </div>
          </div>
        </div>
      </section>

      <section className="benefit-strip" aria-label="NovaCart benefits">
        <div className="benefit">
          <span className="benefit-icon">◇</span>
          <div><strong>Curated collections</strong><small>Handpicked everyday finds</small></div>
        </div>
        <div className="benefit">
          <span className="benefit-icon">↗</span>
          <div><strong>Discover more</strong><small>New styles and essentials</small></div>
        </div>
        <div className="benefit">
          <span className="benefit-icon">♡</span>
          <div><strong>Made for your style</strong><small>Choices for every day</small></div>
        </div>
        <div className="benefit">
          <span className="benefit-icon">✧</span>
          <div><strong>One easy destination</strong><small>Fashion, tech and more</small></div>
        </div>
      </section>

      <section className="section category-section" id="categories">
        <div className="section-heading">
          <div>
            <span className="section-kicker">EXPLORE YOUR INTERESTS</span>
            <h2>Shop by <span>category.</span></h2>
            <p>Start with what you love. Find something unexpected.</p>
          </div>
          <a className="section-link" href="#products">
            All products <span>→</span>
          </a>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.name}
              className="category-card"
              onClick={() => chooseCategory(category.name)}
            >
              <div className={`category-art ${category.style}`}>
                <span className="category-art-spark">✳</span>
                <span className="category-emoji">{category.emoji}</span>
              </div>
              <div className="category-card-copy">
                <strong>{category.name}</strong>
                <small>{category.subtitle}</small>
              </div>
              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="deal-banner" id="deals">
        <div className="deal-copy">
          <span className="deal-kicker">A LITTLE SOMETHING EXTRA</span>
          <h2>
            Good finds.
            <br />
            <span>Better prices.</span>
          </h2>
          <p>
            Explore our sample selection of everyday favourites.
            Find your next pick and make it yours.
          </p>
          <a className="deal-button" href="#products">
            Explore featured picks <span>↗</span>
          </a>
          <small className="deal-disclaimer">
            Demo storefront: prices and offers are illustrative, not live promotions.
          </small>
        </div>

        <div className="deal-art" aria-label="Illustrations of featured products">
          <div className="deal-ring" />
          <div className="deal-product deal-product-left">🎧</div>
          <div className="deal-product deal-product-center">👕</div>
          <div className="deal-product deal-product-right">👟</div>
          <div className="deal-offer-stamp">
            <span>THE</span>
            <strong>EDIT</strong>
            <span>IS IN</span>
          </div>
          <div className="deal-timer-card">
            <span>DEMO COUNTDOWN</span>
            <div className="deal-timer">
              <strong>{hours}</strong><i>:</i>
              <strong>{minutes}</strong><i>:</i>
              <strong>{seconds}</strong>
            </div>
            <small>Illustrative timer only</small>
          </div>
        </div>
      </section>

      <section className="section featured-section" id="products">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE NOVACART COLLECTION</span>
            <h2>Find your <span>next favourite.</span></h2>
            <p>Explore a sample of products selected for your everyday.</p>
          </div>
          <span className="product-count">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="product-toolbar">
          <div className="filter-chips" aria-label="Filter products by category">
            {["All", ...categories.map((category) => category.name)].map((category) => (
              <button
                key={category}
                className={`filter-chip ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category === "All" ? "All products" : category}
              </button>
            ))}
          </div>
          <label className="sort-label">
            <span>Showing</span>
            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
              aria-label="Filter products"
            >
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const discount = Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              );
              const isFavorite = favorites.includes(product.id);

              return (
                <article className="product-card" key={product.id}>
                  <div
                    className="product-image"
                    style={{ backgroundColor: product.bg }}
                  >
                    <span className="product-tag">{product.tag}</span>
                    <button
                      className={`wishlist-button ${isFavorite ? "is-favorite" : ""}`}
                      onClick={() => toggleFavorite(product.id, product.name)}
                      aria-label={isFavorite ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                      aria-pressed={isFavorite}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                    <span className="product-emoji" aria-hidden="true">
                      {product.emoji}
                    </span>
                    <span className="product-image-mark">NC.</span>
                  </div>

                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>

                    <div className="product-rating">
                      <span>★ {product.rating}</span>
                      <small>({product.reviews} reviews)</small>
                    </div>

                    <div className="product-price-row">
                      <strong>{money(product.price)}</strong>
                      <del>{money(product.oldPrice)}</del>
                      <span className="discount">{discount}% off</span>
                    </div>

                    <button
                      className="add-cart-button"
                      onClick={() => addToCart(product.name)}
                    >
                      <span>＋</span> Add to cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-results">
            <span>⌕</span>
            <h3>No products found</h3>
            <p>Try another search term or choose a different category.</p>
            <button
              className="button-primary"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <p className="demo-note">
          Product names, prices, ratings and availability on this preview are sample data.
          Cart and wishlist actions are demonstrations and do not place real orders.
        </p>
      </section>

      <section className="seller-banner" id="account">
        <div className="seller-symbol">N.</div>
        <div className="seller-copy">
          <span>GROW WITH NOVACART</span>
          <h2>Your products deserve a bigger stage.</h2>
          <p>Discover the opportunity to bring your store and products to a wider audience.</p>
        </div>
        <a className="seller-button" href="mailto:sellers@novacart.example">
          Become a seller <span>↗</span>
        </a>
        <span className="seller-decoration" aria-hidden="true">N.</span>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#">
              <span className="brand-mark">N.</span>
              <span className="brand-name">Nova<span>Cart</span></span>
            </a>
            <p>
              A marketplace for discovering fashion, useful technology
              and everyday accessories — all in one place.
            </p>
          </div>

          <div className="footer-column">
            <strong>Explore</strong>
            <a href="#categories">Categories</a>
            <a href="#products">Featured products</a>
            <a href="#deals">Latest offers</a>
          </div>

          <div className="footer-column">
            <strong>For sellers</strong>
            <a href="#account">Become a seller</a>
            <a href="mailto:sellers@novacart.example">Seller enquiries</a>
          </div>

          <div className="footer-column">
            <strong>Need help?</strong>
            <a href="mailto:support@novacart.example">Contact support</a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NovaCart. All rights reserved.</span>
          <span>Designed for everyday discovery.</span>
        </div>
      </footer>

      {toast && (
        <div className="toast-notice" role="status" aria-live="polite">
          <span>✓</span>
          {toast}
        <