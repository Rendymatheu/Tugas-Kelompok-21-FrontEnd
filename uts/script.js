// jQuery Document Ready
$(document).ready(function() {
    // Variables
    let currentFilter = 'all';
    let searchTerm = '';
    let welcomeScreenShown = false;

    // Initialize
    initializeWebsite();

    function initializeWebsite() {
        // Show welcome screen first
        showWelcomeScreen();
        
        // Load saved filter from memory (instead of localStorage)
        const savedData = window.appData || {};
        if (savedData.lastFilter) {
            currentFilter = savedData.lastFilter;
            $('.filter-btn').removeClass('active');
            $(`.filter-btn[data-filter="${currentFilter}"]`).addClass('active');
        }

        // Setup event listeners
        setupEventListeners();
        
        // Initialize scroll animations
        setupScrollAnimations();
        
        // Initialize navbar behavior
        setupNavbar();
    }

    function showWelcomeScreen() {
        // Hide welcome screen after animation completes
        setTimeout(() => {
            $('#welcomeScreen').addClass('hide');
            
            // Remove welcome screen from DOM after transition
            setTimeout(() => {
                $('#welcomeScreen').remove();
                welcomeScreenShown = true;
                
                // Show main content and start hero animations
                $('body').css('overflow', 'auto');
                $('.fade-in').addClass('visible');
                
                // Start hero title letter animation
                setTimeout(() => {
                    animateHeroTitle();
                }, 500);
                
            }, 800); // Match CSS transition duration
        }, 4000); // Total welcome screen display time
    }

    function animateHeroTitle() {
        const letters = $('.hero-title .letter');
        
        letters.each(function(index) {
            const letter = $(this);
            
            // Set initial state
            letter.css({
                'opacity': '0',
                'transform': 'translateY(100px) rotateX(90deg)',
                'display': 'inline-block'
            });
            
            // Animate each letter with delay
            setTimeout(() => {
                letter.css({
                    'opacity': '1',
                    'transform': 'translateY(0) rotateX(0deg)',
                    'transition': 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                });
                
                // Add bouncing effect
                setTimeout(() => {
                    letter.addClass('letter-bounce');
                }, 800);
                
            }, index * 150); // Stagger delay
        });
        
        // Add hover effects after animation completes
        setTimeout(() => {
            addHeroTitleHoverEffects();
        }, letters.length * 150 + 1000);
    }

    function addHeroTitleHoverEffects() {
        $('.hero-title .letter').hover(
            function() {
                $(this).css({
                    'transform': 'translateY(-10px) scale(1.2)',
                    'color': '#ff4747ff',
                    'text-shadow': '0 10px 20px rgba(255, 99, 71, 0.5)',
                    'transition': 'all 0.3s ease'
                });
            },
            function() {
                $(this).css({
                    'transform': 'translateY(0) scale(1)',
                    'color': 'white',
                    'text-shadow': '2px 2px 4px rgba(0,0,0,0.5)',
                    'transition': 'all 0.3s ease'
                });
            }
        );
    }

    function setupEventListeners() {
        // Mobile menu toggle
        $('.hamburger').on('click', function() {
            $('.nav-menu').toggleClass('open');
        });

        // Optional: close menu when link clicked (mobile UX)
        $('.nav-link').on('click', function() {
            if ($(window).width() <= 700) {
                $('.nav-menu').removeClass('open');
            }
        });

        // Smooth scrolling for navigation links
        $('.nav-link').on('click', function(e) {
            e.preventDefault();
            const target = $(this).attr('href');
            
            // Close mobile menu
            $('.nav-menu').removeClass('active');
            $('.hamburger').removeClass('active');
            $('.hamburger span').css({
                'transform': 'none',
                'opacity': '1'
            });
            
            // Update active link
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
            
            // Smooth scroll to target
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70
            }, 800, 'easeInOutQuart');
        });

        // Hero button scroll to sejarah
        $('#learnMoreBtn').on('click', function() {
            $('html, body').animate({
                scrollTop: $('#sejarah').offset().top - 70
            }, 1000, 'easeInOutQuart');
        });

        // Expand buttons in penjelasan section
        $('.expand-btn').on('click', function() {
            const expandedContent = $(this).siblings('.expanded-content');
            const isExpanded = expandedContent.hasClass('show');
            
            if (isExpanded) {
                expandedContent.removeClass('show');
                $(this).text('Lihat Selengkapnya');
            } else {
                expandedContent.addClass('show');
                $(this).text('Sembunyikan');
            }
        });

        // Filter buttons
        $('.filter-btn').on('click', function() {
            const filter = $(this).data('filter');
            
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            currentFilter = filter;
            
            // Save filter to memory
            if (!window.appData) window.appData = {};
            window.appData.lastFilter = filter;
            
            applyFilters();
        });

        // Search input
        $('#searchInput').on('input', function() {
            searchTerm = $(this).val().toLowerCase();
            applyFilters();
        });

        // Window resize handler
        $(window).on('resize', function() {
            if ($(window).width() > 768) {
                $('.nav-menu').removeClass('active');
                $('.hamburger').removeClass('active');
            }
        });

        // Skip welcome screen on click (emergency skip)
        $('#welcomeScreen').on('click', function() {
            if (!welcomeScreenShown) {
                $(this).addClass('hide');
                setTimeout(() => {
                    $(this).remove();
                    welcomeScreenShown = true;
                    $('body').css('overflow', 'auto');
                    $('.fade-in').addClass('visible');
                    setTimeout(() => animateHeroTitle(), 500);
                }, 800);
            }
        });

        // Modal functionality
        $('.rendang-card').on('click', function() {
            const category = $(this).data('category');
            const modalId = getModalId(category);
            if (modalId) {
                $(`#${modalId}`).css('display', 'block');
                $('body').css('overflow', 'hidden'); // Prevent background scrolling
            }
        });

        // Close modal when clicking close button
        $('.close-btn').on('click', function() {
            $(this).closest('.modal').css('display', 'none');
            $('body').css('overflow', 'auto'); // Restore scrolling
        });

        // Close modal when clicking outside modal content
        $('.modal').on('click', function(e) {
            if (e.target === this) {
                $(this).css('display', 'none');
                $('body').css('overflow', 'auto'); // Restore scrolling
            }
        });

        // Close modal on Escape key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                $('.modal').css('display', 'none');
                $('body').css('overflow', 'auto'); // Restore scrolling
            }
        });
    }

    function setupNavbar() {
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            
            // Navbar background change
            if (scrollTop > 50) {
                $('.navbar').addClass('scrolled');
            } else {
                $('.navbar').removeClass('scrolled');
            }
            
            // Update active navigation based on scroll position
            updateActiveNavigation();
        });
    }

    function updateActiveNavigation() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        $('section[id]').each(function() {
            const sectionTop = $(this).offset().top - 100;
            const sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                const sectionId = $(this).attr('id');
                $('.nav-link').removeClass('active');
                $(`.nav-link[href="#${sectionId}"]`).addClass('active');
            }
        });
    }

    function setupScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        $('.fade-in').each(function() {
            observer.observe(this);
        });

        // Parallax effect for hero section
        $(window).on('scroll', function() {
            const scrolled = $(window).scrollTop();
            const parallaxSpeed = 0.5;
            
            $('.hero-background').css('transform', `translateY(${scrolled * parallaxSpeed}px)`);
        });
    }

    function applyFilters() {
        const $cards = $('.rendang-card');
        let visibleCount = 0;

        $('.no-results').remove();
        $('.result-count').remove();

        $cards.each(function() {
            const $card = $(this);
            const category = $card.attr('data-category');
            const title = $card.find('h3').text().toLowerCase();
            const description = $card.find('p').text().toLowerCase();

            let showCard = true;

            // Filter kategori
            if (currentFilter !== 'all' && category !== currentFilter) {
                showCard = false;
            }

            // Filter pencarian (lebih robust)
            if (searchTerm.trim() !== '') {
                // Gabungkan judul dan deskripsi jadi satu string
                const combinedText = (title + ' ' + description).replace(/\s+/g, ' ').trim();
                // Cek apakah searchTerm ada di combinedText
                if (!combinedText.includes(searchTerm.trim())) {
                    showCard = false;
                }
            }

            if (showCard) {
                $card.removeClass('hidden').addClass('visible').show();
                visibleCount++;
            } else {
                $card.removeClass('visible').addClass('hidden').hide();
            }
        });

        // Tampilkan pesan jika tidak ada hasil
        if (visibleCount === 0) {
            $('.rendang-grid').append(`
                <div class="no-results" style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #666;
                    font-size: 1.2rem;
                    background: rgba(255,255,255,0.8);
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
                    <h3 style="color: #8B4513; margin-bottom: 1rem;">Tidak ada rendang yang ditemukan</h3>
                    <p style="font-size: 1rem; margin-bottom: 1rem;">
                        ${searchTerm ? `Pencarian "${searchTerm}" tidak menghasilkan hasil.` : 'Tidak ada item dalam kategori ini.'}
                    </p>
                    <button onclick="$('#searchInput').val('').trigger('input'); $('.filter-btn[data-filter=all]').click();" 
                            style="
                                margin-top: 1rem;
                                background: linear-gradient(45deg, #FF6347, #FF4500);
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 20px;
                                cursor: pointer;
                                font-size: 0.9rem;
                            ">
                        Reset Filter
                    </button>
                </div>
            `);
        }

        // Tampilkan jumlah hasil
        $('.rendang-grid').before(`
            <div class="result-count" style="
                text-align: center;
                margin-bottom: 1rem;
                color: #8B4513;
                font-size: 0.9rem;
                font-weight: 500;
            ">
                Menampilkan ${visibleCount} dari ${$cards.length} jenis rendang
            </div>
        `);
    }
    
    function updateResultCount(count) {
        $('.result-count').remove();
        if (searchTerm || currentFilter !== 'all') {
            const countHtml = `
                <div class="result-count" style="
                    text-align: center;
                    margin-bottom: 1rem;
                    color: #8B4513;
                    font-size: 0.9rem;
                    font-weight: 500;
                ">
                    Menampilkan ${count} dari ${$('.rendang-card').length} jenis rendang
                </div>
            `;
            $('.rendang-grid').before(countHtml);
        }
    }

    // Custom easing functions
    $.extend($.easing, {
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    });

    // Modal helper function
    function getModalId(category) {
        const modalMap = {
            'sapi': 'modal-sapi',
            'unggas': 'modal-ayam', // Note: using 'ayam' for unggas category
            'sayuran': 'modal-jengkol', // Default to jengkol for sayuran, but we need to handle multiple
            'laut': 'modal-kerang'
        };
        return modalMap[category] || null;
    }

    // Additional interactive features
    setupAdditionalFeatures();

    function setupAdditionalFeatures() {
        // Add dynamic styles for animations
        if (!$('#dynamic-styles').length) {
            $('head').append(`
                <style id="dynamic-styles">
                    button.clicked {
                        transform: scale(0.95) !important;
                    }
                    .card-icon, .placeholder-img {
                        transition: transform 0.3s ease;
                    }
                    .letter-bounce {
                        animation: letterBounce 0.6s ease-in-out;
                    }
                    @keyframes letterBounce {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-5px) scale(1.05); }
                    }
                    .hero-title .letter {
                        display: inline-block;
                        transform-origin: center;
                    }
                </style>
            `);
        }

        // Hover effects for cards
        $('.penjelasan-card, .rendang-card').hover(
            function() {
                $(this).find('.card-icon, .placeholder-img').css('transform', 'scale(1.1)');
            },
            function() {
                $(this).find('.card-icon, .placeholder-img').css('transform', 'scale(1)');
            }
        );

        // Click effects for buttons
        $('button').on('click', function() {
            const button = $(this);
            button.addClass('clicked');
            setTimeout(() => {
                button.removeClass('clicked');
            }, 200);
        });
    }
})