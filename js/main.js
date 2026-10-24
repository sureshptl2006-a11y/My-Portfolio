(function () {
    'use strict';

    // ============ THREE.JS SCENE ============
    function initThreeScene() {
        const container = document.getElementById('canvas-container');
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const mouse = { x: 0, y: 0 };
        let scrollY = 0;
        let targetScroll = 0;

        // ============ STAR PARTICLES ============
        const particleCount = window.innerWidth < 768 ? 1000 : 2000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);

        const colors = [
            new THREE.Color('#0aa3b8'),
            new THREE.Color('#7c4dff'),
            new THREE.Color('#f472b6'),
            new THREE.Color('#8a8a8f')
        ];

        for (let i = 0; i < particleCount * 3; i += 3) {
            const r = 8 + Math.random() * 14;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            posArray[i] = r * Math.sin(phi) * Math.cos(theta);
            posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            posArray[i + 2] = r * Math.cos(phi);

            const col = colors[Math.floor(Math.random() * colors.length)];
            colorArray[i] = col.r;
            colorArray[i + 1] = col.g;
            colorArray[i + 2] = col.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            transparent: true,
            opacity: 0.5,
            vertexColors: true,
            blending: THREE.NormalBlending,
            depthWrite: false
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // ============ TORUS KNOT CENTERPIECE ============
        const torusKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(2.2, 0.6, 128, 24),
            new THREE.MeshStandardMaterial({
                color: '#7c4dff',
                metalness: 0.7,
                roughness: 0.3,
                emissive: '#e6d9ff',
                emissiveIntensity: 0.35,
                wireframe: false
            })
        );
        torusKnot.position.set(4, -1, -6);
        scene.add(torusKnot);

        const wireSphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.6, 32, 32),
            new THREE.MeshBasicMaterial({
                color: '#0aa3b8',
                wireframe: true,
                transparent: true,
                opacity: 0.3
            })
        );
        wireSphere.position.set(-5, 2, -5);
        scene.add(wireSphere);

        const smallTorus = new THREE.Mesh(
            new THREE.TorusGeometry(0.9, 0.3, 16, 48),
            new THREE.MeshStandardMaterial({
                color: '#e0247a',
                metalness: 0.6,
                roughness: 0.3,
                emissive: '#ffd0e4',
                emissiveIntensity: 0.35
            })
        );
        smallTorus.position.set(6, 3, -3);
        scene.add(smallTorus);

        const icosahedron = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.7, 0),
            new THREE.MeshStandardMaterial({
                color: '#0aa3b8',
                metalness: 0.7,
                roughness: 0.3,
                emissive: '#d9f3ff',
                emissiveIntensity: 0.5
            })
        );
        icosahedron.position.set(-7, -3, -2);
        scene.add(icosahedron);

        // ============ LIGHTS ============
        scene.add(new THREE.AmbientLight('#ffffff', 1.1));

        const pointLight1 = new THREE.PointLight('#0aa3b8', 1.2, 30);
        pointLight1.position.set(5, 4, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight('#7c4dff', 1.2, 30);
        pointLight2.position.set(-5, -3, 4);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight('#e0247a', 0.8, 25);
        pointLight3.position.set(0, 5, -5);
        scene.add(pointLight3);

        // ============ ANIMATION LOOP ============
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Smooth scroll interpolation
            targetScroll = window.pageYOffset || document.documentElement.scrollTop;
            scrollY += (targetScroll - scrollY) * 0.08;

            const scrollFactor = scrollY * 0.0012;

            // Rotate particle sphere slowly
            particlesMesh.rotation.y = elapsed * 0.03;
            particlesMesh.rotation.x = Math.sin(elapsed * 0.05) * 0.1;
            particlesMesh.rotation.z = elapsed * 0.015;

            // Float & rotate geometric shapes
            torusKnot.rotation.x = elapsed * 0.25;
            torusKnot.rotation.y = elapsed * 0.35;
            torusKnot.position.y = -1 + Math.sin(elapsed * 0.6) * 0.5;

            wireSphere.rotation.y = elapsed * 0.2;
            wireSphere.rotation.z = elapsed * 0.15;
            wireSphere.position.y = 2 + Math.sin(elapsed * 0.7 + 1) * 0.6;

            smallTorus.rotation.x = elapsed * 0.4;
            smallTorus.rotation.y = elapsed * 0.5;
            smallTorus.position.y = 3 + Math.sin(elapsed * 0.8 + 2) * 0.7;

            icosahedron.rotation.x = elapsed * 0.6;
            icosahedron.rotation.z = elapsed * 0.5;
            icosahedron.position.y = -3 + Math.cos(elapsed * 0.5 + 3) * 0.5;

            // Camera parallax with mouse
            const parallaxX = mouse.x * 0.6;
            const parallaxY = mouse.y * 0.4;

            scene.rotation.x = -parallaxY * 0.06;
            scene.rotation.y = parallaxX * 0.06;

            // Scroll-driven camera zoom & group movement
            particlesMesh.rotation.y += scrollFactor;
            scene.position.y = scrollFactor * 14;

            // Move camera closer on scroll (zoom effect)
            camera.position.z = 12 + scrollFactor * 3;

            // Animate lights
            pointLight1.position.x = 5 + Math.sin(elapsed * 1.2) * 2;
            pointLight1.position.y = 4 + Math.cos(elapsed * 1.1) * 2;
            pointLight2.position.x = -5 + Math.sin(elapsed * 0.9 + 2) * 2;
            pointLight2.position.y = -3 + Math.cos(elapsed * 1.3 + 1) * 2;

            renderer.render(scene, camera);
        }
        animate();

        // ============ MOUSE MOVE ============
        window.addEventListener('mousemove', function (e) {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // ============ RESIZE ============
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    try {
        initThreeScene();
    } catch (err) {
        console.warn("3D background unavailable:", err);
    }

    // ============ NAV SCROLL STATE ============
    const nav = document.getElementById('nav');
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = scrollPercent + '%';

        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============ TYPING EFFECT ============
    const typedTextEl = document.querySelector('.typed-text');
    const phrases = ['Full-Stack Web.', '3D Interfaces.', 'AI Workflows.', 'UI/UX Design.'];
    const initialText = typedTextEl.textContent.trim();
    let phraseIndex = 0;
    let charIndex = initialText.length;
    let deleting = initialText.length > 0;

    function type() {
        const current = phrases[phraseIndex];
        if (deleting) {
            typedTextEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex < 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 300);
                return;
            }
            setTimeout(type, 40);
        } else {
            typedTextEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex > current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
            setTimeout(type, 70);
        }
    }
    setTimeout(type, 1200);

    // ============ SCROLL REVEAL ============
    function countUp(el, target) {
        const duration = 1500;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    let countsRun = false;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');

                if (!countsRun) {
                    document.querySelectorAll('.count').forEach(function (c) {
                        countUp(c, parseInt(c.dataset.target, 10));
                    });
                    countsRun = true;
                }

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-header, .about-card, .stat, .skill-group, .skill-bar-item, .timeline-item, .project-card, .contact-info, .contact-form').forEach(function (el) {
        observer.observe(el);
    });

    // Skill bars fill when skill group becomes visible
    const skillGroupObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
                        bar.style.width = bar.dataset.width || '0%';
                    });
                }, 300);
                skillGroupObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-group').forEach(function (g) {
        skillGroupObserver.observe(g);
    });

    // ============ CONTACT FORM ============
    const CONTACT_EMAIL = 'sureshpatel-ecs@atharvacoe.ac.in';
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const senderName = contactForm.querySelector('#name').value.trim();
            const senderEmail = contactForm.querySelector('#email').value.trim();
            const senderMessage = contactForm.querySelector('#message').value.trim();

            const subject = 'Portfolio enquiry from ' + (senderName || 'a visitor');
            const body = senderMessage +
                '\n\n---\n' +
                'From: ' + (senderName || 'Not provided') +
                '\nEmail: ' + (senderEmail || 'Not provided');

            const btn = contactForm.querySelector('.btn');
            btn.textContent = 'Opening your mail app...';
            btn.style.background = 'linear-gradient(135deg, #00c853, #1de9b6)';

            window.location.href = 'mailto:' + CONTACT_EMAIL +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            setTimeout(function () {
                btn.textContent = 'Send Message';
                btn.style.background = '';
            }, 2500);
        });
    }

    // ============ ACTIVE NAV LINK ============
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.style.color = link.getAttribute('href') === '#' + id ? '#6d3ef4' : '';
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(function (s) {
        sectionObserver.observe(s);
    });

})();