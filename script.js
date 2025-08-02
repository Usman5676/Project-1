document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const downloadBtn = document.getElementById('download-btn');
            const tiktokUrlInput = document.getElementById('tiktok-url');
            const resultSection = document.getElementById('result-section');
            const loadingSection = document.getElementById('loading');
            const errorSection = document.getElementById('error');
            const errorMessage = document.getElementById('error-message');
            const videoPreview = document.getElementById('video-preview');
            const imagePreview = document.getElementById('image-preview');
            const downloadNoWatermark = document.getElementById('download-no-watermark');
            const downloadHd = document.getElementById('download-hd');
            const downloadAudio = document.getElementById('download-audio');
            const downloadImage = document.getElementById('download-image');
            const historySection = document.getElementById('history-section');
            const historyList = document.getElementById('history-list');
            
            // Page elements
            const homePage = document.getElementById('home-page');
            const aboutPage = document.getElementById('about-page');
            const contactPage = document.getElementById('contact-page');
            const termsPage = document.getElementById('terms-page');
            const privacyPage = document.getElementById('privacy-page');
            
            // Navigation links
            const navLinks = document.querySelectorAll('.nav-links a');
            const footerLinks = document.querySelectorAll('.footer-links a');
            
            // Auth Elements
            const authButtons = document.getElementById('auth-buttons');
            const userProfile = document.getElementById('user-profile');
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const logoutBtn = document.getElementById('logout-btn');
            const loginBtn = document.getElementById('login-btn');
            const signupBtn = document.getElementById('signup-btn');
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            const closeModalBtns = document.querySelectorAll('.close-modal');
            const showSignup = document.getElementById('show-signup');
            const showLogin = document.getElementById('show-login');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const loginSubmitBtn = document.getElementById('login-submit-btn');
            const signupSubmitBtn = document.getElementById('signup-submit-btn');
            
            // Contact form
            const contactForm = document.getElementById('contact-form');
            
            // Form error elements
            const loginEmailError = document.getElementById('login-email-error');
            const loginPasswordError = document.getElementById('login-password-error');
            const signupNameError = document.getElementById('signup-name-error');
            const signupEmailError = document.getElementById('signup-email-error');
            const signupPasswordError = document.getElementById('signup-password-error');
            const signupConfirmError = document.getElementById('signup-confirm-error');
            
            // Tab elements
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');
            
            let currentVideoData = null;
            let currentUser = null;

            // Check current page from URL
            function checkCurrentPage() {
                const path = window.location.pathname;
                const page = path.split('/').pop().replace('.html', '');
                
                // Hide all pages first
                homePage.style.display = 'none';
                aboutPage.style.display = 'none';
                contactPage.style.display = 'none';
                termsPage.style.display = 'none';
                privacyPage.style.display = 'none';
                
                // Show the current page
                switch(page) {
                    case 'about':
                        aboutPage.style.display = 'block';
                        document.title = 'About - TikTok Video Downloader';
                        break;
                    case 'contact':
                        contactPage.style.display = 'block';
                        document.title = 'Contact - TikTok Video Downloader';
                        break;
                    case 'terms':
                        termsPage.style.display = 'block';
                        document.title = 'Terms of Service - TikTok Video Downloader';
                        break;
                    case 'privacy':
                        privacyPage.style.display = 'block';
                        document.title = 'Privacy Policy - TikTok Video Downloader';
                        break;
                    case 'index':
                    default:
                        homePage.style.display = 'block';
                        document.title = 'TikTok Video Downloader - No Watermark';
                        break;
                }
            }
            
            // Initialize the page
            checkCurrentPage();
            checkAuthStatus();

            // Initially hide sections
            resultSection.style.display = 'none';
            loadingSection.style.display = 'none';
            errorSection.style.display = 'none';
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';

            // Navigation handling
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (this.getAttribute('href').startsWith('http')) return;
                    
                    e.preventDefault();
                    const page = this.getAttribute('href').replace('.html', '');
                    window.history.pushState({}, '', `${page}.html`);
                    checkCurrentPage();
                });
            });
            
            footerLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (this.getAttribute('href').startsWith('http')) return;
                    
                    e.preventDefault();
                    const page = this.getAttribute('href').replace('.html', '');
                    window.history.pushState({}, '', `${page}.html`);
                    checkCurrentPage();
                });
            });
            
            // Handle back/forward navigation
            window.addEventListener('popstate', checkCurrentPage);
            
            // Tab functionality
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    const tabId = tab.getAttribute('data-tab');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });

            // Show notification function
            function showNotification(type, message, duration = 5000) {
                const container = document.getElementById('notification-container');
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                
                let icon;
                switch(type) {
                    case 'success':
                        icon = '<i class="fas fa-check-circle"></i>';
                        break;
                    case 'error':
                        icon = '<i class="fas fa-exclamation-circle"></i>';
                        break;
                    case 'warning':
                        icon = '<i class="fas fa-exclamation-triangle"></i>';
                        break;
                    default:
                        icon = '<i class="fas fa-info-circle"></i>';
                }
                
                notification.innerHTML = `
                    ${icon}
                    <span>${message}</span>
                    <span class="notification-close">&times;</span>
                `;
                
                container.appendChild(notification);
                
                // Show notification
                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);
                
                // Close button
                const closeBtn = notification.querySelector('.notification-close');
                closeBtn.addEventListener('click', () => {
                    closeNotification(notification);
                });
                
                // Auto close after duration
                if (duration) {
                    setTimeout(() => {
                        closeNotification(notification);
                    }, duration);
                }
                
                return notification;
            }
            
            // Close notification
            function closeNotification(notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
            
            // Clear all form errors
            function clearFormErrors() {
                loginEmailError.style.display = 'none';
                loginPasswordError.style.display = 'none';
                signupNameError.style.display = 'none';
                signupEmailError.style.display = 'none';
                signupPasswordError.style.display = 'none';
                signupConfirmError.style.display = 'none';
            }

            // Auth Modal Functions
            function openModal(modal) {
                clearFormErrors();
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
            
            function closeModal(modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            // Auth Event Listeners
            loginBtn.addEventListener('click', () => openModal(loginModal));
            signupBtn.addEventListener('click', () => openModal(signupModal));
            
            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    closeModal(modal);
                });
            });
            
            showSignup.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(loginModal);
                openModal(signupModal);
            });
            
            showLogin.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(signupModal);
                openModal(loginModal);
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === loginModal) {
                    closeModal(loginModal);
                }
                if (e.target === signupModal) {
                    closeModal(signupModal);
                }
            });
            
            // Auth Form Submissions
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value.trim();
                
                // Clear previous errors
                clearFormErrors();
                loginSubmitBtn.disabled = true;
                
                // Validate form
                let isValid = true;
                
                if (!email) {
                    loginEmailError.textContent = 'Email is required';
                    loginEmailError.style.display = 'block';
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    loginEmailError.textContent = 'Please enter a valid email';
                    loginEmailError.style.display = 'block';
                    isValid = false;
                }
                
                if (!password) {
                    loginPasswordError.textContent = 'Password is required';
                    loginPasswordError.style.display = 'block';
                    isValid = false;
                }
                
                if (!isValid) {
                    loginSubmitBtn.disabled = false;
                    return;
                }
                
                // In a real app, you would validate and send to server
                // For demo, we'll just store the user in localStorage
                const users = JSON.parse(localStorage.getItem('tiktok_downloader_users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    currentUser = user;
                    localStorage.setItem('tiktok_downloader_current_user', JSON.stringify(user));
                    checkAuthStatus();
                    closeModal(loginModal);
                    loadDownloadHistory();
                    showNotification('success', 'Logged in successfully!');
                } else {
                    showNotification('error', 'Invalid email or password');
                }
                
                loginSubmitBtn.disabled = false;
            });
            
            // Email validation
            function isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('signup-name').value.trim();
                const email = document.getElementById('signup-email').value.trim();
                const password = document.getElementById('signup-password').value.trim();
                const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
                
                // Clear previous errors
                clearFormErrors();
                signupSubmitBtn.disabled = true;
                
                // Validate form
                let isValid = true;
                
                if (!name) {
                    signupNameError.textContent = 'Name is required';
                    signupNameError.style.display = 'block';
                    isValid = false;
                }
                
                if (!email) {
                    signupEmailError.textContent = 'Email is required';
                    signupEmailError.style.display = 'block';
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    signupEmailError.textContent = 'Please enter a valid email';
                    signupEmailError.style.display = 'block';
                    isValid = false;
                }
                
                if (!password) {
                    signupPasswordError.textContent = 'Password is required';
                    signupPasswordError.style.display = 'block';
                    isValid = false;
                } else if (password.length < 6) {
                    signupPasswordError.textContent = 'Password must be at least 6 characters';
                    signupPasswordError.style.display = 'block';
                    isValid = false;
                }
                
                if (!confirmPassword) {
                    signupConfirmError.textContent = 'Please confirm your password';
                    signupConfirmError.style.display = 'block';
                    isValid = false;
                } else if (password !== confirmPassword) {
                    signupConfirmError.textContent = "Passwords don't match";
                    signupConfirmError.style.display = 'block';
                    isValid = false;
                }
                
                if (!isValid) {
                    signupSubmitBtn.disabled = false;
                    return;
                }
                
                // Check if user already exists
                const users = JSON.parse(localStorage.getItem('tiktok_downloader_users')) || [];
                const userExists = users.some(u => u.email === email);
                
                if (userExists) {
                    showNotification('error', 'User with this email already exists');
                    signupSubmitBtn.disabled = false;
                    return;
                }
                
                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name: name,
                    email: email,
                    password: password,
                    createdAt: new Date().toISOString()
                };
                
                users.push(newUser);
                localStorage.setItem('tiktok_downloader_users', JSON.stringify(users));
                
                // Log in the new user
                currentUser = newUser;
                localStorage.setItem('tiktok_downloader_current_user', JSON.stringify(newUser));
                checkAuthStatus();
                closeModal(signupModal);
                loadDownloadHistory();
                
                showNotification('success', 'Account created successfully!');
                signupSubmitBtn.disabled = false;
            });
            
            // Logout functionality
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('tiktok_downloader_current_user');
                currentUser = null;
                checkAuthStatus();
                showNotification('success', 'Logged out successfully');
            });
            
            // Check auth status and update UI
            function checkAuthStatus() {
                const user = JSON.parse(localStorage.getItem('tiktok_downloader_current_user'));
                
                if (user) {
                    currentUser = user;
                    authButtons.style.display = 'none';
                    userProfile.style.display = 'flex';
                    userName.textContent = user.name;
                    userAvatar.textContent = user.name.charAt(0).toUpperCase();
                    historySection.style.display = 'block';
                    loadDownloadHistory();
                } else {
                    currentUser = null;
                    authButtons.style.display = 'flex';
                    userProfile.style.display = 'none';
                    historySection.style.display = 'none';
                }
            }
            
            // Load download history for current user
            function loadDownloadHistory() {
                if (!currentUser) return;
                
                const history = JSON.parse(localStorage.getItem('tiktok_downloader_history')) || [];
                const userHistory = history.filter(item => item.userId === currentUser.id);
                
                if (userHistory.length === 0) {
                    historyList.innerHTML = '<div class="no-history">No download history yet</div>';
                    return;
                }
                
                historyList.innerHTML = '';
                
                // Sort by date (newest first)
                userHistory.sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));
                
                userHistory.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    
                    historyItem.innerHTML = `
                        <img class="history-thumbnail" src="${item.thumbnail}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/80?text=TikTok'">
                        <div class="history-info">
                            <div class="history-title">${item.title || 'TikTok Video'}</div>
                            <div class="history-date">${formatDate(item.downloadedAt)}</div>
                        </div>
                        <button class="history-download" data-url="${item.videoUrl}">
                            <i class="fas fa-redo"></i>
                        </button>
                    `;
                    
                    historyList.appendChild(historyItem);
                });
                
                // Add event listeners to download buttons
                document.querySelectorAll('.history-download').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const url = this.getAttribute('data-url');
                        tiktokUrlInput.value = url;
                        processTikTokUrl();
                    });
                });
            }
            
            // Format date for display
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            }
            
            // Add item to download history
            function addToHistory(videoData) {
                if (!currentUser) return;
                
                const historyItem = {
                    userId: currentUser.id,
                    videoUrl: videoData.no_watermark_url,
                    thumbnail: videoData.cover,
                    title: videoData.title,
                    downloadedAt: new Date().toISOString()
                };
                
                const history = JSON.parse(localStorage.getItem('tiktok_downloader_history')) || [];
                history.push(historyItem);
                localStorage.setItem('tiktok_downloader_history', JSON.stringify(history));
                
                loadDownloadHistory();
            }
            
            // Contact form submission
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('success', 'Thank you for your message! We will get back to you soon.');
                this.reset();
            });
            
            // Download button click handler
            downloadBtn.addEventListener('click', processTikTokUrl);
            tiktokUrlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    processTikTokUrl();
                }
            });

            // Process TikTok URL
            async function processTikTokUrl() {
                const tiktokUrl = tiktokUrlInput.value.trim();
                
                if (!tiktokUrl) {
                    showError('Please enter a TikTok video URL');
                    showNotification('error', 'Please enter a TikTok video URL');
                    return;
                }
                
                if (!isValidTikTokUrl(tiktokUrl)) {
                    showError('Please enter a valid TikTok video URL');
                    showNotification('error', 'Please enter a valid TikTok video URL');
                    return;
                }
                
                // Show loading, hide other sections
                loadingSection.style.display = 'block';
                resultSection.style.display = 'none';
                errorSection.style.display = 'none';
                
                try {
                    // Use the TikWM API to get video info
                    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`;
                    const response = await fetch(apiUrl);
                    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    
                    const data = await response.json();
                    
                    if (data.code !== 0) {
                        throw new Error(data.msg || 'Failed to fetch video information');
                    }
                    
                    currentVideoData = {
                        no_watermark_url: data.data.play,
                        hd_url: data.data.hdplay || data.data.play,
                        audio_url: data.data.music,
                        cover: data.data.cover,
                        title: data.data.title
                    };
                    
                    displayVideoResult(currentVideoData);
                    
                    // Add to history if user is logged in
                    if (currentUser) {
                        addToHistory(currentVideoData);
                    }
                    
                    showNotification('success', 'Video loaded successfully!');
                } catch (error) {
                    const errorMsg = 'Error processing your request: ' + error.message;
                    showError(errorMsg);
                    showNotification('error', errorMsg);
                }
            }
            
            // Validate TikTok URL
            function isValidTikTokUrl(url) {
                const tiktokRegex = /^https?:\/\/(www\.|vm\.|m\.|vt\.)?tiktok\.com\//;
                return tiktokRegex.test(url);
            }
            
            // Display video result
            function displayVideoResult(videoData) {
                loadingSection.style.display = 'none';
                errorSection.style.display = 'none';
                
                // Set video preview source
                videoPreview.src = videoData.no_watermark_url;
                videoPreview.poster = videoData.cover;
                
                // Set image preview source
                imagePreview.src = videoData.cover;
                
                // Set download buttons with improved download functionality
                downloadNoWatermark.onclick = async () => {
                    await triggerDownload(videoData.no_watermark_url, `tiktok_${Date.now()}_no_watermark.mp4`);
                };
                
                downloadHd.onclick = async () => {
                    await triggerDownload(videoData.hd_url, `tiktok_${Date.now()}_hd.mp4`);
                };
                
                downloadAudio.onclick = async () => {
                    await triggerDownload(videoData.audio_url, `tiktok_${Date.now()}_audio.mp3`);
                };
                
                downloadImage.onclick = async () => {
                    await triggerDownload(videoData.cover, `tiktok_${Date.now()}_cover.jpg`);
                };
                
                resultSection.style.display = 'block';
            }
            
            // Show error message
            function showError(message) {
                loadingSection.style.display = 'none';
                resultSection.style.display = 'none';
                
                errorMessage.textContent = message;
                errorSection.style.display = 'block';
            }
            
            // New function to handle downloads via fetch + blob
            async function triggerDownload(url, filename) {
                try {
                    loadingSection.style.display = 'block';
                    
                    // Fetch the video as a blob
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Failed to fetch video');
                    
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    
                    // Create and trigger download
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    
                    // Cleanup
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(blobUrl);
                        loadingSection.style.display = 'none';
                    }, 100);
                    
                    showNotification('success', 'Download started!');
                } catch (error) {
                    loadingSection.style.display = 'none';
                    const errorMsg = 'Download failed: ' + error.message;
                    showError(errorMsg);
                    showNotification('error', errorMsg);
                }
            }
            
            // Disable right-click context menu on video and image
            videoPreview.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            imagePreview.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        });