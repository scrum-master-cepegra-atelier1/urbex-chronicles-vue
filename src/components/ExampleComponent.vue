<script setup>
/**
 * ExampleComponent - Composant d'exemple suivant les conventions URBEX CHRONICLES
 *
 * @description Composant démonstration des bonnes pratiques Vue.js
 */

import { ref, computed } from 'vue'

// Props avec validation
const props = defineProps({
  /**
   * Titre du composant
   * @type {String}
   * @required
   */
  title: {
    type: String,
    required: true,
    validator: (value) => value.length > 0,
  },

  /**
   * Variante du composant
   * @type {String}
   * @default 'primary'
   */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value),
  },

  /**
   * État actif du composant
   * @type {Boolean}
   * @default false
   */
  isActive: {
    type: Boolean,
    default: false,
  },
})

// Events
const emit = defineEmits({
  /**
   * Émis lors du clic sur le composant
   * @param {Object} payload - Données émises
   */
  click: (payload) => payload && typeof payload === 'object',

  /**
   * Émis lors du changement d'état
   * @param {Boolean} isActive - Nouvel état
   */
  'update:isActive': (isActive) => typeof isActive === 'boolean',
})

// State réactif
const isExpanded = ref(false)
const clickCount = ref(0)

// Computed
const componentClasses = computed(() => {
  return {
    'example-component': true,
    'example-component--active': props.isActive,
    'example-component--expanded': isExpanded.value,
    [`example-component--${props.variant}`]: true,
  }
})

// Methods
const handleClick = () => {
  clickCount.value++
  isExpanded.value = !isExpanded.value

  emit('click', {
    clickCount: clickCount.value,
    isExpanded: isExpanded.value,
    variant: props.variant,
  })

  emit('update:isActive', !props.isActive)
}
</script>

<template>
  <div :class="componentClasses">
    <header class="example-component__header">
      <h3 class="example-component__header__title">
        {{ title }}
      </h3>
      <span class="example-component__header__badge--{{ variant }}">
        {{ variant }}
      </span>
    </header>

    <main class="example-component__content">
      <p class="example-component__content__text">
        <!-- Slot pour le contenu principal -->
        <slot name="content"> Contenu par défaut du composant </slot>
      </p>

      <div v-if="isExpanded" class="example-component__content__details">
        <p class="example-component__content__details__info">Clics : {{ clickCount }}</p>

        <!-- Slot pour les détails -->
        <slot name="details">
          <p>Informations détaillées</p>
        </slot>
      </div>
    </main>

    <footer class="example-component__footer">
      <button
        class="example-component__footer__button--action"
        @click="handleClick"
        :aria-expanded="isExpanded"
        :aria-label="`${isExpanded ? 'Réduire' : 'Développer'} le composant ${title}`"
      >
        {{ isExpanded ? 'Réduire' : 'Développer' }}
      </button>

      <!-- Slot pour actions supplémentaires -->
      <slot name="actions" />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.example-component {
  background: white;
  border-radius: 8px;
  border: 1px solid lighten($dark-color, 60%);
  overflow: hidden;
  @include transition(all);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &--active {
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }

  &--expanded {
    .example-component__content__details {
      max-height: 200px;
      opacity: 1;
    }
  }

  &--primary {
    .example-component__header {
      background-color: lighten($primary-color, 45%);
    }
  }

  &--secondary {
    .example-component__header {
      background-color: lighten($secondary-color, 45%);
    }
  }

  &--danger {
    .example-component__header {
      background-color: lighten($danger-color, 45%);
    }
  }
}

.example-component__header {
  padding: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid lighten($dark-color, 70%);
}

.example-component__header__title {
  margin: 0;
  font-size: $font-size-large;
  font-weight: 600;
  color: $dark-color;
}

.example-component__header__badge--primary {
  background-color: $primary-color;
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: 4px;
  font-size: $font-size-small;
  text-transform: uppercase;
  font-weight: 600;
}

.example-component__header__badge--secondary {
  background-color: $secondary-color;
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: 4px;
  font-size: $font-size-small;
  text-transform: uppercase;
  font-weight: 600;
}

.example-component__header__badge--danger {
  background-color: $danger-color;
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: 4px;
  font-size: $font-size-small;
  text-transform: uppercase;
  font-weight: 600;
}

.example-component__content {
  padding: $spacing-md;
}

.example-component__content__text {
  margin-bottom: $spacing-sm;
  line-height: 1.6;
  color: $dark-color;
}

.example-component__content__details {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  @include transition(all, 0.3s, ease-in-out);
  background-color: lighten($light-color, 2%);
  padding: 0 $spacing-md;
  border-radius: 4px;
  margin-top: $spacing-sm;

  &.example-component--expanded & {
    padding: $spacing-md;
  }
}

.example-component__content__details__info {
  font-weight: 600;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.example-component__footer {
  padding: $spacing-md;
  background-color: lighten($light-color, 2%);
  border-top: 1px solid lighten($dark-color, 70%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.example-component__footer__button--action {
  background-color: $primary-color;
  color: white;
  border: none;
  padding: $spacing-sm $spacing-md;
  border-radius: 4px;
  cursor: pointer;
  font-size: $font-size-base;
  @include transition(background-color);

  &:hover {
    background-color: darken($primary-color, 10%);
  }

  &:focus {
    outline: 2px solid $primary-color;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(1px);
  }
}

// Responsive (Mobile First)
@include respond-to('md') {
  .example-component__header {
    padding: $spacing-lg;
  }

  .example-component__content {
    padding: $spacing-lg;
  }

  .example-component__footer {
    padding: $spacing-lg;
  }
}
</style>
