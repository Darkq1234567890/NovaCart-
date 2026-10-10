
"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Grid2X2,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  ShoppingCart,
  Star,
  Truck,
  UserRound,
  X,
} from "lucide-react";

const categories = [
  { name: "Fashion", image: "photo-1521572163474-6864f9cf17ab", color: "#f0edff" },
  { name: "Electronics", image: "photo-1505740420928-5e560c06d30e", color: "#e3f7f8" },
  { name: "Footwear", image: "photo-1542291026-7eec264c27ff", color: "#fff0e7" },
  { name: "Accessories", image: "photo-1523275335684-37898b6baf30", color: "#fce9f0" },
  { name: "Beauty", image: "photo-1608248543803-ba4f8c70ae0b", color: "#eaf7ee" },
  { name: "Home & Living", image: "photo-1555041469-a586c61ea9bc", color: "#e8f1ff" },
];

const products = [
  { id: 1, name: "Men's Casual Shirt", brand: "Roadster", category: "Fashion", price: 1099, old: 1999, rating: 4.5, image: "photo-1521572163474-6864f9cf17ab" },
  { id: 2, name: "Wireless Headphones", brand: "SoundCore", category: "Electronics", price: 1999, old: 2999, rating: 4.6, image: "photo-1505740420928-5e560c06d30e" },
  { id: 3, name: "Everyday Sneakers", brand: "Urban Step", category: "Footwear", price: 2499, old: 3999, rating: 4.4, image: "photo-1542291026-7eec264c27ff" },
  { id: 4, name: "Smart Watch", brand: "Fire-Boltt", category: "Accessories", price: 2199, old: 4999, rating: 4.3, image: "photo-1523275335684-37898b6baf30" },
  { id: 5, name: "Shoulder Bag", brand: "Lavie", category: "Accessories", price: 1499, old: 2499, rating: 4.2, image: "photo-1548036328-c9fa89d128fa" },
  { id: 6, name: "Skincare Essentials", brand: "Minimalist", category: "Beauty", price: 1299, old: 1999, rating: 4.5, image: "photo-1608248543803-ba4f8c70ae0b" },
  { id: 7, name: "Classic Hoodie", brand: "North Lane", category: "Fashion", price: 1699, old: 2499, rating: 4.4, image: "photo-1556821840-3a63f95609a7" },
  { id: 8, name: "Premium Earbuds", brand: "Audio Plus", category: "Electronics", price: 1799, old: 2999, rating: 4.3, image: "photo-1606220945770-b5b6c2c55bf1" },
];

const imageUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=85`;

const money = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const visibleProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = `${p.name} ${p.brand} ${p.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, category, sort]);

  const chooseCategory = (name: string) => {
    setCategory(name);
    setMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="novacart-page">
      <style jsx global>{pageStyles}</style>
      <div className="announcement">
        <div className="container announcement-inner">
          <span><Truck size={15} /> Free shipping over ₹999</span>
          <span><ShieldCheck size={15} /> Secure shopping</span>
          <span>Easy 7-day returns</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>

          <a href="/" className="brand">
            <span className="brand-mark">N</span>
            <span className="brand-copy">
              <span className="brand-name">Nova<span>Cart</span></span>
              <span className="brand-tagline">Shop More. Live Better.</span>
            </span>
          </a>

          <form className="search-box" onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <Search size={19} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, brands and more..." aria-label="Search products" />
            {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
            <button type="submit" className="search-submit" aria-label="Search"><Search size={17} /></button>
          </form>

          <div className="header-actions">
            <button className="header-action" onClick={() => notify("Account sign-in will be connected soon.")}><UserRound size={20} /><span>Account</span></button>
            <button className="header-action" onClick={() => notify(`${wishlist.length} saved item(s)`)}><Heart size={20} /><span>Wishlist ({wishlist.length})</span></button>
            <button className="header-action" onClick={() => notify(`${cart.length} item(s) in your cart`)}><ShoppingCart size={20} /><span>Cart ({cart.length})</span></button>
          </div>
        </div>
        <nav className={`nav-bar ${menuOpen ? "nav-open" : ""}`}>
          <div className="container nav-inner">
            <button className="nav-category" onClick={() => chooseCategory("All")}>
              <Grid2X2 size={16} /> All Categories <ChevronDown size={14} />
            </button>
            {categories.map((item) => (
              <button key={item.name} className={category === item.name ? "nav-active" : ""} onClick={() => chooseCategory(item.name)}>
                {item.name}
              </button>
            ))}
            <button className="nav-deals" onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}>
              Today's Deals <ArrowRight size={14} />
            </button>
          </div>
        </nav>
      </header>

      {notice && (
        <div className="toast-notice" role="status">
          <Check size={17} /> {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15} /></button>
        </div>
      )}

      <div className="container page-content">
        <section className="hero-layout">
          <div className="hero">
            <div className="hero-copy">
              <span className="eyebrow-pill">THE NEW SEASON EDIT</span>
              <h1>Upgrade Your Everyday Style</h1>
              <p>Discover trending fashion, smart technology and everyday essentials at prices you'll love.</p>
              <button className="primary-button" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                Shop Now <ArrowRight size={17} />
              </button>
              <div className="hero-dots">
                <span className="hero-dot hero-dot-active" />
                <span className="hero-dot" />
                <span className="hero-dot" />
              </div>
            </div>
            <div className="hero-image-wrap">
              <img className="hero-image" src={imageUrl("photo-1483985988355-763728e1935b")} alt="Fashion shopping collection" />
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
                <button onClick={() => chooseCategory("Electronics")}>Explore tech <ArrowRight size={14} /></button>
              </div>
              <img src={imageUrl("photo-1505740420928-5e560c06d30e")} alt="Wireless headphones" />
            </article>
            <article className="side-promo footwear-promo">
              <div>
                <span className="promo-kicker">STEP INTO STYLE</span>
                <h2>Fresh kicks.<br />Fresh starts.</h2>
                <p>Find your everyday favourite.</p>
                <button onClick={() => chooseCategory("Footwear")}>Shop footwear <ArrowRight size={14} /></button>
              </div>
              <img src={imageUrl("photo-1542291026-7eec264c27ff")} alt="Red sneakers" />
            </article>
          </div>
        </section>

        <section className="benefit-strip">
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
            <span><strong>Secure Payments</strong><small>Shop with confidence</small></span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><Star size={21} /></span>
            <span><strong>Curated Finds</strong><small>Everyday favourites</small></span>
          </div>
        </section>

        <section className="section-block" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">EXPLORE YOUR WORLD</span>
              <h2>Shop by Category</h2>
              <p>Good finds for every part of your day.</p>
            </div>
            <button className="text-link" onClick={() => chooseCategory("All")}>View all <ArrowRight size={15} /></button>
          </div>
          <div className="category-grid">
            {categories.map((item) => (
              <button key={item.name} className={`category-card ${category === item.name ? "category-selected" : ""}`} onClick={() => chooseCategory(item.name)} style={{ "--category-tint": item.color } as CSSProperties}>
                <span className="category-image-wrap">
                  <img src={imageUrl(item.image)} alt={item.name} loading="lazy" />
                </span>
                <strong>{item.name}</strong>
                <small>{item.name === "Fashion" ? "Fresh styles" : item.name === "Electronics" ? "Smart technology" : "Explore collection"}</small>
              </button>
            ))}
          </div>
        </section>
                    <section className="section-block deals-section" id="deals">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">HANDPICKED FOR YOU</span>
              <h2>Trending This Week</h2>
              <p>Popular picks worth adding to your collection.</p>
            </div>
            <div className="deal-label"><Star size={15} /> Customer favourites</div>
          </div>

          <div className="product-toolbar" id="products">
            <div className="product-count">
              <strong>{visibleProducts.length} products</strong>
              <span>{category === "All" ? "across all categories" : `in ${category}`}</span>
            </div>
            <div className="product-filters">
              <label htmlFor="category-filter">Category</label>
              <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
              </select>
              <label htmlFor="sort-products">Sort by</label>
              <select id="sort-products" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => {
                const saved = wishlist.includes(product.id);
                const inCart = cart.includes(product.id);
                const discount = Math.round((1 - product.price / product.old) * 100);

                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
                      <span className="discount-badge">{discount}% OFF</span>
                      <button
                        className={`wishlist-button ${saved ? "wishlist-active" : ""}`}
                        onClick={() => {
                          setWishlist((current) =>
                            saved ? current.filter((id) => id !== product.id) : [...current, product.id]
                          );
                          notify(saved ? "Removed from wishlist" : "Added to wishlist");
                        }}
                        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={18} fill={saved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="product-info">
                      <span className="product-brand">{product.brand}</span>
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        <span><Star size={13} fill="currentColor" /> {product.rating}</span>
                        <small>Top rated</small>
                      </div>
                      <div className="product-pricing">
                        <strong>{money(product.price)}</strong>
                        <del>{money(product.old)}</del>
                        <span>Save {discount}%</span>
                      </div>
                      <button
                        className={`add-cart-button ${inCart ? "added-to-cart" : ""}`}
                        onClick={() => {
                          setCart((current) =>
                            inCart ? current.filter((id) => id !== product.id) : [...current, product.id]
                          );
                          notify(inCart ? "Removed from cart" : "Added to cart");
                        }}
                      >
                        {inCart ? <Check size={17} /> : <ShoppingBag size={17} />}
                        {inCart ? "Added to Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-products">
              <Search size={30} />
              <h3>No products found</h3>
              <p>Try another search or select a different category.</p>
              <button className="primary-button" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear Filters <X size={16} />
              </button>
            </div>
          )}
        </section>

        <section className="newsletter-section">
          <div className="newsletter-copy">
            <span className="section-eyebrow">THE NOVACART EDIT</span>
            <h2>Good finds. Great updates.</h2>
            <p>Discover fresh arrivals, trending picks and special offers in one place.</p>
          </div>
          <button className="newsletter-button" onClick={() => notify("Newsletter signup will be connected soon.")}>
            Discover More <ArrowRight size={17} />
          </button>
          <div className="newsletter-decoration">N</div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand-block">
            <a href="/" className="brand footer-brand">
              <span className="brand-mark">N</span>
              <span className="brand-copy">
                <span className="brand-name">Nova<span>Cart</span></span>
                <span className="brand-tagline">Shop More. Live Better.</span>
              </span>
            </a>
            <p>Your everyday destination for style, technology and the little things that make life better.</p>
          </div>
          <div className="footer-column">
            <h3>Shop</h3>
            <button onClick={() => chooseCategory("Fashion")}>Fashion</button>
            <button onClick={() => chooseCategory("Electronics")}>Electronics</button>
            <button onClick={() => chooseCategory("Footwear")}>Footwear</button>
            <button onClick={() => chooseCategory("Accessories")}>Accessories</button>
          </div>
          <div className="footer-column">
            <h3>Customer Care</h3>
            <button onClick={() => notify("Help centre will be available soon.")}>Help Centre</button>
            <button onClick={() => notify("Order tracking will be connected soon.")}>Track an Order</button>
            <button onClick={() => notify("Returns information will be available soon.")}>Returns & Refunds</button>
            <button onClick={() => notify("Contact support will be available soon.")}>Contact Us</button>
          </div>
          <div className="footer-column footer-trust">
            <h3>Shop with confidence</h3>
            <p><ShieldCheck size={17} /> Secure shopping experience</p>
            <p><Truck size={17} /> Convenient delivery</p>
            <p><RotateCcw size={17} /> Easy return experience</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© {new Date().getFullYear()} NovaCart. All rights reserved.</span>
            <span>Made for better everyday shopping.</span>
          </div>
        </div>
      </footer>
    </main>
  );
                                 }    
