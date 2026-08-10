<template>
    <div class="hero-wrapper">
        <div class="video-container">
            <video class="video-bg" autoplay muted loop playsinline :src="BG_VIDEO" />
            <div class="video-overlay"></div>
        </div>

        <!-- Navbar -->
        <nav class="navbar">
            <!-- Logo -->
            <div class="logo">
                <img src="@/assets/logo.png" alt="FixWise Logo" class="logo-img" />
                <span class="logo-text">FixWise</span>
            </div>

            <!-- Desktop Nav -->
            <div class="nav-pill">
                <button v-for="link in navLinks" :key="link.label" class="nav-link"
                    :class="link.active ? 'nav-link-active' : 'nav-link-inactive'">
                    {{ link.label }}
                    <ChevronDown v-if="link.dropdown" :size="14" class="nav-chevron" />
                </button>
            </div>

            <!-- Desktop CTAs -->
            <div class="cta-desktop">
                <button class="btn-ghost">Log in</button>
                <button class="btn-primary">Begin Now</button>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" @click="menuOpen = !menuOpen">
                <X v-if="menuOpen" :size="20" />
                <Menu v-else :size="20" />
            </button>
        </nav>

        <!-- Mobile Menu -->
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-4 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-4 scale-95"
        >
            <div v-if="menuOpen" class="mobile-menu">
                <button v-for="link in navLinks" :key="link.label" class="mobile-nav-link"
                    :class="link.active ? 'mobile-nav-link-active' : 'mobile-nav-link-inactive'">
                    <span>{{ link.label }}</span>
                    <ChevronDown v-if="link.dropdown" :size="14" />
                </button>
                <div class="mobile-ctas">
                    <button class="mobile-btn-ghost">Log in</button>
                    <button class="mobile-btn-primary">Begin Now</button>
                </div>
            </div>
        </Transition>

        <!-- Hero Content -->
        <div class="hero-content">
            <!-- Badge -->
            <div class="hero-badge">
                <span class="badge-dot"></span>
                <span class="badge-text">Smart Maintenance Management</span>
            </div>

            <!-- Title -->
            <h1 class="hero-title">
                Organize, Track, and
                <span class="hero-title-gradient">Maintain</span>
                With Confidence
            </h1>

            <!-- Description -->
            <p class="hero-description">
                FixWise helps you manage maintenance for your home, vehicles, appliances, 
                and equipment with intelligent AI assistance and smart scheduling.
            </p>

            <!-- CTAs -->
            <div class="hero-ctas">
                <button class="hero-btn-primary">
                    Get Started Free
                    <ArrowRight :size="18" class="btn-arrow" />
                </button>
                <button class="hero-btn-secondary">
                    Learn More
                </button>
            </div>

            <!-- Stats -->
            <div class="hero-stats">
                <div class="stat-item">
                    <span class="stat-value">10K+</span>
                    <span class="stat-label">Assets Tracked</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-value">5K+</span>
                    <span class="stat-label">Maintenance Logs</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-value">98%</span>
                    <span class="stat-label">Satisfaction Rate</span>
                </div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="scroll-indicator">
            <span class="scroll-text">Scroll</span>
            <div class="scroll-line">
                <div class="scroll-progress"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-vue-next'

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4'

const navLinks = [
    { label: 'Home', active: true },
    { label: 'Features', dropdown: true },
    { label: 'Pricing' },
    { label: 'About' },
]

const menuOpen = ref(false)
</script>

<style scoped>
/* ===== Container ===== */
.hero-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #001f3d;
}

/* ===== Video ===== */
.video-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.video-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
}

.video-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(0, 31, 61, 0.4) 0%,
        rgba(0, 31, 61, 0.1) 30%,
        rgba(0, 31, 61, 0.5) 60%,
        rgba(0, 31, 61, 0.8) 100%
    );
}

/* ===== Navbar ===== */
.navbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 31, 61, 0.6) 0%,
        transparent 100%
    );
}

@media (min-width: 640px) {
    .navbar {
        padding: 1rem 2rem;
    }
}

@media (min-width: 1024px) {
    .navbar {
        padding: 1.25rem 3rem;
    }
}

/* ===== Logo ===== */
.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    flex-shrink: 0;
    min-width: 120px;
}

.logo-img {
    height: 32px;
    width: auto;
    max-width: 100px;
    object-fit: contain;
}

