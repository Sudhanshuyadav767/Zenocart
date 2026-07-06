// Product Database
const PRODUCTS = [
    { id: "p1", name: "Solid Round Neck T-Shirt", price: 799, category: "T-Shirts", rating: 4.0, reviews: 120, label: "New", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60" },
    { id: "p2", name: "Unisex Fleece Hoodie", price: 1499, category: "Hoodies", rating: 5.0, reviews: 310, label: "Best Seller", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=60" },
    { id: "p3", name: "Men's Performance Polo", price: 1199, category: "Polo Shirts", rating: 4.0, reviews: 85, label: "", image: "https://images.pexels.com/photos/36701792/pexels-photo-36701792.jpeg?auto=format&fit=crop&w=800&h=800&q=60" },
    { id: "p4", name: "Graphic Print Sweatshirt", price: 1299, category: "Hoodies", rating: 5.0, reviews: 198, label: "Trending", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&h=800&q=60" },
    { id: "p5", name: "ZENOCART Signature Cap", price: 499, category: "Caps", rating: 4.5, reviews: 92, label: "", image: "https://images.pexels.com/photos/13697753/pexels-photo-13697753.jpeg?auto=format&fit=crop&w=800&q=60" },
    { id: "p6", name: "Customized Coffee Mug", price: 349, category: "Mugs", rating: 4.2, reviews: 45, label: "", image: "https://images.pexels.com/photos/50676/coffee-mugs-t-brown-drink-50676.jpeg?auto=format&fit=crop&w=800&q=60" },
    { id: "p7", name: "Insulated Sports Bottle", price: 899, category: "Bottles", rating: 4.7, reviews: 112, label: "New", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=60" },
    { id: "p8", name: "Minimalist Canvas Tote Bag", price: 299, category: "Bags", rating: 4.4, reviews: 76, label: "", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=60" },
];

document.addEventListener("DOMContentLoaded", () => {
    initSharedUi();
    initCartCount();
    
    // Static add-to-cart listener for index.html
    document.querySelectorAll(".add-to-cart-quick-static").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const pid = btn.dataset.id;
            const prod = PRODUCTS.find(p => p.id === pid);
            if (prod) {
                addToCart({
                    id: prod.id,
                    name: prod.name,
                    price: prod.price,
                    quantity: 1,
                    image: prod.image,
                    customized: false
                });
                const originalText = btn.textContent;
                btn.textContent = "Added ✓";
                btn.style.borderColor = "#1a936f";
                btn.style.color = "#1a936f";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.borderColor = "";
                    btn.style.color = "";
                }, 2000);
            }
        });
    });
    
    // Page-specific initializations
    if (document.body.classList.contains('custom-page-body') || document.getElementById('avatar-character')) {
        initCustomizer();
    }
    
    if (document.getElementById('shop-page-identifier')) {
        initShopPage();
    }
    
    if (document.getElementById('cart-page-identifier')) {
        initCartPage();
    }

    if (document.getElementById('checkout-page-identifier')) {
        initCheckoutPage();
    }

    if (document.getElementById('wholesale-page-identifier')) {
        initWholesalePage();
    }
    
    // Contact form handling if present
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Sending...";
            btn.disabled = true;
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = "Message Sent Successfully!";
                btn.style.background = "#1a936f";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = "";
                    btn.disabled = false;
                }, 3000);
            }, 1200);
        });
    }
});

// Shared Layout Code
function initSharedUi() {
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }
    
    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.classList.toggle("visible", window.scrollY > 300);
        });
    }
}

// Cart Utility Functions
function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    initCartCount();
}

function initCartCount() {
    const cartBadges = document.querySelectorAll("#cart-count");
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadges.forEach(badge => {
        badge.textContent = String(count);
        badge.style.display = count > 0 ? "flex" : "none";
    });
}

