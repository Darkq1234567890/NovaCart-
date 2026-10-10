
"use client";

import { useEffect, useMemo, useState } from "react";

const categories = [
  { name: "All", icon: "✦" },
  { name: "Korean Fashion", icon: "👕" },
  { name: "Japanese Style", icon: "👘" },
  { name: "Electronics", icon: "🎧" },
  { name: "Footwear", icon: "👟" },
  { name: "Accessories", icon: "⌚" },
];

const products = [
  {
    id: 1,
    name: "Korean Oversized T-Shirt",
    category: "Korean Fashion",
    price: 1099,
    oldPrice: 1499,
    discount: 27,
    rating: 4.6,
    icon: "👕",
    color: "#e6edff",
    label: "BESTSELLER",
  },
  {
    id: 2,
    name: "Minimal Wireless Headphones",
    category: "Electronics",
    price: 1899,
    oldPrice: 2499,
    discount: 24,
    rating: 4.5,
    icon: "🎧",
    color: "#e0f2fe",
    label: "HOT DEAL",
  },
  {
    id: 3,
    name: "Japanese Everyday Backpack",
    category: "Japanese Style",
    price: 1499,
    oldPrice: 1999,
    discount: 25,
    rating: 4.7,
    icon: "🎒",
    color: "#fce7f3",
    label: "TRENDING",
  },
  {
    id: 4,
    name: "Classic Street Sneakers",
    category: "Footwear",
    price: 2299,
    oldPrice: 2999,
    discount: 23,
    rating: 4.4,
    icon: "👟",
    color: "#dcfce7",
    label: "NEW ARRIVAL",
  },
  {
    id: 5,
    name: "Everyday Minimal Watch",
    category: "Accessories",
    price: 1299,
    oldPrice: 1799,
    discount: 28,
    rating: 4.3,
    icon: "⌚",
    color: "#fef3c7",
    label: "LIMITED DEAL",
  },
  {
    id: 6,
    name: "Japanese Relaxed Hoodie",
    category: "Japanese Style",
    price: 1799,
    oldPrice: 2299,
    discount: 22,
    rating: 4.8,
    icon: "🧥",
    color: "#ede9fe",
    label: "TOP RATED",
  },
  {
    id: 7,
    name: "Korean Everyday Sneakers",
    category: "Korean Fashion",
    price: 1999,
    oldPrice: 2699,
    discount: 26,
    rating: 4.5,
    icon: "👟",
    color: "#ffe4e6",
    label: "POPULAR",
  },
  {
    id: 8,
    name: "Portable Music Earbuds",
    category: "Electronics",
    price: 999,
    oldPrice: 1499,
    discount: 33,
    rating: 4.4,
    icon: "🎵",
    color: "#dbeafe",
    label: "GREAT VALUE",
  },
];

