<template>
    <div id="top">
        <HeaderSection />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AudienceSection />
        <CtaSection />
        <FooterSection />
        <ThemeToggle />
    </div>
</template>

<script setup lang="ts">
import HeaderSection from "@/components/Landing/Header.vue"
import HeroSection from '@/components/Landing/HeroSection.vue'
import FeaturesSection from '@/components/Landing/FeaturesSection.vue'
import HowItWorksSection from '@/components/Landing/HowItWorksSection.vue'
import AudienceSection from '@/components/Landing/AudienceSection.vue'
import CtaSection from '@/components/Landing/CtaSection.vue'
import FooterSection from '@/components/Landing/FooterSection.vue'
import ThemeToggle from "@/components/common/ThemeToggle.vue"
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue"
</script>
