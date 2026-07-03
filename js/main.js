// ========================
// Volts Soluções em Elétrica
// Site institucional - JS
// ========================

document.addEventListener('DOMContentLoaded', () => {

    // pegando os elementos da página
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const revealElements = document.querySelectorAll('[data-reveal]');
    const sections = document.querySelectorAll('section[id]');

    // tela de loading - some depois de 800ms
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 800);
    });

    // efeito de sombra no header quando rola a página
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    });

    // menu mobile - abre e fecha
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // fecha o menu quando clica num link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Colete os alvos (headers) que possuem os IDs dos links
    const scrollTargets = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    // deixa o link da nav destacado conforme a seção visível
    window.addEventListener('scroll', () => {
        let currentId = '';
        
        scrollTargets.forEach(target => {
            const targetTop = target.getBoundingClientRect().top;
            // Se o topo do título estiver próximo ao topo da tela
            if (targetTop < 250) {
                currentId = target.getAttribute('id');
            }
        });

        // Se chegou no final da página, ativa o último link (Contato)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentId = scrollTargets[scrollTargets.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    });

    // animação de entrada quando o elemento aparece na tela
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // scroll suave até a seção
    function scrollToSection(href) {
        const target = document.querySelector(href);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('href'));
        });
    });

    // parallax nos orbs do hero - se move mais devagar que a página
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const orbs = document.querySelectorAll('.hero__orb');
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.15;
            orb.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
        });
    });

    // marquee infinito - rola os serviços sem parar
    const marqueeTrack = document.getElementById('marquee');
    if (marqueeTrack) {
        const text = 'ADEQUAÇÃO ELÉTRICA <span class="marquee__dot">•</span> MONTAGEM DE PAINÉIS <span class="marquee__dot">•</span> INSTALAÇÃO RESIDENCIAL <span class="marquee__dot">•</span> ATERRAMENTO SPDA <span class="marquee__dot">•</span> CFTV <span class="marquee__dot">•</span> AR CONDICIONADO <span class="marquee__dot">•</span> ';
        const html = '<span class="marquee__content">' + text + '</span>';
        // duplico 6x pra nunca faltar texto na tela
        marqueeTrack.innerHTML = html + html + html + html + html + html;

        const blocos = marqueeTrack.querySelectorAll('.marquee__content');
        let pos = 0;

        function animate() {
            pos -= 1;
            // quando um bloco inteiro saiu, volta pra posição inicial
            if (pos <= -blocos[0].offsetWidth) {
                pos += blocos[0].offsetWidth;
            }
            marqueeTrack.style.transform = 'translateX(' + pos + 'px)';
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    // efeito magnético nos botões - segue o mouse de leve
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.05) + 'px, ' + (y * 0.05) + 'px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // efeito tilt 3D nos cards de serviço
    document.querySelectorAll('.service').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'perspective(1000px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
        });
    });

    // botão voltar ao topo - aparece ao rolar
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.pageYOffset > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // bloqueia zoom duplo-toque no mobile (permite pinch-to-zoom com 2 dedos)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // ========================
    // Modal de Serviços
    // ========================
    const serviceLinks = document.querySelectorAll('.service__link');
    const modal = document.getElementById('serviceModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (modal) {
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalBtn = document.getElementById('modalBtn');

        const serviceImages = [
            'img/servicos/adequacao.jpg', // Adequacao
            'img/servicos/paineis.jpg', // Paineis
            'img/servicos/residencial.jpg', // Residencial
            'img/servicos/spda.jpg', // SPDA
            'img/servicos/comercial.jpg', // Comercial
            'img/servicos/cftv.jpg', // CFTV
            'img/servicos/ar.jpg'  // Ar
        ];

        serviceLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get parent article to extract data
                const article = link.closest('.service');
                const title = article.querySelector('.service__title').innerText;
                const text = article.querySelector('.service__text').innerText;
                const originalHref = link.getAttribute('href'); // WhatsApp Link

                // Populate modal
                modalTitle.innerText = title;
                modalDesc.innerText = text + ' Nossa equipe está pronta para avaliar sua necessidade e propor a melhor solução técnica. Fale conosco para um orçamento sem compromisso!';
                modalImg.src = serviceImages[index] || serviceImages[0];
                modalBtn.href = originalHref;

                // Open modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // block background scroll
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modalClose.addEventListener('click', closeModal);
        
        // Fechar ao apertar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
