/* =====================================================================
   YOU.ART — APP LOGIC
   =====================================================================
   This file reads content from four global variables, each defined
   in its own admin-editable data file:
     - window.ARTWORKS     <- data/artworks.js
     - window.ARTISTS      <- data/artists.js
     - window.COLLECTIONS  <- data/collections.js
     - window.HOMEPAGE     <- data/homepage.js

   This file never contains actual content itself — all copy, prices,
   bios, and images live in the data files so non-developers can
   update the site without touching this file.

   Every data getter below is defensive: malformed entries are
   filtered out and missing/broken files fall back to friendly empty
   states, so one bad admin edit can never take the whole site down.

   Routes:
     #/                        homepage
     #/gallery                 full catalog grid
     #/artwork/<slug>          single artwork
     #/artist/<slug>           artist bio + their works
     #/collection/<slug>       curated album/gallery
   ===================================================================== */

(function () {
  "use strict";

  const root = document.getElementById("app");

  // ---- Safe data access -------------------------------------------------
  function getArtworks() {
    const data = window.ARTWORKS;
    if (!Array.isArray(data)) {
      console.error("[you.art] window.ARTWORKS is missing or not an array. Check data/artworks.js.");
      return [];
    }
    // Filter out any malformed entries rather than letting one bad
    // admin edit break the whole catalog.
    return data.filter((a) => a && typeof a === "object" && a.slug && a.title);
  }

  function findArtwork(slug) {
    return getArtworks().find((a) => a.slug === slug) || null;
  }

  function getArtists() {
    const data = window.ARTISTS;
    if (!Array.isArray(data)) {
      console.error("[you.art] window.ARTISTS is missing or not an array. Check data/artists.js.");
      return [];
    }
    return data.filter((a) => a && typeof a === "object" && a.slug && a.name);
  }

  function findArtist(slug) {
    return getArtists().find((a) => a.slug === slug) || null;
  }

  function getArtworksByArtist(slug) {
    return getArtworks().filter((a) => a.artistSlug === slug);
  }

  function getCollections() {
    const data = window.COLLECTIONS;
    if (!Array.isArray(data)) {
      console.error("[you.art] window.COLLECTIONS is missing or not an array. Check data/collections.js.");
      return [];
    }
    return data.filter((c) => c && typeof c === "object" && c.slug && c.title);
  }

  function findCollection(slug) {
    return getCollections().find((c) => c.slug === slug) || null;
  }

  function getArtworksByCollection(collection) {
    if (!collection || !Array.isArray(collection.artworkSlugs)) return [];
    const all = getArtworks();
    // Preserve the order given in the collection, skip unknown slugs.
    return collection.artworkSlugs
      .map((slug) => all.find((a) => a.slug === slug))
      .filter(Boolean);
  }

  function getHomepage() {
    const data = window.HOMEPAGE;
    if (!data || typeof data !== "object") {
      console.error("[you.art] window.HOMEPAGE is missing or malformed. Check data/homepage.js.");
      return {};
    }
    return data;
  }

  function formatPrice(n, currency) {
    if (typeof n !== "number" || isNaN(n)) return "";
    const symbol = currency === "INR" ? "₹" : (currency || "");
    return symbol + " " + n.toLocaleString("en-IN");
  }

  // ---- Templates ----------------------------------------------------
  function cardTemplate(art) {
    const cover = (art.images && art.images[0]) || "";
    const onSale = art.salePrice && art.salePrice < art.price;
    return `
      <a class="card reveal" href="#/artwork/${encodeURIComponent(art.slug)}">
        <div class="card-img-wrap">
          <img src="${cover}" alt="${escapeHtml(art.title)}" loading="lazy">
          ${!art.inStock ? '<span class="badge badge-sold">Sold</span>' : ''}
          ${onSale && art.inStock ? '<span class="badge badge-sale">Sale</span>' : ''}
        </div>
        <div class="card-body">
          <h3>${escapeHtml(art.title)}</h3>
          <p class="card-artist">${escapeHtml(art.artist)}</p>
          <p class="card-price">
            ${onSale ? `<span class="strike">${formatPrice(art.price, art.currency)}</span> ` : ""}
            ${formatPrice(art.salePrice ?? art.price, art.currency)}
          </p>
        </div>
      </a>`;
  }

  function galleryTemplate() {
    const artworks = getArtworks();
    if (artworks.length === 0) {
      return `
        <div class="empty-state reveal in">
          <h2>No artwork to show yet</h2>
          <p>Add pieces in <code>data/artworks.js</code> and refresh the page.</p>
        </div>`;
    }
    return `
      <section class="gallery-head reveal in">
        <div class="kicker">The Collection</div>
        <h1>Original Art, <em>Direct From The Studio.</em></h1>
      </section>
      <section class="grid">
        ${artworks.map(cardTemplate).join("")}
      </section>`;
  }

  function collectionCardTemplate(col) {
    return `
      <a class="col-card reveal" href="#/collection/${encodeURIComponent(col.slug)}">
        <div class="col-card-img"><img src="${col.coverImage || ""}" alt="${escapeHtml(col.title)}" loading="lazy"></div>
        <div class="col-card-body">
          <h3>${escapeHtml(col.title)}</h3>
          ${col.description ? `<p>${escapeHtml(col.description)}</p>` : ""}
        </div>
      </a>`;
  }

  function artistStripTemplate(artist) {
    if (!artist) return "";
    return `
      <a class="artist-strip reveal" href="#/artist/${encodeURIComponent(artist.slug)}">
        ${artist.portrait ? `<img src="${artist.portrait}" alt="${escapeHtml(artist.name)}">` : `<div class="artist-strip-fallback">${escapeHtml((artist.name || "?").charAt(0))}</div>`}
        <div>
          <div class="artist-strip-name">${escapeHtml(artist.name)}</div>
          <div class="artist-strip-role">${escapeHtml(artist.role || "")}</div>
        </div>
      </a>`;
  }

  function homeTemplate() {
    const home = getHomepage();
    const collections = (home.featuredCollectionSlugs || [])
      .map((slug) => findCollection(slug))
      .filter(Boolean);
    const artworks = (home.featuredArtworkSlugs || [])
      .map((slug) => findArtwork(slug))
      .filter(Boolean);

    return `
      <section class="hero reveal in">
        <div class="hero-text">
          <div class="kicker">${escapeHtml(home.heroKicker || "")}</div>
          <h1>${escapeHtml(home.heroTitle || "")} ${home.heroTitleEm ? `<em>${escapeHtml(home.heroTitleEm)}</em>` : ""}</h1>
          ${home.heroSubtitle ? `<p class="hero-sub">${escapeHtml(home.heroSubtitle)}</p>` : ""}
          <a class="btn btn-primary" href="#/gallery"><span class="shine"></span> Browse The Collection →</a>
        </div>
        ${home.heroImage ? `<div class="hero-img"><img src="${home.heroImage}" alt=""></div>` : ""}
      </section>

      ${collections.length ? `
      <section class="home-section">
        <div class="section-head reveal">
          <div class="kicker">Curated Albums</div>
          <h2>Shop by <em>Gallery.</em></h2>
        </div>
        <div class="col-grid">
          ${collections.map(collectionCardTemplate).join("")}
        </div>
      </section>` : ""}

      ${artworks.length ? `
      <section class="home-section">
        <div class="section-head reveal">
          <div class="kicker">Handpicked</div>
          <h2>Featured <em>Originals.</em></h2>
        </div>
        <div class="grid">
          ${artworks.map(cardTemplate).join("")}
        </div>
      </section>` : ""}`;
  }

  function artistTemplate(artist) {
    const works = getArtworksByArtist(artist.slug);
    return `
      <a class="back-link reveal in" href="#/gallery">← Back to Collection</a>
      <section class="artist-page reveal in">
        <div class="artist-page-img">
          <img src="${artist.coverImage || artist.portrait || ""}" alt="${escapeHtml(artist.name)}">
        </div>
        <div class="artist-page-info">
          ${artist.quote ? `<p class="artist-quote">"${escapeHtml(artist.quote)}"</p>` : ""}
          <h1>${escapeHtml(artist.name)}</h1>
          <p class="artist-role">${escapeHtml(artist.role || "")}</p>
          ${artist.bio ? `<p class="desc">${escapeHtml(artist.bio)}</p>` : ""}
        </div>
      </section>
      <section class="home-section">
        <div class="section-head reveal">
          <div class="kicker">Available Work</div>
          <h2>By ${escapeHtml(artist.name)}</h2>
        </div>
        ${works.length ? `<div class="grid">${works.map(cardTemplate).join("")}</div>` : `<p class="muted">No available pieces from this artist right now.</p>`}
      </section>`;
  }

  function collectionTemplate(col) {
    const works = getArtworksByCollection(col);
    return `
      <a class="back-link reveal in" href="#/gallery">← Back to Collection</a>
      <section class="gallery-head reveal in">
        <div class="kicker">Curated Album</div>
        <h1>${escapeHtml(col.title)}</h1>
        ${col.description ? `<p class="hero-sub">${escapeHtml(col.description)}</p>` : ""}
      </section>
      ${works.length ? `
        <section class="grid">${works.map(cardTemplate).join("")}</section>`
        : `<p class="muted">No artwork currently linked to this album. Check the artworkSlugs list in data/collections.js.</p>`}`;
  }

  function detailTemplate(art) {
    const onSale = art.salePrice && art.salePrice < art.price;
    const images = (art.images && art.images.length ? art.images : [""]);
    return `
      <a class="back-link reveal in" href="#/gallery">← Back to Collection</a>
      <section class="detail">
        <div class="detail-gallery">
          <div class="stage" id="stage">
            ${images.map((src, i) => `<img data-i="${i}" class="${i === 0 ? "active" : ""}" src="${src}" alt="${escapeHtml(art.title)}">`).join("")}
          </div>
          ${images.length > 1 ? `
          <div class="thumbs">
            ${images.map((src, i) => `<button data-i="${i}" class="${i === 0 ? "active" : ""}"><img src="${src}" alt=""></button>`).join("")}
          </div>` : ""}
        </div>
        <div class="detail-info reveal in">
          <div class="eyebrow"><span class="dot"></span> ${art.inStock ? "Original Artwork — Only One Available" : "Sold — No Longer Available"}</div>
          <h1>${escapeHtml(art.title)}</h1>
          <p class="by">by <a href="#/artist/${encodeURIComponent(art.artistSlug || "")}">${escapeHtml(art.artist)}</a></p>
          <p class="desc">${escapeHtml(art.description || "")}</p>
          <div class="meta-row">
            <div class="meta-item">Medium<b>${escapeHtml(art.medium || "—")}</b></div>
            <div class="meta-item">Size<b>${escapeHtml(art.size || "—")}</b></div>
            <div class="meta-item">Availability<b style="color:${art.inStock ? "var(--acid)" : "var(--ink-faint)"}">${art.inStock ? "In stock" : "Sold"}</b></div>
          </div>
          <div class="price-block">
            ${onSale ? `<span class="price-strike">${formatPrice(art.price, art.currency)}</span>` : ""}
            <span class="price-now">${formatPrice(art.salePrice ?? art.price, art.currency)}</span>
          </div>
          <div class="cta-row">
            ${art.inStock ? `
              <button class="btn btn-primary" onclick="window.open('https://wa.me/${encodeURIComponent(art.whatsappNumber || "")}?text=${encodeURIComponent("Hi, I want to enquire about Artwork " + art.title)}','_blank')">
                <span class="shine"></span> Enquire on WhatsApp →
              </button>` : `<button class="btn btn-ghost" disabled>No longer available</button>`}
          </div>
        </div>
      </section>`;
  }

  function notFoundTemplate(label) {
    return `
      <div class="empty-state reveal in">
        <h2>We couldn't find that ${escapeHtml(label || "page")}</h2>
        <p><a href="#/">Return to the homepage →</a></p>
      </div>`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str ?? "");
    return div.innerHTML;
  }

  // ---- Detail page interactivity -------------------------------------
  function wireDetailInteractions() {
    const images = document.querySelectorAll("#stage img");
    const thumbs = document.querySelectorAll(".thumbs button");
    thumbs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.i;
        images.forEach((img) => img.classList.toggle("active", img.dataset.i === i));
        thumbs.forEach((t) => t.classList.toggle("active", t.dataset.i === i));
      });
    });
  }

  // ---- Scroll reveal ---------------------------------------------------
  function wireReveal() {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  // ---- Router -----------------------------------------------------------
  function render() {
    const hash = window.location.hash || "#/";

    const artworkMatch = hash.match(/^#\/artwork\/(.+)$/);
    const artistMatch = hash.match(/^#\/artist\/(.+)$/);
    const collectionMatch = hash.match(/^#\/collection\/(.+)$/);

    if (artworkMatch) {
      const art = findArtwork(decodeURIComponent(artworkMatch[1]));
      root.innerHTML = art ? detailTemplate(art) : notFoundTemplate("artwork");
      if (art) wireDetailInteractions();
    } else if (artistMatch) {
      const artist = findArtist(decodeURIComponent(artistMatch[1]));
      root.innerHTML = artist ? artistTemplate(artist) : notFoundTemplate("artist");
    } else if (collectionMatch) {
      const col = findCollection(decodeURIComponent(collectionMatch[1]));
      root.innerHTML = col ? collectionTemplate(col) : notFoundTemplate("album");
    } else if (hash === "#/gallery") {
      root.innerHTML = galleryTemplate();
    } else {
      root.innerHTML = homeTemplate();
    }

    wireReveal();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);
})();
