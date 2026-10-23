(function(){
  "use strict";

  /* ---------- data ---------- */
  var FLOWERS = [
    { id: 1, name: "White Roses", price: 18, petals: 8, color: "#F3EEE8", image: "https://i.pinimg.com/736x/6f/25/f1/6f25f1c0f0bbbe2adc7799d98e041999.jpg", tag: "Bestseller", desc: "Full, ruffled ivory-white blooms with softly blushed centers — a graceful classic, sold by the bunch of six stems.", stock: "24 bunches available", weather: ["sunny", "cloudy"] },
    { id: 2, name: "Tulip", price: 12, petals: 6, color: "#C9707A", image: "https://i.pinimg.com/1200x/41/45/e6/4145e6c389cc523103a48d2b2302ff21.jpg", tag: "Seasonal", desc: "Clean, cup-shaped blooms just opening, prized for their simple, elegant silhouette.", stock: "40 bunches available", weather: ["sunny", "cloudy"] },
    { id: 3, name: "Sunflower", price: 9, petals: 14, color: "#D9A441", image: "https://i.pinimg.com/736x/88/80/c8/8880c8dca83b7b140822e54e155d3997.jpg", tag: "Cheerful", desc: "Bold, sun-facing blooms with a deep centre — an instant lift for any room.", stock: "30 bunches available", weather: ["sunny"] },
    { id: 4, name: "Peony", price: 22, petals: 10, color: "#E3AEB4", image: "https://i.pinimg.com/1200x/f6/0b/87/f60b875e1e608848192bbb5df823c1ed.jpg", tag: "Limited", desc: "Lush, layered petals with a soft scent — a favourite for spring arrangements.", stock: "12 bunches available", weather: ["cloudy", "rainy"] },
    { id: 5, name: "Orchid", price: 28, petals: 5, color: "#9C6FA8", image: "https://i.pinimg.com/736x/a3/fe/78/a3fe781878e192addbde413f7c3b5bd2.jpg", tag: "Exotic", desc: "Elegant, long-lasting blooms with a sculptural, architectural form.", stock: "15 pots available", weather: ["cloudy", "rainy"] },
    { id: 6, name: "Lily", price: 16, petals: 6, color: "#F2F0E4", image: "https://i.pinimg.com/736x/c8/c5/bb/c8c5bbbd0ebf0eb4a55efc426b3d7af9.jpg", tag: "Fragrant", desc: "Trumpet-shaped blooms with a heady scent — striking in tall arrangements.", stock: "20 bunches available", weather: ["rainy"] },
    { id: 7, name: "Red Roses", price: 32, petals: 8, color: "#A93342", image: "https://i.pinimg.com/1200x/18/08/d9/1808d9bfc9c02363db24b31c7e85932c.jpg", tag: "Romantic", desc: "A hand-tied dozen of velvety red roses, chosen for their rich color and lasting impression.", stock: "18 bunches available", weather: ["sunny", "cloudy"] },
    { id: 8, name: "Carnation", price: 14, petals: 12, color: "#D77A86", image: "https://i.pinimg.com/736x/0f/e2/b7/0fe2b7ef1ca49707e629e909fc7994e5.jpg", tag: "Long-lasting", desc: "Softly ruffled stems with a gentle, clove-like scent and a long vase life.", stock: "26 bunches available", weather: ["cloudy", "rainy"] },
    { id: 9, name: "Chrysanthemum", price: 18, petals: 16, color: "#E3AEB4", image: "https://i.pinimg.com/736x/bf/96/ce/bf96ceb78977bc51902ec7b6c5a66b0d.jpg", tag: "Full-bloom", desc: "A generous spray of layered blooms that brings lasting color to any arrangement.", stock: "22 bunches available", weather: ["cloudy", "rainy"] },
    { id: 10, name: "Gladiolus", price: 20, petals: 6, color: "#D77988", image: "https://gardenerspath.com/wp-content/uploads/2024/07/Gladiolus-Wont-Bloom-Feature.jpg", tag: "Statement", desc: "Tall, elegant flower spikes that add graceful height and color to a bouquet.", stock: "14 bunches available", weather: ["sunny"] }
  ];
  var WRAPPING_DESIGNS = [
    { id: "pink-elegance", name: "Pink Elegance", color: "Blush pink", price: 75, detail: "Premium pink matte wrapping paper with satin ribbon.", image: "https://i.pinimg.com/1200x/10/3a/b7/103ab76c85c18521d5ba2addbd7689af.jpg" },
    { id: "classic-kraft", name: "Classic Kraft", color: "Natural brown", price: 50, detail: "Eco-friendly brown kraft paper with natural jute twine.", image: "https://i.pinimg.com/originals/a4/83/86/a48386d024d02f316231bb5b8635798f.png" },
    { id: "midnight-luxury", name: "Midnight Luxury", color: "Midnight navy", price: 80, detail: "Dark navy blue waterproof wrapping with gold ribbon accents.", image: "https://i.pinimg.com/736x/75/91/1e/75911ef1eea4d5bae6547dfc00504a82.jpg" },
    { id: "minimalist-white", name: "Minimalist White", color: "Clean white", price: 45, detail: "Clean white tissue paper with pastel ribbon.", image: "https://i.pinimg.com/736x/23/e6/57/23e657e50be60d5c493b63c62614aa92.jpg" }
  ];
  var STEP_LABELS = ["Browse", "Cart", "Account", "Fulfillment", "Payment", "Confirmed"];
  var DEMO_PASSWORD = "petalhub";

  /* ---------- state ---------- */
  var state = {
    screen: "home",
    weather: null,
    detailId: null,
    qty: 1,
    arrangementType: "single",
    wrapChoice: "none",
    wrapDesign: WRAPPING_DESIGNS[0].id,
    customFlowers: {},
    customWrapColor: "",
    customWrapNotes: "",
    cart: [],
    authenticated: false,
    userName: "",
    registerError: "",
    loginError: "",
    fulfillment: null,
    address: { street: "", city: "", zip: "" },
    payment: null,
    orderCode: null
  };

  function go(screen){ state.screen = screen; window.scrollTo(0,0); render(); }

  function cartCount(){
    return state.cart.reduce(function(s, l){ return s + l.qty; }, 0);
  }
  function itemsSubtotal(){
    return state.cart.reduce(function(s, l){
      return s + flowerSubtotal(l);
    }, 0);
  }
  function wrappingSubtotal(){
    return state.cart.reduce(function(s, l){
      var option = WRAPPING_DESIGNS.filter(function(x){ return x.id === l.wrapDesign; })[0];
      return s + (l.wrapChoice === "wrapped" && option ? option.price * l.qty : 0);
    }, 0);
  }
  function cartTotal(){ return itemsSubtotal() + wrappingSubtotal(); }
  function flowerSubtotal(line){
    if (line.arrangementType === "custom"){
      return line.flowers.reduce(function(total, item){
        var flower = FLOWERS.filter(function(x){ return x.id === item.id; })[0];
        return total + (flower ? flower.price * item.qty : 0);
      }, 0) * line.qty;
    }
    var flower = FLOWERS.filter(function(x){ return x.id === line.id; })[0];
    return flower ? flower.price * line.qty : 0;
  }
  function lineTotal(line){
    var option = WRAPPING_DESIGNS.filter(function(x){ return x.id === line.wrapDesign; })[0];
    return flowerSubtotal(line) + (line.wrapChoice === "wrapped" && option ? option.price * line.qty : 0);
  }
  function customFlowerSubtotal(){
    return FLOWERS.reduce(function(total, flower){
      return total + flower.price * (state.customFlowers[flower.id] || 0);
    }, 0);
  }
  function customFlowerList(flowers, multiplier){
    return flowers.map(function(item){
      var flower = FLOWERS.filter(function(x){ return x.id === item.id; })[0];
      return flower ? '<span class="custom-flower-item">' + esc(flower.name) + ' ×' + (item.qty * multiplier) + '</span>' : "";
    }).join("");
  }
  function customWrapNotes(line){
    var notes = [];
    if (line.wrapColor) notes.push("Requested color: " + esc(line.wrapColor));
    if (line.wrapNotes) notes.push("Notes: " + esc(line.wrapNotes));
    return notes.length ? '<small>' + notes.join(" · ") + '</small>' : "";
  }
  function wrappingColor(option){
    return '<small class="wrap-design-color">Color: ' + esc(option.color) + '</small>';
  }
  function detailTotal(f){
    var wrap = WRAPPING_DESIGNS.filter(function(x){ return x.id === state.wrapDesign; })[0];
    return f.price + (state.arrangementType === "bouquet" && state.wrapChoice === "wrapped" && wrap ? wrap.price : 0);
  }
  function money(n){ return "₱" + n.toFixed(2); }
  function wrappingImage(option, className){
    return '<img class="' + className + '" src="' + esc(option.image) + '" alt="' + esc(option.name) + ' wrapping preview" loading="lazy">';
  }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }

  /* ---------- icons ---------- */
  function petalFlower(color, petals){
    var cx = 60, cy = 60, r = 40, s = "";
    for (var i = 0; i < petals; i++){
      var angle = i * (360 / petals);
      s += '<ellipse cx="' + cx + '" cy="' + (cy - r*0.56) + '" rx="' + (r*0.30) + '" ry="' + (r*0.60) +
           '" fill="' + color + '" opacity="0.92" transform="rotate(' + angle + ' ' + cx + ' ' + cy + ')"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r*0.25) + '" fill="var(--gold)"/>';
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  }
  function iconCart(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M2.5 3h2l2.2 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6"/></svg>';
  }
  function iconBack(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  }
  function iconStore(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/><path d="M9 20v-6h6v6"/></svg>';
  }
  function iconTruck(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="7" width="13" height="9"/><path d="M14.5 10h4l3.5 3.5V16h-7.5z"/><circle cx="6" cy="18.5" r="1.6"/><circle cx="17.5" cy="18.5" r="1.6"/></svg>';
  }
  function iconCard(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>';
  }
  function iconWallet(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-4a2.5 2.5 0 0 1 0-5h4"/></svg>';
  }
  function iconCash(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="1.5"/><circle cx="12" cy="12" r="3"/></svg>';
  }
  function iconCheck(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="var(--sage)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="rgba(124,152,133,0.12)"/><path d="M8 12.5l2.6 2.6L16 9.5"/></svg>';
  }
  function iconEmptyCart(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none"/><path d="M2.5 3h2l2.2 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6"/></svg>';
  }
  function flowerVisual(f, className){
    if (!f.image) return petalFlower(f.color, f.petals);
    return '<img class="' + className + '" src="' + esc(f.image) + '" alt="' + esc(f.name) + '" loading="lazy">';
  }
  function brandMark(){
    return '<svg class="brand-mark" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<g>' + petalFlowerMini() + '</g></svg>';
  }
  function petalFlowerMini(){
    var cx=12, cy=12, r=8.4, s="";
    for (var i=0;i<6;i++){
      var a = i*60;
      s += '<ellipse cx="'+cx+'" cy="'+(cy-r*0.55)+'" rx="'+(r*0.30)+'" ry="'+(r*0.58)+'" fill="var(--rose-deep)" transform="rotate('+a+' '+cx+' '+cy+')"/>';
    }
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.24)+'" fill="var(--gold)"/>';
    return s;
  }

  /* ---------- chrome ---------- */
  function stepIndexFor(screen){
    switch(screen){
      case "home": return 0;
      case "detail": return 0;
      case "cart": return 1;
      case "authGate": case "register": case "login": return 2;
      case "fulfillment": case "delivery": return 3;
      case "payment": return 4;
      case "confirm": case "done": return 5;
      default: return 0;
    }
  }
  function renderSteps(){
    var current = stepIndexFor(state.screen);
    var html = '<div class="steps">';
    STEP_LABELS.forEach(function(label, i){
      var cls = "step" + (i === current ? " active" : (i < current ? " done" : ""));
      html += '<div class="' + cls + '"><div class="step-bar"></div><div class="step-label">' + esc(label) + '</div></div>';
    });
    html += '</div>';
    return html;
  }
  function renderTopbar(){
    var count = cartCount();
    var cartClickable = count > 0;
    return '' +
      '<div class="topbar">' +
        '<div class="topbar-inner">' +
          '<button class="brand" onclick="App.go(\'home\')">' + brandMark() + 'PetalHub</button>' +
          (state.authenticated ? '<div class="user-session"><span class="user-name">' + esc(state.userName) + '</span><button class="logout-btn" onclick="App.logout()">Log out</button></div>' : '') +
          '<button class="cart-pill" aria-label="Cart" ' + (cartClickable ? 'onclick="App.openCart()"' : 'style="opacity:.55;cursor:default"') + '>' +
            iconCart() + '<span>Cart</span><span class="cart-count">' + count + '</span>' +
          '</button>' +
        '</div>' +
        (state.screen === "home" ? "" : renderSteps()) +
      '</div>';
  }

  /* ---------- screens ---------- */
  function renderFlowerCard(f){
      return '' +
        '<button class="flower-card" onclick="App.openDetail(' + f.id + ')">' +
          '<span class="flower-tag">' + esc(f.tag) + '</span>' +
          '<div class="flower-icon-wrap">' + flowerVisual(f, "flower-card-image") + '</div>' +
          '<div class="flower-name display">' + esc(f.name) + '</div>' +
          '<div class="flower-price">' + money(f.price) + ' / bunch</div>' +
        '</button>';
  }

  function screenHome(){
    var cards = FLOWERS.map(renderFlowerCard).join("");
    var weatherOptions = [
      { id: "sunny", label: "Sunny", icon: "☀" },
      { id: "cloudy", label: "Cloudy", icon: "☁" },
      { id: "rainy", label: "Rainy", icon: "☂" }
    ];
    var weatherButtons = weatherOptions.map(function(option){
      var selected = state.weather === option.id;
      return '<button class="weather-option' + (selected ? ' selected' : '') + '" aria-pressed="' + selected + '" onclick="App.selectWeather(\'' + option.id + '\')"><span aria-hidden="true">' + option.icon + '</span>' + option.label + '</button>';
    }).join("");
    var suggestions = state.weather ? FLOWERS.filter(function(f){ return f.weather.indexOf(state.weather) !== -1; }) : [];
    var suggestionHtml = state.weather ?
      '<div class="weather-results"><h3>' + state.weather.charAt(0).toUpperCase() + state.weather.slice(1) + ' day picks</h3><div class="weather-grid">' + suggestions.map(renderFlowerCard).join("") + '</div></div>' :
      '<p class="weather-prompt">Choose a forecast to see flowers picked for the day.</p>';
    return '' +
      '<div class="hero">' +
        '<div><h1>Fresh stems, chosen and sent with care.</h1><p>Browse this week’s cuts from the PetalHub growers’ room, add what catches your eye, and we’ll get it to you — by pickup or delivery.</p></div>' +
        petalFlower("var(--rose)", 8).replace("<svg ", '<svg class="hero-mark" ') +
      '</div>' +
      '<section class="weather-guide" aria-labelledby="weather-title"><div class="weather-heading"><div><span class="eyebrow">A little help from the forecast</span><h2 id="weather-title">Flowers for the weather</h2></div><div class="weather-options" role="group" aria-label="Choose weather">' + weatherButtons + '</div></div>' + suggestionHtml + '</section>' +
      '<section class="flower-collection"><div class="collection-heading"><h2>Fresh from the growers</h2><span>' + FLOWERS.length + ' varieties</span></div><div class="grid">' + cards + '</div></section>';
  }

  function screenDetail(){
    var f = FLOWERS.filter(function(x){ return x.id === state.detailId; })[0];
    if (!f) { go("home"); return ""; }
    var designs = WRAPPING_DESIGNS.map(function(option){
      var selected = state.wrapDesign === option.id;
      return '<button type="button" class="wrap-style' + (selected ? ' selected' : '') + '" aria-pressed="' + selected + '" onclick="App.chooseWrapDesign(\'' + option.id + '\')">' +
        wrappingImage(option, "wrap-style-image") + '<span class="wrap-style-name">' + esc(option.name) + '</span><span class="wrap-style-price">+' + money(option.price) + '</span>' + wrappingColor(option) + '<span class="wrap-style-detail">' + esc(option.detail) + '</span></button>';
    }).join("");
    var isReadyBouquet = state.arrangementType === "bouquet";
    var isCustomBouquet = state.arrangementType === "custom";
    var selectedStemCount = FLOWERS.reduce(function(total, flower){
      return total + (state.customFlowers[flower.id] || 0);
    }, 0);
    var customFlowerRows = FLOWERS.map(function(flower){
      var qty = state.customFlowers[flower.id] || 0;
      return '<div class="builder-flower-row">' +
        '<div class="builder-flower-info"><strong>' + esc(flower.name) + '</strong><small>' + money(flower.price) + ' each</small></div>' +
        '<div class="builder-qty"><button type="button" class="qty-btn" aria-label="Remove one ' + esc(flower.name) + '" onclick="App.changeCustomFlower(' + flower.id + ',-1)">−</button><span class="qty-val">' + qty + '</span><button type="button" class="qty-btn" aria-label="Add one ' + esc(flower.name) + '" onclick="App.changeCustomFlower(' + flower.id + ',1)">+</button></div>' +
        '<strong class="builder-line-total">' + money(flower.price * qty) + '</strong>' +
      '</div>';
    }).join("");
    return '' +
      '<button class="back-link" onclick="App.go(\'home\')">' + iconBack() + 'Back to browsing</button>' +
      '<div class="detail">' +
        '<div class="detail-visual">' + flowerVisual(f, "flower-detail-image") + '</div>' +
        '<div class="detail-body">' +
          '<span class="flower-tag">' + esc(f.tag) + '</span>' +
          '<h2 style="margin-top:10px;">' + esc(f.name) + '</h2>' +
          '<div class="detail-price">' + money(f.price) + ' base price per bunch</div>' +
          '<p class="detail-desc">' + esc(f.desc) + '</p>' +
          '<div class="detail-stock"><span class="stock-badge">In Stock</span><span>' + esc(f.stock) + '</span></div>' +
          '<section class="product-options" aria-label="Customize your order">' +
            '<fieldset class="option-group"><legend>1. Purchase type</legend>' +
              '<div class="option-choice-row arrangement-choice-row">' +
                '<button type="button" class="option-choice' + (state.arrangementType === "single" ? ' selected' : '') + '" aria-pressed="' + (state.arrangementType === "single") + '" onclick="App.chooseArrangement(\'single\')"><span class="option-choice-title">Single Flower</span><span class="option-choice-detail">Individual stems, unwrapped</span></button>' +
                '<button type="button" class="option-choice' + (isReadyBouquet ? ' selected' : '') + '" aria-pressed="' + isReadyBouquet + '" onclick="App.chooseArrangement(\'bouquet\')"><span class="option-choice-title">Ready-Made Bouquet</span><span class="option-choice-detail">This flower arranged as a bouquet</span></button>' +
                '<button type="button" class="option-choice' + (isCustomBouquet ? ' selected' : '') + '" aria-pressed="' + isCustomBouquet + '" onclick="App.chooseArrangement(\'custom\')"><span class="option-choice-title">Custom Bouquet</span><span class="option-choice-detail">Build your bouquet from any flowers</span></button>' +
              '</div>' +
            '</fieldset>' +
            (isCustomBouquet ?
              '<section class="custom-builder" aria-labelledby="custom-builder-title">' +
                '<h3 id="custom-builder-title">2. Build your bouquet</h3>' +
                '<p class="builder-hint">Choose the flowers and quantities for your arrangement.</p>' +
                '<div class="builder-flower-list">' + customFlowerRows + '</div>' +
                '<div class="builder-subtotal"><span>Flowers (' + selectedStemCount + ' stems)</span><strong>' + money(customFlowerSubtotal()) + '</strong></div>' +
              '</section>' : '') +
            (isReadyBouquet || (isCustomBouquet && selectedStemCount > 0) ?
              '<fieldset class="option-group"><legend>2. Wrapping preference</legend>' +
                '<div class="option-choice-row">' +
                  '<button type="button" class="option-choice' + (state.wrapChoice === "wrapped" ? ' selected' : '') + '" aria-pressed="' + (state.wrapChoice === "wrapped") + '" onclick="App.chooseWrapType(\'wrapped\')"><span class="option-choice-title">With Wrapping</span><span class="option-choice-detail">Choose a wrapping design</span></button>' +
                  '<button type="button" class="option-choice' + (state.wrapChoice === "none" ? ' selected' : '') + '" aria-pressed="' + (state.wrapChoice === "none") + '" onclick="App.chooseWrapType(\'none\')"><span class="option-choice-title">Without Wrapping</span><span class="option-choice-detail">No additional charge</span></button>' +
                '</div>' +
              '</fieldset>' : '') +
            ((isReadyBouquet || isCustomBouquet) && state.wrapChoice === "wrapped" && (!isCustomBouquet || selectedStemCount > 0) ?
              '<fieldset class="option-group"><legend>3. Wrapping design</legend><div class="wrap-styles" role="group" aria-label="Wrapping designs">' + designs + '</div>' +
                (isCustomBouquet ? '<div class="custom-wrap-fields"><div class="field"><label for="custom-wrap-color">Wrapping color preference</label><input id="custom-wrap-color" type="text" value="' + esc(state.customWrapColor) + '" placeholder="e.g. soft blush pink" onchange="App.updateCustomWrap(\'color\',this.value)"></div><div class="field"><label for="custom-wrap-notes">Material or wrapping notes</label><textarea id="custom-wrap-notes" rows="2" placeholder="Any special material or finishing requests" onchange="App.updateCustomWrap(\'notes\',this.value)">' + esc(state.customWrapNotes) + '</textarea></div></div>' : '') +
              '</fieldset>' : '') +
          '</section>' +
          (!isCustomBouquet ? '<div class="qty-row">' +
            '<button class="qty-btn" onclick="App.changeQty(-1)" aria-label="Decrease quantity">−</button>' +
            '<span class="qty-val">' + state.qty + '</span>' +
            '<button class="qty-btn" onclick="App.changeQty(1)" aria-label="Increase quantity">+</button>' +
          '</div>' : '') +
          '<div class="detail-total"><span>' + (isCustomBouquet ? 'Custom bouquet total' : 'Total for ' + state.qty) + '</span><strong>' + money((isCustomBouquet ? customFlowerSubtotal() + (state.wrapChoice === "wrapped" ? (WRAPPING_DESIGNS.filter(function(x){ return x.id === state.wrapDesign; })[0] || { price: 0 }).price : 0) : detailTotal(f) * state.qty)) + '</strong></div>' +
          '<button class="btn" ' + (isCustomBouquet && selectedStemCount === 0 ? 'disabled' : '') + ' onclick="' + (isCustomBouquet ? 'App.addCustomBouquet()' : 'App.addToCart(' + f.id + ')') + '">' + (isCustomBouquet ? 'Add custom bouquet to cart' : 'Add ' + state.qty + ' to cart — ' + money(detailTotal(f) * state.qty)) + '</button>' +
        '</div>' +
      '</div>';
  }

  function screenAuthGate(){
    return '' +
      '<div class="panel" style="max-width:460px;margin:0 auto;">' +
        '<h2>Have a PetalHub account?</h2>' +
        '<p class="sub">Sign in or create an account so we can confirm your order and track delivery.</p>' +
        '<div class="choice-row" style="margin-top:6px;">' +
          '<button class="tap-card" onclick="App.go(\'login\')"><span class="t">Yes, log in</span><span class="d">I already have an account</span></button>' +
          '<button class="tap-card" onclick="App.go(\'register\')"><span class="t">No, register</span><span class="d">Set up a new account</span></button>' +
        '</div>' +
      '</div>';
  }

  function screenRegister(){
    return '' +
      '<div class="panel" style="max-width:460px;margin:0 auto;">' +
        '<h2>Register a new account</h2>' +
        '<p class="sub">Takes under a minute — this stays on your device for this demo.</p>' +
        (state.registerError ? '<div class="error-box" style="margin-bottom:14px;">' + esc(state.registerError) + '</div>' : '') +
        '<form class="stack" onsubmit="return App.submitRegister(event)">' +
          '<div class="field"><label for="reg-name">Full name</label><input id="reg-name" type="text" placeholder="Jamie Flores" autocomplete="name"></div>' +
          '<div class="field"><label for="reg-email">Email address</label><input id="reg-email" type="email" placeholder="jamie@email.com" autocomplete="email"></div>' +
          '<div class="row2">' +
            '<div class="field"><label for="reg-pass">Password</label><input id="reg-pass" type="password" placeholder="At least 6 characters" autocomplete="new-password"></div>' +
            '<div class="field"><label for="reg-pass2">Confirm password</label><input id="reg-pass2" type="password" placeholder="Repeat password" autocomplete="new-password"></div>' +
          '</div>' +
          '<button class="btn block" type="submit">Create account</button>' +
        '</form>' +
        '<div class="switch-mode">Already registered? <button onclick="App.go(\'login\')">Log in instead</button></div>' +
      '</div>';
  }

  function screenLogin(){
    return '' +
      '<div class="panel" style="max-width:460px;margin:0 auto;">' +
        '<h2>Log in</h2>' +
        '<p class="sub">Demo password is <strong>' + DEMO_PASSWORD + '</strong> — try a wrong one first to see what happens.</p>' +
        (state.loginError ? '<div class="error-box" style="margin-bottom:14px;">' + esc(state.loginError) + '</div>' : '') +
        '<form class="stack" onsubmit="return App.submitLogin(event)">' +
          '<div class="field"><label for="log-email">Email address</label><input id="log-email" type="email" placeholder="jamie@email.com" autocomplete="email"></div>' +
          '<div class="field"><label for="log-pass">Password</label><input id="log-pass" type="password" placeholder="Enter your password" autocomplete="current-password"></div>' +
          '<button class="btn block" type="submit">Log in</button>' +
        '</form>' +
        '<div class="switch-mode">New here? <button onclick="App.go(\'register\')">Register an account</button></div>' +
      '</div>';
  }

  function screenCart(){
    if (state.cart.length === 0){
      return '<div class="empty-state">' + iconEmptyCart() + '<div>Your cart is empty.</div>' +
        '<div style="margin-top:18px;"><button class="btn" onclick="App.go(\'home\')">Browse flowers</button></div></div>';
    }
    var lines = state.cart.map(function(l, index){
      var f = FLOWERS.filter(function(x){ return x.id === l.id; })[0];
      var wrap = WRAPPING_DESIGNS.filter(function(x){ return x.id === l.wrapDesign; })[0];
      var iconFlower = f || FLOWERS.filter(function(x){ return l.flowers && l.flowers.some(function(item){ return item.id === x.id; }); })[0];
      var lineName = l.arrangementType === "custom" ? "Custom Bouquet" : (f ? f.name : "Flower");
      var arrangement = l.arrangementType === "custom" ? "Custom Bouquet" : (l.arrangementType === "bouquet" ? "Ready-Made Bouquet" : "Single Flower");
      var wrapDetails = l.wrapChoice === "wrapped" && wrap ?
        '<div class="cart-line-wrap">' + wrappingImage(wrap, "cart-wrap-image") + '<span><strong>' + esc(wrap.name) + '</strong>' + wrappingColor(wrap) + '<small>' + esc(wrap.detail) + '</small><small>+' + money(wrap.price) + ' / bouquet</small>' + (l.arrangementType === "custom" ? customWrapNotes(l) : '') + '</span></div>' :
        (l.arrangementType !== "single" ? '<div class="cart-line-wrap">Without wrapping</div>' : '');
      return '' +
        '<div class="cart-line">' +
          '<div class="cart-line-icon">' + (iconFlower ? flowerVisual(iconFlower, "flower-cart-image") : '') + '</div>' +
          '<div class="cart-line-info"><div class="cart-line-name">' + esc(lineName) + '</div><div class="cart-line-sub">' + esc(arrangement) + ' · ' + (l.arrangementType === "custom" ? 'Flower subtotal ' + money(flowerSubtotal(l) / l.qty) + ' / bouquet' : money(f ? f.price : 0) + ' base / bunch') + '</div>' +
            (l.arrangementType === "custom" ? '<div class="custom-flower-list">' + customFlowerList(l.flowers, l.qty) + '</div>' : '') +
            wrapDetails +
          '</div>' +
          '<div class="cart-line-controls">' +
            '<button class="qty-btn" onclick="App.lineQty(' + index + ',-1)" aria-label="Decrease">−</button>' +
            '<span class="qty-val">' + l.qty + '</span>' +
            '<button class="qty-btn" onclick="App.lineQty(' + index + ',1)" aria-label="Increase">+</button>' +
          '</div>' +
          '<div class="cart-line-total">' + money(lineTotal(l)) + '</div>' +
        '</div>';
    }).join("");
    return '' +
      '<div class="panel">' +
        '<h2>Your cart</h2>' +
        '<p class="sub">' + (state.authenticated ? "Signed in as " + esc(state.userName) : "Review your stems before checkout") + '</p>' +
        lines +
        '<div class="summary-row"><span>Flowers</span><span>' + money(itemsSubtotal()) + '</span></div>' +
        '<div class="summary-row"><span>Wrapping</span><span>' + money(wrappingSubtotal()) + '</span></div>' +
        '<div class="summary-row total"><span>Total</span><span>' + money(cartTotal()) + '</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;">' +
        '<button class="btn secondary" onclick="App.go(\'home\')">Continue shopping</button>' +
        '<button class="btn" onclick="App.go(\'fulfillment\')">Proceed to checkout</button>' +
      '</div>';
  }

  function renderCheckoutSummary(){
    var lines = state.cart.map(function(l){
      var f = FLOWERS.filter(function(x){ return x.id === l.id; })[0];
      var wrap = WRAPPING_DESIGNS.filter(function(x){ return x.id === l.wrapDesign; })[0];
      var lineName = l.arrangementType === "custom" ? "Custom Bouquet" : (f ? f.name : "Flower");
      var arrangement = l.arrangementType === "custom" ? "Custom Bouquet" : (l.arrangementType === "bouquet" ? "Ready-Made Bouquet" : "Single Flower");
      var wrapLabel = l.arrangementType !== "single" ?
        (l.wrapChoice === "wrapped" && wrap ? wrap.name : "Without wrapping") : "";
      return '<div class="checkout-item"><span class="checkout-item-info"><strong>' + esc(lineName) + ' ×' + l.qty + '</strong><small>' + esc(arrangement) + '</small>' +
        (l.arrangementType === "custom" ? '<span class="custom-flower-list">' + customFlowerList(l.flowers, l.qty) + '</span>' : '') +
        (l.wrapChoice === "wrapped" && wrap ? '<span class="checkout-wrap">' + wrappingImage(wrap, "checkout-wrap-image") + '<span><strong>' + esc(wrap.name) + '</strong>' + wrappingColor(wrap) + '<small>' + esc(wrap.detail) + '</small>' + (l.arrangementType === "custom" ? customWrapNotes(l) : '') + '</span></span>' : (wrapLabel ? '<small>' + esc(wrapLabel) + '</small>' : '')) +
        '</span><span>' + money(lineTotal(l)) + '</span></div>';
    }).join("");
    return '<div class="panel checkout-summary"><h2>Order summary</h2>' + lines +
      '<div class="summary-row"><span>Flowers</span><span>' + money(itemsSubtotal()) + '</span></div>' +
      '<div class="summary-row"><span>Wrapping</span><span>' + money(wrappingSubtotal()) + '</span></div>' +
      '<div class="summary-row total"><span>Total</span><span>' + money(cartTotal()) + '</span></div></div>';
  }

  function screenFulfillment(){
    return '' +
      '<div class="panel" style="max-width:520px;margin:0 auto;">' +
        '<h2>Pickup or delivery?</h2>' +
        '<p class="sub">Choose how you’d like to receive your order.</p>' +
        '<div class="choice-row">' +
          '<button class="tap-card" onclick="App.choosePickup()">' + iconStore() + '<span class="t">Pick up at store</span><span class="d">Ready in 2 hours, Ilocos Sur branch</span></button>' +
          '<button class="tap-card" onclick="App.go(\'delivery\')">' + iconTruck() + '<span class="t">Delivery</span><span class="d">Same-day, about 2–4 hours</span></button>' +
        '</div>' +
      '</div>' + renderCheckoutSummary();
  }

  function screenDelivery(){
    var a = state.address;
    return '' +
      '<div class="panel" style="max-width:520px;margin:0 auto;">' +
        '<button class="back-link" onclick="App.go(\'fulfillment\')">' + iconBack() + 'Change fulfillment</button>' +
        '<h2>Delivery address</h2>' +
        '<p class="sub">Where should we send your flowers?</p>' +
        '<form class="stack" onsubmit="return App.submitDelivery(event)">' +
          '<div class="field"><label for="d-street">Street address</label><input id="d-street" type="text" value="' + esc(a.street) + '" placeholder="123 Rizal Street"></div>' +
          '<div class="row2">' +
            '<div class="field"><label for="d-city">City / town</label><input id="d-city" type="text" value="' + esc(a.city) + '" placeholder="Caoayan"></div>' +
            '<div class="field"><label for="d-zip">ZIP / postal code</label><input id="d-zip" type="text" value="' + esc(a.zip) + '" placeholder="2703"></div>' +
          '</div>' +
          '<button class="btn block" type="submit">Continue to payment</button>' +
        '</form>' +
      '</div>' + renderCheckoutSummary();
  }

  function screenPayment(){
    var opts = [
      { id: "card", label: "Credit / debit card", desc: "Visa, Mastercard", icon: iconCard() },
      { id: "wallet", label: "GCash / e-wallet", desc: "Pay from your mobile wallet", icon: iconWallet() },
      { id: "cash", label: state.fulfillment === "delivery" ? "Cash on delivery" : "Cash on pickup", desc: "Pay when you receive your order", icon: iconCash() }
    ];
    var rows = opts.map(function(o){
      var sel = state.payment === o.id;
      return '<button class="pay-opt' + (sel ? ' selected' : '') + '" onclick="App.choosePayment(\'' + o.id + '\')">' +
        o.icon + '<div><div class="t">' + esc(o.label) + '</div><div class="d">' + esc(o.desc) + '</div></div></button>';
    }).join("");
    return '' +
      '<div class="panel" style="max-width:520px;margin:0 auto;">' +
        '<h2>Choose payment method</h2>' +
        '<p class="sub">Fulfillment: ' + (state.fulfillment === "delivery" ? "Delivery to " + esc(state.address.street || "your address") : "Pickup at store") + '</p>' +
        '<div class="payment-list">' + rows + '</div>' +
        '<button class="btn block" ' + (state.payment ? '' : 'disabled') + ' onclick="App.go(\'confirm\')">Review order</button>' +
      '</div>' + renderCheckoutSummary();
  }

  function screenConfirm(){
    var payLabel = { card: "Credit / debit card", wallet: "GCash / e-wallet", cash: state.fulfillment === "delivery" ? "Cash on delivery" : "Cash on pickup" }[state.payment] || "—";
    var itemsLine = state.cart.map(function(l){
      var f = FLOWERS.filter(function(x){ return x.id === l.id; })[0];
      var wrap = WRAPPING_DESIGNS.filter(function(x){ return x.id === l.wrapDesign; })[0];
      var lineName = l.arrangementType === "custom" ? "Custom Bouquet" : (f ? f.name : "Flower");
      var arrangement = l.arrangementType === "custom" ? "Custom Bouquet" : (l.arrangementType === "bouquet" ? "Ready-Made Bouquet" : "Single Flower");
      var flowers = l.arrangementType === "custom" ? '<small class="confirm-option">' + customFlowerList(l.flowers, l.qty) + '</small>' : '';
      var wrapDetails = l.arrangementType !== "single" ?
        '<div class="confirm-item confirm-wrap-item"><span>' + (l.wrapChoice === "wrapped" && wrap ? wrappingImage(wrap, "confirm-wrap-image") + '<span class="confirm-wrap-info"><strong>' + esc(wrap.name) + ' ×' + l.qty + '</strong>' + wrappingColor(wrap) + '<small>' + esc(wrap.detail) + '</small>' + (l.arrangementType === "custom" ? customWrapNotes(l) : '') + '</span>' : 'Without wrapping') + '</span><span>' + money(l.wrapChoice === "wrapped" && wrap ? wrap.price * l.qty : 0) + '</span></div>' : '';
      return '<div class="confirm-item"><span>' + esc(lineName) + ' ×' + l.qty + '<small class="confirm-option">' + esc(arrangement) + '</small>' + flowers + '</span><span>' + money(flowerSubtotal(l)) + '</span></div>' + wrapDetails;
    }).join("");
    return '' +
      '<div class="panel" style="max-width:520px;margin:0 auto;">' +
        '<h2>Confirm your order</h2>' +
        '<p class="sub">Double-check everything before we send it off.</p>' +
        '<div class="confirm-list">' +
          '<div class="confirm-section-label">Items</div>' + itemsLine +
          '<div class="confirm-item"><span class="label">Fulfillment</span><span>' + (state.fulfillment === "delivery" ? "Delivery" : "Pickup at store") + '</span></div>' +
          (state.fulfillment === "delivery" ? '<div class="confirm-item"><span class="label">Estimated time</span><span>Same-day delivery, about 2–4 hours</span></div>' : '') +
          (state.fulfillment === "delivery" ? '<div class="confirm-item"><span class="label">Address</span><span>' + esc([state.address.street, state.address.city, state.address.zip].filter(Boolean).join(", ")) + '</span></div>' : '') +
          '<div class="confirm-item"><span class="label">Payment</span><span>' + esc(payLabel) + '</span></div>' +
          '<div class="confirm-item"><span class="label">Account</span><span>' + esc(state.userName || "Guest") + '</span></div>' +
        '</div>' +
        '<div class="summary-row"><span>Flowers</span><span>' + money(itemsSubtotal()) + '</span></div>' +
        '<div class="summary-row"><span>Wrapping</span><span>' + money(wrappingSubtotal()) + '</span></div>' +
        '<div class="summary-row total"><span>Total</span><span>' + money(cartTotal()) + '</span></div>' +
        '<div class="confirm-actions">' +
          '<button class="btn secondary" onclick="App.go(\'cart\')">Edit cart</button>' +
          '<button class="btn" onclick="App.confirmOrder()">Confirm order</button>' +
        '</div>' +
      '</div>';
  }

  function screenDone(){
    return '' +
      '<div class="done-wrap">' +
        '<div class="done-mark">' + iconCheck() + '</div>' +
        '<h2 style="font-size:26px;">Order confirmed</h2>' +
        '<p style="color:var(--text-soft);max-width:360px;margin:10px auto 0;">A confirmation has been sent for your order. Thank you for choosing PetalHub.</p>' +
        '<div class="order-code">' + esc(state.orderCode) + '</div>' +
        '<div class="actions-row">' +
          '<button class="btn" onclick="App.newOrder()">Start a new order</button>' +
        '</div>' +
      '</div>';
  }

  function renderMain(){
    switch(state.screen){
      case "home": return screenHome();
      case "detail": return screenDetail();
      case "authGate": return screenAuthGate();
      case "register": return screenRegister();
      case "login": return screenLogin();
      case "cart": return screenCart();
      case "fulfillment": return screenFulfillment();
      case "delivery": return screenDelivery();
      case "payment": return screenPayment();
      case "confirm": return screenConfirm();
      case "done": return screenDone();
      default: return screenHome();
    }
  }

  function render(){
    document.getElementById("app").innerHTML =
      renderTopbar() +
      "<main>" + renderMain() + "</main>" +
      '<footer>PetalHub — a working prototype. No real orders, accounts or payments are processed.</footer>';
  }

  /* ---------- actions ---------- */
  var App = {
    go: go,
    selectWeather: function(weather){
      state.weather = state.weather === weather ? null : weather;
      render();
    },
    openDetail: function(id){
      state.detailId = id;
      state.qty = 1;
      state.arrangementType = "single";
      state.wrapChoice = "none";
      state.wrapDesign = WRAPPING_DESIGNS[0].id;
      state.customFlowers = {};
      state.customWrapColor = "";
      state.customWrapNotes = "";
      go("detail");
    },
    changeQty: function(d){ state.qty = Math.max(1, state.qty + d); render(); },
    chooseArrangement: function(type){
      if (["single", "bouquet", "custom"].indexOf(type) === -1) return;
      if (state.arrangementType !== type) state.wrapChoice = "none";
      state.arrangementType = type;
      render();
    },
    changeCustomFlower: function(id, delta){
      if (!FLOWERS.some(function(flower){ return flower.id === id; })) return;
      state.customFlowers[id] = Math.max(0, (state.customFlowers[id] || 0) + delta);
      if (state.customFlowers[id] === 0) delete state.customFlowers[id];
      render();
    },
    updateCustomWrap: function(field, value){
      if (field === "color") state.customWrapColor = value;
      else if (field === "notes") state.customWrapNotes = value;
    },
    chooseWrapType: function(choice){
      state.wrapChoice = choice;
      render();
    },
    chooseWrapDesign: function(id){
      if (WRAPPING_DESIGNS.some(function(option){ return option.id === id; })){
        state.wrapDesign = id;
        render();
      }
    },
    addToCart: function(id){
      var flower = FLOWERS.filter(function(f){ return f.id === id; })[0];
      if (!flower) return;
      var wrapChoice = state.arrangementType === "bouquet" ? state.wrapChoice : "none";
      var designId = wrapChoice === "wrapped" ? state.wrapDesign : null;
      var line = state.cart.filter(function(l){
        return l.id === id && l.arrangementType === state.arrangementType && l.wrapChoice === wrapChoice && l.wrapDesign === designId;
      })[0];
      if (line) line.qty += state.qty;
      else state.cart.push({ id: id, qty: state.qty, arrangementType: state.arrangementType, wrapChoice: wrapChoice, wrapDesign: designId });
      if (state.authenticated) go("cart"); else go("authGate");
    },
    addCustomBouquet: function(){
      var flowers = FLOWERS.filter(function(flower){ return (state.customFlowers[flower.id] || 0) > 0; }).map(function(flower){
        return { id: flower.id, qty: state.customFlowers[flower.id] };
      });
      if (!flowers.length) return;
      var wrapChoice = state.wrapChoice;
      state.cart.push({
        id: null,
        qty: 1,
        arrangementType: "custom",
        flowers: flowers,
        wrapChoice: wrapChoice,
        wrapDesign: wrapChoice === "wrapped" ? state.wrapDesign : null,
        wrapColor: wrapChoice === "wrapped" ? state.customWrapColor.trim() : "",
        wrapNotes: wrapChoice === "wrapped" ? state.customWrapNotes.trim() : ""
      });
      if (state.authenticated) go("cart"); else go("authGate");
    },
    openCart: function(){
      if (state.authenticated) go("cart"); else go("authGate");
    },
    logout: function(){
      state.authenticated = false;
      state.userName = "";
      go("home");
    },
    lineQty: function(index, d){
      var line = state.cart[index];
      if (!line) return;
      line.qty += d;
      if (line.qty <= 0) state.cart.splice(index, 1);
      render();
    },
    submitRegister: function(ev){
      ev.preventDefault();
      var name = document.getElementById("reg-name").value.trim();
      var email = document.getElementById("reg-email").value.trim();
      var pass = document.getElementById("reg-pass").value;
      var pass2 = document.getElementById("reg-pass2").value;
      if (!name || !email || !pass || !pass2){
        state.registerError = "Please fill in every field to finish registration.";
      } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1){
        state.registerError = "That doesn’t look like a valid email address.";
      } else if (pass.length < 6){
        state.registerError = "Password must be at least 6 characters.";
      } else if (pass !== pass2){
        state.registerError = "Passwords don’t match — try again.";
      } else {
        state.registerError = "";
        state.authenticated = true;
        state.userName = name;
        go("cart");
        return false;
      }
      render();
      return false;
    },
    submitLogin: function(ev){
      ev.preventDefault();
      var email = document.getElementById("log-email").value.trim();
      var pass = document.getElementById("log-pass").value;
      if (!email || !pass){
        state.loginError = "Enter both your email and password.";
      } else if (pass !== DEMO_PASSWORD){
        state.loginError = "Incorrect password. Hint: it’s “" + DEMO_PASSWORD + "” for this demo.";
      } else {
        state.loginError = "";
        state.authenticated = true;
        state.userName = email.split("@")[0].replace(/[._-]+/g, " ").replace(/^\s*([a-z])/, function(_, letter){ return letter.toUpperCase(); });
        go("cart");
        return false;
      }
      render();
      return false;
    },
    choosePickup: function(){ state.fulfillment = "pickup"; go("payment"); },
    submitDelivery: function(ev){
      ev.preventDefault();
      var street = document.getElementById("d-street").value.trim();
      var city = document.getElementById("d-city").value.trim();
      var zip = document.getElementById("d-zip").value.trim();
      if (!street || !city){
        document.getElementById("d-street").reportValidity && document.getElementById("d-street").focus();
        return false;
      }
      state.fulfillment = "delivery";
      state.address = { street: street, city: city, zip: zip };
      go("payment");
      return false;
    },
    choosePayment: function(id){ state.payment = id; render(); },
    confirmOrder: function(){
      state.orderCode = "PH-" + Math.floor(100000 + Math.random() * 900000);
      go("done");
    },
    newOrder: function(){
      state.cart = [];
      state.fulfillment = null;
      state.address = { street: "", city: "", zip: "" };
      state.payment = null;
      state.orderCode = null;
      go("home");
    }
  };
  window.App = App;

  render();
})();