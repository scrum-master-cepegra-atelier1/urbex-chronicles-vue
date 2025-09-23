<script setup></script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__header__title">URBEX Chronicles</h1>
      <p class="app__header__subtitle">
        Explorez l'architecture abandonnée avec
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue.js</a>
      </p>
    </header>

    <main class="app__main">
      <div class="app__main__card">
        <h2 class="app__main__card__title">Bienvenue dans votre application Vue.js</h2>
        <p class="app__main__card__description">
          Cette application utilise maintenant SCSS pour le styling !
        </p>
        <button class="app__main__card__button--primary">Explorer</button>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/scss/variables' as vars;
@use '@/assets/scss/mixins' as mixins;

.app {
  min-height: 100vh;
  @include mixins.center-element;
  flex-direction: column;
  padding: vars.$spacing-lg;
}

.app__header {
  text-align: center;
  margin-bottom: vars.$spacing-xl;
}

.app__header__title {
  font-size: vars.$font-size-xl * 2;
  color: vars.$primary-color;
  margin-bottom: vars.$spacing-sm;

  // Exemple d'utilisation avancée de SCSS
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: linear-gradient(45deg, vars.$primary-color, vars.$secondary-color);
    margin: vars.$spacing-sm auto;
  }
}

.app__header__subtitle {
  color: color.adjust(vars.$dark-color, $lightness: 20%);
  font-size: vars.$font-size-large;
}

.app__main {
  max-width: 600px;
  width: 100%;
}

.app__main__card {
  background: white;
  border-radius: 8px;
  padding: vars.$spacing-lg;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  @include mixins.transition(box-shadow);

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
}

.app__main__card__title {
  margin-bottom: vars.$spacing-md;
  font-weight: 600;
}

.app__main__card__description {
  margin-bottom: vars.$spacing-md;
}

.app__main__card__button--primary {
  display: inline-block;
  padding: vars.$spacing-sm vars.$spacing-md;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: vars.$font-size-base;
  background-color: vars.$primary-color;
  color: white;
  @include mixins.transition();

  &:hover {
    background-color: color.adjust(vars.$primary-color, $lightness: -10%);
  }
}

// Responsive design
@include mixins.respond-to('md') {
  .app__header__title {
    font-size: vars.$font-size-xl * 2.5;
  }
}
</style>