function addToCart(item) {
    const cart = getCart();
    // For custom items, check if a custom look with exact matches already exists
    let existingIndex = -1;
    if (item.customized) {
        existingIndex = cart.findIndex(c => 
            c.customized && 
            c.name === item.name && 
            c.details.size === item.details.size &&
            c.details.topColor === item.details.topColor &&
            c.details.bottomColor === item.details.bottomColor &&
            c.details.print === item.details.print &&
            c.details.customText === item.details.customText &&
            c.details.logo === item.details.logo &&
            c.details.fit === item.details.fit &&
            c.details.fabric === item.details.fabric &&
            c.details.accessory === item.details.accessory
        );
    } else {
        existingIndex = cart.findIndex(c => !c.customized && c.id === item.id);
    }

    if (existingIndex > -1) {
        cart[existingIndex].quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
}

// --------------------------------------------------------------------------
// 1. TRIAL ROOM CUSTOMIZER PAGE
// --------------------------------------------------------------------------
function initCustomizer() {
    const state = {
        product: "Classic Tee",
        fit: "Regular",
        fabric: "Cotton Flex",
        print: "Embroidery",
        topColor: "#e30613",
        bottomColor: "#1f2937",
        customText: "Own Your Fit",
        logo: "Z",
        hair: "fade",
        bodyType: "balanced",
        skinIndex: 1,
        size: "M",
        quantity: 1,
        accessory: "Sneakers",
        scene: "Studio"
    };

    const skinTones = ["#f6d6bc", "#e7b98d", "#c98c63", "#9f6541", "#6f422a"];
    const productPricing = {
        "Classic Tee": 899,
        "Oversized Hoodie": 1499,
        "Street Polo": 1199,
        "Co-ord Set": 1899
    };
    const printPricing = {
        Embroidery: 250,
        "Puff Print": 320,
        "Minimal Vinyl": 180,
        "DTF Graphic": 290
    };
    const accessoryPricing = {
        Sneakers: 0,
        Cap: 120,
        Tote: 180
    };
    const moodMap = {
        Regular: "Bold street minimal",
        Oversized: "Relaxed creator vibe",
        Athletic: "Clean active energy"
    };

    const refs = {
        productSelect: document.getElementById("product-select"),
        printStyle: document.getElementById("print-style"),
        topColor: document.getElementById("top-color"),
        bottomColor: document.getElementById("bottom-color"),
        customText: document.getElementById("custom-text"),
        logoMark: document.getElementById("logo-mark"),
        hairStyle: document.getElementById("hair-style"),
        bodyType: document.getElementById("body-type"),
        skinTone: document.getElementById("skin-tone"),
        quantity: document.getElementById("quantity"),
        avatarCharacter: document.getElementById("avatar-character"),
        avatarTop: document.getElementById("avatar-top"),
        garmentText: document.getElementById("garment-text"),
        garmentLogo: document.getElementById("garment-logo"),
        avatarShell: document.getElementById("avatar-shell"),
        accessoryBadge: document.getElementById("accessory-badge"),
        productBadge: document.getElementById("selected-product-badge"),
        fabricPill: document.getElementById("fabric-pill"),
        fitPill: document.getElementById("fit-pill"),
        printPill: document.getElementById("print-pill"),
        scenePill: document.getElementById("scene-pill"),
        summaryProduct: document.getElementById("summary-product"),
        summaryFit: document.getElementById("summary-fit"),
        summaryFabric: document.getElementById("summary-fabric"),
        summaryPrint: document.getElementById("summary-print"),
        summaryAvatar: document.getElementById("summary-avatar"),
        summaryMood: document.getElementById("summary-mood"),
        summarySize: document.getElementById("summary-size"),
        summaryQuantity: document.getElementById("summary-quantity"),
        summaryAccessory: document.getElementById("summary-accessory"),
        summaryScene: document.getElementById("summary-scene"),
        basePrice: document.getElementById("base-price"),
        customPrice: document.getElementById("custom-price"),
        totalPrice: document.getElementById("total-price"),
        orderMessage: document.getElementById("order-message"),
        addToCartButton: document.getElementById("add-to-cart-button")
    };

    const fitButtons = document.querySelectorAll('[data-group="fit"]');
    const fabricButtons = document.querySelectorAll('[data-group="fabric"]');
    const sizeButtons = document.querySelectorAll('[data-group="size"]');
    const accessoryButtons = document.querySelectorAll('[data-group="accessory"]');
    const sceneButtons = document.querySelectorAll('[data-group="scene"]');

    if (refs.productSelect) {
        refs.productSelect.addEventListener("change", (event) => {
            state.product = event.target.value;
            renderCustomizer();
        });
    }

    if (refs.printStyle) {
        refs.printStyle.addEventListener("change", (event) => {
            state.print = event.target.value;
            renderCustomizer();
        });
    }

    if (refs.topColor) {
        refs.topColor.addEventListener("input", (event) => {
            state.topColor = event.target.value;
            renderCustomizer();
        });
    }

    if (refs.bottomColor) {
        refs.bottomColor.addEventListener("input", (event) => {
            state.bottomColor = event.target.value;
            renderCustomizer();
        });
    }

    if (refs.customText) {
        refs.customText.addEventListener("input", (event) => {
            state.customText = event.target.value.trim() || "Own Your Fit";
            renderCustomizer();
        });
    }

    if (refs.logoMark) {
        refs.logoMark.addEventListener("input", (event) => {
            state.logo = (event.target.value.trim() || "Z").slice(0, 2).toUpperCase();
            renderCustomizer();
        });
    }

    if (refs.hairStyle) {
        refs.hairStyle.addEventListener("change", (event) => {
            state.hair = event.target.value;
            renderCustomizer();
        });
    }

    if (refs.bodyType) {
        refs.bodyType.addEventListener("change", (event) => {
            state.bodyType = event.target.value;
            renderCustomizer();
        });
    }

    if (refs.skinTone) {
        refs.skinTone.addEventListener("input", (event) => {
            state.skinIndex = Number(event.target.value);
            renderCustomizer();
        });
    }

    if (refs.quantity) {
        refs.quantity.addEventListener("change", (event) => {
            state.quantity = Math.max(1, Number(event.target.value) || 1);
            refs.quantity.value = state.quantity;
            renderCustomizer();
        });
        refs.quantity.addEventListener("input", (event) => {
            state.quantity = Math.max(1, Number(event.target.value) || 1);
            renderCustomizer();
        });
    }

    bindChoiceButtons(fitButtons, "fit", state, renderCustomizer);
    bindChoiceButtons(fabricButtons, "fabric", state, renderCustomizer);
    bindChoiceButtons(sizeButtons, "size", state, renderCustomizer);
    bindChoiceButtons(accessoryButtons, "accessory", state, renderCustomizer);
    bindChoiceButtons(sceneButtons, "scene", state, renderCustomizer);

    // Preset configurations
    const presets = {
        street: {
            product: "Oversized Hoodie",
            fit: "Oversized",
            fabric: "French Terry",
            print: "Puff Print",
            topColor: "#111827",
            bottomColor: "#4b5563",
            customText: "STREET VIBE",
            logo: "SR",
            hair: "curly",
            bodyType: "balanced",
            skinIndex: 2,
            size: "L",
            quantity: 1,
            accessory: "Cap",
            scene: "Street"
        },
        gym: {
            product: "Classic Tee",
            fit: "Athletic",
            fabric: "Dry Fit Mesh",
            print: "Minimal Vinyl",
            topColor: "#f97316",
            bottomColor: "#111827",
            customText: "LIMITLESS",
            logo: "FIT",
            hair: "fade",
            bodyType: "broad",
            skinIndex: 1,
            size: "M",
            quantity: 1,
            accessory: "Sneakers",
            scene: "Gym"
        },
        corporate: {
            product: "Street Polo",
            fit: "Regular",
            fabric: "Cotton Flex",
            print: "Embroidery",
            topColor: "#1e3a8a",
            bottomColor: "#1f2937",
            customText: "DESIGN LEAD",
            logo: "ZC",
            hair: "bun",
            bodyType: "slim",
            skinIndex: 0,
            size: "M",
            quantity: 1,
            accessory: "Tote",
            scene: "Studio"
        },
        retro: {
            product: "Co-ord Set",
            fit: "Oversized",
            fabric: "French Terry",
            print: "DTF Graphic",
            topColor: "#e30613",
            bottomColor: "#e30613",
            customText: "BOLD CREATOR",
            logo: "XO",
            hair: "wave",
            bodyType: "balanced",
            skinIndex: 3,
            size: "XL",
            quantity: 1,
            accessory: "Cap",
            scene: "Stage"
        }
    };

    const presetButtons = document.querySelectorAll('[data-preset]');
    presetButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            presetButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const presetKey = btn.dataset.preset;
            const presetData = presets[presetKey];
            if (presetData) {
                // Apply preset to state
                Object.assign(state, presetData);

                // Update UI elements visually
                if (refs.productSelect) refs.productSelect.value = state.product;
                if (refs.printStyle) refs.printStyle.value = state.print;
                if (refs.topColor) refs.topColor.value = state.topColor;
                if (refs.bottomColor) refs.bottomColor.value = state.bottomColor;
                if (refs.customText) refs.customText.value = state.customText;
                if (refs.logoMark) refs.logoMark.value = state.logo;
                if (refs.hairStyle) refs.hairStyle.value = state.hair;
                if (refs.bodyType) refs.bodyType.value = state.bodyType;
                if (refs.skinTone) refs.skinTone.value = state.skinIndex;
                if (refs.quantity) refs.quantity.value = state.quantity;

                // Update choice pills
                updateActivePill(fitButtons, state.fit);
                updateActivePill(fabricButtons, state.fabric);
                updateActivePill(sizeButtons, state.size);
                updateActivePill(accessoryButtons, state.accessory);
                updateActivePill(sceneButtons, state.scene);

                // Render customizer with new state
                renderCustomizer();
            }
        });
    });

    function updateActivePill(buttons, value) {
        buttons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.value === value);
        });
    }

    if (refs.addToCartButton) {
        refs.addToCartButton.addEventListener("click", (event) => {
            event.preventDefault();
            
            const base = productPricing[state.product] || 899;
            const printExtra = printPricing[state.print] || 250;
            const accessoryExtra = accessoryPricing[state.accessory] || 0;
            const totalSingle = base + printExtra + accessoryExtra;
            
            // Get image
            let image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60";
            if (state.product === "Oversized Hoodie") image = "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=60";
            if (state.product === "Street Polo") image = "https://images.pexels.com/photos/36701792/pexels-photo-36701792.jpeg?auto=format&fit=crop&w=800&h=800&q=60";
            if (state.product === "Co-ord Set") image = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=60";

            const customItem = {
                id: "custom_" + Date.now(),
                name: state.product + " (Custom)",
                price: totalSingle,
                quantity: state.quantity,
                image: image,
                customized: true,
                details: {
                    fit: state.fit,
                    fabric: state.fabric,
                    print: state.print,
                    topColor: state.topColor,
                    bottomColor: state.bottomColor,
                    customText: state.customText,
                    logo: state.logo,
                    hair: state.hair,
                    bodyType: state.bodyType,
                    size: state.size,
                    accessory: state.accessory,
                    scene: state.scene
                }
            };
            
            addToCart(customItem);
            
            if (refs.orderMessage) {
                refs.orderMessage.textContent = `${state.quantity} ${state.product} in size ${state.size} added to your cart successfully!`;
                refs.orderMessage.style.color = "#1a936f";
                setTimeout(() => {
                    refs.orderMessage.textContent = "";
                }, 4000);
            }
        });
    }

    renderCustomizer();

    function renderCustomizer() {
        const base = productPricing[state.product] || 899;
        const printExtra = printPricing[state.print] || 0;
        const accessoryExtra = accessoryPricing[state.accessory] || 0;
        const total = (base + printExtra + accessoryExtra) * state.quantity;

        // Apply styles to character element
        if (refs.avatarCharacter) {
            refs.avatarCharacter.className = `avatar-character body-${state.bodyType} scene-${toToken(state.scene)}`;
            refs.avatarCharacter.style.setProperty("--skin-tone", skinTones[state.skinIndex]);
            refs.avatarCharacter.style.setProperty("--top-color", state.topColor);
            refs.avatarCharacter.style.setProperty("--bottom-color", state.bottomColor);
            refs.avatarCharacter.dataset.hair = state.hair;
            refs.avatarCharacter.dataset.accessory = state.accessory;
            refs.avatarCharacter.dataset.product = state.product;
        }

        // Apply hair class directly to hair element
        const hairEl = document.getElementById("avatar-hair");
        if (hairEl) {
            hairEl.className = `avatar-hair hair-${state.hair}`;
        }

        if (refs.avatarTop) {
            refs.avatarTop.className = `avatar-top product-${toToken(state.product)}`;
        }
        if (refs.garmentText) {
            refs.garmentText.textContent = state.customText;
        }
        if (refs.garmentLogo) {
            refs.garmentLogo.textContent = state.logo;
        }
        if (refs.avatarShell) {
            refs.avatarShell.dataset.scene = state.scene;
        }
        if (refs.accessoryBadge) {
            refs.accessoryBadge.textContent = state.accessory;
            refs.accessoryBadge.style.display = state.accessory === "Sneakers" ? "none" : "inline-flex";
        }
        if (refs.productBadge) {
            refs.productBadge.textContent = state.product;
        }

        // Update pills
        if (refs.fabricPill) refs.fabricPill.textContent = state.fabric;
        if (refs.fitPill) refs.fitPill.textContent = state.fit;
        if (refs.printPill) refs.printPill.textContent = state.print;
        if (refs.scenePill) refs.scenePill.textContent = state.scene;

        // Update summary values
        if (refs.summaryProduct) refs.summaryProduct.textContent = state.product;
        if (refs.summaryFit) refs.summaryFit.textContent = state.fit;
        if (refs.summaryFabric) refs.summaryFabric.textContent = state.fabric;
        if (refs.summaryPrint) refs.summaryPrint.textContent = state.print;
        if (refs.summaryAvatar) refs.summaryAvatar.textContent = `${titleCase(state.hair)} / ${titleCase(state.bodyType)}`;
        if (refs.summaryMood) refs.summaryMood.textContent = moodMap[state.fit] || "Made for your vibe";
        
        if (refs.summarySize) refs.summarySize.textContent = state.size;
        if (refs.summaryQuantity) refs.summaryQuantity.textContent = String(state.quantity);
        if (refs.summaryAccessory) refs.summaryAccessory.textContent = state.accessory;
        if (refs.summaryScene) refs.summaryScene.textContent = state.scene;

        // Update pricing
        if (refs.basePrice) refs.basePrice.textContent = `Rs. ${base}`;
        if (refs.customPrice) refs.customPrice.textContent = `Rs. ${printExtra + accessoryExtra}`;
        if (refs.totalPrice) refs.totalPrice.textContent = `Rs. ${total}`;
    }
}

