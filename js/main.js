document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const icon = mobileMenuBtn.querySelector('i');

    function toggleMenu() {
        navList.classList.toggle('active');
        // Optional: Animate icon or swap it
        if (navList.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons(); // Re-render icon
    }

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navList.classList.contains('active') && !navList.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navList.classList.remove('active');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });


    // 2. WhatsApp Balloon Logic
    setTimeout(() => {
        const balloon = document.createElement('div');
        balloon.className = 'whatsapp-balloon';
        balloon.innerHTML = 'Olá! Posso te ajudar com um orçamento?';

        const waBtn = document.querySelector('.floating-whatsapp');
        if (waBtn) {
            waBtn.appendChild(balloon);
            void balloon.offsetWidth;
            balloon.classList.add('visible');
        }
    }, 5000);


    // 3. Form Validation & Submission
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        const inputs = quoteForm.querySelectorAll('input');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateInput(input);
            });

            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });

        function validateInput(input) {
            const nextElement = input.nextElementSibling;
            // Create error message element if not exists
            let errorMsg = null;
            if (nextElement && nextElement.classList.contains('input-error-message')) {
                errorMsg = nextElement;
            } else {
                errorMsg = document.createElement('span');
                errorMsg.className = 'input-error-message';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }

            if (input.checkValidity()) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                errorMsg.style.display = 'none';
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                errorMsg.textContent = input.validationMessage;
                errorMsg.style.display = 'block';
            }
        }

        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all before sending
            let isValid = true;
            inputs.forEach(input => {
                validateInput(input);
                if (!input.checkValidity()) isValid = false;
            });

            if (!isValid) return;

            const formData = new FormData(quoteForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const bill = formData.get('bill');

            // Construct WhatsApp Message
            const message = `*SOLICITAÇÃO DE ORÇAMENTO SOL & VENTO*\n\n*Nome:* ${name}\n*Email:* ${email}\n*Telefone:* ${phone}\n*Média da Conta:* R$ ${bill}\n\n-----------------------------------\nEnviado através do site.`;
            const whatsappNumber = '556299576462';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Optional: Reset form
            quoteForm.reset();
            inputs.forEach(i => i.classList.remove('valid'));
        });
    }

    // 4. Counter Animation
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const counters = document.querySelectorAll('.stat-number');
        let started = false;

        const startCounters = () => {
            counters.forEach(counter => {
                const target = +counter.innerText.replace(/\D/g, ''); // Extract number
                if (target === 0) return; // Skip non-numbers like 95% if parsed wrong, but regex helps.

                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + (counter.innerText.includes('%') ? '%' : (counter.innerText.includes('+') ? '+' : ''));
                        // Simple re-append suffix if needed, but better logic:
                        // Restore prefix/suffix?
                        // For "+1000", target=1000. Text -> "+"+current.
                        if (counter.dataset.originalText.includes('+')) counter.innerText = "+" + Math.ceil(current);
                        else if (counter.dataset.originalText.includes('%')) counter.innerText = Math.ceil(current) + "%";
                        else counter.innerText = Math.ceil(current);

                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = counter.dataset.originalText; // Ensure exact final value
                    }
                };

                // Store original text
                counter.dataset.originalText = counter.innerText;
                updateCounter();
            });
        };

        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                startCounters();
                started = true;
            }
        });

        statsObserver.observe(statsSection);
    }

    // 5. Exit Intent Popup
    const exitModal = document.getElementById('exitModal');
    if (exitModal) {
        const closeModal = document.querySelector('.close-modal');
        let hasShown = false;

        // Trigger on mouse leaving viewport (desktop)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !hasShown) {
                exitModal.style.display = 'flex';
                hasShown = true;
            }
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                exitModal.style.display = 'none';
            });
        }

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target == exitModal) {
                exitModal.style.display = 'none';
            }
        });
    }

    // Scroll Reveal Animation (Keep existing)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});
