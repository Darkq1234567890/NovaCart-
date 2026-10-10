"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Heart,
  Home,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  UserRound,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: string;
  image: string;
  badge: string;
  tint: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Men's Casual Shirt",
    brand: "Roadster",
    category: "Fashion",
    price: 1099,
    oldPrice: 1999,
    rating: 4.5,
    reviews: "2.4k",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85",
    badge: "Bestseller",
    tint: "#f0edff",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    brand: "SoundCore",
    category: "Electronics",
    price: 1999,
    oldPrice: 2999,
    rating: 4.6,
    reviews: "1.8k",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85",
    badge: "Top Rated",
    tint: "#e5f7f8",
  },
  {
    id: 3,
    name: "Everyday Sneakers",
    brand: "Urban Step",
    category: "Footwear",
    price: 2499,
    oldPrice: 3999,
    rating: 4.4,
    reviews: "1.1k",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=85",
    badge: "Hot Deal",
    tint: "#fff0e7",
  },
  {
    id: 4,
    name: "Smart Watch",
    brand: "Fire-Boltt",
    category: "Accessories",
    price: 2199,
    oldPrice: 4999,
    rating: 4.3,
    reviews: "986",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85",
    badge: "New Arrival",
    tint: "#fce9f0",
  },
  {
    id: 5,
    name: "Everyday Shoulder Bag",
    brand: "Lavie",
    category: "Accessories",
    price: 1499,
    oldPrice: 2499,
    rating: 4.2,
    reviews: "743",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85",
    badge: "Popular",
    tint: "#fff2e7",
  },
  {
    id: 6,
    name: "Skincare Essentials",
    brand: "Minimalist",
    category: "Beauty",
    price: 1299,
    oldPrice: 1999,
    rating: 4.5,
    reviews: "1.1k",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=85",
    badge: "Best Value",
    tint: "#eaf7ee",
  },
  {
    id: 7,
    name: "Classic Hoodie",
    brand: "North Lane",
    category: "Fashion",
    price: 1699,
    oldPrice: 2499,
    rating: 4.4,
    reviews: "824",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=85",
    badge: "Trending",
    tint: "#eee9ff",
  },
  {
    id: 8,
    name: "Premium Earbuds",
    brand: "Audio Plus",
    category: "Electronics",
    price: 1799,
    oldPrice: 2999,
    rating: 4.3,
    reviews: "652",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=85",
    badge: "Great Deal",
    tint: "#e7f7f7",
  },
];

