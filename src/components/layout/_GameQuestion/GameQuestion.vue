<template>
  <div class="game-question">
    <div class="game-question__header">
      <h3 class="game-question__title">{{ question.title }}</h3>
      <p class="game-question__statement">{{ question.statement }}</p>
    </div>

    <!-- QCM Questions -->
    <div
      v-if="question.type === 'qcm' && question.data?.choices && question.data.choices.length > 0"
      class="game-question__options"
    >
      <label
        v-for="(choice, index) in question.data.choices"
        :key="index"
        class="game-question__option"
        :class="{ 'game-question__option--selected': selectedAnswer === choice }"
      >
        <input
          type="radio"
          :name="`question-${question.id}`"
          :value="choice"
          v-model="selectedAnswer"
          class="game-question__option-input"
        />
        <span class="game-question__option-text">{{ choice }}</span>
      </label>
    </div>

    <!-- Enigme Questions (text input) -->
    <div v-else-if="question.type === 'enigme'" class="game-question__input">
      <input
        type="text"
        v-model="selectedAnswer"
        placeholder="Tapez votre réponse..."
        class="game-question__text-input"
        @keyup.enter="submitAnswer"
      />
    </div>

    <!-- Other question types fallback -->
    <div v-else class="game-question__input">
      <input
        type="text"
        v-model="selectedAnswer"
        placeholder="Tapez votre réponse..."
        class="game-question__text-input"
        @keyup.enter="submitAnswer"
      />
    </div>

    <button @click="submitAnswer" :disabled="!selectedAnswer" class="game-question__submit">
      Valider la réponse
    </button>

    <!-- Result feedback -->
    <div v-if="showResult" class="game-question__result">
      <p v-if="isCorrect" class="game-question__result--correct">
        ✓ Bonne réponse !
        <span v-if="question.answer?.explanation">{{ question.answer.explanation }}</span>
      </p>
      <p v-else class="game-question__result--wrong">✗ Mauvaise réponse. Essayez encore !</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['correct-answer'])

const selectedAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)

// Reset when question changes
watch(
  () => props.question,
  () => {
    selectedAnswer.value = ''
    showResult.value = false
    isCorrect.value = false
  },
  { immediate: true },
)

function submitAnswer() {
  if (!selectedAnswer.value) return

  showResult.value = true

  // Check answer based on question type and API structure
  let correct = false

  if (props.question.type === 'qcm' && props.question.answer?.correct) {
    correct = selectedAnswer.value === props.question.answer.correct
  } else if (props.question.type === 'enigme' && props.question.answer?.correct) {
    // Case insensitive comparison for enigma
    correct =
      selectedAnswer.value.toLowerCase().trim() ===
      props.question.answer.correct.toLowerCase().trim()
  } else if (typeof props.question.answer === 'string') {
    // Fallback for simple string answers
    correct =
      selectedAnswer.value.toLowerCase().trim() === props.question.answer.toLowerCase().trim()
  }

  isCorrect.value = correct

  if (correct) {
    // Delay to show success message before moving to next
    setTimeout(() => {
      emit('correct-answer')
    }, 1500)
  }
}
</script>

<style scoped lang="scss">
.game-question {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;

  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #23232b;
    margin-bottom: 0.5rem;
  }

  &__statement {
    font-size: 1.1rem;
    color: #6b7280;
    line-height: 1.6;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__option {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #3b82f6;
      background-color: #f8fafc;
    }

    &--selected {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
  }

  &__option-input {
    margin-right: 1rem;
    accent-color: #3b82f6;
  }

  &__option-text {
    font-size: 1rem;
    color: #374151;
  }

  &__input {
    margin-bottom: 2rem;
  }

  &__text-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }

  &__submit {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover:not(:disabled) {
      background: #2563eb;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }

  &__result {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;

    &--correct {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    &--wrong {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  }
}
</style>