const pageStyles = `
.novacart-page {
  --nc-ink: #172033;
  --nc-muted: #687386;
  --nc-primary: #2457d6;
  --nc-border: #e8ebf1;
  color: var(--nc-ink);
  background: #fff;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
}
.novacart-page * { box-sizing: border-box; }
.novacart-page button, .novacart-page input, .novacart-page select { font: inherit; }
.novacart-page button { cursor: pointer; }
.novacart-page button:focus-visible,
.novacart-page a:focus-visible,
.novacart-page input:focus-visible,
.novacart-page select:focus-visible {
  outline: 3px solid #9db9ff;
  outline-offset: 3px;
}
.novacart-page .container {
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
}
.announcement {
  background: #172033;
  color: #f8fafc;
  font-size: 12px;
}
.announcement-inner {
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.announcement-inner span {
  display: flex;
  align-items: center;
  gap: 7px;
}
.site-header {
  background: white;
  position: relative;
  z-index: 10;
  border-bottom: 1px solid var(--nc-border);
}
.header-main {
  min-height: 86px;
  display: flex;
  align-items: center;
  gap: 28px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--nc-ink);
  text-decoration: none;
  flex-shrink: 0;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--nc-primary);
  color: white;
  font-weight: 900;
  font-size: 25px;
  box-shadow: 0 5px 12px #2457d633;
}
.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.brand-name {
  font-size: 25px;
  letter-spacing: -1px;
  font-weight: 850;
  line-height: 1;
}
.brand-name span { color: var(--nc-primary); }
.brand-tagline {
  font-size: 10px;
  color: var(--nc-muted);
  letter-spacing: .25px;
  margin-top: 3px;
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 11px;
  background: #f5f7fb;
  border: 1px solid #e9edf5;
  border-radius: 9px;
  height: 46px;
  padding: 0 13px;
  color: #687386;
  min-width: 100px;
}
.search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--nc-ink);
  font-size: 13px;
}
.search-box input::placeholder { color: #929bad; }
.search-box button {
  border: 0;
  background: transparent;
  color: #687386;
  display: grid;
  place-items: center;
  padding: 4px;
}
.search-box .search-submit {
  background: var(--nc-primary);
  color: white;
  border-radius: 6px;
  width: 31px;
  height: 31px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 17px;
}
.header-action {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: transparent;
  color: #3b4558;
  font-size: 12px;
  white-space: nowrap;
}
.header-action:hover { color: var(--nc-primary); }
.mobile-menu-toggle {
  display: none;
  border: 0;
  background: transparent;
  padding: 5px;
  color: var(--nc-ink);
}
.nav-bar { border-top: 1px solid #f0f2f6; }
.nav-inner {
  min-height: 47px;
  display: flex;
  align-items: center;
  gap: 27px;
}
.nav-inner > button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: transparent;
  color: #515c70;
  font-size: 12px;
  white-space: nowrap;
  padding: 14px 0;
}
.nav-inner > button:hover,
.nav-inner > button.nav-active { color: var(--nc-primary); }
.nav-inner .nav-category {
  color: var(--nc-ink);
  font-weight: 750;
}
.nav-inner .nav-deals {
  color: #d74d30;
  font-weight: 750;
  margin-left: auto;
}
.page-content { padding-top: 23px; }
.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(270px, .85fr);
  gap: 17px;
}
.hero {
  min-height: 360px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  border-radius: 13px;
  background: linear-gradient(120deg, #edf1ff 0%, #f6f3ff 55%, #f8e9e5 100%);
}
.hero-copy {
  padding: 42px 0 24px 34px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
}
.eyebrow-pill {
  background: #fff;
  color: var(--nc-primary);
  border: 1px solid #dce5ff;
  border-radius: 30px;
  padding: 7px 11px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.1px;
}
.hero h1 {
  font-size: clamp(28px, 3vw, 43px);
  letter-spacing: -1.8px;
  line-height: 1.08;
  margin: 20px 0 12px;
  max-width: 350px;
}
.hero-copy > p {
  font-size: 13px;
  line-height: 1.8;
  color: #626e84;
  max-width: 310px;
  margin: 0 0 22px;
}
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 7px;
  padding: 13px 19px;
  background: var(--nc-primary);
  color: white;
  font-weight: 750;
  font-size: 12px;
  box-shadow: 0 5px 14px #2457d629;
}
.primary-button:hover {
  background: #1746bd;
  transform: translateY(-1px);
}
.hero-dots { display: flex; gap: 6px; margin-top: 30px; }
.hero-dot {
  width: 6px;
  height: 6px;
  border-radius: 20px;
  background: #bdc7dd;
}
.hero-dot-active { width: 21px; background: var(--nc-primary); }
.hero-image-wrap {
  position: relative;
  min-width: 0;
  min-height: 360px;
}
.hero-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.hero-image-caption {
  position: absolute;
  bottom: 17px;
  left: 16px;
  right: 16px;
  padding: 12px 14px;
  border-radius: 9px;
  background: #ffffffdc;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero-image-caption span { color: #657086; font-size: 10px; }
.hero-image-caption strong { font-size: 13px; }
.side-promos {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  min-width: 0;
}
.side-promo {
  border-radius: 12px;
  padding: 18px 16px 15px 19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  min-height: 172px;
}
.electronics-promo { background: #e7f6f7; }
.footwear-promo { background: #fff0e7; }
.side-promo > div { position: relative; z-index: 1; max-width: 64%; }
.promo-kicker {
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 1px;
  color: #4c7882;
}
.footwear-promo .promo-kicker { color: #a75e35; }
.side-promo h2 { font-size: 19px; line-height: 1.15; letter-spacing: -.5px; margin: 8px 0 7px; }
.side-promo p { font-size: 10px; line-height: 1.5; color: #697486; margin: 0 0 11px; }
.side-promo button {
  border: 0;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--nc-primary);
  font-weight: 750;
  font-size: 10px;
}
.side-promo img {
  width: 41%;
  max-height: 140px;
  object-fit: contain;
  mix-blend-mode: multiply;
}
`;
.benefit-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 21px;
  border: 1px solid var(--nc-border);
  border-radius: 10px;
  padding: 17px 12px;
}
.benefit-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 3px 9px;
  border-right: 1px solid var(--nc-border);
}
.benefit-item:last-child { border-right: 0; }
.benefit-icon {
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f0f4ff;
  color: var(--nc-primary);
}
.benefit-item > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.benefit-item strong { font-size: 11px; }
.benefit-item small { font-size: 10px; color: var(--nc-muted); }