function bindChoiceButtons(buttons, key, state, onChange) {
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            state[key] = button.dataset.value;
            onChange();
        });
    });
}

// --------------------------------------------------------------------------
// 2. SHOP PAGE CATALOG
// --------------------------------------------------------------------------
function initShopPage() {
    const grid = document.getElementById("shop-product-grid");
    const searchInput = document.getElementById("shop-search");
    const sortSelect = document.getElementById("shop-sort");
    const checkboxes = document.querySelectorAll(".category-filter-checkbox");
    
    let activeCategories = [];
    let searchQuery = "";
    let sortVal = "popular";

    checkboxes.forEach(chk => {
        chk.addEventListener("change", () => {
            activeCategories = Array.from(checkboxes)
                                    .filter(c => c.checked)
                                    .map(c => c.value);
            renderShopProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderShopProducts();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            sortVal = e.target.value;
            renderShopProducts();
        });
    }

    renderShopProducts();

    function renderShopProducts() {
        if (!grid) return;

        let filtered = PRODUCTS.filter(p => {
            const matchesCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        // Sorting
        if (sortVal === "price-low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortVal === "price-high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortVal === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; font-weight: 600; color: var(--muted-gray);">No products found matching your criteria.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(p => {
            const labelHtml = p.label ? `<span class="product-label ${p.label === 'Best Seller' ? 'label-green' : (p.label === 'Trending' ? 'label-orange' : '')}">${p.label}</span>` : '';
            return `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${p.image}" alt="${p.name}">
                        ${labelHtml}
                    </div>
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <div class="product-rating">${p.rating.toFixed(1)} (${p.reviews})</div>
                        <div class="product-price">Rs. ${p.price}</div>
                        <div class="product-actions">
                            <button type="button" class="btn btn-secondary add-to-cart-quick" data-id="${p.id}">Add to Cart</button>
                            <a href="custom/index.html" class="btn btn-primary">Customize</a>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Bind quick add buttons
        grid.querySelectorAll(".add-to-cart-quick").forEach(btn => {
            btn.addEventListener("click", () => {
                const pid = btn.dataset.id;
                const prod = PRODUCTS.find(p => p.id === pid);
                if (prod) {
                    addToCart({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        quantity: 1,
                        image: prod.image,
                        customized: false
                    });
                    
                    const originalText = btn.textContent;
                    btn.textContent = "Added ✓";
                    btn.style.borderColor = "#1a936f";
                    btn.style.color = "#1a936f";
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.borderColor = "";
                        btn.style.color = "";
                    }, 2000);
                }
            });
        });
    }
}

// --------------------------------------------------------------------------
// 3. CART PAGE SYSTEM
// --------------------------------------------------------------------------
function initCartPage() {
    const listContainer = document.getElementById("cart-items-list");
    const summaryList = document.getElementById("summary-prices-box");
    const promoBtn = document.getElementById("apply-promo");
    const promoInput = document.getElementById("promo-code");
    const cartWrapper = document.getElementById("cart-grid-wrapper");
    const checkoutBtn = document.getElementById("proceed-to-checkout-btn");

    let discountPercent = 0;

    if (promoBtn && promoInput) {
        promoBtn.addEventListener("click", () => {
            const code = promoInput.value.toUpperCase().trim();
            if (code === "ZENO10") {
                discountPercent = 0.10;
                alert("Coupon code 'ZENO10' applied successfully! Got 10% off.");
            } else if (code === "CUSTOM20") {
                discountPercent = 0.20;
                alert("Coupon code 'CUSTOM20' applied successfully! Got 20% off.");
            } else {
                alert("Invalid coupon code.");
                discountPercent = 0;
            }
            renderCartPage();
        });
    }

    renderCartPage();

    function renderCartPage() {
        const cart = getCart();

        if (cart.length === 0) {
            // Render empty state
            if (cartWrapper) {
                cartWrapper.innerHTML = `
                    <div class="cart-empty" style="grid-column: 1/-1;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 80px; height: 80px; color: var(--muted-gray); margin-bottom: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.835l1.823-6.44a1.125 1.125 0 00-.142-1.095L17.102 3.75H5.484M7.5 14.25L5.106 5.165m0 0a1.5 1.5 0 01-1.823-1.095l-1.823-6.441" /></svg>
                        <h2>Your Cart is Empty</h2>
                        <p style="margin: 12px 0 30px;">Add some premium products or design a custom look in the trial room.</p>
                        <a href="shop.html" class="btn btn-primary">Go to Shop</a>
                    </div>
                `;
            }
            return;
        }

        // Render Cart Items
        if (listContainer) {
            listContainer.innerHTML = cart.map((item, index) => {
                let metaHtml = '';
                if (item.customized) {
                    const dt = item.details;
                    metaHtml = `
                        <div class="cart-item-meta">
                            <span>Fit: <strong>${dt.fit}</strong></span>
                            <span>Fabric: <strong>${dt.fabric}</strong></span>
                            <span>Print: <strong>${dt.print}</strong></span>
                            <span>Size: <strong>${dt.size}</strong></span>
                            <span>Text: <strong>${dt.customText}</strong></span>
                            <span>Logo: <strong>${dt.logo}</strong></span>
                            <span>Accessory: <strong>${dt.accessory}</strong></span>
                            <span>Color: <strong style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${dt.topColor}; vertical-align:middle; border:1px solid #ccc;"></strong></span>
                        </div>
                    `;
                } else {
                    metaHtml = `<div class="cart-item-meta"><span>Standard Product</span><span>Size: <strong>Free Size</strong></span></div>`;
                }

                return `
                    <div class="cart-item">
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <h3 class="cart-item-title">${item.name}</h3>
                            ${metaHtml}
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
                            <div style="display: flex; gap: 20px; align-items: center;">
                                <div class="quantity-control">
                                    <button type="button" class="quantity-btn dec-qty" data-index="${index}">-</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button type="button" class="quantity-btn inc-qty" data-index="${index}">+</button>
                                </div>
                                <button type="button" class="remove-cart-item-btn" data-index="${index}">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px; height:16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            // Attach listeners to list buttons
            listContainer.querySelectorAll(".dec-qty").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idx = Number(btn.dataset.index);
                    if (cart[idx].quantity > 1) {
                        cart[idx].quantity--;
                        saveCart(cart);
                        renderCartPage();
                    }
                });
            });

            listContainer.querySelectorAll(".inc-qty").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idx = Number(btn.dataset.index);
                    cart[idx].quantity++;
                    saveCart(cart);
                    renderCartPage();
                });
            });

            listContainer.querySelectorAll(".remove-cart-item-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idx = Number(btn.dataset.index);
                    cart.splice(idx, 1);
                    saveCart(cart);
                    renderCartPage();
                });
            });
        }

        // Calculate Pricing
        const subtotal = cart.reduce((tot, item) => tot + (item.price * item.quantity), 0);
        const gst = Math.round(subtotal * 0.18); // 18% GST
        const shipping = subtotal > 1500 ? 0 : 100; // Free shipping above 1500
        const promoDiscount = Math.round(subtotal * discountPercent);
        const finalTotal = subtotal + gst + shipping - promoDiscount;

        if (summaryList) {
            summaryList.innerHTML = `
                <div class="summary-row"><span>Subtotal</span><strong>Rs. ${subtotal}</strong></div>
                <div class="summary-row"><span>GST (18%)</span><strong>Rs. ${gst}</strong></div>
                <div class="summary-row"><span>Shipping</span><strong>${shipping === 0 ? '<span style="color:#1a936f">FREE</span>' : 'Rs. ' + shipping}</strong></div>
                ${promoDiscount > 0 ? `<div class="summary-row" style="color:#1a936f"><span>Coupon Discount</span><strong>- Rs. ${promoDiscount}</strong></div>` : ''}
                <div class="summary-row total-row" style="margin-top:16px"><span>Final Total</span><strong>Rs. ${finalTotal}</strong></div>
            `;
        }
    }
}

