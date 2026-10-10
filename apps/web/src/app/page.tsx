
"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
};

const categories = [
  { name: "All Products", icon: "✦" },
  { name: "Fashion", icon: "👕" },
  { name: "Electronics", icon: "🎧" },
  { name: "Footwear", icon: "👟" },
  { name: "Accessories", icon: "👜" },
];

const products: Product[] = [
  { id: 1, name: "Korean Oversized T-Shirt", category: "Fashion", price: 1099, originalPrice: 1599, rating: 4.8, reviews: 124, image: "👕", badge: "BESTSELLER" },
  { id: 2, name: "Wireless Bluetooth Headphones", category: "Electronics", price: 1799, originalPrice: 2499, rating: 4.7, reviews: 89, image: "🎧", badge: "HOT DEAL" },
  { id: 3, name: "Minimal Everyday Sneakers", category: "Footwear", price: 2199, originalPrice: 2999, rating: 4.6, reviews: 76, image: "👟" },
  { id: 4, name: "Japanese Minimalist Backpack", category: "Accessories", price: 1499, originalPrice: 2199, rating: 4.8, reviews: 63, image: "🎒", badge: "POPULAR" },
  { id: 5, name: "Premium Casual Hoodie", category: "Fashion", price: 1899, originalPrice: 2599, rating: 4.7, reviews: 102, image: "🧥" },
  { id: 6, name: "Compact Wireless Earbuds", category: "Electronics", price: 1299, originalPrice: 1999, rating: 4.5, reviews: 58, image: "🎵" },
  { id: 7, name: "Classic Everyday Watch", category: "Accessories", price: 999, originalPrice: 1499, rating: 4.6, reviews: 91, image: "⌚" },
  { id: 8, name: "Streetwear Running Shoes", category: "Footwear", price: 2499, originalPrice: 3499, rating: 4.9, reviews: 147, image: "👟", badge: "TOP RATED" },
];

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sort, setSort] = useState("featured");
  const [toast, setToast] = useState("");
  const [timeLeft, setTimeLeft] = useState(8 * 3600 + 24 * 60 + 36);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const term = search.trim().toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

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
  }, [activeCategory, search, sort]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  function selectCategory(category: string) {
    setActiveCategory(category);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function toggleWishlist(product: Product) {
    const saved = wishlist.includes(product.id);

    setWishlist((current) =>
      saved
        ? current.filter((id) => id !== product.id)
        : [...current, product.id]
    );

    setToast(saved ? "Removed from your wishlist" : "Added to your wishlist");
  }

  function addToCart(product: Product) {
    setCart((current) => [...current, product.id]);
    setToast(`${product.name} added to cart`);
  }

  return (
    <main className="storefront">
      <div className="announcement">
        <span className="announcement-dot" />
        <span>THE NEW SEASON IS HERE</span>
        <span className="announcement-divider">|</span>
        <span>Discover something extraordinary.</span>
      </div>

      <header className="site-header">
        <a href="#" className="brand" aria-label="NovaCart home">
          <span className="brand-mark">N</span>
          <span className="brand-name">
            nova<span>cart</span>
            <small>YOUR WORLD. YOUR STYLE.</small>
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
          <span className="search-icon">⌕</span>
          <input
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search fashion, electronics and more..."
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
          <button
            className="action-icon"
            type="button"
            onClick={() => selectCategory("All Products")}
            aria-label="Browse wishlist products"
          >
            <span>♡</span>
            <small>Wishlist</small>
            {wishlist.length > 0 && (
              <b className="action-count">{wishlist.length}</b>
            )}
          </button>

          <button
            className="action-icon cart-link"
            type="button"
            onClick={() =>
              setToast(
                cart.length
                  ? `Your demo cart contains ${cart.length} item(s).`
                  : "Your cart is empty. Find something you love!"
              )
            }
            aria-label="Shopping cart"
          >
            <span>🛍</span>
            <small>Cart</small>
            {cart.length > 0 && (
              <b className="action-count">{cart.length}</b>
            )}
          </button>
        </div>
      </header>

      <nav className="category-nav" aria-label="Product categories">
        <div className="nav-inner">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`nav-category ${activeCategory === category.name ? "active" : ""}`}
              type="button"
              onClick={() => selectCategory(category.name)}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
          <span className="nav-promo">NEW ARRIVALS ↗</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span>✳</span> CURATED FOR YOUR EVERYDAY
          </span>

          <h1>
            Find your
            <br />
            next <span>favourite.</span>
          </h1>

          <p>
            Discover standout fashion, everyday essentials and clever
            accessories from a world of independent finds.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => selectCategory("All Products")}
            >
              Explore collection <span>↗</span>
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => selectCategory("Fashion")}
            >
              Shop fashion <span>→</span>
            </button>
          </div>

          <div className="hero-proof">
            <div className="proof-avatars">
              <span>J</span>
              <span>A</span>
              <span>M</span>
            </div>
            <div>
              <strong>Made for curious shoppers</strong>
              <small>Fresh finds. Thoughtful choices.</small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-product">
            <span className="hero-product-label">THE EVERYDAY EDIT</span>
            <span className="hero-product-emoji">👕</span>
            <span className="hero-product-caption">
              <strong>Effortless style.</strong>
              <small>Pieces you will reach for.</small>
            </span>
          </div>

          <div className="hero-floating-card floating-top">
            <span>✦</span>
            <div>
              <strong>Fresh finds</strong>
              <small>New season, new you</small>
            </div>
          </div>

          <div className="hero-floating-card floating-bottom">
            <span className="floating-rating">★ 4.8</span>
            <div>
              <strong>Worth discovering</strong>
              <small>Handpicked favourites</small>
            </div>
          </div>

          <span className="hero-sparkle sparkle-one">✳</span>
          <span className="hero-sparkle sparkle-two">✦</span>
        </div>
      </section>

      <section className="benefit-strip">
        <div className="benefit-item">
          <span>↗</span>
          <div>
            <strong>Discover more</strong>
            <small>Fresh finds across categories</small>
          </div>
        </div>
        <div className="benefit-item">
          <span>◇</span>
          <div>
            <strong>Curated collections</strong>
            <small>Style meets everyday utility</small>
          </div>
        </div>
        <div className="benefit-item">
          <span>◎</span>
          <div>
            <strong>Made for you</strong>
            <small>Explore at your own pace</small>
          </div>
        </div>
        <div className="benefit-item">
          <span>♡</span>
          <div>
            <strong>Save your favourites</strong>
            <small>Keep the things you love close</small>
          </div>
        </div>
      </section>

      <section className="section category-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">A LITTLE BIT OF EVERYTHING</span>
            <h2>
              Explore by category<span>.</span>
            </h2>
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => selectCategory("All Products")}
          >
            View all products <span>→</span>
          </button>
        </div>

        <div className="category-grid">
          <button
            className="category-card category-fashion"
            type="button"
            onClick={() => selectCategory("Fashion")}
          >
            <span className="category-art">👕</span>
            <span className="category-card-copy">
              <strong>Fashion</strong>
              <small>Wear it your way</small>
            </span>
            <span className="category-arrow">↗</span>
          </button>

          <button
            className="category-card category-electronics"
            type="button"
            onClick={() => selectCategory("Electronics")}
          >
            <span className="category-art">🎧</span>
            <span className="category-card-copy">
              <strong>Electronics</strong>
              <small>Everyday essentials</small>
            </span>
            <span className="category-arrow">↗</span>
          </button>

          <button
            className="category-card category-footwear"
            type="button"
            onClick={() => selectCategory("Footwear")}
          >
            <span className="category-art">👟</span>
            <span className="category-card-copy">
              <strong>Footwear</strong>
              <small>Make every step count</small>
            </span>
            <span className="category-arrow">↗</span>
          </button>

          <button
            className="category-card category-accessories"
            type="button"
            onClick={() => selectCategory("Accessories")}
          >
            <span className="category-art">👜</span>
            <span className="category-card-copy">
              <strong>Accessories</strong>
              <small>Little details, big impact</small>
            </span>
            <span className="category-arrow">↗</span>
          </button>
        </div>
      </section>

      <section className="deal-banner">
        <div className="deal-copy">
          <span className="deal-kicker">THE DAILY DISCOVERY</span>
          <h2>
            Good finds.
            <br />
            Even better <span className="deal-highlight">prices.</span>
          </h2>
          <p>
            Your next favourite might be closer than you think. Explore
            selected styles and everyday essentials.
          </p>
          <button
            className="deal-button"
            type="button"
            onClick={() => selectCategory("All Products")}
          >
            Explore the deals <span>→</span>
          </button>
        </div>

        <div className="deal-art">
          <span className="deal-sparkle">✳</span>
          <div className="deal-product deal-product-back">🎧</div>
          <div className="deal-product deal-product-front">👟</div>
          <div className="deal-offer-stamp">
            <span>YOUR NEXT</span>
            <strong>FIND</strong>
            <span>AWAITS ✦</span>
          </div>
          <div className="deal-timer-card">
            <small className="deal-timer-label">DAILY DISCOVERY TIMER</small>
            <div className="deal-timer">
              <span>{String(hours).padStart(2, "0")}</span>
              <b>:</b>
              <span>{String(minutes).padStart(2, "0")}</span>
              <b>:</b>
              <span>{String(seconds).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section product-section" id="products">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">HANDPICKED FOR YOU</span>
            <h2>
              {activeCategory === "All Products"
                ? "Trending right now"
                : activeCategory}
              <span>.</span>
            </h2>
            <p className="section-description">
              A few good things worth taking a closer look at.
            </p>
          </div>
          <span className="product-count">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="product-toolbar">
          <div className="filter-chips">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                className={`filter-chip ${activeCategory === category.name ? "active" : ""}`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <label className="sort-label">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const saved = wishlist.includes(product.id);
              const discount = Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              );

              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}

                    <button
                      className={`wishlist-button ${saved ? "saved" : ""}`}
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {saved ? "♥" : "♡"}
                    </button>

                    <span className="product-image-mark">{product.image}</span>
                    <span className="product-image-category">
                      {product.category}
                    </span>
                  </div>

                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>

                    <div className="product-rating">
                      <span>★ {product.rating}</span>
                      <small>({product.reviews} reviews)</small>
                    </div>

                    <div className="product-pricing">
                      <strong>{formatPrice(product.price)}</strong>
                      <del>{formatPrice(product.originalPrice)}</del>
                      <span>{discount}% off</span>
                    </div>

                    <button
                      className="add-cart-button"
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart <span>＋</span>
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
            <p>Try another search or explore a different category.</p>
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All Products");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="seller-banner">
        <div className="seller-symbol">N.</div>
        <div className="seller-copy">
          <span className="section-eyebrow">BUILT FOR INDEPENDENT BRANDS</span>
          <h2>Your products. A bigger world.</h2>
          <p>
            NovaCart brings shoppers and sellers together in one marketplace.
          </p>
        </div>
        <button
          className="seller-button"
          type="button"
          onClick={() => setToast("Seller registration will be available soon.")}
        >
          Become a seller <span>↗</span>
        </button>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <a href="#" className="brand foote