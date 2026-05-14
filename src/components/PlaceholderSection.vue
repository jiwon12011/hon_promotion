<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<template>
  <section class="section placeholder-section" data-section>
    <div class="placeholder-section__inner">
      <h2>{{ title }}</h2>
    </div>
  </section>
</template>