// --------------------------------------------------------------------------
// 4. CHECKOUT PAGE
// --------------------------------------------------------------------------
function initCheckoutPage() {
    const listContainer = document.getElementById("checkout-items-list");
    const totalBox = document.getElementById("checkout-totals-box");
    const checkoutForm = document.getElementById("checkout-shipping-form");
    const successOverlay = document.getElementById("success-overlay");
    const successOrderId = document.getElementById("success-order-id");
    const checkoutBtn = document.getElementById("checkout-place-order-btn");
    
    // Bind payment option styles
    const paymentOptions = document.querySelectorAll(".payment-option");
    paymentOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            paymentOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    renderCheckout();

    function renderCheckout() {
        const cart = getCart();
        if (cart.length === 0) {
            window.location.href = "cart.html";
            return;
        }

        if (listContainer) {
            listContainer.innerHTML = cart.map(item => `
                <div class="summary-row" style="padding:10px 0; font-size:0.92rem;">
                    <span>${item.name} <strong style="color:var(--black)">x ${item.quantity}</strong></span>
                    <strong>Rs. ${item.price * item.quantity}</strong>
                </div>
            `).join("");
        }

        const subtotal = cart.reduce((tot, item) => tot + (item.price * item.quantity), 0);
        const gst = Math.round(subtotal * 0.18);
        const shipping = subtotal > 1500 ? 0 : 100;
        
        // Check if there was discount applied (mocking it)
        const promoDiscount = 0; // Simple mock checkout discount
        const finalTotal = subtotal + gst + shipping - promoDiscount;

        if (totalBox) {
            totalBox.innerHTML = `
                <div class="summary-row"><span>Subtotal</span><strong>Rs. ${subtotal}</strong></div>
                <div class="summary-row"><span>GST (18%)</span><strong>Rs. ${gst}</strong></div>
                <div class="summary-row"><span>Shipping</span><strong>${shipping === 0 ? '<span style="color:#1a936f">FREE</span>' : 'Rs. ' + shipping}</strong></div>
                <div class="summary-row total-row" style="margin-top:16px"><span>Total Amount</span><strong>Rs. ${finalTotal}</strong></div>
            `;
        }
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Generate Random Order ID
            const orderId = "ZENO" + Math.floor(100000 + Math.random() * 900000);
            
            if (successOrderId) successOrderId.textContent = orderId;
            if (successOverlay) successOverlay.classList.add("visible");
            
            // Empty localstorage cart
            saveCart([]);
        });
    }
}

// --------------------------------------------------------------------------
// 5. WHOLESALE PAGE INQUIRY FORM
// --------------------------------------------------------------------------
function initWholesalePage() {
    const wholesaleForm = document.getElementById("wholesale-inquiry-form");
    if (wholesaleForm) {
        wholesaleForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = wholesaleForm.querySelector("button[type='submit']");
            const originalText = btn.textContent;
            
            btn.textContent = "Submitting Inquiry...";
            btn.disabled = true;
            
            setTimeout(() => {
                wholesaleForm.reset();
                btn.textContent = "Inquiry Submitted Successfully!";
                btn.style.background = "#1a936f";
                btn.style.borderColor = "#1a936f";
                
                alert("Thank you! Your bulk request has been submitted. A wholesale business manager will contact you in 2-4 business hours.");
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = "";
                    btn.style.borderColor = "";
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
}

// Helper utility
function titleCase(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function toToken(value) {
    if (!value) return "";
    return value.toLowerCase().replace(/\s+/g, "-");
}
