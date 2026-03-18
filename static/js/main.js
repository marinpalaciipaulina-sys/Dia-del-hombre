/**
 * ===================================
 * REGALO OSO POLAR - INTERACCIONES (Corregido)
 * JavaScript modular, robusto y optimizado
 * ===================================
 */

(function() {
    'use strict';

    // ===================================
    // CONFIGURACION
    // ===================================
    
    const CONFIG = {
        typingSpeed: 50,
        typingDelay: 1000, // Aumentado para dar tiempo a cargar
        confettiCount: 150,
        revealThreshold: 0.15
    };

    // ===================================
    // ESTADO DE LA APLICACION
    // ===================================
    
    const state = {
        welcomeComplete: false,
        confettiActive: false,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // ===================================
    // DATOS LOCALES (Fallback)
    // ===================================
    
    const FALLBACK_DATA = {
        mensajesInteractivos: [
            "Eres mi tranquilidad en medio del caos.",
            "A tu lado aprendí que el amor sí puede ser bonito.",
            "No eres perfecto, pero eres perfecto para mí.",
            "Tu sonrisa ilumina mis días más oscuros.",
            "Me haces sentir como en casa, donde sea que estemos.",
            "Eres mi persona favorita en todo el mundo."
        ],
        mensajeSecreto: "Oso polar... si algún día dudas de lo mucho que te amo, vuelve aquí. Porque todo esto lo hice pensando en ti, en lo que eres para mí y en lo feliz que me haces. Eres mi presente bonito y mi futuro deseado.",
        galeria: [
            { id: 1, imagen: '/static/images/Love is 1.png', mensaje: 'Amor es reír contigo sin razón.' },
            { id: 2, imagen: '/static/images/Love is 2.png', mensaje: 'Amor es elegirte todos los días.' },
            { id: 3, imagen: '/static/images/Love is 3.png', mensaje: 'Amor es sentir paz cuando estás conmigo.' },
            { id: 4, imagen: '/static/images/Love is 4.png', mensaje: 'Amor es tenerte como mi lugar seguro.' },
            { id: 5, imagen: '/static/images/Love is 5.png', mensaje: 'Amor es cada momento a tu lado.' },
            { id: 6, imagen: '/static/images/Love is 6.png', mensaje: 'Amor es tu abrazo, mi refugio favorito.' },
            { id: 7, imagen: '/static/images/Love is 7.png', mensaje: 'Amor es mirarte y saber que todo estará bien.' },
            { id: 8, imagen: '/static/images/Love is 8.png', mensaje: 'Amor es construir un mundo solo para dos.' }
        ]
    };

    // ===================================
    // UTILIDADES
    // ===================================
    
    const utils = {
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        random(min, max) {
            return Math.random() * (max - min) + min;
        },
        sanitize(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    };

    // ===================================
    // TYPING EFFECT
    // ===================================
    
    class TypingEffect {
        constructor(element, text, speed = CONFIG.typingSpeed) {
            this.element = element;
            this.text = text;
            this.speed = speed;
            this.index = 0;
        }

        start() {
            if (!this.element) return;
            this.type();
        }

        type() {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                const delay = state.reducedMotion ? 0 : this.speed;
                setTimeout(() => this.type(), delay);
            }
        }
    }

    // ===================================
    // CONFETTI DE CORAZONES
    // ===================================
    
    class Confetti {
        constructor(canvas) {
            if (!canvas) {
                console.warn('Canvas no disponible para confetti');
                return null;
            }
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            if (!this.ctx) return null;
            
            this.hearts = [];
            this.running = false;
            this.resize();
            
            window.addEventListener('resize', utils.throttle(() => this.resize(), 200));
        }

        resize() {
            if(!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createHeart() {
            return {
                x: utils.random(0, this.canvas.width),
                y: -20,
                size: utils.random(8, 20),
                speedY: utils.random(1, 3),
                speedX: utils.random(-1, 1),
                rotation: utils.random(0, Math.PI * 2),
                rotationSpeed: utils.random(-0.05, 0.05),
                opacity: utils.random(0.3, 0.8),
                hue: utils.random(40, 55)
            };
        }

        drawHeart(heart) {
            this.ctx.save();
            this.ctx.translate(heart.x, heart.y);
            this.ctx.rotate(heart.rotation);
            this.ctx.globalAlpha = heart.opacity;
            
            const size = Math.max(1, heart.size);
            
            this.ctx.fillStyle = `hsl(${heart.hue}, 80%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, size * 0.3);
            this.ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size);
            this.ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
            this.ctx.fill();
            
            this.ctx.restore();
        }

        start() {
            if (state.reducedMotion || !this.ctx) return;
            
            this.running = true;
            this.hearts = [];
            
            for (let i = 0; i < CONFIG.confettiCount; i++) {
                const heart = this.createHeart();
                heart.y = utils.random(-this.canvas.height, this.canvas.height);
                this.hearts.push(heart);
            }
            
            this.animate();
        }

        animate() {
            if (!this.running || !this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.hearts.forEach((heart, index) => {
                heart.y += heart.speedY;
                heart.x += heart.speedX;
                heart.rotation += heart.rotationSpeed;
                
                if (heart.y > this.canvas.height + 20) {
                    this.hearts[index] = this.createHeart();
                }
                
                this.drawHeart(heart);
            });
            
            requestAnimationFrame(() => this.animate());
        }

        stop() {
            this.running = false;
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    // ===================================
    // SCROLL REVEAL
    // ===================================
    
    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll('[data-reveal]');
            this.init();
        }

        init() {
            if (state.reducedMotion) {
                this.elements.forEach(el => el.classList.add('revealed'));
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => this.handleIntersect(entries),
                { threshold: CONFIG.revealThreshold }
            );

            this.elements.forEach(el => observer.observe(el));
        }

        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                }
            });
        }
    }

    // ===================================
    // GESTOR DE GALERIA
    // ===================================
    
    class GalleryManager {
        constructor() {
            this.grid = document.getElementById('gallery-grid');
            this.overlay = document.getElementById('image-overlay');
            this.overlayImage = document.getElementById('overlay-image');
            this.overlayMessage = document.getElementById('overlay-message');
            this.closeBtn = document.getElementById('close-overlay');
            
            if (this.grid) this.init();
        }

        init() {
            this.loadGallery();
            this.bindEvents();
        }

        async loadGallery() {
            let items = FALLBACK_DATA.galeria;
            
            try {
                const response = await fetch('/api/galeria');
                if (response.ok) {
                    items = await response.json();
                }
            } catch (e) {
                console.log('Usando datos locales para galeria');
            }
            
            this.renderGallery(items);
        }

        renderGallery(items) {
            if (!this.grid) return;
            
            // Generamos solo las fichas (cards)
            this.grid.innerHTML = items.map((item, index) => `
                <div class="gallery-card opacity-0" data-reveal="up" data-delay="${index * 50}">
                    <img src="${utils.sanitize(item.imagen)}" 
                         alt="Recuerdo especial" 
                         loading="lazy">
                </div>
            `).join('');
            
            // Re-inicializar animaciones de scroll reveal
            new ScrollReveal();
            
            // Asignar eventos de click a las nuevas tarjetas
            this.grid.querySelectorAll('.gallery-card').forEach((card, index) => {
                card.addEventListener('click', () => this.openOverlay(items[index]));
                
                // Accesibilidad: hacer la tarjeta focuseable
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', `Ver mensaje: ${items[index].mensaje}`);
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') this.openOverlay(items[index]);
                });
            });
        }

        openOverlay(item) {
            if (!this.overlay || !this.overlayImage || !this.overlayMessage) return;
            
            // Imagen grande y mensaje centrado
            this.overlayImage.src = item.imagen;
            this.overlayImage.alt = item.mensaje;
            this.overlayMessage.textContent = item.mensaje;
            
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        closeOverlay() {
            if (!this.overlay) return;
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        bindEvents() {
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.closeOverlay());
            }
            
            if (this.overlay) {
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay) this.closeOverlay();
                });
            }
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeOverlay();
            });
        }
    }

    // ===================================
    // GESTOR DE MENSAJES SECRETOS
    // ===================================
    
    class SecretMessages {
        constructor() {
            this.buttons = document.querySelectorAll('.secret-btn');
            this.messageContainer = document.getElementById('secret-message');
            this.messageText = document.getElementById('secret-text');
            
            if (this.buttons.length > 0) this.init();
        }

        init() {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', () => this.showMessage());
                
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    btn.style.setProperty('--mouse-x', `${x}%`);
                    btn.style.setProperty('--mouse-y', `${y}%`);
                });
            });
        }

        async showMessage() {
            let message = FALLBACK_DATA.mensajesInteractivos[Math.floor(Math.random() * FALLBACK_DATA.mensajesInteractivos.length)];
            
            try {
                const response = await fetch('/api/mensaje-interactivo');
                if (response.ok) {
                    const data = await response.json();
                    message = data.mensaje;
                }
            } catch (e) {
                // Silencioso, usa fallback
            }
            
            if (this.messageContainer && this.messageText) {
                this.messageContainer.classList.remove('hidden');
                this.messageText.textContent = message;
                
                // Reiniciar animacion
                this.messageContainer.style.animation = 'none';
                void this.messageContainer.offsetWidth; // Trigger reflow
                this.messageContainer.style.animation = '';
            }
        }
    }

    // ===================================
    // MENSAJE SECRETO CON TYPING
    // ===================================
    
    class SecretTyping {
        constructor() {
            this.container = document.getElementById('secret-typing');
            this.typed = false;
            if (this.container) this.init();
        }

        init() {
            const observer = new IntersectionObserver(
                (entries) => this.handleIntersect(entries),
                { threshold: 0.5 }
            );
            
            observer.observe(this.container);
        }

        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.typed) {
                    this.typed = true;
                    this.startTyping();
                }
            });
        }

        async startTyping() {
            let message = FALLBACK_DATA.mensajeSecreto;
            
            try {
                const response = await fetch('/api/mensaje-secreto');
                if (response.ok) {
                    const data = await response.json();
                    message = data.mensaje;
                }
            } catch (e) {
                // Silencioso
            }
            
            const typing = new TypingEffect(this.container, message, 40);
            typing.start();
        }
    }

    // ===================================
    // PANTALLA DE BIENVENIDA (CORREGIDA)
    // ===================================
    
    class WelcomeScreen {
        constructor() {
            this.screen = document.getElementById('welcome-screen');
            this.enterBtn = document.getElementById('enter-btn');
            this.typingText = document.getElementById('typing-text');
            this.canvas = document.getElementById('confetti-canvas');
            this.mainContent = document.getElementById('main-content');
            
            this.confetti = null;
            
            // Inicializar siempre que los elementos existan
            if (this.screen) {
                this.init();
            } else {
                console.error('Elemento welcome-screen no encontrado');
            }
        }

        init() {
            this.startTyping();
            this.bindEvents();
        }

        startTyping() {
            const text = "Hoy celebro al hombre que me hace sentir amada, segura y feliz...";
            
            setTimeout(() => {
                if (this.typingText) {
                    const typing = new TypingEffect(this.typingText, text, CONFIG.typingSpeed);
                    typing.start();
                }
            }, CONFIG.typingDelay);
        }

        // Intenta iniciar confetti de forma segura
        startConfetti() {
            if (state.confettiActive) return;
            
            state.confettiActive = true;
            
            if (this.canvas) {
                try {
                    this.confetti = new Confetti(this.canvas);
                    if (this.confetti) {
                        this.confetti.start();
                    }
                } catch (e) {
                    console.error("Error iniciando confetti:", e);
                }
            }
        }

        // Función principal para ocultar la bienvenida
        hideWelcome() {
            // CÓDIGO NUEVO: Scroll hacia arriba inmediatamente
            window.scrollTo(0, 0);

            // 1. Iniciar confetti (si falla, no importa, el resto sigue)
            this.startConfetti();

            // 2. Ocultar pantalla con transición
            setTimeout(() => {
                if (this.screen) {
                    this.screen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    this.screen.style.opacity = '0';
                    this.screen.style.transform = 'translateY(-20px)';
                    // Prevenir clicks mientras se desvanece
                    this.screen.style.pointerEvents = 'none'; 
                }
                
                // 3. Mostrar contenido principal
                if (this.mainContent) {
                    this.mainContent.classList.remove('opacity-0', 'pointer-events-none');
                }

                // 4. Limpieza final después de la animación
                setTimeout(() => {
                    if (this.screen) {
                        this.screen.style.display = 'none';
                    }
                    // Detener confetti después de un tiempo para no gastar recursos
                    setTimeout(() => {
                        if (this.confetti) this.confetti.stop();
                    }, 3000);
                    
                    state.welcomeComplete = true;
                    
                    // Iniciar revelación de scroll para el nuevo contenido
                    new ScrollReveal();

                }, 800); // Coincide con la transición CSS

            }, 200); // Pequeña pausa para que el confetti empiece
        }

        bindEvents() {
            if (!this.enterBtn) {
                console.error('Botón enter-btn no encontrado');
                return;
            }
            
            // Evento click
            this.enterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Botón clickeado');
                this.hideWelcome();
            });

            // Evento teclado (Accesibilidad)
            this.enterBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Teclado activado');
                    this.hideWelcome();
                }
            });
        }
    }

    // ===================================
    // FLIP CARDS (Accesibilidad)
    // ===================================
    
    class FlipCards {
        constructor() {
            this.cards = document.querySelectorAll('.flip-card');
            if (this.cards.length > 0) this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', 'Voltear tarjeta para ver mensaje');
                
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.classList.toggle('flipped');
                    }
                });
            });
            
            // Inicializar efecto tilt
            this.initTiltEffect();
        }

        // Añade este método dentro de la clase FlipCards
        initTiltEffect() {
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    if (card.classList.contains('flipped')) return; // No tilt si está volteada
                    
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const xVal = (x - rect.width / 2) / 10;
                    const yVal = (y - rect.height / 2) / 10;
                    
                    // Inclinación sutil (solo en el frente)
                    const inner = card.querySelector('.flip-card-inner');
                    if (inner) {
                        inner.style.transform = `rotateY(${xVal}deg) rotateX(${-yVal}deg)`;
                    }
                });

                card.addEventListener('mouseleave', () => {
                    const inner = card.querySelector('.flip-card-inner');
                    if (inner) {
                        inner.style.transform = '';
                    }
                });
            });
        }
    }

    // ===================================
    // INICIALIZACION
    // ===================================
    
    function init() {
        new WelcomeScreen();
        new GalleryManager();
        new SecretMessages();
        new SecretTyping();
        new FlipCards();
        
        // Scroll reveal inicial (para elementos que ya están visibles)
        // Nota: El WelcomeScreen también llama a ScrollReveal al cerrarse.
        new ScrollReveal();
        
        console.log('App inicializada correctamente');
    }

    // Iniciar cuando el DOM este listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
