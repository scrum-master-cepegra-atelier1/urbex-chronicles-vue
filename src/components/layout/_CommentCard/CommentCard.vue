<template>
  <pre>{{ dateraw /*raw data for debug */}}</pre>
  <article class="comment-card">
    <header class="comment-card__header">
      <h2 class="comment-card__header__title">Comment by {{ comment.users_permissions_user.username }}</h2>
    </header>
    <main class="comment-card__content">
      <p class="comment-card__content__text">{{ comment.content }}</p>
    </main>
    <footer class="comment-card__footer">
      <p class="comment-card__footer__date">{{ day }} / {{ month }} / {{ year }} at {{ hour }}:{{ minute }}</p>
    </footer>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})
const dateraw = new Date(props.comment.comment_at)
const year = new Date(props.comment.comment_at).getFullYear()
const month = new Date(props.comment.comment_at).getMonth()+1
const day = new Date(props.comment.comment_at).getDate()
const hour = props.comment.comment_at[11]+props.comment.comment_at[12]
const minute = new Date(props.comment.comment_at).getMinutes()

</script>

<style scoped lang="scss">
.comment-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: #f9f9f9;

  &__header {
    margin-bottom: 12px;

    &__title {
      font-size: 1.5em;
      margin: 0;
    }
  }

  &__content {
    margin-bottom: 12px;

    &__text {
      font-size: 1.2em;
      line-height: 1.5;
    }
  }

  &__footer {
    text-align: right;

    &__date {
      font-size: 0.9em;
      color: #666;
    }
  }
}
</style>