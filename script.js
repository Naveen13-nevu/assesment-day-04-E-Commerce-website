let searchText = "";

let selectedCategory = "All";

let selectedMaxPrice = 100000;

let cart = [];

let wishlist = [];

let compareList = [];

let productGrid = document.getElementById("productGrid");
let noResultsText = document.getElementById("noResults");
let resultCountText = document.getElementById("resultCount");

let searchInput = document.getElementById("searchInput");
let categorySelect = document.getElementById("categorySelect");
let priceRange = document.getElementById("priceRange");
let priceValueText = document.getElementById("priceValue");

let cartBtn = document.getElementById("cartBtn");
let cartCountText = document.getElementById("cartCount");
let cartSidebar = document.getElementById("cartSidebar");
let cartOverlay = document.getElementById("cartOverlay");
let closeCartBtn = document.getElementById("closeCartBtn");
let cartItemsContainer = document.getElementById("cartItemsContainer");
let cartTotalText = document.getElementById("cartTotal");
let checkoutBtn = document.getElementById("checkoutBtn");

let wishlistBtn = document.getElementById("wishlistBtn");
let wishlistCountText = document.getElementById("wishlistCount");

let modalOverlay = document.getElementById("modalOverlay");
let productModal = document.getElementById("productModal");
let modalContent = document.getElementById("modalContent");
let closeModalBtn = document.getElementById("closeModalBtn");

// Product Comparison elements
let compareBtn = document.getElementById("compareBtn");
let compareCountText = document.getElementById("compareCount");
let clearCompareBtn = document.getElementById("clearCompareBtn");
let compareModalOverlay = document.getElementById("compareModalOverlay");
let compareModal = document.getElementById("compareModal");
let compareModalContent = document.getElementById("compareModalContent");
let closeCompareModalBtn = document.getElementById("closeCompareModalBtn");

loadWishlist();

displayProducts(products);

renderCart();

function displayProducts(productList) {
  productGrid.innerHTML = "";

  if (productList.length === 0) {
    noResultsText.style.display = "block";
  } else {
    noResultsText.style.display = "none";
  }

  resultCountText.textContent = productList.length + " product(s) found";

  for (let i = 0; i < productList.length; i++) {
    let product = productList[i];
    let card = createProductCard(product);
    productGrid.appendChild(card);
  }
}

function createProductCard(product) {
  let card = document.createElement("div");
  card.className = "product-card";

  let isWishlisted = wishlist.indexOf(product.id) !== -1;
  let heartClass = isWishlisted ? "wishlist-btn active" : "wishlist-btn";

  let isComparing = compareList.indexOf(product.id) !== -1;
  let compareChecked = isComparing ? "checked" : "";

  card.innerHTML =
    '<div class="product-image-wrap">' +
    '<span class="category-tag">' +
    product.category +
    "</span>" +
    '<button class="' +
    heartClass +
    '" data-id="' +
    product.id +
    '">❤</button>' +
    '<img src="' +
    product.image +
    '" alt="' +
    product.name +
    '" />' +
    "</div>" +
    '<div class="product-info">' +
    '<p class="product-name">' +
    product.name +
    "</p>" +
    '<p class="product-category">' +
    product.category +
    "</p>" +
    '<p class="product-rating">' +
    getStars(product.rating) +
    " (" +
    product.rating +
    ")</p>" +
    '<p class="product-price">' +
    formatPrice(product.price) +
    "</p>" +
    '<div class="product-actions">' +
    '<button class="btn btn-outline view-details-btn" data-id="' +
    product.id +
    '">View Details</button>' +
    '<button class="btn btn-primary add-to-cart-btn" data-id="' +
    product.id +
    '">Add to Cart</button>' +
    "</div>" +
    '<div class="compare-check-wrap">' +
    '<input type="checkbox" class="compare-checkbox" id="compare-' +
    product.id +
    '" data-id="' +
    product.id +
    '" ' +
    compareChecked +
    " />" +
    '<label for="compare-' +
    product.id +
    '">Add to Compare</label>' +
    "</div>" +
    "</div>";

  let heartButton = card.querySelector(".wishlist-btn");
  heartButton.addEventListener("click", function () {
    toggleWishlist(product.id);
  });

  let viewDetailsButton = card.querySelector(".view-details-btn");
  viewDetailsButton.addEventListener("click", function () {
    showProductDetails(product.id);
  });

  let addToCartButton = card.querySelector(".add-to-cart-btn");
  addToCartButton.addEventListener("click", function () {
    addToCart(product.id);
  });

  let compareCheckbox = card.querySelector(".compare-checkbox");
  compareCheckbox.addEventListener("change", function () {
    if (this.checked) {
      addToCompare(product.id);
    } else {
      removeFromCompare(product.id);
    }
  });

  return card;
}

