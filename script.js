document.addEventListener('DOMContentLoaded', async function() {
            // Admin password
            const ADMIN_PASSWORD = "admin123";

            // GitHub repository information
            const GITHUB_REPO = "DeepakSingh86/Travalindia.github.io";
            const GITHUB_BRANCH = "main";
            const GITHUB_IMAGE_FOLDER = "images";
            const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_IMAGE_FOLDER}/`;
            let products = [];
            let cart = [];
            // Initialize products array
          //  let products = JSON.parse(localStorage.getItem('TravalindiaProducts')) || [];

            // Format number as INR
          //  function formatINR(amount) {
           //     return new Intl.NumberFormat('en-IN', {
           //         maximumFractionDigits: 2,
          //          minimumFractionDigits: 2
          //      }).format(amount);
          //  }

            // Save products to localStorage
        //    function saveProducts() {
        //        localStorage.setItem('TravalindiaProducts', JSON.stringify(products));
          //  }

            // Function to convert image URL to GitHub raw URL
            function convertToGitHubUrl(url) {
                if (!url) return '';

                // If it's already a full URL, return as is
                if (url.startsWith('http')) {
                    // Convert blob URL to raw URL if needed
                    if (url.includes('github.com') && url.includes('/blob/')) {
                        return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                    }
                    return url;
                }

                // If it's a relative path, convert to full GitHub raw URL
                return GITHUB_BASE_URL + url;
            }

            // Function to load sample CSV from GitHub
            async function loadCSVFromGitHub(csvFileName) {
                const csvUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_IMAGE_FOLDER}/${csvFileName}`;

                try {
                    const response = await fetch(csvUrl);
                    if (!response.ok) {
                        throw new Error('CSV फ़ाइल लोड नहीं हो सकी');
                    }

                    const csvText = await response.text();
                    return csvText;
                } catch (error) {
                    console.error('Error loading CSV:', error);
                    return null;
                }
            }

            // Function to get available CSV files from GitHub
            async function getAvailableCSVFiles() {
                // This is a simplified approach - in a real scenario, you'd use GitHub API
                // For now, we'll try to load a predefined list of possible CSV files
                const possibleFiles = ['products.csv', 'sample-products.csv', 'Travalindia-products.csv'];
                const availableFiles = [];

                for (const fileName of possibleFiles) {
                    try {
                        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_IMAGE_FOLDER}/${fileName}`);
                        if (response.ok) {
                            availableFiles.push(fileName);
                        }
                    } catch (error) {
                        // File doesn't exist or couldn't be loaded
                    }
                }

                return availableFiles;
            }

            // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const footerNavLinks = document.querySelectorAll('.footer-nav');
    const pages = document.querySelectorAll('.page');
    const adminLink = document.getElementById('admin-link');
    const footerAdminLink = document.getElementById('footer-admin-link');
    const backToStoreBtn = document.getElementById('back-to-store');
    const publicPage = document.getElementById('public-page');
    const adminPage = document.getElementById('admin-page');

            function navigateTo(pageId) {
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

                pages.forEach(page => page.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');

                if (pageId === 'products' || pageId === 'home') {
                    renderProducts();
                }

                if (pageId === 'cart') {
                    renderCart();
                }
            }

            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    navigateTo(pageId);
                });
            });

            footerNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    navigateTo(pageId);
                });
            });

            // Admin login functionality
            const loginBtn = document.getElementById('login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const adminLogin = document.getElementById('admin-login');
            const adminPanelContent = document.getElementById('admin-panel-content');
            const loginError = document.getElementById('login-error');

            adminLink.addEventListener('click', function(e) {
                e.preventDefault();
                publicPage.style.display = 'none';
                adminPage.style.display = 'block';
                adminLogin.style.display = 'flex';
                adminPanelContent.style.display = 'none';
                loginError.style.display = 'none';
                document.getElementById('admin-password').value = '';
            });

            footerAdminLink.addEventListener('click', function(e) {
                e.preventDefault();
                publicPage.style.display = 'none';
                adminPage.style.display = 'block';
                adminLogin.style.display = 'flex';
                adminPanelContent.style.display = 'none';
                loginError.style.display = 'none';
                document.getElementById('admin-password').value = '';
            });

            loginBtn.addEventListener('click', function() {
                const password = document.getElementById('admin-password').value;

                if (password === ADMIN_PASSWORD) {
                    adminLogin.style.display = 'none';
                    adminPanelContent.style.display = 'block';
                    renderAdminProducts();
                } else {
                    loginError.style.display = 'block';
                }
            });

            logoutBtn.addEventListener('click', function() {
                adminLogin.style.display = 'flex';
                adminPanelContent.style.display = 'none';
                loginError.style.display = 'none';
                document.getElementById('admin-password').value = '';
            });

            backToStoreBtn.addEventListener('click', function() {
                adminPage.style.display = 'none';
                publicPage.style.display = 'block';
                navigateTo('home');
            });

            document.getElementById('explore-btn').addEventListener('click', function() {
                navigateTo('products');
            });

            document.querySelector('.cart-icon').addEventListener('click', function() {
                navigateTo('cart');
    });

            // Admin tabs functionality
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');

                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');

                    tabContents.forEach(content => content.classList.remove('active'));
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // Add item functionality
            document.getElementById('addItemBtn').addEventListener('click', function() {
                const itemNo = document.getElementById('itemNo').value;
                const itemName = document.getElementById('itemName').value;
                const itemPrice = document.getElementById('itemPrice').value;
                const itemQty = document.getElementById('itemQty').value;
                const imageUrl1 = document.getElementById('imageUrl1').value;
                const imageUrl2 = document.getElementById('imageUrl2').value;
                const imageUrl3 = document.getElementById('imageUrl3').value;

                if (!itemNo || !itemName || !itemPrice || !itemQty) {
                    alert('कृपया सभी फ़ील्ड भरें');
                    return;
                }

                // Create new product object
                const newProduct = {
                    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                    itemNo: itemNo,
                    name: itemName,
                    price: parseFloat(itemPrice),
                    images: [],
                    quantity: parseInt(itemQty)
                };

                // Add image URLs (convert to GitHub URLs if needed)
                if (imageUrl1) newProduct.images.push(convertToGitHubUrl(imageUrl1));
                if (imageUrl2) newProduct.images.push(convertToGitHubUrl(imageUrl2));
                if (imageUrl3) newProduct.images.push(convertToGitHubUrl(imageUrl3));

                // Add to products array
                products.push(newProduct);
                saveProducts();

                // Show success message
                alert('उत्पाद सफलतापूर्वक जोड़ा गया!');

                // Clear form
                document.getElementById('itemNo').value = '';
                document.getElementById('itemName').value = '';
                document.getElementById('itemPrice').value = '';
                document.getElementById('itemQty').value = '';
                document.getElementById('imageUrl1').value = '';
                document.getElementById('imageUrl2').value = '';
                document.getElementById('imageUrl3').value = '';

                // Render the newly added item
                renderAdminProducts();
                renderProducts();
            });

            // Render products for public page
            function renderProducts() {
                const productsGrid = document.querySelector('#products .products-grid');
                const homeProductsGrid = document.querySelector('#home .products-grid');

                productsGrid.innerHTML = '';
                homeProductsGrid.innerHTML = '';

                if (products.length === 0) {
                    productsGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>कोई उत्पाद उपलब्ध नहीं</h3>
                            <p>एडमिन द्वारा उत्पाद जोड़े जाने पर यहां दिखाई देंगे</p>
                        </div>
                    `;

                    homeProductsGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>कोई उत्पाद उपलब्ध नहीं</h3>
                            <p>एडमिन द्वारा उत्पाद जोड़े जाने पर यहां दिखाई देंगे</p>
                        </div>
                    `;
                    return;
                }

                // Show all products on products page
                products.forEach(product => {
                    const productCard = createProductCard(product);
                    productsGrid.appendChild(productCard);
                });

                // Show 3 featured products on home page
                const featuredProducts = products.slice(0, 3);
                featuredProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    homeProductsGrid.appendChild(productCard);
                });
            }

            // Create product card for public page
            function createProductCard(product) {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                const productImage = product.images && product.images.length > 0 ?
                    product.images[0] :
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${productImage}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4='">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">₹ <span class="inr-symbol">${formatINR(product.price)}</span></div>
                        <div class="product-actions">
                            <div class="quantity-control">
                                <button class="qty-btn minus">-</button>
                                <input type="text" class="qty-input" value="1" readonly>
                                <button class="qty-btn plus">+</button>
                            </div>
                            <button class="add-to-cart" data-id="${product.id}">कार्ट में जोड़ें</button>
                        </div>
                    </div>
                `;

                const plusBtn = productCard.querySelector('.plus');
                const minusBtn = productCard.querySelector('.minus');
                const qtyInput = productCard.querySelector('.qty-input');

                plusBtn.addEventListener('click', function() {
                    qtyInput.value = parseInt(qtyInput.value) + 1;
                });

                minusBtn.addEventListener('click', function() {
                    if (parseInt(qtyInput.value) > 1) {
                        qtyInput.value = parseInt(qtyInput.value) - 1;
                    }
                });

                const addToCartBtn = productCard.querySelector('.add-to-cart');
                addToCartBtn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    const quantity = parseInt(qtyInput.value);
                    addToCart(id, quantity);

                    const confirmation = document.createElement('div');
                    confirmation.textContent = 'कार्ट में जोड़ा गया!';
                    confirmation.style.position = 'fixed';
                    confirmation.style.bottom = '20px';
                    confirmation.style.right = '20px';
                    confirmation.style.background = '#00b894';
                    confirmation.style.color = 'white';
                    confirmation.style.padding = '10px 20px';
                    confirmation.style.borderRadius = '5px';
                    confirmation.style.zIndex = '1000';
                    document.body.appendChild(confirmation);

                    setTimeout(() => {
                        document.body.removeChild(confirmation);
                    }, 2000);
                });

                const productImageElem = productCard.querySelector('.product-image');
                productImageElem.addEventListener('click', function() {
                    openImageModal(product.images, product.name);
                });

                return productCard;
            }

            // Render admin products
            function renderAdminProducts() {
                const adminProductList = document.getElementById('admin-product-list');
                const noProductsMessage = document.getElementById('no-products-message');

                adminProductList.innerHTML = '';

                if (products.length === 0) {
                    noProductsMessage.style.display = 'block';
                    return;
                }

                noProductsMessage.style.display = 'none';

                products.forEach(product => {
                    const row = document.createElement('tr');
                    const productImage = product.images && product.images.length > 0 ?
                        product.images[0] :
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMzAiIHk9IjMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWc8L3RleHQ+PC9zdmc+';

                    row.innerHTML = `
                        <td>${product.itemNo}</td>
                        <td><img src="${productImage}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMzAiIHk9IjMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD48L3N2Zz4='"></td>
                        <td>${product.name}</td>
                        <td>₹ ${formatINR(product.price)}</td>
                        <td>${product.quantity}</td>
                        <td>
                            <button class="btn btn-danger delete-product" data-id="${product.id}">हटाएं</button>
                        </td>
                    `;

                    adminProductList.appendChild(row);
                });

                document.querySelectorAll('.delete-product').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        if (confirm('क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?')) {
                            products = products.filter(p => p.id !== id);
                            saveProducts();
                            renderAdminProducts();
                            renderProducts();
                        }
                    });
                });
            }

            // Image Modal functionality
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const imageGallery = document.getElementById('imageGallery');
            const closeBtn = document.querySelector('.close');

            function openImageModal(images, title) {
                modal.style.display = 'block';

                if (images && images.length > 0) {
                    modalImg.src = images[0];
                    modalImg.alt = title;
                } else {
                    modalImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZXMgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                    modalImg.alt = 'No images available';
                }

                imageGallery.innerHTML = '';

                if (images && images.length > 0) {
                    images.forEach((image, index) => {
                        const thumbnail = document.createElement('img');
                        thumbnail.src = image;
                        thumbnail.alt = `${title} ${index + 1}`;
                        thumbnail.className = 'thumbnail';
                        if (index === 0) thumbnail.classList.add('active');

                        thumbnail.addEventListener('click', function() {
                            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                            this.classList.add('active');
                            modalImg.src = image;
                        });

                        imageGallery.appendChild(thumbnail);
                    });
                }
            }

            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });

            window.addEventListener('click', function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            });

            // Cart functionality
            let cart = JSON.parse(localStorage.getItem('TravalindiaCart')) || [];

            function addToCart(productId, quantity) {
                const product = products.find(p => p.id === productId);

                if (product) {
                    const existingItem = cart.find(item => item.id === productId);

                    if (existingItem) {
                        existingItem.quantity += quantity;
                    } else {
                        cart.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                            quantity: quantity
                        });
                    }

                    updateCartCount();
                    saveCart();
                }
            }

            function saveCart() {
                localStorage.setItem('TravalindiaCart', JSON.stringify(cart));
            }

            function updateCartCount() {
                const cartCount = document.querySelector('.cart-count');
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
            }

            function renderCart() {
                const cartItems = document.querySelector('.cart-items');

                if (cart.length === 0) {
                    cartItems.innerHTML = `
                        <div class="empty-cart-message" style="text-align: center; padding: 30px;">
                            <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                            <h3>आपकी कार्ट खाली है</h3>
                            <p>अपनी कार्ट में कुछ उत्पाद जोड़ें</p>
                        </div>
                    `;
                    document.getElementById('cartTotal').textContent = '0.00';
                    return;
                }

                cartItems.innerHTML = '';
                let total = 0;

                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNDAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWc8L3RleHQ+PC9zdmc+='">
                        </div>
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <div class="cart-item-price">₹ ${formatINR(item.price)} x ${item.quantity}</div>
                            <div class="cart-item-actions">
                                <div class="quantity-control">
                                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                                </div>
                                <button class="remove-item" data-id="${item.id}">हटाएं</button>
                            </div>
                        </div>
                    `;

                    cartItems.appendChild(cartItem);

                    const plusBtn = cartItem.querySelector('.plus');
                    const minusBtn = cartItem.querySelector('.minus');
                    const qtyInput = cartItem.querySelector('.qty-input');
                    const removeBtn = cartItem.querySelector('.remove-item');

                    plusBtn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        const item = cart.find(item => item.id === id);
                        item.quantity += 1;
                        qtyInput.value = item.quantity;
                        renderCart();
                        saveCart();
                    });

                    minusBtn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        const item = cart.find(item => item.id === id);

                        if (item.quantity > 1) {
                            item.quantity -= 1;
                            qtyInput.value = item.quantity;
                            renderCart();
                            saveCart();
                        }
                    });

                    removeBtn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        cart = cart.filter(item => item.id !== id);
                        renderCart();
                        updateCartCount();
                        saveCart();
                    });
                });

                document.getElementById('cartTotal').textContent = formatINR(total);
            }

            // Data Management Functions

            // Export to CSV
            function exportToCSV() {
                if (products.length === 0) {
                    alert('एक्सपोर्ट करने के लिए कोई उत्पाद नहीं');
                    return;
                }

                const headers = ['productId', 'productName', 'quantity', 'price', 'imageUrl1', 'imageUrl2', 'imageUrl3'];
                const csvContent = products.map(product => {
                    return [
                        product.itemNo,
                        product.name,
                        product.quantity,
                        product.price,
                        product.images[0] || '',
                        product.images[1] || '',
                        product.images[2] || ''
                    ];
                });

                csvContent.unshift(headers);

                const csvString = csvContent.map(row =>
                    row.map(field => `"${field}"`).join(',')
                ).join('\n');

                const blob = new Blob([csvString], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Travalindia_products.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showStatus('उत्पाद CSV में सफलतापूर्वक एक्सपोर्ट हो गए!', 'success');
            }

            // Import from CSV
            function importFromCSV(file) {
                const imageLoading = document.getElementById('image-loading');
                imageLoading.style.display = 'flex';

                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        if (results.errors.length > 0) {
                            showStatus('CSV फ़ाइल पार्स करने में त्रुटि: ' + results.errors[0].message, 'error');
                            imageLoading.style.display = 'none';
                            return;
                        }

                        const importedProducts = [];

                        for (const row of results.data) {
                            if (row.productId && row.productName) {
                                const imageUrls = [
                                    row.imageUrl1 || '',
                                    row.imageUrl2 || '',
                                    row.imageUrl3 || ''
                                ].filter(url => url !== '');

                                // Convert image URLs to GitHub URLs
                                const githubImageUrls = imageUrls.map(url => convertToGitHubUrl(url));

                                const product = {
                                    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + importedProducts.length + 1 : importedProducts.length + 1,
                                    itemNo: row.productId,
                                    name: row.productName,
                                    quantity: parseInt(row.quantity) || 0,
                                    price: parseFloat(row.price) || 0,
                                    images: githubImageUrls
                                };

                                importedProducts.push(product);
                            }
                        }

                        if (importedProducts.length === 0) {
                            showStatus('CSV फ़ाइल में कोई वैध उत्पाद नहीं मिले', 'error');
                            imageLoading.style.display = 'none';
                            return;
                        }

                        products = [...products, ...importedProducts];
                        saveProducts();
                        renderAdminProducts();
                        renderProducts();

                        showStatus(`CSV से ${importedProducts.length} उत्पाद सफलतापूर्वक आयात हुए!`, 'success');
                        imageLoading.style.display = 'none';
                    }
                });
            }

            // Load data from GitHub
            async function loadFromGitHub() {
                const imageLoading = document.getElementById('image-loading');
                imageLoading.style.display = 'flex';

                try {
                    // Get available CSV files
                    const availableFiles = await getAvailableCSVFiles();

                    if (availableFiles.length === 0) {
                        showStatus('GitHub पर कोई CSV फ़ाइल नहीं मिली', 'error');
                        imageLoading.style.display = 'none';
                        return;
                    }

                    // Use the first available CSV file
                    const csvFileName = availableFiles[0];
                    const csvText = await loadCSVFromGitHub(csvFileName);

                    if (!csvText) {
                        showStatus('GitHub से CSV लोड नहीं हो सकी', 'error');
                        imageLoading.style.display = 'none';
                        return;
                    }

                    Papa.parse(csvText, {
                        header: true,
                        skipEmptyLines: true,
                        complete: function(results) {
                            if (results.errors.length > 0) {
                                showStatus('CSV पार्स करने में त्रुटि: ' + results.errors[0].message, 'error');
                                imageLoading.style.display = 'none';
                                return;
                            }

                            const importedProducts = [];

                            for (const row of results.data) {
                                if (row.productId && row.productName) {
                                    const imageUrls = [
                                        row.imageUrl1 || '',
                                        row.imageUrl2 || '',
                                        row.imageUrl3 || ''
                                    ].filter(url => url !== '');

                                    const githubImageUrls = imageUrls.map(url => convertToGitHubUrl(url));

                                    const product = {
                                        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + importedProducts.length + 1 : importedProducts.length + 1,
                                        itemNo: row.productId,
                                        name: row.productName,
                                        quantity: parseInt(row.quantity) || 0,
                                        price: parseFloat(row.price) || 0,
                                        images: githubImageUrls
                                    };

                                    importedProducts.push(product);
                                }
                            }

                            if (importedProducts.length === 0) {
                                showStatus('CSV में कोई वैध उत्पाद नहीं मिले', 'error');
                                imageLoading.style.display = 'none';
                                return;
                            }

                            products = [...products, ...importedProducts];
                            saveProducts();
                            renderAdminProducts();
                            renderProducts();

                            showStatus(`GitHub से ${importedProducts.length} उत्पाद सफलतापूर्वक लोड हुए!`, 'success');
                            imageLoading.style.display = 'none';
                        }
                    });
                } catch (error) {
                    showStatus('GitHub से डेटा लोड करने में त्रुटि: ' + error.message, 'error');
                    imageLoading.style.display = 'none';
                }
            }

            // Show status message
            function showStatus(message, type) {
                const statusElement = document.getElementById('import-status');
                statusElement.textContent = message;
                statusElement.className = 'status-message';
                statusElement.classList.add(`status-${type}`);
                statusElement.style.display = 'block';

                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 5000);
            }

            // Event listeners for data management buttons
            document.getElementById('export-csv').addEventListener('click', exportToCSV);
            document.getElementById('export-csv-tab').addEventListener('click', exportToCSV);
            document.getElementById('load-from-github').addEventListener('click', loadFromGitHub);
            document.getElementById('save-to-github').addEventListener('click', loadFromGitHub);

            // Import CSV functionality
            document.getElementById('import-csv').addEventListener('click', function() {
                document.getElementById('csv-file').click();
            });

            document.getElementById('import-csv-tab').addEventListener('click', function() {
                document.getElementById('csv-file').click();
            });

            document.getElementById('csv-file').addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    importFromCSV(e.target.files[0]);
                }
            });

            // Initialize the page
            renderProducts();
            updateCartCount();
            renderCart();
        });

    

