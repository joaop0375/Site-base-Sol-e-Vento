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
            waBtn.appendChild(balloon); // Append to the button wrapper if possible, or body
             // Actually, sticking it to body and positioning relative to fixed button is safer
             // But CSS expects it potentially inside or relative. 
             // Let's modify CSS slightly or just append to body and position fixed.
             // Based on CSS '.whatsapp-balloon' usually implies being near the button.
             // The CSS I wrote: .whatsapp-balloon { position: absolute; right: 70px; ... }
             // This implies it should be inside the floating-whatsapp container or relative to it.
             // But .floating-whatsapp is an <a> tag. It can have children.
             waBtn.appendChild(balloon);
             
             // Trigger reflow
             void balloon.offsetWidth;
             
             balloon.classList.add('visible');
             
             // Hide after 10 seconds? Or keep it? User said "exibir", didn't say hide.
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
