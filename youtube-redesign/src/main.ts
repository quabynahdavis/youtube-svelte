import { mount } from 'svelte'
import '@fontsource-variable/figtree' // wght 300–900 variable; 400–900 in use
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
