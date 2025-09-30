 document.addEventListener('DOMContentLoaded', async function() {

    // ==========================
    // NAVIGATION
    // ==========================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const adminLink = document.getElementById('admin-link');
    const backToStoreBtn = document.getElementById('back-to-store');
	
	// NAVIGATION + ADMIN LOGIN
//const adminLink = document.getElementById('admin-link');
const adminPage = document.getElementById('admin-page');
const loginBox = document.getElementById('admin-login');
 const adminLogin = document.getElementById('admin-login');
const loginBtn = document.getElementById('login-btn');
const adminPasswordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');
 const footerAdminLink = document.getElementById('footer-admin-link');
  const logoutBtn = document.getElementById('logout-btn');
    const publicPage = document.getElementById('public-page');
	const adminPanelContent = document.getElementById('admin-panel-content');
//const ADMIN_PASSWORD = "admin123";
<!-- if(adminLink){ -->
    <!-- adminLink.addEventListener('click', function(e){ -->
        <!-- e.preventDefault(); -->

        <!-- // Hide all other pages -->
        <!-- pages.forEach(page => page.style.display = 'none'); -->

        <!-- // Show admin page -->
        <!-- if(adminPage) adminPage.style.display = 'block'; -->
    <!-- }); -->
<!-- } -->

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

// Updated navigateTo function
function navigateTo(pageId) {
    // Remove active class from all nav links
    navLinks.forEach(n => n.classList.remove('active'));
    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(el => el.classList.add('active'));

    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    // Special rendering for certain pages
    if (pageId === 'products' || pageId === 'home') renderProducts();
    if (pageId === 'cart') renderCart();

    // Show/hide footer
    const footer = document.querySelector('footer');
    if (pageId === 'admin-page') {
        if (footer) footer.style.display = 'none';
    } else {
        if (footer) footer.style.display = 'block';
    }
}

// Nav links click
navLinks.forEach(l => {
    l.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(l.getAttribute('data-page'));
    });
});

    //if(adminLink) adminLink.addEventListener('click', e => { e.preventDefault(); navigateTo('admin-page'); });
    if(backToStoreBtn) backToStoreBtn.addEventListener('click', e => { e.preventDefault(); navigateTo('home'); });

    // ==========================
    // CONFIG
    // ==========================
    const ADMIN_PASSWORD = 'admin123';
	 const GITHUB_REPO = "DeepakSingh86/Travalindia.github.io";
    const GITHUB_BRANCH = "main";
    const GITHUB_IMAGE_FOLDER = "images";
    const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_IMAGE_FOLDER}/`;
    let products = [];
    let cart = [];

    function formatINR(amount) {
        return new Intl.NumberFormat('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}).format(amount);
    }

    function convertToGitHubUrl(url){
        if(!url) return '';
        if(url.startsWith('http')) return url;
        return GITHUB_BASE_URL + url;
    }

    function showTemporaryMessage(msg){
        const div = document.createElement('div');
        div.textContent = msg;
        Object.assign(div.style,{position:'fixed',bottom:'20px',right:'20px',background:'#00b894',color:'white',padding:'10px 20px',borderRadius:'5px',zIndex:1000});
        document.body.appendChild(div);
        setTimeout(()=>document.body.removeChild(div),2000);
    }

    // ==========================
    // LOAD PRODUCTS FROM CSV
    // ==========================
    async function loadCSV(url){
        const res = await fetch(url);
        if(!res.ok) return null;
        return await res.text();
    }

    async function loadFromGitHub(){
        const csvFiles = ['sample-products.csv'];
        for(const file of csvFiles){
            const text = await loadCSV(GITHUB_BASE_URL + file);
            if(text){
                Papa.parse(text,{header:true,skipEmptyLines:true,complete:function(results){
                    products = results.data.filter(r=>r.productId&&r.productName).map((r,i)=>({
                        id:i+1,
                        itemNo:r.productId,
                        name:r.productName,
                        quantity:parseInt(r.quantity)||0,
                        price:parseFloat(r.price)||0,
                        images:[r.imageUrl1,r.imageUrl2,r.imageUrl3].filter(u=>u).map(convertToGitHubUrl)
                    }));
                    renderAdminProducts();
                    renderProducts();
                }});
                break;
            }
        }
    }

    document.getElementById('import-csv').addEventListener('change', e=>{
        const file = e.target.files[0];
        if(file){
            Papa.parse(file,{header:true,skipEmptyLines:true,complete:function(results){
                const imported = results.data.filter(r=>r.productId&&r.productName).map((r,i)=>({
                    id:products.length+i+1,
                    itemNo:r.productId,
                    name:r.productName,
                    quantity:parseInt(r.quantity)||0,
                    price:parseFloat(r.price)||0,
                    images:[r.imageUrl1,r.imageUrl2,r.imageUrl3].filter(u=>u).map(convertToGitHubUrl)
                }));
                products = [...products,...imported];
                renderAdminProducts();
                renderProducts();
                showTemporaryMessage(`CSV से ${imported.length} उत्पाद आयात हुए!`);
            }});
        }
    });

    // ==========================
    // PRODUCT RENDERING
    // ==========================
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

    function renderProducts(){
        const prodGrid = document.querySelector('#products .products-grid');
        const homeGrid = document.querySelector('#home .products-grid');
        prodGrid.innerHTML=''; homeGrid.innerHTML='';
        if(products.length===0){
            prodGrid.innerHTML=homeGrid.innerHTML='<div>कोई उत्पाद उपलब्ध नहीं</div>'; return;
        }
        products.forEach(p=>prodGrid.appendChild(createProductCard(p)));
        products.slice(0,3).forEach(p=>homeGrid.appendChild(createProductCard(p)));
    }

    // ==========================
    // ADMIN
    // ==========================
    function renderAdminProducts(){
        const adminList = document.getElementById('admin-product-list');
        const noProd = document.getElementById('no-products-message');
        adminList.innerHTML='';
        if(products.length===0){noProd.style.display='block'; return;}
        noProd.style.display='none';
        products.forEach(p=>{
            const row = document.createElement('tr');
            const img = (p.images && p.images.length>0)?p.images[0]:'https://via.placeholder.com/60';
            row.innerHTML=`<td>${p.itemNo}</td><td><img src="${img}" style="width:60px;"></td><td>${p.name}</td><td>₹ ${formatINR(p.price)}</td><td>${p.quantity}</td><td><button class="delete-product" data-id="${p.id}">हटाएं</button></td>`;
            adminList.appendChild(row);
        });
        document.querySelectorAll('.delete-product').forEach(btn=>{
            btn.addEventListener('click',()=>{ 
                const id=parseInt(btn.dataset.id);
                if(confirm('क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?')){
                    products = products.filter(p=>p.id!==id);
                    renderAdminProducts();
                    renderProducts();
                }
            });
        });
    }

    // ==========================
    // CART
    // ==========================
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
                
                }
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



    function updateCartCount(){
        const count = cart.reduce((acc,c)=>acc+c.quantity,0);
        document.querySelectorAll('.cart-count').forEach(el=>el.textContent=count);
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
                a.download = 'urvashi_products.csv';
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
                        //saveProducts();
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
                            //saveProducts();
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
			
			// Function to get available CSV files from GitHub
            async function getAvailableCSVFiles() {
                // This is a simplified approach - in a real scenario, you'd use GitHub API
                // For now, we'll try to load a predefined list of possible CSV files
                const possibleFiles = [ 'sample-products.csv'];
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
            

    // ==========================
    // INITIAL LOAD
    // ==========================
    await loadFromGitHub();
    updateCartCount();

});





