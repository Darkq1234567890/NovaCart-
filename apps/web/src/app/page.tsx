"use client";
const categories = [
  { name: "Korean Fashion", icon: "👕", color: "#e8efff" },
  { name: "Japanese Style", icon: "👘", color: "#fce7f3" },
  { name: "Electronics", icon: "🎧", color: "#e0f2fe" },
  { name: "Accessories", icon: "⌚", color: "#fef3c7" },
  { name: "Streetwear", icon: "👟", color: "#dcfce7" },
  { name: "New Arrivals", icon: "✨", color: "#f3e8ff" },
];

const products = [
  {
    id: 1,
    name: "Korean Oversized T-Shirt",
    category: "KOREAN FASHION",
    price: 1099,
    oldPrice: 1499,
    discount: "27% OFF",
    rating: "4.6",
    icon: "👕",
    color: "#e8efff",
    tag: "BESTSELLER",
  },
  {
    id: 2,
    name: "Minimal Wireless Headphones",
    category: "ELECTRONICS",
    price: 1899,
    oldPrice: 2499,
    discount: "24% OFF",
    rating: "4.5",
    icon: "🎧",
    color: "#e0f2fe",
    tag: "POPULAR",
  },
  {
    id: 3,
    name: "Japanese Everyday Backpack",
    category: "JAPANESE STYLE",
    price: 1499,
    oldPrice: 1999,
    discount: "25% OFF",
    rating: "4.7",
    icon: "🎒",
    color: "#fce7f3",
    tag: "TRENDING",
  },
  {
    id: 4,
    name: "Classic Everyday Sneakers",
    category: "STREETWEAR",
    price: 2299,
    oldPrice: 2999,
    discount: "23% OFF",
    rating: "4.4",
    icon: "👟",
    color: "#dcfce7",
    tag: "NEW",
  },
];

export default function HomePage() {
  return (
    <main>
      <div className="top-strip">
        Discover your style. Find your next favourite.
        <span>Free shipping on selected orders</span>
      </div>

      <header className="site-header">
        <a className="brand" href="/" aria-label="NovaCart home">
          <span className="brand-symbol">N</span>
          <span>nova<span className="brand-accent">cart</span></span>
        </a>

        <form className="search-box" action="/products" method="get">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            name="search"
            placeholder="Search fashion, electronics and more..."
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <nav className="header-actions" aria-label="Main navigation">
          <a href="/account">♙ <span>Account</span></a>
          <a href="/orders">▤ <span>Orders</span></a>
          <a className="cart-link" href="/cart">
            ♧ <span>Cart</span>
            <span className="cart-count">0</span>
          </a>
        </nav>
      </header>

      <nav className="category-nav" aria-label="Shop categories">
        <a href="/products">All Products</a>
        <a href="/products?category=fashion">Fashion</a>
        <a href="/products?category=electronics">Electronics</a>
        <a href="/products?category=accessories">Accessories</a>
        <a href="/products?sort=newest">New Arrivals</a>
        <a href="/products?sort=popular">Trending Now</a>
      </nav>

      <div className="page-container">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR STYLE. YOUR DISCOVERY.
            </span>
            <h1>
              Find your next
              <br />
              <span>favourite thing.</span>
            </h1>
            <p>
              Explore Korean fashion, Japanese-inspired essentials,
              and everyday accessories from a world of independent sellers.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="/products">
                Explore Collection <span>→</span>
              </a>
              <a className="text-button" href="#categories">
                Browse Categories
              </a>
            </div>
            <div className="hero-trust">
              <span><b>✓</b> Curated discoveries</span>
              <span><b>✓</b> Seller marketplace</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Fashion and accessories illustration">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="floating-card card-top">
              <span>✦</span> New season
            </div>
            <div className="hero-product hero-shirt">👕</div>
            <div className="hero-product hero-headphones">🎧</div>
            <div className="hero-product hero-shoe">👟</div>
            <div className="floating-card card-bottom">
              <span className="online-dot" />
              Discover something new
            </div>
          </div>
          <div className="hero-decoration decoration-one" />
          <div className="hero-decoration decoration-two" />
        </section>

        <section className="benefit-row" aria-label="Shopping benefits">
          <div className="benefit">
            <span className="benefit-icon">◇</span>
            <div>
              <strong>Curated collections</strong>
              <small>Discover your style</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">♧</span>
            <div>
              <strong>Multiple sellers</strong>
              <small>More choice, one place</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <strong>Secure shopping</strong>
              <small>Designed with care</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">↗</span>
            <div>
              <strong>Fresh finds</strong>
              <small>Explore new arrivals</small>
            </div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-kicker">EXPLORE THE MARKETPLACE</span>
              <h2>Shop by category</h2>
              <p>Find the things that match your world.</p>
            </div>
            <a className="view-all" href="/products">
              View all categories <span>→</span>
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <a
                className="category-card"
                href={`/products?category=${encodeURIComponent(category.name)}`}
                key={category.name}
              >
                <span
                  className="category-art"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </span>
                <strong>{category.name}</strong>
                <span className="category-arrow">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section featured-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">HANDPICKED FOR YOU</span>
              <h2>Featured finds</h2>
              <p>Popular picks to get your discovery started.</p>
            </div>
            <a className="view-all" href="/products">
              Explore all products <span>→</span>
            </a>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <a
                  className="product-image"
                  href={`/products/${product.id}`}
                  style={{ backgroundColor: product.color }}
                  aria-label={`View ${product.name}`}
                >
                  <span className="product-tag">{product.tag}</span>
                  <span className="product-emoji">{product.icon}</span>
                  <span className="quick-view">View product ↗</span>
                </a>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <a href={`/products/${product.id}`}>
                    <h3>{product.name}</h3>
                  </a>
                  <div className="product-rating">
                    <span>★ {product.rating}</span>
                    <span className="rating-caption">Customer favourite</span>
                  </div>
                  <div className="product-price-row">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                    <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
                    <span className="discount">{product.discount}</span>
                  </div>
                  <button
                    className="add-cart-button"
                    onClick={() => {
                      window.location.href = "/cart";
                    }}
                    type="button"
                  >
                    View shopping cart <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="demo-note">
            Sample homepage products are for design preview. Live product
            listings will be connected to the NovaCart API in a later step.
          </p>
        </section>

        <section className="seller-banner">
          <div>
            <span className="section-kicker">GROW WITH NOVACART</span>
            <h2>Your products deserve to be discovered.</h2>
            <p>
              Bring your store to a marketplace built for new finds and
              independent sellers.
            </p>
          </div>
          <a className="seller-button" href="/vendor">
            Become a seller <span>→</span>
          </a>
          <span className="seller-decoration">✳</span>
        </section>

        <section className="newsletter">
          <div>
            <span className="section-kicker">A LITTLE INSPIRATION</span>
            <h2>Your next favourite starts here.</h2>
            <p>Explore fresh finds and discover something different.</p>
          </div>
          <a className="primary-button" href="/products">
            Start exploring <span>→</span>
          </a>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="/">
              <span className="brand-symbol">N</span>
              <span>nova<span className="brand-accent">cart</span></span>
            </a>
            <p>
              A marketplace for distinctive fashion, everyday essentials,
              and exciting discoveries.
            </p>
          </div>
          <div className="footer-column">
            <strong>Discover</strong>
            <a href="/products">All products</a>
            <a href="/products?category=fashion">Fashion</a>
            <a href="/products?category=electronics">Electronics</a>
          </div>
          <div className="footer-column">
            <strong>Your account</strong>
            <a href="/account">My account</a>
            <a href="/orders">My orders</a>
            <a href="/cart">Shopping cart</a>
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