function getStars(rating) {
  let fullStars = Math.round(rating);
  let starString = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starString += "★";
    } else {
      starString += "☆";
    }
  }

  return starString;
}

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function getFilteredProducts() {
  let filteredList = [];

  for (let i = 0; i < products.length; i++) {
    let product = products[i];

    let matchesSearch =
      product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;

    let matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    let matchesPrice = product.price <= selectedMaxPrice;

    if (matchesSearch && matchesCategory && matchesPrice) {
      filteredList.push(product);
    }
  }

  return filteredList;
}
function searchProducts() {
  searchText = searchInput.value;
  displayProducts(getFilteredProducts());
}

function filterCategory() {
  selectedCategory = categorySelect.value;
  displayProducts(getFilteredProducts());
}

function filterPrice() {
  selectedMaxPrice = Number(priceRange.value);
  priceValueText.textContent = formatPrice(selectedMaxPrice);
  displayProducts(getFilteredProducts());
}

searchInput.addEventListener("input", searchProducts);
categorySelect.addEventListener("change", filterCategory);
priceRange.addEventListener("input", filterPrice);

function findProductById(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
  return null;
}

function showProductDetails(productId) {
  let product = findProductById(productId);
  if (product === null) {
    return;
  }

  modalContent.innerHTML =
    '<img src="' +
    product.image +
    '" alt="' +
    product.name +
    '" />' +
    '<div class="modal-details">' +
    '<p class="product-category">' +
    product.category +
    "</p>" +
    "<h2>" +
    product.name +
    "</h2>" +
    '<p class="product-rating">' +
    getStars(product.rating) +
    " (" +
    product.rating +
    ")</p>" +
    '<p class="product-price">' +
    formatPrice(product.price) +
    "</p>" +
    "<p>" +
    product.description +
    "</p>" +
    '<div class="product-actions">' +
    '<button class="btn btn-primary" id="modalAddToCartBtn">Add to Cart</button>' +
    "</div>" +
    "</div>";

  let modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
  modalAddToCartBtn.addEventListener("click", function () {
    addToCart(product.id);
  });

  productModal.classList.add("open");
  modalOverlay.classList.add("show");
}

function closeModal() {
  productModal.classList.remove("open");
  modalOverlay.classList.remove("show");
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

function addToCart(productId) {
  let existingItem = null;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      existingItem = cart[i];
    }
  }

  if (existingItem !== null) {
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
  openCart();
}

function increaseQuantity(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity = cart[i].quantity + 1;
    }
  }
  renderCart();
}

function decreaseQuantity(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity = cart[i].quantity - 1;

      if (cart[i].quantity <= 0) {
        removeFromCart(productId);
        return;
      }
    }
  }
  renderCart();
}

function removeFromCart(productId) {
  let newCart = [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i]);
    }
  }

  cart = newCart;
  renderCart();
}

function calculateTotal() {
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    let product = findProductById(cart[i].id);
    if (product !== null) {
      total = total + product.price * cart[i].quantity;
    }
  }

  return total;
}

function getCartItemCount() {
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count = count + cart[i].quantity;
  }
  return count;
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart-msg">Your cart is empty. Start adding some products!</p>';
  } else {
    for (let i = 0; i < cart.length; i++) {
      let cartItem = cart[i];
      let product = findProductById(cartItem.id);

      if (product === null) {
        continue;
      }

      let itemRow = document.createElement("div");
      itemRow.className = "cart-item";

      itemRow.innerHTML =
        '<img src="' +
        product.image +
        '" alt="' +
        product.name +
        '" />' +
        '<div class="cart-item-info">' +
        '<p class="cart-item-name">' +
        product.name +
        "</p>" +
        '<p class="cart-item-price">' +
        formatPrice(product.price) +
        " x " +
        cartItem.quantity +
        "</p>" +
        '<div class="qty-controls">' +
        '<button class="decrease-btn" data-id="' +
        product.id +
        '">-</button>' +
        "<span>" +
        cartItem.quantity +
        "</span>" +
        '<button class="increase-btn" data-id="' +
        product.id +
        '">+</button>' +
        '<button class="remove-item-btn" data-id="' +
        product.id +
        '">Remove</button>' +
        "</div>" +
        "</div>";

      cartItemsContainer.appendChild(itemRow);

      let decreaseBtn = itemRow.querySelector(".decrease-btn");
      decreaseBtn.addEventListener("click", function () {
        decreaseQuantity(Number(this.getAttribute("data-id")));
      });

      let increaseBtn = itemRow.querySelector(".increase-btn");
      increaseBtn.addEventListener("click", function () {
        increaseQuantity(Number(this.getAttribute("data-id")));
      });

      let removeBtn = itemRow.querySelector(".remove-item-btn");
      removeBtn.addEventListener("click", function () {
        removeFromCart(Number(this.getAttribute("data-id")));
      });
    }
  }

  cartTotalText.textContent = formatPrice(calculateTotal());

  cartCountText.textContent = getCartItemCount();
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty. Add a few products before checking out.");
  } else {
    alert(
      "This is a demo project. Checkout is not connected to any payment system.",
    );
  }
});