@media (min-width: 640px) {
    .logo-img {
        height: 40px;
        max-width: 120px;
    }
}

.logo-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    letter-spacing: -0.01em;
    white-space: nowrap;
}

@media (min-width: 640px) {
    .logo-text {
        font-size: 1.25rem;
    }
}

/* ===== Desktop Nav ===== */
.nav-pill {
    display: none;
    align-items: center;
    gap: 0.25rem;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.75rem;
    padding: 0.4rem;
}

@media (min-width: 768px) {
    .nav-pill {
        display: flex;
    }
}

@media (min-width: 1024px) {
    .nav-pill {
        padding: 0.5rem;
    }
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    transition: all 0.2s ease;
    cursor: pointer;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
}

@media (min-width: 1024px) {
    .nav-link {
        padding: 0.375rem 1rem;
        font-size: 0.875rem;
    }
}

.nav-link-active {
    background: rgba(232, 122, 0, 0.2);
    color: white;
}

.nav-link-inactive {
    color: rgba(255, 255, 255, 0.6);
}

.nav-link-inactive:hover {
    color: white;
    background: rgba(232, 122, 0, 0.1);
}

.nav-chevron {
    margin-top: 1px;
}

/* ===== Desktop CTAs ===== */
.cta-desktop {
    display: none;
    align-items: center;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .cta-desktop {
        display: flex;
    }
}

.btn-ghost {
    padding: 0.5rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
}

@media (min-width: 1024px) {
    .btn-ghost {
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
    }
}

.btn-ghost:hover {
    background: rgba(232, 122, 0, 0.15);
}

.btn-primary {
    padding: 0.5rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    background: #e87a00;
    border: none;
    transition: all 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
}

@media (min-width: 1024px) {
    .btn-primary {
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
    }
}

.btn-primary:hover {
    background: #f58a1a;
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(232, 122, 0, 0.3);
}

/* ===== Menu Toggle ===== */
.menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: white;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: all 0.2s ease;
}

@media (min-width: 768px) {
    .menu-toggle {
        display: none;
    }
}

.menu-toggle:hover {
    background: rgba(232, 122, 0, 0.15);
}

/* ===== Mobile Menu ===== */
.mobile-menu {
    position: absolute;
    top: 4.5rem;
    left: 0.75rem;
    right: 0.75rem;
    z-index: 30;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    border-radius: 1rem;
    background: rgba(0, 31, 61, 0.98);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(232, 122, 0, 0.1);
    max-height: 80vh;
    overflow-y: auto;
}

@media (min-width: 768px) {
    .mobile-menu {
        display: none;
    }
}

.mobile-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    cursor: pointer;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
}

.mobile-nav-link-active {
    background: rgba(232, 122, 0, 0.15);
    color: white;
}

.mobile-nav-link-inactive {
    color: rgba(255, 255, 255, 0.6);
}

.mobile-nav-link-inactive:hover {
    color: white;
    background: rgba(232, 122, 0, 0.08);
}

.mobile-ctas {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(232, 122, 0, 0.1);
}

.mobile-btn-ghost {
    flex: 1;
    padding: 0.625rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.2s ease;
    cursor: pointer;
}

.mobile-btn-primary {
    flex: 1;
    padding: 0.625rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background: #e87a00;
    border: none;
    transition: all 0.2s ease;
    cursor: pointer;
}

.mobile-btn-primary:hover {
    background: #f58a1a;
}

/* ===== Hero Content ===== */
.hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 20;
    padding: 1.5rem 1.25rem 2.5rem;
    max-width: 42rem;
}

@media (min-width: 640px) {
    .hero-content {
        padding: 2rem 2.5rem 3.5rem;
    }
}

@media (min-width: 1024px) {
    .hero-content {
        padding: 2.5rem 3.5rem 4.5rem;
    }
}

/* ===== Hero Badge ===== */
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem 0.25rem 0.5rem;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(232, 122, 0, 0.1);
    margin-bottom: 1rem;
}

@media (min-width: 640px) {
    .hero-badge {
        padding: 0.375rem 0.875rem 0.375rem 0.625rem;
        margin-bottom: 1.5rem;
    }
}

.badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e87a00;
    animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }
}

