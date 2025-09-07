<template>
  <GridSystem>
    <div class="col col-12">
      <div class="home-content" d-flex>
        <img 
          src="@/assets/images/home-image.svg" 
          alt="Home Image" 
          class="home-image"
        />
        <p class="h3">
          Teste de Guilherme Robert Silveira Santos
        </p>
      </div>
    </div>
    <div class="col col-12"> </div>
   </GridSystem>
</template>

<script setup lang="ts">
import GridSystem from '@/components/Layout/GridSystem.vue'
</script>

<style scoped>
.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  width: 100%;
  padding: 2rem 0;
}

.home-image {
  max-width: 100%;
  height: auto;
  max-height: 300px;
}

/* Responsividade para a página Home */
@media (max-width: 768px) {
  .home-content {
    gap: 1.5rem;
    padding: 1.5rem 0;
  }
  
  .home-image {
    max-height: 200px;
  }
  
  .h3 {
    font-size: var(--font-size-h4);
  }
}

@media (max-width: 480px) {
  .home-content {
    gap: 1rem;
    padding: 1rem 0;
  }
  
  .home-image {
    max-height: 150px;
  }
  
  .h3 {
    font-size: var(--font-size-h5);
    line-height: 1.4;
  }
}
</style>
