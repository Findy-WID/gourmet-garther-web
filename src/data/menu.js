// ─────────────────────────────────────────────────────────────
// MENU — every dish, price and option on the site lives here.
//
// All prices are PLACEHOLDERS. Replace them with the real prices.
//
// Adding photos: drop the image into /public/images/ and set
//   image: '/images/your-photo.jpg'
// Leave image empty ('') to show the drawn placeholder.
//
// Fields:
//   section   'plates' | 'buckets' | 'corporate'
//   group     the filter chip it appears under on the menu page
//   price     starting price in Naira (before choices and extras)
//   unit      short serving info shown under the name
//   minQty    smallest quantity a customer can order (default 1)
//   popular   true = shows in "Most ordered" on the home page
//   choices   pick-one groups (price = amount added to base price)
//   extras    optional add-ons, each with its own quantity
//   extrasMax most add-on pieces allowed in total (optional)
// ─────────────────────────────────────────────────────────────

const plateProtein = {
  id: 'protein',
  label: 'Choose your protein',
  options: [
    { id: 'chicken', label: 'Grilled chicken', price: 0 },
    { id: 'turkey', label: 'Peppered turkey', price: 1500 },
    { id: 'beef', label: 'Beef (2 pieces)', price: -500 },
    { id: 'fish', label: 'Fried croaker fish', price: 1000 },
    { id: 'goat', label: 'Goat meat (2 pieces)', price: 1000 },
  ],
}

const plateExtras = [
  { id: 'dodo', label: 'Dodo (fried plantain)', price: 1000 },
  { id: 'moimoi', label: 'Moi moi', price: 1200 },
  { id: 'egg', label: 'Boiled egg', price: 400 },
  { id: 'coleslaw', label: 'Coleslaw', price: 800 },
  { id: 'xchicken', label: 'Extra chicken', price: 3000 },
  { id: 'drink', label: 'Chilled soft drink', price: 700 },
]

const bucketSize = {
  id: 'size',
  label: 'Choose a size',
  options: [
    { id: 'medium', label: 'Medium — serves 4 to 6', price: 0 },
    { id: 'large', label: 'Large — serves 8 to 10', price: 12000 },
  ],
}

const bucketProteins = [
  { id: 'chicken', label: 'Chicken', note: 'per piece', price: 3000 },
  { id: 'turkey', label: 'Turkey', note: 'per piece', price: 4000 },
  { id: 'beef', label: 'Beef', note: 'per piece', price: 1500 },
  { id: 'goat', label: 'Goat meat', note: 'per piece', price: 2500 },
  { id: 'fish', label: 'Croaker fish', note: 'per piece', price: 3000 },
  { id: 'assorted', label: 'Assorted (shaki, ponmo, beef)', note: 'per portion', price: 3500 },
]

export const SECTIONS = [
  {
    id: 'plates',
    name: 'Plates',
    short: 'Single meals, ready to eat',
    long: 'One person, one plate. Pick your protein, add your sides, and it’s packed hot.',
  },
  {
    id: 'buckets',
    name: 'Buckets',
    short: 'Big portions for the family or the week',
    long: 'Stews, soups and rice in sealed buckets. Feed the house, or stock your freezer for the week.',
  },
  {
    id: 'corporate',
    name: 'Workplace',
    short: 'Office lunches, meetings and events',
    long: 'Packed lunches for the team, trays for meetings and feasts for office parties. One-off or on a weekly or monthly schedule.',
  },
]

