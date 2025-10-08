<template>
      <h2 class="question-card__info__title">Enigme 1 Combien d'ascenseurs</h2>
      <p class="question-card__info__description">Quel est le nombre d'ascenseurs dans ce circuit ?</p>
      <!--mutli choice answer-->
      <section class="question-card__info__answers">
        <div class="question-card__info__answers__answer">
          <input type="radio" name="answer" id="answer1" value="1" @change="checkAnswer(1)">
          <label for="answer1">1</label>
        </div>
        <div class="question-card__info__answers__answer">
          <input type="radio" name="answer" id="answer2" value="2" @change="checkAnswer(2)">
          <label for="answer2">2</label>
        </div>
        <div class="question-card__info__answers__answer">
          <input type="radio" name="answer" id="answer3" value="3" @change="checkAnswer(3)">
          <label for="answer3">3</label>
        </div>
        <div class="question-card__info__answers__answer">
          <input type="radio" name="answer" id="answer4" value="4" @change="checkAnswer(4)">
          <label for="answer4">4</label>
        </div>
      </section>
      <!--text answer-->
      <button class="question-card__info__start-button">Repondre</button>
      <!--if answer is correct-->
      <aside class="question-card__info__result">
        <p class="question-card__info__result__correct" v-show="isCorrect">Bonne reponse</p>
        <p class="question-card__info__result__wrong" v-show="!isCorrect && question_response">Mauvaise reponse</p>
      </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isCorrect = ref(false);
const question_response = ref('');

function checkAnswer(answer) {
  console.log(answer);
  if (answer === 2) {
    isCorrect.value = true;
    question_response.value = 'Bonne reponse';
    console.log('Bonne reponse');
  } else {
    isCorrect.value = false;
    question_response.value = 'Mauvaise reponse';
  }
}
</script>

<style scoped lang="scss">
</style>