.section-block {
  padding-top: 47px;
  scroll-margin-top: 15px;
}
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}
.section-eyebrow {
  color: var(--nc-primary);
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 1.25px;
}
.section-heading h2,
.newsletter-copy h2 {
  font-size: 27px;
  letter-spacing: -.8px;
  line-height: 1.2;
  margin: 8px 0 7px;
}
.section-heading p,
.newsletter-copy p {
  margin: 0;
  font-size: 12px;
  color: var(--nc-muted);
  line-height: 1.6;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: transparent;
  color: var(--nc-primary);
  font-weight: 750;
  font-size: 12px;
  padding: 7px 0;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 15px;
}
.category-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  background: white;
  padding: 10px 8px 14px;
  border-radius: 10px;
  color: var(--nc-ink);
  transition: border-color .15s, transform .15s, box-shadow .15s;
}
.category-card:hover,
.category-selected {
  border-color: #cbd8ff;
  box-shadow: 0 5px 18px #1c3f8010;
  transform: translateY(-2px);
}
.category-image-wrap {
  width: 100%;
  aspect-ratio: 1 / .88;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--category-tint);
  overflow: hidden;
}
.category-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
}
.category-card strong { font-size: 12px; margin-top: 12px; }
.category-card small {
  color: var(--nc-muted);
  font-size: 10px;
  margin-top: 5px;
  text-align: center;
}