export const MENU = [
  // ── PLATES ─────────────────────────────────────────────────
  {
    id: 'party-jollof',
    name: 'Smoky Party Jollof',
    section: 'plates',
    group: 'Rice',
    price: 6500,
    unit: '1 plate',
    popular: true,
    description: 'Firewood-style jollof with that bottom-pot smokiness, served with your choice of protein.',
    image: '',
    choices: [plateProtein],
    extras: plateExtras,
  },
  {
    id: 'fried-rice',
    name: 'Nigerian Fried Rice',
    section: 'plates',
    group: 'Rice',
    price: 6500,
    unit: '1 plate',
    popular: true,
    description: 'Curry-scented fried rice with liver, carrots, green beans and sweetcorn.',
    image: '',
    choices: [plateProtein],
    extras: plateExtras,
  },
  {
    id: 'coconut-rice',
    name: 'Coconut Rice',
    section: 'plates',
    group: 'Rice',
    price: 7000,
    unit: '1 plate',
    description: 'Rice cooked down in fresh coconut milk with smoked fish and peppers.',
    image: '',
    choices: [plateProtein],
    extras: plateExtras,
  },
  {
    id: 'ofada-ayamase',
    name: 'Ofada Rice & Ayamase',
    section: 'plates',
    group: 'Rice',
    price: 7500,
    unit: '1 plate',
    popular: true,
    description: 'Local ofada rice with green pepper ayamase sauce, assorted meat and boiled egg.',
    image: '',
    choices: [plateProtein],
    extras: plateExtras,
  },
  {
    id: 'stir-fry-spaghetti',
    name: 'Stir-fry Spaghetti',
    section: 'plates',
    group: 'Pasta',
    price: 6000,
    unit: '1 plate',
    description: 'Spaghetti tossed with peppers, onions and sautéed vegetables.',
    image: '',
    choices: [plateProtein],
    extras: plateExtras,
  },
  {
    id: 'ewa-agoyin',
    name: 'Ewa Agoyin & Bread',
    section: 'plates',
    group: 'Beans & Pottage',
    price: 4500,
    unit: '1 plate',
    description: 'Mashed honey beans with dark, slow-fried pepper sauce and a soft agege loaf.',
    image: '',
    choices: [
      {
        id: 'protein',
        label: 'Add a protein',
        options: [
          { id: 'none', label: 'No protein', price: 0 },
          { id: 'fish', label: 'Fried fish', price: 2500 },
          { id: 'egg', label: 'Two boiled eggs', price: 800 },
        ],
      },
    ],
    extras: plateExtras,
  },
  {
    id: 'yam-pottage',
    name: 'Yam Pottage (Asaro)',
    section: 'plates',
    group: 'Beans & Pottage',
    price: 5500,
    unit: '1 plate',
    description: 'Soft yam cooked down in palm oil and pepper, with ugu leaves.',
    image: '',
    choices: [plateProtein],
    extras: plateExtras,
  },
  {
    id: 'soup-swallow',
    name: 'Soup & Swallow',
    section: 'plates',
    group: 'Soups & Swallow',
    price: 7000,
    unit: '1 plate',
    popular: true,
    description: 'Your pick of soup with a wrap of swallow and one protein.',
    image: '',
    choices: [
      {
        id: 'soup',
        label: 'Choose your soup',
        options: [
          { id: 'egusi', label: 'Egusi', price: 0 },
          { id: 'efo', label: 'Efo riro', price: 500 },
          { id: 'okra', label: 'Okra', price: 0 },
          { id: 'ogbono', label: 'Ogbono', price: 0 },
          { id: 'afang', label: 'Afang', price: 1000 },
        ],
      },
      {
        id: 'swallow',
        label: 'Choose your swallow',
        options: [
          { id: 'poundo', label: 'Pounded yam', price: 0 },
          { id: 'eba', label: 'Eba', price: 0 },
          { id: 'amala', label: 'Amala', price: 0 },
          { id: 'semo', label: 'Semo', price: 0 },
        ],
      },
      plateProtein,
    ],
    extras: [
      { id: 'xswallow', label: 'Extra wrap of swallow', price: 800 },
      { id: 'xbeef', label: 'Extra beef', price: 1000 },
      { id: 'xfish', label: 'Extra fish', price: 3000 },
      { id: 'drink', label: 'Chilled soft drink', price: 700 },
    ],
  },

  // ── BUCKETS ────────────────────────────────────────────────
  {
    id: 'jollof-bucket',
    name: 'Party Jollof Bucket',
    section: 'buckets',
    group: 'Rice',
    price: 22000,
    unit: 'Serves 4 to 6',
    popular: true,
    description: 'A full bucket of our smoky party jollof. Add proteins by the piece.',
    image: '',
    choices: [bucketSize],
    extras: bucketProteins,
    extrasMax: 12,
  },
  {
    id: 'fried-rice-bucket',
    name: 'Fried Rice Bucket',
    section: 'buckets',
    group: 'Rice',
    price: 22000,
    unit: 'Serves 4 to 6',
    description: 'A full bucket of Nigerian fried rice. Add proteins by the piece.',
    image: '',
    choices: [bucketSize],
    extras: bucketProteins,
    extrasMax: 12,
  },
  {
    id: 'egusi-bucket',
    name: 'Egusi Soup Bucket',
    section: 'buckets',
    group: 'Soups',
    price: 28000,
    unit: 'About 2 litres',
    popular: true,
    description: 'Thick egusi with ugu and stockfish, cooked in palm oil. Freezer-friendly.',
    image: '',
    choices: [bucketSize],
    extras: bucketProteins,
    extrasMax: 12,
  },
  {
    id: 'efo-riro-bucket',
    name: 'Efo Riro Bucket',
    section: 'buckets',
    group: 'Soups',
    price: 30000,
    unit: 'About 2 litres',
    description: 'Spinach stew with locust beans, peppers and smoked fish.',
    image: '',
    choices: [bucketSize],
    extras: bucketProteins,
    extrasMax: 12,
  },
  {
    id: 'stew-bucket',
    name: 'Chicken Stew Bucket',
    section: 'buckets',
    group: 'Stews & Sauces',
    price: 32000,
    unit: 'About 2 litres',
    description: 'Fried tomato-pepper stew with six pieces of chicken included.',
    image: '',
    choices: [bucketSize],
    extras: bucketProteins,
    extrasMax: 12,
  },
  {
    id: 'ofada-sauce-bucket',
    name: 'Ofada Sauce Bucket',
    section: 'buckets',
    group: 'Stews & Sauces',
    price: 30000,
    unit: 'About 2 litres',
    description: 'Green pepper ayamase sauce with assorted meat. Pair with ofada rice.',
    image: '',
    choices: [bucketSize],
    extras: bucketProteins,
    extrasMax: 12,
  },
  {
    id: 'pepper-soup-bucket',
    name: 'Goat Meat Pepper Soup',
    section: 'buckets',
    group: 'Soups',
    price: 26000,
    unit: 'About 2 litres',
    popular: true,
    description: 'Peppery broth with uziza and scent leaf, and six pieces of goat meat.',
    image: '',
    choices: [
      bucketSize,
      {
        id: 'heat',
        label: 'How hot?',
        options: [
          { id: 'mild', label: 'Mild', price: 0 },
          { id: 'medium', label: 'Medium', price: 0 },
          { id: 'hot', label: 'Very hot', price: 0 },
        ],
      },
    ],
    extras: bucketProteins,
    extrasMax: 12,
  },

  // ── WORKPLACE / CORPORATE ──────────────────────────────────
  {
    id: 'office-lunch-pack',
    name: 'Office Lunch Pack',
    section: 'corporate',
    group: 'Lunch packs',
    price: 6000,
    unit: 'Per pack · minimum 10 packs',
    minQty: 10,
    popular: true,
    description: 'Individually packed lunches for the team, each labelled. Rice, one protein and a side.',
    image: '',
    choices: [
      {
        id: 'rice',
        label: 'Choose the rice',
        options: [
          { id: 'jollof', label: 'Party jollof', price: 0 },
          { id: 'fried', label: 'Fried rice', price: 0 },
          { id: 'mixed', label: 'Half jollof, half fried', price: 0 },
          { id: 'coconut', label: 'Coconut rice', price: 500 },
        ],
      },
      {
        id: 'protein',
        label: 'Choose the protein',
        options: [
          { id: 'chicken', label: 'Chicken', price: 0 },
          { id: 'turkey', label: 'Turkey', price: 1500 },
          { id: 'fish', label: 'Fried fish', price: 1000 },
        ],
      },
    ],
    extras: [
      { id: 'dodo', label: 'Dodo', note: 'per pack', price: 800 },
      { id: 'moimoi', label: 'Moi moi', note: 'per pack', price: 1000 },
      { id: 'water', label: 'Bottled water', note: 'per pack', price: 300 },
      { id: 'drink', label: 'Soft drink', note: 'per pack', price: 600 },
    ],
  },
  {
    id: 'executive-lunch-box',
    name: 'Executive Lunch Box',
    section: 'corporate',
    group: 'Lunch packs',
    price: 9500,
    unit: 'Per box · minimum 10 boxes',
    minQty: 10,
    description: 'A fuller box for client visits and board days: rice, two proteins, salad, dodo and a drink.',
    image: '',
    choices: [
      {
        id: 'main',
        label: 'Choose the main',
        options: [
          { id: 'jollof', label: 'Party jollof', price: 0 },
          { id: 'fried', label: 'Fried rice', price: 0 },
          { id: 'ofada', label: 'Ofada rice & ayamase', price: 1000 },
        ],
      },
    ],
    extras: [],
  },
  {
    id: 'small-chops-tray',
    name: 'Small Chops Tray',
    section: 'corporate',
    group: 'Meetings & events',
    price: 35000,
    unit: '50 pieces · serves about 10',
    popular: true,
    description: 'Puff-puff, samosa, spring rolls, peppered gizzard and chicken wings on one tray.',
    image: '',
    choices: [
      {
        id: 'tray',
        label: 'Tray size',
        options: [
          { id: '50', label: '50 pieces — about 10 people', price: 0 },
          { id: '100', label: '100 pieces — about 20 people', price: 32000 },
        ],
      },
    ],
    extras: [{ id: 'sauce', label: 'Extra dipping sauce', price: 1500 }],
  },
  {
    id: 'breakfast-pack',
    name: 'Meeting Breakfast Pack',
    section: 'corporate',
    group: 'Meetings & events',
    price: 4500,
    unit: 'Per pack · minimum 10 packs',
    minQty: 10,
    description: 'Akara, bread, scrambled eggs and a hot drink sachet for early meetings.',
    image: '',
    choices: [],
    extras: [{ id: 'juice', label: 'Fruit juice', note: 'per pack', price: 700 }],
  },
  {
    id: 'office-party-feast',
    name: 'Office Party Feast',
    section: 'corporate',
    group: 'Meetings & events',
    price: 180000,
    unit: 'Serves about 20',
    description: 'Two coolers of rice, a tray of proteins, dodo, salad and small chops for office celebrations.',
    image: '',
    choices: [
      {
        id: 'rice',
        label: 'Rice combination',
        options: [
          { id: 'jf', label: 'Jollof + fried rice', price: 0 },
          { id: 'jc', label: 'Jollof + coconut rice', price: 5000 },
        ],
      },
    ],
    extras: [
      { id: 'drinks', label: 'Crate of soft drinks', price: 9000 },
      { id: 'water', label: 'Pack of bottled water', price: 3500 },
    ],
  },
]

export const getItem = (id) => MENU.find((m) => m.id === id)
export const itemsIn = (section) => MENU.filter((m) => m.section === section)
export const groupsIn = (section) => [...new Set(itemsIn(section).map((m) => m.group))]
