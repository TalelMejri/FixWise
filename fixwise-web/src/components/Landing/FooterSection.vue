<template>
    <footer class="bg-[var(--bg-primary)] px-5 py-14 md:px-8 md:py-18" id="about">
        <div class="mx-auto max-w-7xl">
            <!-- Footer Top -->
            <div
                class="flex flex-col gap-10 pb-12 border-b border-[var(--border-color)] lg:flex-row lg:justify-between lg:gap-16">
                <!-- Brand -->
                <div class="max-w-sm">
                    <a href="#top" class="inline-flex items-center gap-2 mb-4 no-underline">
                        <img :src="logo" alt="" class="h-9 w-9" />
                        <span class="text-lg font-bold text-[var(--text-primary)]">FixWise</span>
                    </a>
                    <p class="text-sm leading-relaxed text-[var(--text-muted)] mb-6">
                        {{ $t('footer.tagline') }}
                    </p>

                    <!-- Newsletter -->
                    <form class="flex gap-2 max-w-sm" @submit.prevent="subscribed = true">
                        <label for="newsletter-email" class="sr-only">Email address</label>
                        <input id="newsletter-email" v-model="email" type="email" required
                            :placeholder="$t('footer.newsletterPlaceholder')"
                            class="flex-1 min-w-0 px-3 py-2.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2" />
                        <button type="submit"
                            class="flex-shrink-0 px-4 py-2.5 rounded-full bg-[var(--accent-primary)] text-white text-sm font-semibold transition-colors hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                            {{ $t('footer.newsletterButton') }}
                        </button>
                    </form>
                    <p v-if="subscribed" class="mt-2 text-sm text-[var(--accent-primary)]" role="status">
                        {{ $t('footer.newsletterConfirm') }}
                    </p>
                </div>

                <!-- Columns -->
                <div class="grid grid-cols-2 gap-8 flex-1 sm:grid-cols-4">
                    <div v-for="col in columns" :key="col.title">
                        <h3 class="text-xs font-bold uppercase tracking-[0.06em] text-[var(--text-primary)] mb-4">
                            {{ $t(`footer.${col.key}`) }}
                        </h3>
                        <ul class="flex flex-col gap-2.5">
                            <li v-for="link in col.links" :key="link">
                                <a href="#"
                                    class="text-sm text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 rounded">
                                    {{ $t(`footer.${link}`) }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="pt-7 flex flex-col-reverse items-center gap-5 sm:flex-row sm:justify-between">
                <p class="text-xs text-[var(--text-muted)]/60">
                    © {{ year }} FixWise. {{ $t('footer.copyright') }}
                </p>
                <div class="flex items-center gap-3">
                    <!-- Language Switcher -->
                    <language-switcher />

                    <!-- Social Links -->
                    <div class="flex gap-2.5">
                        <a v-for="s in socials" :key="s.label" :href="s.href"
                            class="h-8 w-8 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] transition-all hover:bg-[var(--accent-primary)]/15 hover:text-white hover:border-[var(--accent-primary)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                            :aria-label="s.label">
                            <component :is="s.icon" :size="16" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Twitter, Linkedin, Github, Instagram } from 'lucide-vue-next'
import logo from '@/assets/logo.png'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'

const { t } = useI18n()

const email = ref('')
const subscribed = ref(false)
const year = new Date().getFullYear()

const columns = [
    {
        title: 'Product',
        key: 'product',
        links: ['features', 'howItWorksLink', 'solutionsLink', 'changelog']
    },
    {
        title: 'Company',
        key: 'company',
        links: ['aboutLink', 'careers', 'contact', 'press']
    },
    {
        title: 'Resources',
        key: 'resources',
        links: ['helpCenter', 'community', 'apiStatus', 'guides']
    },
    {
        title: 'Legal',
        key: 'legal',
        links: ['privacy', 'terms', 'security']
    },
]

const socials = [
    { label: 'X (Twitter)', href: '#', icon: Twitter },
    { label: 'LinkedIn', href: '#', icon: Linkedin },
    { label: 'GitHub', href: '#', icon: Github },
    { label: 'Instagram', href: '#', icon: Instagram },
]
</script>

<style scoped>
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* RTL Support for footer */
[dir="rtl"] .footer-logo {
    flex-direction: row-reverse;
}

[dir="rtl"] .newsletter {
    flex-direction: row-reverse;
}

[dir="rtl"] .footer-socials {
    flex-direction: row-reverse;
}
</style>