.badge-text {
    font-size: 0.6rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

@media (min-width: 640px) {
    .badge-text {
        font-size: 0.7rem;
        letter-spacing: 0.1em;
    }
}

/* ===== Hero Title ===== */
.hero-title {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: white;
    margin-bottom: 0.75rem;
}

@media (min-width: 640px) {
    .hero-title {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
}

@media (min-width: 1024px) {
    .hero-title {
        font-size: 4rem;
    }
}

@media (min-width: 1280px) {
    .hero-title {
        font-size: 4.5rem;
    }
}

.hero-title-gradient {
    background: linear-gradient(135deg, #e87a00, #f58a1a, #ff9a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ===== Hero Description ===== */
.hero-description {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    max-width: 28rem;
    margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
    .hero-description {
        font-size: 0.95rem;
        line-height: 1.7;
        margin-bottom: 1.75rem;
    }
}

@media (min-width: 1024px) {
    .hero-description {
        font-size: 1.05rem;
    }
}

/* ===== Hero CTAs ===== */
.hero-ctas {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

@media (min-width: 640px) {
    .hero-ctas {
        gap: 0.75rem;
        margin-bottom: 2.5rem;
    }
}

.hero-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 500;
    color: white;
    background: #e87a00;
    border: none;
    transition: all 0.3s ease;
    cursor: pointer;
}

@media (min-width: 640px) {
    .hero-btn-primary {
        padding: 0.75rem 1.75rem;
        font-size: 0.9rem;
    }
}

@media (min-width: 1024px) {
    .hero-btn-primary {
        padding: 0.875rem 2rem;
        font-size: 1rem;
    }
}

.hero-btn-primary:hover {
    background: #f58a1a;
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(232, 122, 0, 0.3);
}

.btn-arrow {
    transition: transform 0.3s ease;
}

.hero-btn-primary:hover .btn-arrow {
    transform: translateX(4px);
}

.hero-btn-secondary {
    padding: 0.625rem 1.25rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 500;
    color: white;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
}

@media (min-width: 640px) {
    .hero-btn-secondary {
        padding: 0.75rem 1.75rem;
        font-size: 0.9rem;
    }
}

@media (min-width: 1024px) {
    .hero-btn-secondary {
        padding: 0.875rem 2rem;
        font-size: 1rem;
    }
}

.hero-btn-secondary:hover {
    background: rgba(232, 122, 0, 0.1);
    border-color: rgba(232, 122, 0, 0.2);
    transform: translateY(-2px);
}

/* ===== Hero Stats ===== */
.hero-stats {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

@media (min-width: 640px) {
    .hero-stats {
        gap: 1.5rem;
    }
}

.stat-item {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: white;
}

@media (min-width: 640px) {
    .stat-value {
        font-size: 1.125rem;
    }
}

.stat-label {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

@media (min-width: 640px) {
    .stat-label {
        font-size: 0.7rem;
    }
}

.stat-divider {
    width: 1px;
    height: 1.5rem;
    background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 480px) {
    .stat-divider {
        display: none;
    }
}

/* ===== Scroll Indicator ===== */
.scroll-indicator {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 20;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.4;
}

@media (min-width: 1024px) {
    .scroll-indicator {
        display: flex;
        bottom: 2.5rem;
        right: 2.5rem;
    }
}

.scroll-text {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.4);
}

.scroll-line {
    width: 1px;
    height: 3rem;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.scroll-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: rgba(232, 122, 0, 0.5);
    animation: scroll-bounce 2s ease-in-out infinite;
}

@keyframes scroll-bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(60%);
    }
}

/* ===== Responsive Fixes ===== */
@media (max-width: 480px) {
    .logo-img {
        height: 28px;
        max-width: 80px;
    }
    
    .logo-text {
        font-size: 0.9rem;
    }
    
    .hero-title {
        font-size: 1.75rem;
    }
    
    .hero-description {
        font-size: 0.8rem;
    }
    
    .hero-btn-primary,
    .hero-btn-secondary {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    
    .hero-content {
        padding: 1rem 1rem 2rem;
    }
}

@media (min-width: 481px) and (max-width: 767px) {
    .logo-img {
        height: 32px;
        max-width: 100px;
    }
    
    .logo-text {
        font-size: 1rem;
    }
}

/* ===== Liquid Glass Effect ===== */
.liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.liquid-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.45) 0%,
        rgba(255, 255, 255, 0.15) 20%,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0) 60%,
        rgba(255, 255, 255, 0.15) 80%,
        rgba(255, 255, 255, 0.45) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}
</style>