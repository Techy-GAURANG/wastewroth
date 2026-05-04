// ── WASTE DATA ─────────────────────────────────────────
const MATERIALS = [
  { id: 1, name: 'Plastic Bottle', emoji: '🧴', color: '#3498db', bg: '#ebf5fb' },
  { id: 2, name: 'Tin Can',        emoji: '🥫', color: '#7f8c8d', bg: '#f2f3f4' },
  { id: 3, name: 'Cardboard',      emoji: '📦', color: '#d35400', bg: '#fdf2e9' },
  { id: 4, name: 'Glass Jar',      emoji: '🫙', color: '#27ae60', bg: '#eafaf1' },
  { id: 5, name: 'Fabric',         emoji: '🧵', color: '#8e44ad', bg: '#f5eef8' },
  { id: 6, name: 'Paper',          emoji: '📄', color: '#2980b9', bg: '#eaf4fd' },
  { id: 7, name: 'Rubber',         emoji: '⚫', color: '#1a252f', bg: '#f2f3f4' },
  { id: 8, name: 'Wood',           emoji: '🪵', color: '#784212', bg: '#fef9e7' },
];

const SUGGESTIONS = [
  // ── PLASTIC BOTTLE (material_id: 1) ──────────────────
  {
    id: 1, materialId: 1, title: 'Flower Pot', emoji: '🌱',
    difficulty: 'Easy', time: '30 mins',
    tools: ['Craft knife', 'Marker', 'Drill'],
    steps: [
      'Mark cut line 15cm from the base with a marker.',
      'Carefully cut the bottle in half using a craft knife.',
      'Punch 4 drainage holes in the base with a heated nail.',
      'Fill with potting mix up to 2cm below the rim.',
      'Plant your seedling and water gently.',
      'Optionally decorate the exterior with paint or twine.'
    ]
  },
  {
    id: 2, materialId: 1, title: 'Bird Feeder', emoji: '🐦',
    difficulty: 'Easy', time: '20 mins',
    tools: ['Scissors', 'Dowel rod', 'Twine'],
    steps: [
      'Cut two circular windows (5cm × 8cm) on opposite sides, 10cm from base.',
      'Push a wooden dowel through the bottle below windows as a perch.',
      'Fill the bottom 5cm with wild birdseed.',
      'Replace bottle cap securely.',
      'Tie twine around the bottle neck and hang from a tree branch.'
    ]
  },
  {
    id: 3, materialId: 1, title: 'Self-Watering Planter', emoji: '💧',
    difficulty: 'Easy', time: '15 mins',
    tools: ['Scissors', 'String or wick', 'Knife'],
    steps: [
      'Cut bottle in half. The top half will be inverted into the bottom.',
      'Remove the cap and thread a cotton wick through the neck.',
      'Fill the top half with potting soil and plant seeds.',
      'Fill the bottom half with water.',
      'Invert the top half into the bottom so the wick reaches the water.',
      'Refill water reservoir every 3-5 days.'
    ]
  },
  {
    id: 4, materialId: 1, title: 'Sprinkler Irrigator', emoji: '💦',
    difficulty: 'Easy', time: '10 mins',
    tools: ['Pin', 'Lighter'],
    steps: [
      'Heat a metal pin or needle over a lighter.',
      'Poke 8-10 holes evenly around the bottle cap and sides near the base.',
      'Fill the bottle with water and screw on the perforated cap.',
      'Bury the bottle neck-down next to your plants.',
      'Water slowly seeps out, irrigating roots directly.'
    ]
  },
  // ── TIN CAN (material_id: 2) ──────────────────────────
  {
    id: 5, materialId: 2, title: 'Pencil Holder', emoji: '✏️',
    difficulty: 'Easy', time: '25 mins',
    tools: ['Metal file', 'Glue', 'Twine or paint'],
    steps: [
      'Remove lid completely and file down any sharp edges with a metal file.',
      'Wrap exterior tightly with jute twine, securing with craft glue.',
      'Alternatively, apply chalkboard paint for a functional desk look.',
      'Add a small label or decal to personalise.',
      'Allow to dry completely before use.'
    ]
  },
  {
    id: 6, materialId: 2, title: 'Herb Planter Set', emoji: '🌿',
    difficulty: 'Easy', time: '40 mins',
    tools: ['Paint', 'Brush', 'Hammer & nail'],
    steps: [
      'Punch 3 drainage holes in the base of each can.',
      'Paint each can a different bright colour. Let dry 20 minutes.',
      'Write herb names on the cans with a paint marker.',
      'Fill with potting soil and plant herb seedlings.',
      'Arrange on a sunny windowsill.'
    ]
  },
  {
    id: 7, materialId: 2, title: 'Tin Lantern', emoji: '🕯️',
    difficulty: 'Medium', time: '60 mins',
    tools: ['Hammer', 'Nail', 'Freezer', 'Tea light'],
    steps: [
      'Fill the can with water and freeze solid overnight.',
      'Draw a star or pattern on the can with a marker.',
      'Place on a towel and hammer nail through to create the pattern holes.',
      'Allow ice to melt completely and dry.',
      'Place a tea-light candle inside and light for a beautiful effect.'
    ]
  },
  // ── CARDBOARD (material_id: 3) ──────────────────────
  {
    id: 8, materialId: 3, title: 'Desk Organiser', emoji: '🗂️',
    difficulty: 'Easy', time: '45 mins',
    tools: ['Scissors', 'PVA glue', 'Decorative paper'],
    steps: [
      'Collect 4-6 cardboard boxes of varying heights.',
      'Cut them to desired heights (pencils, scissors, phone, etc).',
      'Arrange in a pleasing grid layout and glue together.',
      'Cover with decorative wrapping paper or washi tape.',
      'Allow glue to dry for 2 hours before loading items.'
    ]
  },
  {
    id: 9, materialId: 3, title: 'Children\'s Playhouse', emoji: '🏠',
    difficulty: 'Medium', time: '90 mins',
    tools: ['Box cutter', 'Strong tape', 'Markers'],
    steps: [
      'Source a large appliance box (refrigerator or washing machine box).',
      'Cut a door opening on one side (leave the top attached as a flap).',
      'Cut 2 window openings with shutters on sides.',
      'Reinforce all corners with packing tape.',
      'Decorate exterior with paint or crayons — bricks, windows, flowers.',
      'Add curtain fabric to windows for a finishing touch.'
    ]
  },
  // ── GLASS JAR (material_id: 4) ──────────────────────
  {
    id: 10, materialId: 4, title: 'Fairy Light Lantern', emoji: '✨',
    difficulty: 'Easy', time: '15 mins',
    tools: ['LED string lights', 'Optional: twine'],
    steps: [
      'Clean the glass jar thoroughly and remove labels.',
      'Place a battery-powered LED string light inside.',
      'Route the battery pack wire through the lid hole (or leave slightly open).',
      'Arrange the lights attractively inside the jar.',
      'Place on a shelf or hang from the neck with twine.'
    ]
  },
  {
    id: 11, materialId: 4, title: 'Kitchen Storage Jar', emoji: '🫙',
    difficulty: 'Easy', time: '20 mins',
    tools: ['Chalkboard paint', 'Brush', 'Chalk'],
    steps: [
      'Remove existing label and wash jar with warm soapy water.',
      'Apply 2 coats of chalkboard paint to a rectangular area.',
      'Let paint cure for 24 hours.',
      'Write contents label in chalk.',
      'Fill with pasta, spices, coffee, or other dry goods.'
    ]
  },
  // ── FABRIC (material_id: 5) ──────────────────────────
  {
    id: 12, materialId: 5, title: 'Tote Bag from T-Shirt', emoji: '👜',
    difficulty: 'Easy', time: '30 mins',
    tools: ['Scissors', 'Chalk or marker'],
    steps: [
      'Lay the T-shirt flat and cut off both sleeves to create handles.',
      'Cut a deeper U-shape at the neck to widen the bag opening.',
      'Turn the shirt inside out.',
      'Cut fringe strips along the bottom edge (about 5cm deep, 1cm wide).',
      'Tie each pair of front/back fringe strips together to seal the bottom.',
      'Turn right side out — your tote bag is ready!'
    ]
  },
  {
    id: 13, materialId: 5, title: 'Patchwork Cushion Cover', emoji: '🛋️',
    difficulty: 'Medium', time: '120 mins',
    tools: ['Scissors', 'Needle', 'Thread', 'Ruler'],
    steps: [
      'Cut fabric scraps into uniform 10cm squares.',
      'Arrange squares in a pleasing colour pattern.',
      'Sew squares together in rows with 1cm seam allowance.',
      'Sew rows together to form front panel.',
      'Cut matching back panel; sew front and back together, leaving one side open.',
      'Insert cushion pad and slip-stitch the opening closed.'
    ]
  },
  // ── PAPER (material_id: 6) ──────────────────────────
  {
    id: 14, materialId: 6, title: 'Papier-Mâché Bowl', emoji: '🥣',
    difficulty: 'Medium', time: '120 mins + drying',
    tools: ['Flour', 'Water', 'Balloon', 'Paint', 'Brush'],
    steps: [
      'Tear newspaper into 2cm wide strips.',
      'Mix flour and water in 1:2 ratio to form paste.',
      'Inflate a balloon to desired bowl size.',
      'Dip strips in paste and layer over the top half of balloon.',
      'Apply 5-6 layers, letting each dry slightly before next layer.',
      'Leave to dry completely for 24-48 hours.',
      'Pop and remove balloon. Trim the edges neatly.',
      'Paint inside and out with your choice of colours. Add varnish to seal.'
    ]
  },
  // ── RUBBER (material_id: 7) ──────────────────────────
  {
    id: 15, materialId: 7, title: 'Garden Hose Gaskets', emoji: '🔧',
    difficulty: 'Easy', time: '10 mins',
    tools: ['Craft knife', 'Ruler'],
    steps: [
      'Clean the rubber tubing and measure the inner diameter of your hose coupling.',
      'Cut rubber into rings of 3-4mm thickness.',
      'Trim ring to fit snugly inside the coupling.',
      'Press into place to create a water-tight seal.',
      'Test connection — replace if still leaking.'
    ]
  },
  // ── WOOD (material_id: 8) ───────────────────────────
  {
    id: 16, materialId: 8, title: 'Pallet Coffee Table', emoji: '🪑',
    difficulty: 'Medium', time: '180 mins',
    tools: ['Sandpaper', 'Wood stain', 'Brush', 'Castor wheels', 'Screwdriver'],
    steps: [
      'Choose a clean, sturdy wooden pallet with no rot.',
      'Sand all surfaces thoroughly — start with 80-grit, finish with 220-grit.',
      'Apply wood stain or paint evenly with a brush. Let dry 4 hours.',
      'Apply a second coat. Let dry overnight.',
      'Attach 4 castor wheels to the base corners with screws.',
      'Seal with clear varnish for durability.',
      'Optionally add a glass topper for a polished look.'
    ]
  },
  {
    id: 17, materialId: 8, title: 'Herb Garden Box', emoji: '🌿',
    difficulty: 'Easy', time: '60 mins',
    tools: ['Sandpaper', 'Drill', 'Paint or stain'],
    steps: [
      'Select a wooden plank or pallet section about 60cm long.',
      'Sand all edges smooth to prevent splinters.',
      'Drill 4-6 drainage holes in the bottom.',
      'Apply non-toxic paint or linseed oil finish.',
      'Line inside with landscape fabric to retain soil.',
      'Fill with potting mix and plant your herbs.',
      'Hang on a fence or balcony railing using hooks.'
    ]
  }
];

function getMaterial(materialId) {
  return MATERIALS.find(m => m.id === materialId);
}

function getSuggestionsByMaterial(materialId) {
  return SUGGESTIONS.filter(s => s.materialId === materialId);
}

function getSuggestionById(id) {
  return SUGGESTIONS.find(s => s.id === id);
}

function getAllSuggestions() { return SUGGESTIONS; }
function getAllMaterials() { return MATERIALS; }

// Simulate AI classification with realistic-looking confidence scores
function mockClassify(imageDataUrl) {
  const materials = MATERIALS.map(m => m.name);
  const idx = Math.floor(Math.random() * materials.length);
  const confidence = 0.72 + Math.random() * 0.25; // 72-97%
  return { material: materials[idx], materialId: MATERIALS[idx].id, confidence };
}