const categories = [
  {
    name: "Fashion",
    detail: "Fresh styles",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80",
    tint: "#f0edff",
  },
  {
    name: "Electronics",
    detail: "Smart technology",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=320&q=80",
    tint: "#e3f7f8",
  },
  {
    name: "Footwear",
    detail: "Step in style",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=320&q=80",
    tint: "#fff0e7",
  },
  {
    name: "Accessories",
    detail: "Little upgrades",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=320&q=80",
    tint: "#fce9f0",
  },
  {
    name: "Home & Living",
    detail: "Made for home",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=320&q=80",
    tint: "#e8f1ff",
  },
  {
    name: "Beauty",
    detail: "Everyday care",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=320&q=80",
    tint: "#fceaf5",
  },
  {
    name: "Sports",
    detail: "Move more",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=320&q=80",
    tint: "#e9f4ff",
  },
  {
    name: "Toys & More",
    detail: "Fun discoveries",
    image:
      "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=320&q=80",
    tint: "#fff1e8",
  },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, search, sortBy]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function toggleWishlist(id: number) {
    const alreadySaved = wishlist.includes(id);

    setWishlist((current) =>
      alreadySaved
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

    showNotice(
      alreadySaved
        ? "Removed from your wishlist"
        : "Added to your wishlist"
    );
  }

  function addToCart(id: number) {
    setCart((current) => [...current, id]);
    showNotice("Added to your cart");
  }

  function selectCategory(category: string) {
    setActiveCategory(category);
    setMobileMenuOpen(false);
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="novacart-page">
      <div className="announcement">
        <div className="container announcement-inner">
          <span><Truck size={14} /> Free shipping on orders over ₹999</span>
          <span className="announcement-divider">|</span>
          <span><RotateCcw size={14} /> Easy returns within 7 days</span>
          <span className="announcement-divider">|</span>
          <span><ShieldCheck size={14} /> Secure shopping</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <button
            className="icon-button mobile-menu-toggle"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <a className="brand" href="#" aria-label="NovaCart homepage">
            <span className="brand-mark">N</span>
            <span className="brand-copy">
              <span className="brand-name">Nova<span>Cart</span></span>
              <span className="brand-tagline">Shop More. Live Better.</span>
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
            <Search size={19} />
            <input
              aria-label="Search products"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="search-submit" aria-label="Search">
              <Search size={19} />
            </button>
          </form>

          <div className="header-actions">
            <button
              className="header-action"
              onClick={() => showNotice("Account sign-in will be connected soon")}
            >
              <UserRound size={21} />
              <span>Account</span>
            </button>
            <button
              className="header-action"
              onClick={() =>
                showNotice(
                  wishlist.length
                    ? `${wishlist.length} saved item(s) in your wishlist`
                    : "Your wishlist is empty"
                )
              }
            >
              <span className="action-icon-wrap">
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="count-badge">{wishlist.length}</span>
                )}
              </span>
              <span>Wishlist</span>
            </button>
            <button
              className="header-action"
              onClick={() =>
                showNotice(
                  cart.length
                    ? `${cart.length} item(s) in your cart`
                    : "Your cart is empty"
                )
              }
            >
              <span className="action-icon-wrap">
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="count-badge">{cart.length}</span>
                )}
              </span>
              <span>Cart</span>
            </button>
          </div>
        </div>

        <div className={`nav-bar ${mobileMenuOpen ? "nav-open" : ""}`}>
          <nav className="container nav-inner" aria-label="Main navigation">
            <button
              className={`nav-category ${activeCategory === "All" ? "nav-active" : ""}`}
              onClick={() => selectCategory("All")}
            >
              <Grid2X2 size={17} /> All Categories
            </button>
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.name}
                className={`nav-link ${activeCategory === category.name ? "nav-active" : ""}`}
                onClick={() => selectCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
            <button
              className="nav-deals"
              onClick={() =>
                document
                  .getElementById("deals")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ShoppingBag size={16} /> Today&apos;s Deals
            </button>
          </nav>
        </div>
      </header>

      <div className="container page-content">
        <section className="hero-layout" aria-label="Featured offers">
          <div className="hero">
            <div className="hero-copy">
              <span className="eyebrow-pill">NEW ARRIVALS</span>
              <h1>Upgrade Your Everyday Style</h1>
              <p>Trendy finds, premium quality, and prices you&apos;ll love.</p>
              <button
                className="primary-button"
                onClick={() => selectCategory("Fashion")}
              >
                Shop Now <ArrowRight size={17} />
              </button>
              <div className="hero-dots" aria-label="Featured collection">
                <span className="hero-dot hero-dot-active" />
                <span className="hero-dot" />
                <span className="hero-dot" />
                <span className="hero-dot" />
              </div>
            </div>
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
                alt="Fashion shoppers exploring a new collection"
                className="hero-image"
              />
              <div className="hero-image-caption">
                <span>Find your</span>
                <strong>next favourite.</strong>
              </div>
            </div>
          </div>

          <div className="side-promos">
            <article className="side-promo electronics-promo">
              <div>
                <span className="promo-kicker">SMART PICKS</span>
                <h2>Electronics</h2>
                <p>Great tech. Better prices.</p>
                <button onClick={() => selectCategory("Electronics")}>
                  Shop now <ArrowRight size={14} />
                </button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                alt="Wireless headphones"
              />
            </article>

            <article className="side-promo footwear-promo">
              <div>
                <span className="promo-kicker">MOVE IN STYLE</span>
                <h2>Fresh Footwear</h2>
                <p>Everyday comfort, elevated.</p>
                <button onClick={() => selectCategory("Footwear")}>
                  Explore <ArrowRight size={14} />
                </button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                alt="Bright red sneakers"
              />
            </article>
          </div>
        </section>

        <section className="benefit-strip" aria-label="Shopping benefits">
          <div className="benefit-item">
            <span className="benefit-icon"><Truck size={22} /></span>
            <span><strong>Free Shipping</strong><small>On orders over ₹999</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><RotateCcw size={22} /></span>
            <span><strong>Easy Returns</strong><small>Within 7 days</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><ShieldCheck size={22} /></span>
            <span><strong>Secure Payments</strong><small>Shop with confidence</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><Check size={22} /></span>
            <span><strong>Curated Finds</strong><small>Discover something new</small></span>
          </div>
        </section>

        <section className="section-block categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">EXPLORE NOVACART</span>
              <h2>Shop by Category</h2>
              <p>Find what you love, all in one place.</p>
            </div>
            <button
              className="text-link"
              onClick={() => selectCategory("All")}
            >
              View all <ArrowRight size={16} />
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-card ${activeCategory === category.name ? "category-selected" : ""}`}
                style={{ "--category-tint": category.tint } as CSSProperties}
                onClick={() => selectCategory(category.name)}
              >
                <span className="category-image-wrap">
                  <img src={category.image} alt="" loading="lazy" />
                </span>
                <strong>{category.name}</strong>
                <small>{category.detail}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="deal-grid" id="deals">
          <article className="deal-banner deal-purple">
            <div className="deal-copy">
              <span className="deal-label">THE BIG SAVE</span>
              <h2>Big Savings<br />Every Day</h2>
              <p>Discover deals worth opening.</p>
              <button onClick={() => selectCategory("All")}>
                Explore deals <ArrowRight size={15} />
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80"
              alt="Laptop for work and entertainment"
              loading="lazy"
            />
          </article>

          <article className="deal-banner deal-teal">
            <div className="deal-copy">
              <span className="deal-label">JUST LANDED</span>
              <h2>Fresh Arrivals<br />Just for You</h2>
              <p>Meet your next favourite.</p>
              <button onClick={() => selectCategory("Fashion")}>
                Shop new in <ArrowRight size={15} />
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80"
              alt="Comfortable casual hoodie"
              loading="lazy"
            />
          </article>

          <article className="deal-banner deal-green">
            <div className="deal-copy">
              <span className="deal-label">SMART SHOPPING</span>
              <h2>Shop Smart.<br />Save More.</h2>
              <p>Find value in every discovery.</p>
              <button onClick={() => showNotice("More offers are coming soon")}>
                View offers <ArrowRight size={15} />
              </button>
            </div>
            <div className="deal-decoration">%</div>
          </article>
        </section>

        <section className="section-block products-section" id="products">
          <div className="section-heading products-heading">
            <div>
              <span className="section-eyebrow">HANDPICKED FOR YOU</span>
              <h2>{activeCategory === "All" ? "Top Picks for You" : activeCategory}</h2>
              <p>Discover great finds at prices you&apos;ll love.</p>
            </div>
            <div className="product-tools">
              <label className="sort-control">
                <span>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={15} />
              </label>
              <button
                className="filter-button"
                onClick={() => {
                  setActi
