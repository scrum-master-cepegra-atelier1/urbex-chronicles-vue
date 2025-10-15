<template>
  <div v-if="isVisible" class="circuit-complete-modal" @click="closeModal">
    <div class="circuit-complete-modal__content" @click.stop>
      <div class="circuit-complete-modal__header">
        <h2 class="circuit-complete-modal__title">🎉 Félicitations !</h2>
        <p class="circuit-complete-modal__subtitle">
          Vous avez terminé le circuit "{{ circuitName }}"
        </p>
      </div>

      <div class="circuit-complete-modal__body">
        <div class="circuit-complete-modal__stats">
          <div class="circuit-complete-modal__stat">
            <span class="circuit-complete-modal__stat-label">Missions complétées</span>
            <span class="circuit-complete-modal__stat-value">{{ missionsCompleted }}</span>
          </div>
          <div class="circuit-complete-modal__stat">
            <span class="circuit-complete-modal__stat-label">Temps total</span>
            <span class="circuit-complete-modal__stat-value">{{ formattedTime }}</span>
          </div>
        </div>

        <div class="circuit-complete-modal__achievement" v-if="achievement">
          <h3>🏆 Récompense obtenue</h3>
          <p>{{ achievement.name }} (+{{ achievement.experience }} XP)</p>
        </div>
      </div>

      <div class="circuit-complete-modal__actions">
        <button
          @click="goHome"
          class="circuit-complete-modal__btn circuit-complete-modal__btn--primary"
        >
          Retour à l'accueil
        </button>
        <button
          @click="closeModal"
          class="circuit-complete-modal__btn circuit-complete-modal__btn--secondary"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  circuitName: {
    type: String,
    default: 'Circuit',
  },
  missionsCompleted: {
    type: Number,
    default: 0,
  },
  timeElapsed: {
    type: Number,
    default: 0,
  },
  achievement: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'go-home'])

const router = useRouter()

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timeElapsed / 60)
  const seconds = props.timeElapsed % 60
  return `${minutes}min ${seconds}s`
})

function closeModal() {
  emit('close')
}

function goHome() {
  emit('go-home')
  router.push({ name: 'Home' })
}
</script>

<style scoped lang="scss">
.circuit-complete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;

  &__content {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    color: #23232b;
    margin-bottom: 0.5rem;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: #6b7280;
  }

  &__body {
    margin-bottom: 2rem;
  }

  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__stat {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
  }

  &__stat-label {
    display: block;
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  &__stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: #23232b;
  }

  &__achievement {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #fef3c7, #f59e0b);
    border-radius: 12px;
    margin-bottom: 1rem;

    h3 {
      margin-bottom: 0.5rem;
      color: #92400e;
      font-size: 1.2rem;
    }

    p {
      color: #92400e;
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  &__btn {
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;

    &--primary {
      background: #3b82f6;
      color: white;

      &:hover {
        background: #2563eb;
      }
    }

    &--secondary {
      background: #e5e7eb;
      color: #374151;

      &:hover {
        background: #d1d5db;
      }
    }
  }
}

@media (max-width: 640px) {
  .circuit-complete-modal {
    &__stats {
      grid-template-columns: 1fr;
    }

    &__actions {
      flex-direction: column;
    }
  }
}
</style>