const money = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (
          previous.hours === 0 &&
          previous.minutes === 0 &&
          previous.seconds === 0
        ) {
          return { hours: 5, minutes: 59, seconds: 59 };
        }

        if (previous.seconds > 0) {
          return { ...previous, seconds: previous.seconds - 1 };
        }

        if (previous.minutes > 0) {
          return {
            ...previous,
            minutes: previous.minutes - 1,
            seconds: 59,
          };
        }

        return {
          hours: previous.hours - 1,
          minutes: 59,
          seconds: 59,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main>
      <div className="top-strip">
        <span>Discover your style. Find your next favourite.</span>
        <span>New-season finds • Exciting everyday discoveries</span>
      </div>

      <header className="site-header">
        <a className="brand" href="/" aria-label="NovaCart home">
          <span className="brand-symbol">N</span>
          <span>
            nova<span className="brand-accent">cart</span>
          </span>
        </a>

        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            document
              .getElementById("shop-products")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Search products, brands and styles..."
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className="header-actions" aria-label="Shopping navigation">
          <a href="/account">♙ <span>Account</span></a>
          <a href="/orders">▤ <span>Orders</span></a>
          <a className="cart-link" href="#shop-products">
            ♧ <span>Cart</span>
            <span className="cart-count">{cartCount}</span>
          </a>
        </nav>
      </header>

      <nav className="category-nav" aria-label="Main categories">
        <a href="#shop-products">Shop All</a>
        <a href="#categories">Categories</a>
        <a href="#deals">Today's Deals</a>
        <a href="#shop-products">Trending</a>
        <a href="/vendor">Sell on NovaCart</a>
      </nav>

      <div className="page-container">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">THE NEW WAY TO DISCOVER</span>
            <h1>
              Your style.
              <br />
              <span>Your discovery.</span>
            </h1>
            <p>
              From Korean streetwear to Japanese-inspired essentials,
              discover products that make everyday shopping exciting.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#shop-products">
                Shop the collection <span>→</span>
              </a>
              <a className="text-button" href="#deals">
                Explore deals ↓
              </a>
            </div>

            <div className="hero-trust">
              <span><b>✓</b> Multiple sellers</span>
              <span><b>✓</b> Fresh discoveries</span>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="hero-product hero-shirt">👕</div>
            <div className="hero-product hero-headphones">🎧</div>
            <div className="hero-product hero-shoe">👟</div>
            <div className="floating-card card-top">
              <span>✦</span> New season, new style
            </div>
            <div className="floating-card card-bottom">
              <span className="online-dot" />
              Your next favourite awaits
            </div>
          </div>
        </section>

        <section className="benefit-row">
          <div className="benefit">
            <span className="benefit-icon">◇</span>
            <div>
              <strong>Discover more</strong>
              <small>Explore unique finds</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">♧</span>
            <div>
              <strong>Multiple sellers</strong>
              <small>More choice in one place</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <strong>Secure shopping</strong>
              <small>Shop with confidence</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">↗</span>
            <div>
              <strong>Fresh collections</strong>
              <small>Find your next favourite</small>
            </div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR WORLD, YOUR STYLE</span>
              <h2>Explore categories</h2>
              <p>Start with what you love.</p>
            </div>
          </div>

          <div className="category-grid">
            {categories.filter((category) => category.name !== "All").map(
              (category) => (
                <button
                  className="category-card"
                  key={category.name}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.name);
                    document
                      .getElementById("shop-products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="category-art">
                    {category.icon}
                  </span>
                  <strong>{category.name}</strong>
                  <span className="category-arrow">↗</span>
                </button>
              ),
            )}
          </div>
        </section>

        <section className="deal-banner" id="deals">
          <div className="deal-copy">
            <span className="deal-kicker">THE DISCOVERY SALE</span>
            <h2>
              Good finds.
              <br />
              Even better prices.
            </h2>
            <p>
              Explore special prices on selected fashion, accessories
              and everyday essentials.
            </p>
            <a className="deal-button" href="#shop-products">
              Shop the deals <span>→</span>
            </a>
          </div>

          <div className="deal-highlight">
            <span className="deal-sparkle">✳</span>
            <span className="deal-up-to">UP TO</span>
            <strong>33%</strong>
            <span className="deal-off">OFF SELECTED FINDS</span>
            <div className="deal-divider" />
            <span className="deal-timer-label">DEMO COUNTDOWN</span>
            <div className="deal-timer">
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <b>:</b>
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <b>:</b>
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
            </div>
            <small>Illustrative timer — not a real sale deadline</small>
          </div>
        </section>

        <section className="section featured-section" id="shop-products">
          <div className="section-heading">
            <div>
              <span className="section-kicker">PICKED FOR YOUR DISCOVERY</span>
              <h2>Find your favourites</h2>
              <p>Explore the latest styles and everyday essentials.</p>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-chips" aria-label="Filter products">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  className={`filter-chip ${
                    activeCategory === category.name ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <span className="result-count">
              {filteredProducts.length} products
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <a
                    className="product-image"
                    href={`/products/${product.id}`}
                    style={{ backgroundColor: product.color }}
                    aria-label={`View ${product.name}`}
                  >
                    <span className="product-tag">{product.label}</span>
                    <span className="product-emoji">{product.icon}</span>
                    <span className="quick-view">Explore product ↗</span>
                  </a>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>
                    <a href={`/products/${product.id}`}>
                      <h3>{product.name}</h3>
                    </a>

                    <div className="product-rating">
                      <span>★ {product.rating}</span>
                      <span className="rating-caption">Sample rating</span>
                    </div>

                    <div className="product-price-row">
                      <strong>{money(product.price)}</strong>
                      <del>{money(product.oldPrice)}</del>
                      <span className="discount">
                        {product.discount}% off
                      </span>
                    </div>

                    <button
                      className="add-cart-button"
                      type="button"
                      onClick={() =>
                        setCartCount((count) => count + 1)
                      }
                    >
                      Add to demo cart <span>＋</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>⌕</span>
              <h3>No matching products</h3>
              <p>Try another search or choose a different category.</p>
              <button
                className="primary-button"
                type="button"
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
            Preview catalog only. Product prices, ratings, offers and
            inventory must be verified against live marketplace data.
          </p>
        </section>

        <section className="seller-banner">
          <div>
            <span className="section-kicker">YOUR BUSINESS, YOUR NEXT CHAPTER</span>
            <h2>Have something worth discovering?</h2>
            <p>
              Bring your products to NovaCart and connect with shoppers
              looking for something different.
            </p>
          </div>
          <a className="seller-button" href="/vendor">
            Become a seller <span>→</span>
          </a>
          <span className="seller-decoration">✳</span>
        </section>

        <section className="newsletter">
          <div>
            <span className="section-kicker">YOUR NEXT FAVOURITE STARTS HERE</span>
            <h2>There is more to discover.</h2>
            <p>Explore collections and find something that feels like you.</p>
          </div>
          <a className="primary-button" href="#shop-products">
            Start exploring <span>→</span>
          </a>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="/">
              <span className="brand-symbol">N</span>
              <span>
                nova<span className="brand-accent">cart</span>
              </span>
            </a>
            <p>
              A marketplace for distinctive fashion, everyday essentials,
              and exciting discoveries.
            </p>
          </div>

          <div className="footer-column">
            <strong>Discover</strong>
            <a href="#shop-products">Shop all</a>
            <a href="#categories">Categories</a>
            <a href="#deals">Deals and offers</a>
          </div>

          <div className="footer-column">
            <strong>Your account</strong>
            <a href="/account">My account</a>
            <a href="/orders">My orders</a>
            <a href="#shop-products">Shopping</a>
          </div>

          <div className="footer-column">
            <strong>Sell on NovaCart</strong>
            <a href="/vendor">Seller portal</a>
            <a href="/vendor/register">Become a seller</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 NovaCart. All rights reserved.</span>
          <span>Discover more. Shop differently.</span>
        </div>
      </footer>
    </main>
  );
}
