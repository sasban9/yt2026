/* =====================================================================
   YOU.ART — COLLECTIONS (ALBUMS / GALLERIES) DATA FILE
   =====================================================================
   ADMIN INSTRUCTIONS:
   - This is the ONLY file you should edit to add or update
     collections (also called albums or curated galleries).
     Never edit anything inside /js/app.js.
   - "slug" must be unique — becomes the URL, e.g. slug "skies"
     -> yoursite.com/#/collection/skies
   - "artworkSlugs" is a list of artwork slugs (from data/artworks.js)
     to include in this collection, in the order you want them shown.
     Do NOT paste artwork details here — just reference the slug.
     If a slug doesn't match anything in artworks.js, it's skipped
     automatically (won't break the page).
   - "coverImage" is a photo URL used on the homepage and collection grid.
   ===================================================================== */

window.COLLECTIONS = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    description: "The latest originals to enter the studio — fresh off the easel.",
    coverImage: "https://you.art/cdn/shop/products/ManoharChiluveru-01_848x700.jpg?v=1649240125",
    artworkSlugs: ["cow", "harbor-light", "abstract-2"]
  },

  {
    slug: "skies-and-moons",
    title: "Skies & Moons",
    description: "A curated set of nocturnes and open-sky studies, chosen for collectors drawn to stillness.",
    coverImage: "https://you.art/cdn/shop/products/ManoharChiluveru-01_304494ce-bfc7-42e1-b99c-599a7e4209f3_875x700.jpg?v=1649240197",
    artworkSlugs: ["moon-1", "harbor-light"]
  },

  {
    slug: "under-1-lakh",
    title: "Under ₹1,00,000",
    description: "Original art doesn't have to mean a six-figure commitment. Start a collection here.",
    coverImage: "https://you.art/cdn/shop/products/Picture9-05_876x700.jpg?v=1649240197",
    artworkSlugs: ["harbor-light"]
  }
];
