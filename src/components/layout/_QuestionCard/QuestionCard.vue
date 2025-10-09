<template>
  <div class="question-card">
    <h2 class="question-card__info__title">{{ questionnaire.question }}</h2>
    <p class="question-card__info__description" v-if="questionnaire.explanation">
      {{ questionnaire.explanation }}
    </p>
    <img
      v-if="questionnaire.image"
      :src="questionnaire.image"
      alt="question image"
      class="question-card__info__image"
    />
    <!-- Multiple Choice -->
    <section v-if="questionnaire.type === 'multiple-choice'" class="question-card__info__answers">
      <div
        v-for="(option, idx) in questionnaire.options"
        :key="idx"
        class="question-card__info__answers__answer"
      >
        <input
          type="radio"
          :name="'answer-' + questionnaire.id"
          :id="'answer-' + idx"
          :value="option"
          v-model="selectedAnswer"
          @change="checkAnswer(option)"
        />
        <label :for="'answer-' + idx">{{ option }}</label>
      </div>
    </section>
    <!-- Boolean (True/False) -->
    <section v-else-if="questionnaire.type === 'boolean'" class="question-card__info__answers">
      <div class="question-card__info__answers__answer">
        <input
          type="radio"
          :name="'answer-' + questionnaire.id"
          id="true"
          value="true"
          v-model="selectedAnswer"
          @change="checkAnswer(true)"
        />
        <label for="true">Vrai</label>
      </div>
      <div class="question-card__info__answers__answer">
        <input
          type="radio"
          :name="'answer-' + questionnaire.id"
          id="false"
          value="false"
          v-model="selectedAnswer"
          @change="checkAnswer(false)"
        />
        <label for="false">Faux</label>
      </div>
    </section>
    <!-- Text Answer -->
    <section v-else-if="questionnaire.type === 'text'" class="question-card__info__answers">
      <input
        type="text"
        v-model="selectedAnswer"
        @keyup.enter="checkAnswer(selectedAnswer)"
        placeholder="Votre réponse..."
      />
      <button @click="checkAnswer(selectedAnswer)">Valider</button>
    </section>
    <!-- Result -->
    <aside class="question-card__info__result">
      <p class="question-card__info__result__correct" v-show="isCorrect">Bonne réponse</p>
      <p class="question-card__info__result__wrong" v-show="!isCorrect && question_response">
        Mauvaise réponse
      </p>
    </aside>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  questionnaire: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['answerChecked'])

const isCorrect = ref(false)
const question_response = ref('')
const selectedAnswer = ref('')

function checkAnswer(answer) {
  let correct = false
  // Multiple answers
  if (Array.isArray(props.questionnaire.answer)) {
    correct = props.questionnaire.answer.includes(answer)
  } else {
    // Boolean answers: convert to string for comparison
    if (props.questionnaire.type === 'boolean') {
      correct = String(props.questionnaire.answer) === String(answer)
    } else {
      correct = props.questionnaire.answer === answer
    }
  }
  isCorrect.value = correct
  question_response.value = correct ? 'Bonne réponse' : 'Mauvaise réponse'
  emit('answerChecked', correct)
}
</script>

<style scoped lang="scss"></style>