function toggleWishlist(productId) {
  let indexInWishlist = wishlist.indexOf(productId);

  if (indexInWishlist === -1) {
    wishlist.push(productId);
  } else {
    it;
    wishlist.splice(indexInWishlist, 1);
  }

  saveWishlist();
  updateWishlist();

  displayProducts(getFilteredProducts());
}

function saveWishlist() {
  let wishlistAsText = JSON.stringify(wishlist);
  localStorage.setItem("myStoreWishlist", wishlistAsText);
}

function loadWishlist() {
  let savedWishlist = localStorage.getItem("myStoreWishlist");

  if (savedWishlist !== null) {
    wishlist = JSON.parse(savedWishlist);
  } else {
    wishlist = [];
  }

  updateWishlist();
}

function updateWishlist() {
  wishlistCountText.textContent = wishlist.length;
}

wishlistBtn.addEventListener("click", function () {
  alert(
    "You have " +
      wishlist.length +
      " item(s) in your wishlist. Tap the heart icon on any product to add or remove it.",
  );
});


function addToCompare(productId) {
  if (compareList.indexOf(productId) !== -1) {
    return;
  }

  if (compareList.length >= 2) {
    alert("You can compare only two products.");

    let checkbox = document.getElementById("compare-" + productId);
    if (checkbox !== null) {
      checkbox.checked = false;
    }
    return;
  }

  compareList.push(productId);
  updateCompareButton();
}

function removeFromCompare(productId) {
  let newCompareList = [];

  for (let i = 0; i < compareList.length; i++) {
    if (compareList[i] !== productId) {
      newCompareList.push(compareList[i]);
    }
  }

  compareList = newCompareList;
  updateCompareButton();
}

function updateCompareButton() {
  compareCountText.textContent = compareList.length;

  if (compareList.length === 2) {
    compareBtn.disabled = false;
  } else {
    compareBtn.disabled = true;
  }
}

function showComparisonModal() {

  if (compareList.length !== 2) {
    return;
  }

  let productA = findProductById(compareList[0]);
  let productB = findProductById(compareList[1]);

  if (productA === null || productB === null) {
    return;
  }

  compareModalContent.innerHTML =
    '<table class="comparison-table">' +
    "<tr>" +
    "<th>Feature</th>" +
    "<th>" +
    productA.name +
    "</th>" +
    "<th>" +
    productB.name +
    "</th>" +
    "</tr>" +
    "<tr>" +
    "<th>Image</th>" +
    '<td><img src="' +
    productA.image +
    '" alt="' +
    productA.name +
    '" /></td>' +
    '<td><img src="' +
    productB.image +
    '" alt="' +
    productB.name +
    '" /></td>' +
    "</tr>" +
    "<tr>" +
    "<th>Name</th>" +
    "<td>" +
    productA.name +
    "</td>" +
    "<td>" +
    productB.name +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<th>Category</th>" +
    "<td>" +
    productA.category +
    "</td>" +
    "<td>" +
    productB.category +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<th>Price</th>" +
    '<td class="compare-price">' +
    formatPrice(productA.price) +
    "</td>" +
    '<td class="compare-price">' +
    formatPrice(productB.price) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<th>Rating</th>" +
    "<td>" +
    getStars(productA.rating) +
    " (" +
    productA.rating +
    ")</td>" +
    "<td>" +
    getStars(productB.rating) +
    " (" +
    productB.rating +
    ")</td>" +
    "</tr>" +
    "<tr>" +
    "<th>Description</th>" +
    "<td>" +
    productA.description +
    "</td>" +
    "<td>" +
    productB.description +
    "</td>" +
    "</tr>" +
    "</table>";

  compareModal.classList.add("open");
  compareModalOverlay.classList.add("show");
}

function closeComparisonModal() {
  compareModal.classList.remove("open");
  compareModalOverlay.classList.remove("show");
}

function clearComparison() {
  compareList = [];
  updateCompareButton();

  displayProducts(getFilteredProducts());
}

compareBtn.addEventListener("click", showComparisonModal);
closeCompareModalBtn.addEventListener("click", closeComparisonModal);
compareModalOverlay.addEventListener("click", closeComparisonModal);
clearCompareBtn.addEventListener("click", clearComparison);
