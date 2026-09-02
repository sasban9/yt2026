/* =====================================================================
   YOU.ART — ARTWORK DATA FILE
   =====================================================================
   ADMIN INSTRUCTIONS:
   - This is the ONLY file you should ever edit to add, remove, or
     update artwork. Never edit anything inside /js/app.js.
   - Add a new artwork by copying an existing {...} block inside the
     ARTWORKS array below, pasting it as a new entry, and changing
     the values. Keep the commas between entries.
   - Every field is required unless marked (optional).
   - "slug" must be unique — it becomes the artwork's URL
     (e.g. slug "cow" -> yoursite.com/#/artwork/cow). Use lowercase,
     hyphens instead of spaces, no special characters.
   - "images" is a list — add as many photo URLs as you want, first
     one is used as the cover image. Wrap each URL in quotes and
     separate with commas.
   - "price" and "salePrice" are plain numbers, no commas, no ₹ symbol.
     If there's no sale, set "salePrice" to the same value as "price".
   - "inStock" is either true or false (no quotes).
   - If you're unsure whether an edit is valid, copy this whole file
     somewhere safe before saving, so you can restore it.
   ===================================================================== */

window.ARTWORKS = [
  {
    id: "cow-001",
    slug: "cow",                      // used in the URL — must be unique
    title: "Cow",
    artist: "Manohar Chiluveru",
    artistSlug: "manohar-chiluveru",
    medium: "Acrylic on Canvas",
    size: "69\" W x 57\" H",
    price: 820000,                    // original price, number only
    salePrice: 737000,                // current/sale price, number only
    currency: "INR",
    inStock: true,
    whatsappNumber: "919987212198",   // digits only, country code first
    description: "My work exists in the space between spontaneity and preconceived ideas and thoughts. The creation begins spontaneously; travels through daily experiences, memories and meets with the idea that refers to the age that we are living in.",
    images: [
      "https://you.art/cdn/shop/products/ManoharChiluveru-01_848x700.jpg?v=1649240125",
      "https://you.art/cdn/shop/products/Picture9-05_876x700.jpg?v=1649240197",
      "https://you.art/cdn/shop/products/ManoharChiluveru-01_304494ce-bfc7-42e1-b99c-599a7e4209f3_875x700.jpg?v=1649240197"
    ]
  },

  {
    id: "abstract-002",
    slug: "abstract-2",
    title: "Abstract",
    artist: "Manohar Chiluveru",
    artistSlug: "manohar-chiluveru",
    medium: "Mixed Media on Canvas",
    size: "48\" W x 36\" H",
    price: 285000,
    salePrice: 285000,
    currency: "INR",
    inStock: true,
    whatsappNumber: "919987212198",
    description: "An exploration of form dissolving into color — where structure gives way to instinct and the canvas becomes a record of a single, unrepeatable gesture.",
    images: [
      "https://you.art/cdn/shop/products/Picture9-05_876x700.jpg?v=1649240197"
    ]
  },

  {
    id: "moon-003",
    slug: "moon-1",
    title: "Full Moon",
    artist: "Manohar Chiluveru",
    artistSlug: "manohar-chiluveru",
    medium: "Oil on Canvas",
    size: "40\" W x 40\" H",
    price: 195000,
    salePrice: 175000,
    currency: "INR",
    inStock: false,
    whatsappNumber: "919987212198",
    description: "A quiet nocturne — the moon as a fixed point of stillness against a restless, layered sky.",
    images: [
      "https://you.art/cdn/shop/products/ManoharChiluveru-01_304494ce-bfc7-42e1-b99c-599a7e4209f3_875x700.jpg?v=1649240197"
    ]
  }
];
