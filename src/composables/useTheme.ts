import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const theme = ref('light')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  })

  return {
    theme,
    toggleTheme
  }
}
