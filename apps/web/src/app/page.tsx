
"use client";

import { useEffect, useMemo, useState } from "react";

const categories = [
  { name: "All Products", icon: "✦" },
  { name: "Fashion", icon: "◈" },
  { name: "Electronics", icon: "⌁" },
  { name: "Footwear", icon: "♧" },
  { name: "Accessories", icon: "◇" },
  { name: "Home & Living", icon: "⌂" },
];

const products = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    category: "Fashion",
    price: 799,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 124,
    emoji: "👕",
    color: "mint",
    label: "BESTSELLER",
  },
  {
    id: 2,
    name: "Studio Wireless Headphones",
    category: "Electronics",
    price: 2499,
    originalPrice: 3499,
    rating: 4.7,
    reviews: 86,
    emoji: "🎧",
    color: "lavender",
    label: "TOP PICK",
  },
  {
    id: 3,
    name: "Everyday Street Sneakers",
    category: "Footwear",
    price: 1899,
    originalPrice: 2799,
    rating: 4.6,
    reviews: 213,
    emoji: "👟",
    color: "sand",
    label: "TRENDING",
  },
  {
    id: 4,
    name: "Minimal Crossbody Bag",
    category: "Accessories",
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 67,
    emoji: "👜",
    color: "rose",
    label: "NEW ARRIVAL",
  },
  {
    id: 5,
    name: "Everyday Smart Watch",
    category: "Electronics",
    price: 3299,
    originalPrice: 4499,
    rating: 4.5,
    reviews: 102,
    emoji: "⌚",
    color: "lavender",
    label: "POPULAR",
  },
  {
    id: 6,
    name: "Relaxed Fit Cargo Pants",
    category: "Fashion",
    price: 1399,
    originalPrice: 1999,
    rating: 4.7,
    reviews: 91,
    emoji: "👖",
    color: "mint",
    label: "TRENDING",
  },
  {
    id: 7,
    name: "Modern Ceramic Mug Set",
    category: "Home & Living",
    price: 649,
    originalPrice: 899,
    rating: 4.6,
    reviews: 54,
    emoji: "☕",
    color: "sand",
    label: "GREAT VALUE",
  },
  {
    id: 8,
    name: "Classic Everyday Sunglasses",
    category: "Accessories",
    price: 599,
    originalPrice: 999,
    rating: 4.4,
    reviews: 73,
    emoji: "🕶️",
    color: "rose",
    label: "JUST IN",
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60 + 24 * 60 + 36);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(timeLeft % 60).padStart(2, "0");

  function addToCart(productName: string) {
    setCartCount((count) => count + 1);
    setNotice(`${productName} added to your demo cart.`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        A little more style, a little less spend.
        <a href="#deals">Explore today&apos;s offers ↗</a>
      </div>

      <header className="site-header">
        <a href="#" className="brand" aria-label="NovaCart home">
          <span className="brand-mark">n.</span>
          <span className="brand-name">
            nova<span>cart</span>
          </span>
        </a>

        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            document
              .getElementById("products")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for products, styles and more"
            aria-label="Search products"
          />
          {search && (
            <button
              type="button"
              className="clear-search"
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

        <nav className="header-actions" aria-label="Main navigation">
          <a className="account-link" href="#account">
            <span className="action-icon">♙</span>
            <span>Account</span>
          </a>
          <a className="cart-link" href="#products">
            <span className="action-icon">♧</span>
            <span>Cart</span>
            <span className="cart-count">{cartCount}</span>
          </a>
        </nav>
      </header>

      <nav className="category-nav" aria-label="Product categories">
        <div className="category-nav-inner">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`nav-category ${
                activeCategory === category.name ? "selected" : ""
              }`}
              onClick={() => {
                setActiveCategory(category.name);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            YOUR STYLE, YOUR WORLD
          </div>
          <h1>
            Good finds.
            <br />
            <span>Great feelings.</span>
          </h1>
          <p>
            Discover everyday essentials, fresh fashion and thoughtful
            accessories—all in one place, picked for your kind of life.
          </p>
          <div className="hero-buttons">
            <a className="button-primary" href="#products">
              Explore collection <span>↗</span>
            </a>
            <a className="button-text" href="#deals">
              See today&apos;s deals <span>→</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars" aria-hidden="true">
              <span>J</span>
              <span>A</span>
              <span>M</span>
            </div>
            <div>
              <strong>Made for everyday you</strong>
              <small>Style, value and variety together</small>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="A curated selection of products">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-sticker">
            <span>THE</span>
            <strong>GOOD</strong>
            <strong>FINDS</strong>
            <span>COLLECTION</span>
          </div>
          <div className="hero-product hero-product-main">
            <div className="hero-product-emoji">👟</div>
            <div className="hero-product-caption">
              <span>EVERYDAY EDIT</span>
              <strong>Made to move.</strong>
            </div>
          </div>
          <div className="hero-floating-card floating-top">
            <span className="floating-icon">✳</span>
            <span>
              <strong>Fresh picks</strong>
              <small>Discover something new</small>
            </span>
          </div>
          <div className="hero-floating-card floating-bottom">
            <span className="floating-check">✓</span>
            <span>
              <strong>Style meets value</strong>
              <small>Find your next favourite</small>
            </span>
          </div>
          <span className="hero-decoration decoration-one">✳</span>
          <span className="hero-decoration decoration-two">✦</span>
        </div>
      </section>

      <section className="benefit-strip" aria-label="Shopping highlights">
        <div className="benefit">
          <span className="benefit-icon">◇</span>
          <span>
            <strong>Curated collections</strong>
            <small>Picked with care</small>
          </span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">↗</span>
          <span>
            <strong>Everyday value</strong>
            <small>Deals worth finding</small>
          </span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">◎</span>
          <span>
            <strong>Multiple sellers</strong>
            <small>More choice for you</small>
          </span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">♡</span>
          <span>
            <strong>Made for you</strong>
            <small>Discover your favourites</small>
          </span>
        </div>
      </section>

      <section className="section category-section" id="categories">
        <div className="section-heading">
          <div>
            <span className="section-kicker">FIND YOUR SOMETHING</span>
            <h2>Shop by category<span>.</span></h2>
            <p>A good place to start your next discovery.</p>
          </div>
          <a
            href="#products"
            className="section-link"
            onClick={() => setActiveCategory("All Products")}
          >
            All collections <span>↗</span>
          </a>
        </div>

        <div className="category-grid">
          {[
            {
              name: "Fashion",
              description: "Everyday looks",
              emoji: "👕",
              color: "mint",
            },
            {
              name: "Electronics",
              description: "Little upgrades",
              emoji: "🎧",
              color: "lavender",
            },
            {
              name: "Footwear",
              description: "Step out well",
              emoji: "👟",
              color: "sand",
            },
            {
              name: "Accessories",
              description: "The finishing touch",
              emoji: "👜",
              color: "rose",
            },
          ].map((category) => (
            <button
              key={category.name}
              className="category-card"
              onClick={() => {
                setActiveCategory(category.name);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className={`category-art ${category.color}`}>
                <span className="category-emoji">{category.emoji}</span>
                <span className="category-art-spark">✳</span>
              </span>
              <span className="category-card-copy">
                <strong>{category.name}</strong>
                <small>{category.description}</small>
              </span>
              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="deal-banner" id="deals">
        <div className="deal-copy">
          <span className="deal-kicker">THE LITTLE EXTRA EVENT</span>
          <h2>
            Good things.
            <br />
            <span>Better prices.</span>
          </h2>
          <p>
            Find a new favourite with handpicked offers across everyday
            essentials and standout styles.
          </p>
          <a className="deal-button" href="#products">
            Explore the offers <span>↗</span>
          </a>
          <small className="deal-disclaimer">
            Demo promotion · Sample prices and timer
          </small>
        </div>
        <div className="deal-art">
          <div className="deal-ring" />
          <div className="deal-product deal-product-left">🎧</div>
          <div className="deal-product deal-product-center">👟</div>
          <div className="deal-product deal-product-right">👜</div>
          <div className="deal-offer-stamp">
            <span>UP TO</span>
            <strong>33%</strong>
            <span>OFF*</span>
          </div>
          <div className="deal-timer-card">
            <span>DEMO COUNTDOWN</span>
            <div className="deal-timer">
              <strong>{hours}</strong>
              <i>:</i>
              <strong>{minutes}</strong>
              <i>:</i>
              <strong>{seconds}</strong>
            </div>
            <small>Hours&nbsp;&nbsp; Min&nbsp;&nbsp; Sec</small>
          </div>
        </div>
      </section>

      <section className="section featured-section" id="products">
        <div className="section-heading">
          <div>
            <span className="section-kicker">A FEW GOOD FINDS</span>
            <h2>
              Things you&apos;ll <span>love.</span>
            </h2>
            <p>Fresh picks for your wardrobe, desk and everyday life.</p>
          </div>
          <span className="product-count">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="product-toolbar">
          <div className="filter-chips" aria-label="Filter products">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`filter-chip ${
                  activeCategory === category.name ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <label className="sort-label">
            <span>View</span>
            <select
              aria-label="Sort products"
              onChange={(event) => {
                const value = event.target.value;
                if (value === "price-low") {
                  setNotice("For this demo, products remain in their original order.");
                  window.setTimeout(() => setNotice(""), 2500);
                }
              }}
              defaultValue="featured"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
            </select>
          </label>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const discount = Math.round(
                (1 - product.price / product.originalPrice) * 100
              );

              return (
                <article className="product-card" key={product.id}>
                  <div className={`product-image ${product.color}`}>
                    <span className="product-tag">{product.label}</span>
                    <button
                      className={`wishlist-button ${
                        favorites.includes(product.id) ? "is-favorite" : ""
                      }`}
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={
                        favorites.includes(product.id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {favorites.includes(product.id) ? "♥" : "♡"}
                    </button>
                    <span className="product-emoji">{product.emoji}</span>
                    <span className="product-image-mark">N.</span>
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
                      <del>{money(product.originalPrice)}</del>
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
            <h3>No finds just yet</h3>
            <p>Try another search or choose a different category.</p>
            <button
              className="button-primary"
              onClick={() => {
                setSearch("");
                setActiveCategory("All Products");
              }}
            >
              Show all products
            </button>
          </div>
        )}
        <p className="demo-note">
          Sample catalogue for design preview. Products, prices, reviews and
          discounts are illustrative and are not live inventory.
        </p>
      </section>

      <section className="seller-banner" id="account">
        <div className="seller-symbol">n.</div>
        <div className="seller-copy">
          <span>GROW WITH NOVACART</span>
          <h2>Your products. A bigger stage.</h2>
          <p>
            Bring your collection to a marketplace made for discovery.
          </p>
        </div>
        <a href="mailto:sellers@novacart.example" className="seller-button">
          Become a seller <span>↗</span>
        </a>
        <span className="seller-decoration">✳</span>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#" className="brand">
              <span className="brand-mark">n.</span>
              <span className="brand-name">
                nova<span>cart</span>
              </span>
            </a>
            <p>
              A thoughtful mix of everyday essentials, fresh styles and
              discoveries worth sharing.
            </p>
          </div>
          <div className="footer-column">
            <strong>Discover</strong>
            <a href="#categories">Categories</a>
            <a href="#products">Popular finds</a>
            <a href="#deals">Deals & offers</a>
          </div>
          <div className="footer-column">
            <strong>Sell with us</strong>
            <a href="#account">Become a seller</a>
            <a href="mailto:sellers@novacart.example">Seller enquiries</a>
          </div>
          <div className