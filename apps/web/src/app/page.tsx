
"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  emoji: string;
  tint: string;
  badge: string;
};

const categories = [
  { name: "Fashion", emoji: "👕", count: "Fresh styles", tint: "#f0eaff" },
  { name: "Electronics", emoji: "🎧", count: "Smart essentials", tint: "#e1f8f5" },
  { name: "Footwear", emoji: "👟", count: "Step in style", tint: "#fff0e4" },
  { name: "Accessories", emoji: "⌚", count: "Little upgrades", tint: "#fce8f0" },
];

const products: Product[] = [
  {
    id: 1,
    name: "Korean Oversized Everyday T-Shirt",
    brand: "NovaCart Select",
    category: "Fashion",
    price: 1099,
    oldPrice: 1499,
    rating: 4.8,
    reviews: 124,
    emoji: "👕",
    tint: "#f0eaff",
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "Premium Wireless Headphones",
    brand: "Audio Studio",
    category: "Electronics",
    price: 1899,
    oldPrice: 2499,
    rating: 4.7,
    reviews: 86,
    emoji: "🎧",
    tint: "#e1f8f5",
    badge: "HOT DEAL",
  },
  {
    id: 3,
    name: "Minimal Everyday Sneakers",
    brand: "Street Form",
    category: "Footwear",
    price: 1599,
    oldPrice: 2199,
    rating: 4.6,
    reviews: 73,
    emoji: "👟",
    tint: "#fff0e4",
    badge: "TRENDING",
  },
  {
    id: 4,
    name: "Classic Everyday Wristwatch",
    brand: "Time Theory",
    category: "Accessories",
    price: 1299,
    oldPrice: 1799,
    rating: 4.5,
    reviews: 58,
    emoji: "⌚",
    tint: "#fce8f0",
    badge: "POPULAR",
  },
  {
    id: 5,
    name: "Relaxed Fit Streetwear Hoodie",
    brand: "Urban Mood",
    category: "Fashion",
    price: 1799,
    oldPrice: 2399,
    rating: 4.7,
    reviews: 91,
    emoji: "🧥",
    tint: "#e8edff",
    badge: "NEW ARRIVAL",
  },
  {
    id: 6,
    name: "Compact Wireless Earbuds",
    brand: "Audio Studio",
    category: "Electronics",
    price: 999,
    oldPrice: 1499,
    rating: 4.4,
    reviews: 112,
    emoji: "🎵",
    tint: "#e3f8ed",
    badge: "GREAT VALUE",
  },
  {
    id: 7,
    name: "Everyday Crossbody Bag",
    brand: "Mode Avenue",
    category: "Accessories",
    price: 899,
    oldPrice: 1299,
    rating: 4.6,
    reviews: 47,
    emoji: "👜",
    tint: "#fff1df",
    badge: "JUST IN",
  },
  {
    id: 8,
    name: "Lightweight Running Shoes",
    brand: "Street Form",
    category: "Footwear",
    price: 1999,
    oldPrice: 2799,
    rating: 4.8,
    reviews: 65,
    emoji: "👟",
    tint: "#eee8ff",
    badge: "TOP RATED",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toast, setToast] = useState("");

  const showMessage = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, activeCategory, sort]);

  const toggleWishlist = (id: number) => {
    const alreadySaved = wishlist.includes(id);

    setWishlist((current) =>
      alreadySaved ? current.filter((item) => item !== id) : [...current, id],
    );

    showMessage(alreadySaved ? "Removed from your wishlist." : "Added to your wishlist.");
  };

  const addToCart = (product: Product) => {
    setCartCount((count) => count + 1);
    showMessage(`${product.name} added to your demo cart.`);
  };

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <div className="announcement">
        Your next favourite find is waiting. <strong>Discover NovaCart today.</strong>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <a className="brand" href="#" aria-label="NovaCart home">
            <span className="brand-mark">N</span>
            <span className="brand-name">
              Nova<span>Cart</span>
            </span>
          </a>

          <label className="search-box">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Search fashion, electronics, accessories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </label>

          <div className="header-actions">
            <button
              className="header-action"
              type="button"
              onClick={() =>
                showMessage(
                  wishlist.length
                    ? `You have ${wishlist.length} saved item(s).`
                    : "Your wishlist is empty. Save something you love!",
                )
              }
            >
              <span className="action-icon" aria-hidden="true">
                ♡
              </span>
              <span>Wishlist</span>
            </button>

            <button
              className="header-action"
              type="button"
              onClick={() =>
                showMessage(`Your demo cart contains ${cartCount} item(s).`)
              }
            >
              <span className="action-icon" aria-hidden="true">
                🛍
              </span>
              <span>Cart</span>
              <span className="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>

        <nav className="nav-bar" aria-label="Main navigation">
          <div className="container nav-inner">
            <a className="nav-link" href="#categories">
              All Categories
            </a>
            <a className="nav-link" href="#products" onClick={() => setActiveCategory("Fashion")}>
              Fashion
            </a>
            <a
              className="nav-link"
              href="#products"
              onClick={() => setActiveCategory("Electronics")}
            >
              Electronics
            </a>
            <a
              className="nav-link"
              href="#products"
              onClick={() => setActiveCategory("Footwear")}
            >
              Footwear
            </a>
            <a
              className="nav-link"
              href="#products"
              onClick={() => setActiveCategory("Accessories")}
            >
              Accessories
            </a>
            <a className="nav-link highlight" href="#deals">
              Today&apos;s Deals
            </a>
            <a className="nav-link" href="#sell">
              Sell on NovaCart
            </a>
          </div>
        </nav>
      </header>

      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span aria-hidden="true">✦</span>
              YOUR STYLE. YOUR DISCOVERY.
            </div>

            <h1>
              Discover more.
              <br />
              Shop <span>better.</span>
            </h1>

            <p className="hero-description">
              Explore fresh fashion, everyday tech, and unique finds from a
              marketplace made around you.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#products">
                Explore collection <span aria-hidden="true">→</span>
              </a>
              <a className="button-secondary" href="#categories">
                Browse categories
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured products">
            <div className="hero-orbit" />
            <div className="hero-product">
              <span className="hero-product-icon" aria-hidden="true">
                🛍️
              </span>
              <span className="hero-product-label">Your next great find ✨</span>
            </div>
            <span className="floating-bubble bubble-one" aria-hidden="true">
              🎧
            </span>
            <span className="floating-bubble bubble-two" aria-hidden="true">
              👟
            </span>
          </div>
        </section>

        <section className="benefit-strip" aria-label="Shopping benefits">
          <div className="benefit-item">
            <div className="benefit-icon" aria-hidden="true">
              🚚
            </div>
            <div>
              <strong>Convenient shopping</strong>
              <span>Explore products in one place</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon" aria-hidden="true">
              ✨
            </div>
            <div>
              <strong>Fresh discoveries</strong>
              <span>Find something different</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon" aria-hidden="true">
              🔒
            </div>
            <div>
              <strong>Shopping with confidence</strong>
              <span>A marketplace built to grow</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon" aria-hidden="true">
              💜
            </div>
            <div>
              <strong>Made for your style</strong>
              <span>Everyday picks, your way</span>
            </div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Find your next favourite</p>
              <h2 className="section-title">Shop by category</h2>
              <p className="section-subtitle">
                Start with what you love and discover more along the way.
              </p>
            </div>
            <a className="text-link" href="#products">
              Explore all →
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                className="category-card"
                key={category.name}
                type="button"
                style={{ "--category-tint": category.tint } as React.CSSProperties}
                onClick={() => selectCategory(category.name)}
              >
                <span className="category-emoji" aria-hidden="true">
                  {category.emoji}
                </span>
                <strong>{category.name}</strong>
                <span>{category.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="deal-banner" id="deals">
          <div className="deal-copy">
            <span className="deal-label">THE DISCOVERY EDIT</span>
            <h2>Good finds. Better prices.</h2>
            <p>
              Explore handpicked demo deals across fashion, tech, and everyday
              essentials.
            </p>
          </div>
          <a className="deal-button" href="#products">
            Explore the deals →
          </a>
        </section>

        <section className="section" id="products">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Picked for you</p>
              <h2 className="section-title">Popular right now</h2>
              <p className="section-subtitle">
                A first look at the NovaCart shopping experience.
              </p>
            </div>
          </div>

          <div className="product-toolbar">
            <div className="filter-list" aria-label="Filter products by category">
              {["All", ...categories.map((category) => category.name)].map(
                (category) => (
                  <button
                    key={category}
                    className={`filter-button ${
                      activeCategory === category ? "active" : ""
                    }`}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>

            <label>
              <span className="section-subtitle">Sort: </span>
              <select
                className="sort-select"
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

          <div className="product-grid">
            {filteredProducts.map((product) => {
              const discount = Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              );

              return (
                <article className="product-card" key={product.id}>
                  <div
                    className="product-image"
                    style={{ "--product-tint": product.tint } as React.CSSProperties}
                  >
                    <span className="product-badge">{product.badge}</span>

                    <button
                      className={`wishlist-button ${
                        wishlist.includes(product.id) ? "active" : ""
                      }`}
                      type="button"
                      aria-label={
                        wishlist.includes(product.id)
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      aria-pressed={wishlist.includes(product.id)}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      {wishlist.includes(product.id) ? "♥" : "♡"}
                    </button>

                    <span className="product-emoji" aria-hidden="true">
                      {product.emoji}
                    </span>
                  </div>

                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-rating">
                      <span className="rating-stars">★ ★ ★ ★ ★</span>{" "}
                      {product.rating} ({product.reviews})
                    </div>

                    <div className="product-price-row">
                      <span className="product-price">
                        {formatPrice(product.price)}
                      </span>
                      <span className="product-old-price">
                        {formatPrice(product.oldPrice)}
                      </span>
                      <span className="product-discount">{discount}% off</span>
                    </div>

                    <button
                      className="add-cart-button"
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart +
                    </button>
                  </div>
                </article>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="empty-products">
                No products match your search. Try another keyword or category.
              </div>
            )}
          </div>
        </section>

        <section className="seller-banner" id="sell">
          <div className="seller-copy">
            <h2>Have something great to sell?</h2>
            <p>
              NovaCart is being built to bring independent vendors and shoppers
              together. Seller tools and registration will be connected in a
              later step.
            </p>
          </div>

          <button
            className="seller-button"
            type="button"
            onClick={() =>
              showMessage("Seller registration will be connected in a later step.")
            }
          >
            Become a seller →
          </button>
        </section>
      </div>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="brand" href="#" aria-label="NovaCart home">
                <span className="brand-mark">N</span>
                <span className="brand-name">
                  Nova<span>Cart</span>
                </span>
              </a>
              <p className="footer-brand-description">
                Discover fashion, useful tech, and everyday finds in one
                growing marketplace.
              </p>
            </div>

            <div>
              <h3 className="footer-heading">Discover</h3>
              <div className="footer-links">
                <a href="#categories">Categories</a>
                <a href="#products">Popular products</a>
                <a href="#deals">Deals and offers</a>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Sell with us</h3>
              <div className="footer-links">
                <a href="#sell">Become a seller</a>
                <a href="#sell">Vendor information</a>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Help</h3>
              <div className="footer-links">
                <a href="mailto:support@novacart.example">Contact</a>
                <a href="#sell">Customer support</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} NovaCart. All rights reserved.</span>
            <span>Discover more. Shop better.</span>
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
