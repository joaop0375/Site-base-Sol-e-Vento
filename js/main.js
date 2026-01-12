document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        const icon = navList.classList.contains('active') ? 'x' : 'menu';
        // Need to re-render lucide icon if we were swapping them, 
        // but for simplicity we rely on toggle visibility or just keep simple.
        // Let's just toggle visibility class.
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });

    // Handle Form Submission
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

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
        });
    }

    // Smooth Scroll for Anchors (handled by CSS, but fallback/enhanced here if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Reveal Animation
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
