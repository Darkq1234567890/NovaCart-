"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Grid2X2,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  UserRound,
  RotateCcw,
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

const imageUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=85`;

const categories = [
  { name: "Fashion", subtitle: "Fresh styles", image: "photo-1521572163474-6864f9cf17ab", tint: "#f0edff" },
  { name: "Electronics", subtitle: "Smart technology", image: "photo-1505740420928-5e560c06d30e", tint: "#e3f7f8" },
  { name: "Footwear", subtitle: "Step in style", image: "photo-1542291026-7eec264c27ff", tint: "#fff0e7" },
  { name: "Accessories", subtitle: "Little upgrades", image: "photo-1523275335684-37898b6baf30", tint: "#fce9f0" },
  { name: "Home & Living", subtitle: "Made for home", image: "photo-1555041469-a586c61ea9bc", tint: "#e8f1ff" },
  { name: "Beauty", subtitle: "Everyday care", image: "photo-1608248543803-ba4f8c70ae0b", tint: "#fceaf5" },
  { name: "Sports", subtitle: "Move more", image: "photo-1534438327276-14e5300c3a48", tint: "#e9f4ff" },
  { name: "Toys & More", subtitle: "Fun discoveries", image: "photo-1559454403-b8fb88521f11", tint: "#fff1e8" },
];

const products: Product[] = [
  { id: 1, name: "Men's Casual Shirt", brand: "Roadster", category: "Fashion", price: 1099, oldPrice: 1999, rating: 4.5, reviews: "2.4k", image: "photo-1521572163474-6864f9cf17ab", badge: "Bestseller", tint: "#f0edff" },
  { id: 2, name: "Wireless Headphones", brand: "SoundCore", category: "Electronics", price: 1999, oldPrice: 2999, rating: 4.6, reviews: "1.8k", image: "photo-1505740420928-5e560c06d30e", badge: "Top Rated", tint: "#e5f7f8" },
  { id: 3, name: "Everyday Sneakers", brand: "Urban Step", category: "Footwear", price: 2499, oldPrice: 3999, rating: 4.4, reviews: "1.1k", image: "photo-1542291026-7eec264c27ff", badge: "Hot Deal", tint: "#fff0e7" },
  { id: 4, name: "Smart Watch", brand: "Fire-Boltt", category: "Accessories", price: 2199, oldPrice: 4999, rating: 4.3, reviews: "986", image: "photo-1523275335684-37898b6baf30", badge: "New Arrival", tint: "#fce9f0" },
  { id: 5, name: "Everyday Shoulder Bag", brand: "Lavie", category: "Accessories", price: 1499, oldPrice: 2499, rating: 4.2, reviews: "743", image: "photo-1548036328-c9fa89d128fa", badge: "Popular", tint: "#fff2e7" },
  { id: 6, name: "Skincare Essentials", brand: "Minimalist", category: "Beauty", price: 1299, oldPrice: 1999, rating: 4.5, reviews: "1.1k", image: "photo-1608248543803-ba4f8c70ae0b", badge: "Best Value", tint: "#eaf7ee" },
  { id: 7, name: "Classic Hoodie", brand: "North Lane", category: "Fashion", price: 1699, oldPrice: 2499, rating: 4.4, reviews: "824", image: "photo-1556821840-3a63f95609a7", badge: "Trending", tint: "#eee9ff" },
  { id: 8, name: "Premium Earbuds", brand: "Audio Plus", category: "Electronics", price: 1799, oldPrice: 2999, rating: 4.3, reviews: "652", image: "photo-1606220945770-b5b6c2c55bf1", badge: "Great Deal", tint: "#e7f7f7" },
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
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState("all");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${product.name} ${product.brand} ${product.category}`
          .toLowerCase()
          .includes(query);
      const matchesPrice =
        maxPrice === "all" || product.price <= Number(maxPrice);
      return matchesCategory && matchesSearch && matchesPrice;
    });

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, search, sortBy, maxPrice]);

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setMobileMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleWishlist = (id: number) => {
    const alreadySaved = wishlist.includes(id);
    setWishlist((current) =>
      alreadySaved ? current.filter((item) => item !== id) : [...current, id]
    );
    showNotice(alreadySaved ? "Removed from your wishlist" : "Added to your wishlist");
  };

  const addToCart = (product: Product) => {
    setCart((current) => [...current, product.id]);
    showNotice(`${product.name} added to cart`);
  };

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setMaxPrice("all");
    setSortBy("featured");
  };

  return (
    <main className="novacart-page">
      <div className="announcement">
        <div className="container announcement-inner">
          <span><Truck size={14} /> Free shipping on orders over ₹999</span>
          <span className="announcement-divider">•</span>
          <span><RotateCcw size={13} /> Easy 7-day returns</span>
          <span className="announcement-divider">•</span>
          <span><ShieldCheck size={13} /> Secure shopping</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <button
            className="mobile-menu-toggle"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          <a className="brand" href="#" aria-label="NovaCart home">
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
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search size={19} />
            <input
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for products, brands and more..."
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
            <button className="search-submit" type="submit" aria-label="Search">
              <Search size={17} />
            </button>
          </form>

          <div className="header-actions">
            <button className="header-action" onClick={() => showNotice("Account sign-in will be connected soon.")}>
              <UserRound size={21} />
              <span>Account</span>
            </button>
            <button className="header-action wishlist-header" onClick={() => showNotice(`${wishlist.length} item(s) in your wishlist`)}>
              <span className="action-icon-wrap">
                <Heart size={21} />
                {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
              </span>
              <span>Wishlist</span>
            </button>
            <button className="header-action" onClick={() => showNotice(`Your cart has ${cart.length} item(s).`)}>
              <span className="action-icon-wrap">
                <ShoppingCart size={22} />
                {cart.length > 0 && <span className="count-badge">{cart.length}</span>}
              </span>
              <span>Cart</span>
            </button>
          </div>
        </div>

        <nav className={`nav-bar ${mobileMenuOpen ? "nav-open" : ""}`}>
          <div className="container nav-inner">
            <button className="nav-category" onClick={() => selectCategory("All")}>
              <Grid2X2 size={16} /> All Categories <ChevronDown size={14} />
            </button>
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.name}
                className={activeCategory === category.name ? "nav-active" : ""}
                onClick={() => selectCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
            <button className="nav-deals" onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}>
              Today&apos;s Deals <ArrowRight size={14} />
            </button>
          </div>
        </nav>
      </header>

      {notice && (
        <div className="toast-notice" role="status">
          <Check size={17} /> {notice}
          <button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15} /></button>
        </div>
      )}

      <div className="container page-content">
        <section className="hero-layout" aria-label="Featured offers">
          <div className="hero">
            <div className="hero-copy">
              <span className="eyebrow-pill">THE NEW SEASON EDIT</span>
              <h1>Upgrade Your Everyday Style</h1>
              <p>Trendy finds, premium quality, and prices you&apos;ll love. Discover something made for you.</p>
              <button className="primary-button" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                Shop Now <ArrowRight size={17} />
              </button>
              <div className="hero-dots" aria-label="Featured slide 1 of 3">
                <span className="hero-dot hero-dot-active" />
                <span className="hero-dot" />
                <span className="hero-dot" />
              </div>
            </div>
            <div className="hero-image-wrap">
              <img className="hero-image" src={imageUrl("photo-1483985988355-763728e1935b")} alt="Friends browsing fashionable outfits" />
              <div className="hero-image-caption">
                <span>Style that feels like you</span>
                <strong>New season. New energy.</strong>
              </div>
            </div>
          </div>

          <div className="side-promos">
            <article className="side-promo electronics-promo">
              <div>
                <span className="promo-kicker">SMART PICKS</span>
                <h2>Tech that<br />moves with you</h2>
                <p>Everyday essentials, better prices.</p>
                <button onClick={() => selectCategory("Electronics")}>Explore tech <ArrowRight size={14} /></button>
              </div>
              <img src={imageUrl("photo-1505740420928-5e560c06d30e")} alt="Wireless headphones" />
            </article>
            <article className="side-promo footwear-promo">
              <div>
                <span className="promo-kicker">STEP INTO STYLE</span>
                <h2>Fresh kicks.<br />Fresh starts.</h2>
                <p>Find your everyday favourite.</p>
                <button onClick={() => selectCategory("Footwear")}>Shop footwear <ArrowRight size={14} /></button>
              </div>
              <img src={imageUrl("photo-1542291026-7eec264c27ff")} alt="Red everyday sneaker" />
            </article>
          </div>
        </section>

        <section className="benefit-strip" aria-label="Shopping benefits">
          <div className="benefit-item">
            <span className="benefit-icon"><Truck size={21} /></span>
            <span><strong>Free Shipping</strong><small>On orders above ₹999</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><RotateCcw size={21} /></span>
            <span><strong>Easy Returns</strong><small>7-day return window</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><ShieldCheck size={21} /></span>
            <span><strong>Secure Payments</strong><small>Your details stay safe</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><Star size={21} /></span>
            <span><strong>Curated Finds</strong><small>Picked for everyday life</small></span>
          </div>
        </section>

        <section className="section-block" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">EXPLORE YOUR WORLD</span>
              <h2>Shop by Category</h2>
              <p>Good finds for every part of your day.</p>
            </div>
            <button className="text-link" onClick={() => selectCategory("All")}>View all <ArrowRight size={15} /></button>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                className={`category-card ${activeCategory === category.name ? "category-selected" : ""}`}
                key={category.name}
                onClick={() => selectCategory(category.name)}
                style={{ "--category-tint": category.tint } as CSSProperties}
              >
                <span className="category-image-wrap">
                  <img src={imageUrl(category.image)} alt="" loading="lazy" />
                </span>
                <strong>{category.name}</strong>
                <small>{category.subtitle}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="deal-grid" id="deals">
          <article className="deal-banner deal-purple">
            <div className="deal-copy">
              <span className="deal-label">LIMITED-TIME PICKS</span>
              <h2>Big savings.<br />Better living.</h2>
              <p>Discover deals worth adding to your cart.</p>
              <button onClick={() => selectCategory("All")}>Shop deals <ArrowRight size={14} /></button>
            </div>
            <img src={imageUrl("photo-1542291026-7eec264c27ff")} alt="Featured sneaker deal" loading="lazy" />
            <span className="deal-decoration">%</span>
          </article>
          <article className="deal-banner deal-teal">
            <div className="deal-copy">
              <span className="deal-label">JUST DROPPED</span>
              <h2>Fresh finds<br />for your routine.</h2>
              <p>New-season picks to make yours.</p>
              <button onClick={() => selectCategory("Fashion")}>See what&apos;s new <ArrowRight size={14} /></button>
            </div>
            <img src={imageUrl("photo-1521572163474-6864f9cf17ab")} alt="Fresh fashion pick" loading="lazy" />
          </article>
          <article className="deal-banner deal-green">
            <div className="deal-copy">
              <span className="deal-label">SMART SHOPPING</span>
              <h2>Little upgrades.<br />Big difference.</h2>
              <p>Everyday essentials at lovely prices.</p>
              <button onClick={() => selectCategory("Accessories")}>Explore picks <ArrowRight size={14} /></button>
            </div>
            <img src={imageUrl("photo-1523275335684-37898b6baf30")} alt="Smart watch accessory" loading="lazy" />
          </article>
        </section>

        <section className="section-block products-section" id="products">
          <div className="section-heading products-heading">
            <div>
              <span className="section-eyebrow">HANDPICKED FOR YOU</span>
              <h2>{activeCategory === "All" ? "Trending Products" : activeCategory}</h2>
              <p>Everyday favourites, all in one place.</p>
            </div>
            <div className="product-tools">
              <label className="sort-control">
                <span>Sort:</span>
                <select aria-label="Sort products" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </label>
              <button className="filter-button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
                <SlidersHorizontal size={16} /> Filter
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filter-panel">
              <label htmlFor="max-price">Maximum price</label>
              <select id="max-price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
                <option value="all">Any price</option>
                <option value="1000">Up to ₹1,000</option>
                <option value="1500">Up to ₹1,500</option>
                <option value="2000">Up to ₹2,000</option>
                <option value="3000">Up to ₹3,000</option>
              </select>
              <button className="text-link" onClick={resetFilters}>Clear filters <X size={14} /></button>
            </div>
          )}

          <div className="filter-list">
            {["All", ...categories.map((category) => category.name)].map((category) => (
              <button
                key={category}
                className={`filter-chip ${activeCategory === category ? "filter-chip-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => {
                const discount = Math.round((1 - product.price / product.oldPrice) * 100);
                const isSaved = wishlist.includes(product.id);
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap" style={{ "--product-tint": product.tint } as CSSProperties}>
                      <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
                      <span className="product-badge">{product.badge}</span>
                      <button
                        className={`wishlist-button ${isSaved ? "wishlist-active" : ""}`}
                        aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
              