.deals-section { padding-top: 53px; }
.deal-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 30px;
  background: #fff8e8;
  color: #a76d08;
  padding: 9px 12px;
  font-size: 10px;
  font-weight: 750;
}
.product-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid var(--nc-border);
  border-bottom: 1px solid var(--nc-border);
  padding: 14px 0;
  margin-bottom: 18px;
  scroll-margin-top: 12px;
}
.product-count { display: flex; align-items: baseline; gap: 8px; }
.product-count strong { font-size: 13px; }
.product-count span { color: var(--nc-muted); font-size: 11px; }
.product-filters {
  display: flex;
  align-items: center;
  gap: 9px;
}
.product-filters label { font-size: 10px; color: var(--nc-muted); }
.product-filters select {
  border: 1px solid #e1e5ee;
  border-radius: 6px;
  background: white;
  color: #344056;
  padding: 9px 26px 9px 10px;
  font-size: 11px;
  max-width: 175px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 19px;
}
.product-card {
  min-width: 0;
  border: 1px solid var(--nc-border);
  border-radius: 10px;
  overflow: hidden;
  background: white;
  transition: box-shadow .18s, transform .18s;
}
.product-card:hover {
  box-shadow: 0 10px 28px #1c2a4510;
  transform: translateY(-3px);
}
.product-image-wrap {
  position: relative;
  background: #f5f6f9;
  aspect-ratio: 1 / 1.02;
  overflow: hidden;
}
.product-image-wrap > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .25s;
}
.product-card:hover .product-image-wrap > img { transform: scale(1.035); }
.discount-badge {
  position: absolute;
  top: 11px;
  left: 10px;
  background: #e5f7ec;
  color: #17854b;
  font-size: 9px;
  font-weight: 850;
  padding: 6px 7px;
  border-radius: 4px;
}
.wishlist-button {
  position: absolute;
  top: 9px;
  right: 9px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid #e9ebf0;
  border-radius: 50%;
  background: #ffffffeb;
  color: #5e687a;
}
.wishlist-button:hover,
.wishlist-button.wishlist-active { color: #e34463; }
.product-info { padding: 14px 13px 13px; }
.product-brand {
  display: block;
  color: #7c8798;
  font-size: 10px;
  font-weight: 700;
}
.product-info h3 {
  font-size: 13px;
  line-height: 1.45;
  min-height: 37px;
  margin: 7px 0 9px;
  font-weight: 700;
}
.product-rating { display: flex; align-items: center; gap: 8px; }
.product-rating > span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e8f6ec;
  color: #227c46;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10px;
  font-weight: 800;
}
.product-rating > span svg { width: 11px; height: 11px; }
.product-rating small { color: #8a93a2; font-size: 9px; }
.product-pricing {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin: 12px 0;
}
.product-pricing strong { font-size: 16px; }
.product-pricing del { color: #8c95a4; font-size: 10px; }
.product-pricing > span { color: #19824b; font-size: 9px; font-weight: 750; }
.add-cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  border: 1px solid var(--nc-primary);
  border-radius: 6px;
  background: white;
  color: var(--nc-primary);
  padding: 10px 7px;
  font-size: 11px;
  font-weight: 750;
}
.add-cart-button:hover,
.add-cart-button.added-to-cart {
  background: var(--nc-primary);
  color: white;
}
.empty-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 50px 15px;
  color: var(--nc-muted);
}
.empty-products h3 { color: var(--nc-ink); margin-bottom: 4px; }
.empty-products p { font-size: 12px; margin-bottom: 20px; }
`;
.newsletter-section {
  position: relative;
  overflow: hidden;
  margin: 55px 0 45px;
  border-radius: 12px;
  background: linear-gradient(110deg, #eef2ff, #f5f0ff 58%, #e8f6f8);
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.newsletter-copy { position: relative; z-index: 1; }
.newsletter-copy h2 { font-size: 25px; margin-top: 9px; }
.newsletter-button {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  background: var(--nc-primary);
  color: white;
  border: 0;
  border-radius: 7px;
  padding: 13px 17px;
  font-size: 11px;
  font-weight: 750;
}
.newsletter-decoration {
  position: absolute;
  right: 150px;
  top: -45px;
  font-size: 220px;
  font-weight: 900;
  line-height: 1;
  color: #ffffff66;
  pointer-events: none;
}
.site-footer {
  background: #f8f9fc;
  border-top: 1px solid var(--nc-border);
}
.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.25fr;
  gap: 35px;
  padding-top: 37px;
  padding-bottom: 35px;
}
.footer-brand .brand-mark {
  width: 37px;
  height: 37px;
  font-size: 22px;
}
.footer-brand .brand-name { font-size: 22px; }
.footer-brand-block > p {
  color: var(--nc-muted);
  font-size: 11px;
  line-height: 1.8;
  max-width: 290px;
  margin-top: 17px;
}
.footer-column {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;
}
.footer-column h3 { font-size: 12px; margin: 5px 0 4px; }
.footer-column > button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--nc-muted);
  font-size: 11px;
  text-align: left;
}
.footer-column > button:hover { color: var(--nc-primary); }
.footer-trust p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--nc-muted);
  font-size: 10px;
}
.footer-trust p svg { color: var(--nc-primary); }
.footer-bottom { border-top: 1px solid #e9ecf2; }
.footer-bottom-inner {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #7c8798;
  font-size: 10px;
}
.toast-notice {
  position: fixed;
  z-index: 50;
  top: 18px;
  right: 18px;
  max-width: calc(100% - 36px);
  display: flex;
  align-items: center;
  gap: 10px;
  background: #172033;
  color: white;
  border-radius: 9px;
  padding: 13px 15px;
  box-shadow: 0 10px 30px #0002;
  font-size: 12px;
}
.toast-notice > svg { color: #75dfa1; flex-shrink: 0; }
.toast-notice button {
  display: grid;
  place-items: center;
  margin-left: 6px;
  border: 0;
  color: white;
  background: transparent;
}

@media (min-width: 1500px) {
  .novacart-page .container {
    width: min(1340px, calc(100% - 60px));
  }
}

@media (max-width: 1100px) {
  .header-main { gap: 16px; }
  .header-actions { gap: 9px; }
  .header-action { gap: 5px; }
  .nav-inner { gap: 19px; }
  .hero-layout {
    grid-template-columns: minmax(0, 1.4fr) minmax(250px, .8fr);
  }
  .hero-copy { padding-left: 24px; }
  .benefit-item { gap: 7px; padding: 3px 5px; }
  .benefit-icon { width: 34px; height: 34px; }
  .product-grid { gap: 13px; }
  .footer-main { gap: 23px; }
}

@media (max-width: 850px) {
  .header-main {
    min-height: 75px;
    flex-wrap: wrap;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .mobile-menu-toggle { display: grid; place-items: center; }
  .brand-mark { width: 37px; height: 37px; font-size: 22px; }
  .brand-name { font-size: 22px; }
  .header-actions { margin-left: auto; }
  .header-action span { display: none; }
  .header-action { padding: 7px; }
  .search-box { order: 5; flex-basis: 100%; }
  .nav-bar { display: none; }
  .nav-bar.nav-open { display: block; }
  .nav-inner {
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .nav-inner > button {
    padding: 11px 3px;
    border-bottom: 1px solid #f0f2f6;
  }
  .nav-inner .nav-deals { margin-left: 0; }
  .hero-layout { grid-template-columns: 1fr; }
  .hero { min-height: 320px; }
  .hero-image-wrap { min-height: 320px; }
  .side-promos {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .side-promo { min-height: 155px; }
  .benefit-strip {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 16px;
  }
  .benefit-item:nth-child(2) { border-right: 0; }
  .category-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .footer-main { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .novacart-page .container { width: calc(100% - 26px); }
  .announcement-inner { justify-content: center; min-height: 32px; }
  .announcement-inner span:nth-child(2),
  .announcement-inner span:nth-child(3) { display: none; }
  .header-main { gap: 9px; }
  .brand { gap: 7px; }
  .brand-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    font-size: 20px;
  }
  .brand-name { font-size: 20px; }
  .brand-tagline { font-size: 9px; }
  .header-actions { gap: 2px; }
  .header-action { padding: 5px; }
  .header-action svg { width: 18px; height: 18px; }
  .search-box { height: 42px; }
  .page-content { padding-top: 13px; }
  .hero { grid-template-columns: 1fr; min-height: 0; }
  .hero-copy { padding: 26px 22px 21px; }
  .hero h1 {
    font-size: 33px;
    max-width: 320px;
    margin-top: 15px;
  }
  .hero-copy > p { font-size: 12px; margin-bottom: 17px; }
  .hero-dots { margin-top: 18px; }
  .hero-image-wrap { min-height: 200px; height: 200px; }
  .hero-image-caption { bottom: 10px; left: 10px; right: 10px; }
  .side-promos { gap: 9px; }
  .side-promo {
    min-height: 170px;
    padding: 13px 10px;
    align-items: flex-end;
  }
  .side-promo > div { max-width: 100%; }
  .side-promo h2 { font-size: 16px; }
  .side-promo p { display: none; }
  .side-promo img {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 44%;
    height: 83px;
    opacity: .82;
  }
  .side-promo > div { padding-top: 68px; }
  .side-promo button { font-size: 9px; }
  .benefit-strip { margin-top: 14px; padding: 13px 5px; }
  .benefit-item { justify-content: flex-start; padding: 3px 5px; gap: 7px; }
  .benefit-icon { width: 29px; height: 29px; border-radius: 8px; }
  .benefit-icon svg { width: 16px; height: 16px; }
  .benefit-item strong { font-size: 10px; }
  .benefit-item small { font-size: 9px; line-height: 1.4; }
  .section-block { padding-top: 35px; }
  .section-heading { align-items: flex-start; margin-bottom: 16px; }
  .section-heading h2,
  .newsletter-copy h2 { font-size: 23px; }
  .section-heading p { font-size: 11px; }
  .text-link { font-size: 10px; white-space: nowrap; }
  .category-grid { gap: 8px; }
  .category-card { padding: 7px 5px 10px; }
  .category-card strong { font-size: 10px; margin-top: 9px; }
  .category-card small { font-size: 8px; }
  .deals-section { padding-top: 38px; }
  .deal-label { font-size: 0; padding: 8px; }
  .deal-label svg { width: 15px; height: 15px; }
  .product-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .product-filters { width: 100%; flex-wrap: wrap; gap: 7px; }
  .product-filters label { font-size: 9px; }
  .product-filters select {
    flex: 1;
    min-width: 0;
    max-width: none;
    padding: 9px 5px;
    font-size: 10px;
  }
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .product-info { padding: 10px 9px; }
  .product-info h3 { font-size: 11px; min-height: 33px; }
  .product-pricing { gap: 5px; }
  .product-pricing strong { font-size: 14px; }
  .product-pricing del { font-size: 9px; }
  .product-pricing > span { font-size: 8px; }
  .product-rating small { font-size: 8px; }
  .add-cart-button { padding: 9px 4px; font-size: 10px; }
  .newsletter-section {
    margin: 38px 0 30px;
    padding: 23px 18px;
    align-items: flex-start;
    flex-direction: column;
  }
  .newsletter-copy h2 { font-size: 22px; }
  .newsletter-copy p { font-size: 11px; }
  .newsletter-button { padding: 11px 13px; }
  .newsletter-decoration {
    right: -5px;
    top: 35px;
    font-size: 140px;
  }
  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px 16px;
    padding-top: 27px;
    padding-bottom: 25px;
  }
  .footer-brand-block { grid-column: 1 / -1; }
  .footer-brand-block > p { max-width: 350px; }
  .footer-bottom-inner {
    padding-top: 12px;
    padding-bottom: 12px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 6px;
  }
}
`;
