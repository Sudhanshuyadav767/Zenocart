 document.addEventListener('DOMContentLoaded', function() {
            // --- Sticky Header ---
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // --- Mobile Menu Toggle ---
            const menuToggle = document.getElementById('mobile-menu-toggle');
            const navMenu = document.getElementById('nav-menu');
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // --- Back to Top Button ---
            const backToTopButton = document.getElementById('back-to-top');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });
        });