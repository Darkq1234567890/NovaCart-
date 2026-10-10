
"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  emoji: string;
  price: number;
  originalPrice: number;
  rating: string;
  reviews: number;
  discount: number;
  badge: string;
  background: string;
};

const categories = [
  { name: "Fashion", emoji: "👕", description: "Korean & Japanese styles", tint: "#eee7ff" },
  { name: "Electronics", emoji: "🎧", description: "Everyday tech essentials", tint: "#dff9f5" },
  { name: "Footwear", emoji: "👟", description: "Step into something new", tint: "#fff0df" },
  { name: "Accessories", emoji: "👜", description: "Details that stand out", tint: "#ffe7ef" },
];

const products: Product[] = [
  {
    id: 1,
    name: "Korean Oversized Streetwear Tee",
    category: "Fashion",
    emoji: "👕",
    price: 899,
    originalPrice: 1499,
    rating: "4.8",
    reviews: 124,
    discount: 40,
    badge: "BESTSELLER",
    background: "#eee7ff",
  },
  {
    id: 2,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    emoji: "🎧",
    price: 1799,
    originalPrice: 2999,
    rating: "4.7",
    reviews: 86,
    discount: 40,
    badge: "HOT DEAL",
    background: "#dff9f5",
  },
  {
    id: 3,
    name: "Minimal Everyday Sneakers",
    category: "Footwear",
    emoji: "👟",
    price: 1299,
    originalPrice: 2199,
    rating: "4.6",
    reviews: 93,
    discount: 41,
    badge: "TRENDING",
    background: "#fff0df",
  },
  {
    id: 4,
    name: "Premium Everyday Backpack",
    category: "Accessories",
    emoji: "🎒",
    price: 1099,
    originalPrice: 1899,
    rating: "4.5",
    reviews: 62,
    discount: 42,
    badge: "GREAT VALUE",
    background: "#ffe7ef",
  },
  {
    id: 5,
    name: "Japanese Minimalist Overshirt",
    category: "Fashion",
    emoji: "🧥",
    price: 1499,
    originalPrice: 2499,
    rating: "4.8",
    reviews: 71,
    discount: 40,
    badge: "NEW ARRIVAL",
    background: "#e8f0ff",
  },
  {
    id: 6,
    name: "Compact Wireless Earbuds",
    category: "Electronics",
    emoji: "🎵",
    price: 999,
    originalPrice: 1699,
    rating: "4.4",
    reviews: 118,
    discount: 41,
    badge: "POPULAR",
    background: "#fff1df",
  },
  {
    id: 7,
    name: "Classic Everyday Wristwatch",
    category: "Accessories",
    emoji: "⌚",
    price: 1299,
    originalPrice: 1999,
    rating: "4.6",
    reviews: 54,
    discount: 35,
    badge: "TOP PICK",
    background: "#e4f8ef",
  },
  {
    id: 8,
    name: "Modern Casual Running Shoes",
    category: "Footwear",
    emoji: "👟",
    price: 1599,
    originalPrice: 2699,
    rating: "4.7",
    reviews: 102,
    discount: 41,
    badge: "LIMITED DEAL",
    background: "#f0eaff",
  },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast("");
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        activeCategory === "Deals" ||
        product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (activeCategory === "Deals") {
      result = result.filter((product) => product.discount >= 40);
    }

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    }

    return result;
  }, [activeCategory, search, sortBy]);

  function showMessage(message: string) {
    setToast(message);
  }

  function toggleWishlist(product: Product) {
    const alreadySaved = wishlist.includes(product.id);

    setWishlist((current) =>
      alreadySaved
        ? current.filter((id) => id !== product.id)
        : [...current, product.id]
    );

    showMessage(
      alreadySaved
        ? "Removed from your wishlist"
        : "Added to your wishlist"
    );
  }

  function addToCart(product: Product) {
    setCartCount((count) => count + 1);
    showMessage(`${product.name} added to your demo cart`);
  }

  function scrollToProducts() {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function selectCategory(category: string) {
    setActiveCategory(category);
    scrollToProducts();
  }

  return (
    <main className="site-shell">
      <div className="announcement">
        Your next favourite find is waiting.{" "}
        <strong>Discover deals worth smiling about.</strong>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <a
            className="brand"
            href="#home"
            aria-label="NovaCart homepage"
          >
            <span className="brand-mark">N</span>
            <span className="brand-copy">
              <span className="brand-name">
                Nova<span>Cart</span>
              </span>
              <span className="brand-tagline">Discover more. Shop better.</span>
            </span>
          </a>

          <label className="search-box">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              placeholder="Search fashion, gadgets, accessories..."
              aria-label="Search products"
            />
          </label>

          <div className="header-actions">
            <button
              className="header-action"
              onClick={() =>
                showMessage(
                  wishlist.length
                    ? `You have ${wishlist.length} saved item${wishlist.length === 1 ? "" : "s"}`
                    : "Your wishlist is waiting for its first favourite"
                )
              }
            >
              <span className="action-icon" aria-hidden="true">
                ♡
              </span>
              <span className="action-label">Wishlist</span>
            </button>

            <button
              className="header-action cart-action"
              onClick={() =>
                showMessage(
                  cartCount
                    ? `Your demo cart has ${cartCount} item${cartCount === 1 ? "" : "s"}`
                    : "Your cart is empty. Find something you love!"
                )
              }
            >
              <span className="action-icon" aria-hidden="true">
                🛍
              </span>
              <span className="action-label">Cart</span>
              <span className="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>

        <nav className="category-nav" aria-label="Shop categories">
          <button
            className={activeCategory === "All" ? "active" : ""}
            onClick={() => selectCategory("All")}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              className={
                activeCategory === category.name ? "active" : ""
              }
              onClick={() => selectCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
          <button
            className={activeCategory === "Deals" ? "active" : ""}
            onClick={() => selectCategory("Deals")}
          >
            Today&apos;s Deals
          </button>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="container">
          <div className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <span aria-hidden="true">✦</span>
                YOUR STYLE. YOUR WORLD.
              </span>

              <h1>
                Good finds.
                <br />
                <span>Great vibes.</span>
              </h1>

              <p>
                From Korean streetwear to everyday tech, discover
                something new with a marketplace made for your style.
              </p>

              <div className="hero-actions">
                <button
                  className="button-primary"
                  onClick={scrollToProducts}
                >
                  Explore products <span aria-hidden="true">→</span>
                </button>
                <button
                  className="button-light"
                  onClick={() => selectCategory("Deals")}
                >
                  Shop the deals
                </button>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit" />
              <div className="hero-product">
                <span className="hero-product-emoji">🛍️</span>
              </div>
              <div className="floating-tag top">
                ✨ Fresh finds
                <small>Your next favourite thing</small>
              </div>
              <div className="floating-tag bottom">
                Up to 42% off
                <small>Selected demo products</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container benefit-strip" aria-label="Shopping benefits">
        <div className="benefit">
          <div className="benefit-icon" aria-hidden="true">🚚</div>
          <div>
            <strong>Easy shopping</strong>
            <span>A simpler way to discover</span>
          </div>
        </div>
        <div className="benefit">
          <div className="benefit-icon" aria-hidden="true">🛡️</div>
          <div>
            <strong>Shop with confidence</strong>
            <span>Built for a better experience</span>
          </div>
        </div>
        <div className="benefit">
          <div className="benefit-icon" aria-hidden="true">💜</div>
          <div>
            <strong>Unique discoveries</strong>
            <span>Styles beyond the ordinary</span>
          </div>
        </div>
        <div className="benefit">
          <div className="benefit-icon" aria-hidden="true">🏪</div>
          <div>
            <strong>Seller community</strong>
            <span>Discover local collections</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Find your something</div>
              <h2>Shop by category</h2>
              <p>Explore the things you love, all in one place.</p>
            </div>
            <button
              className="text-link"
              onClick={() => selectCategory("All")}
            >
              View all products →
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.name}
                className="category-card"
                style={
                  {
                    "--category-tint": category.tint,
                  } as React.CSSProperties
                }
                onClick={() => selectCategory(category.name)}
              >
                <span className="category-emoji" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="category-info">
                  <strong>{category.name}</strong>
                  <span>{category.description}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="deal-banner">
            <div>
              <div className="section-kicker">A little more for less</div>
              <h2>Find your next great deal.</h2>
              <p>
                Explore selected demo products with savings of up to
                42%. Discover a new favourite today.
              </p>
              <div className="hero-actions">
                <button
                  className="button-primary"
                  onClick={() => selectCategory("Deals")}
                >
                  Explore deals →
                </button>
              </div>
            </div>
            <div className="deal-art" aria-hidden="true">
              🎁
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="products">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Picked for discovery</div>
              <h2>
                {activeCategory === "All"
                  ? "Trending right now"
                  : activeCategory === "Deals"
                    ? "Deals you might love"
                    : `${activeCategory} collection`}
              </h2>
              <p>
                Browse our sample collection and find something that
                feels like you.
              </p>
            </div>
            <span className="text-link">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="product-toolbar">
            <div className="filter-chips" aria-label="Filter products">
              {["All", "Deals", "Fashion", "Electronics", "Footwear", "Accessories"].map(
                (category) => (
                  <button
                    key={category}
                    className={
                      activeCategory === category
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === "All" ? "All products" : category}
                  </button>
                )
              )}
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isSaved = wishlist.includes(product.id);

                return (
                  <article className="product-card" key={product.id}>
                    <div
                      className="product-image"
                      style={
                        {
                          "--product-bg": product.background,
                        } as React.CSSProperties
                      }
                    >
                      <span className="product-badge">
                        {product.badge}
                      </span>

                      <button
                        className={
                          isSaved
                            ? "wishlist-button active"
                            : "wishlist-button"
                        }
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          isSaved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        aria-pressed={isSaved}
                      >
                        {isSaved ? "♥" : "♡"}
                      </button>

                      <span className="product-emoji" aria-hidden="true">
                        {product.emoji}
                      </span>
                    </div>

                    <div className="product-details">
                      <div className="product-category">
                        {product.category}
                      </div>
                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-rating">
                        <span className="rating-pill">
                          ★ {product.rating}
                        </span>
                        <span>({product.reviews} reviews)</span>
                      </div>

                      <div className="product-pricing">
                        <span className="product-price">
                          {formatPrice(product.price)}
                        </span>
                        <span className="product-original">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="product-discount">
                          {product.discount}% off
                        </span>
                      </div>

                      <button
                        className="add-cart-button"
                        onClick={() => addToCart(product)}
                      >
                        + Add to cart
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="empty-state">
                <span aria-hidden="true">🔎</span>
                <h3>No products found</h3>
                <p>
                  Try another search or choose a different category.
                </p>
                <div className="hero-actions" style={{ justifyContent: "center" }}>
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
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="seller-banner">
          <div>
            <div className="section-kicker" style={{ color: "#80f3df" }}>
              Have something to sell?
            </div>
            <h2>Your store deserves a bigger stage.</h2>
            <p>
              NovaCart is being built to bring local vendors and
              international collections together in one marketplace.
              Get ready to grow your business with us.
            </p>
            <div className="hero-actions">
              <button
                className="button-primary"
                onClick={() =>
                  showMessage(
                    "Seller registration will be available when vendor onboarding is connecte