<template>
  <div class="search">
    <div class="search__bar">
      <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input 
        type="search" 
        class="search__input" 
        placeholder="Rechercher..." 
        v-model.trim="searchTerm"
        @input="handleSearch"
      />
      <button 
        v-if="searchTerm" 
        class="search__clear" 
        @click="clearSearch"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button 
        class="search__filter"
        :class="{ 'search__filter--active': showFilters }"
        @click="showFilters = !showFilters"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>
    </div>

    <transition name="slide">
      <div v-if="showFilters" class="chips">
        <button 
          class="chip"
          :class="{ 'chip--active': activeFilter === 'name' }"
          @click="setFilter('name')"
        >
          Nom
        </button>
        <button 
          class="chip"
          :class="{ 'chip--active': activeFilter === 'mission' }"
          @click="setFilter('mission')"
        >
          Mission
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="searchTerm && hasSearched" class="results">
        <div v-if="circuitStore.filteredCircuits.length" class="results__found">
          <strong>{{ circuitStore.filteredCircuits.length }}</strong>
          {{ circuitStore.filteredCircuits.length > 1 ? 'circuits' : 'circuit' }}
        </div>
        <div v-else class="results__empty">
          Aucun résultat
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCircuitStore } from '@/stores/circuit';

defineProps({
  circuits: {
    type: Array,
    required: true
  }
});

const searchTerm = ref('');
const activeFilter = ref('name');
const showFilters = ref(false);
const hasSearched = ref(false);
const circuitStore = useCircuitStore();

const handleSearch = () => {
  hasSearched.value = true;
  if (searchTerm.value) {
    circuitStore.searchCircuit(searchTerm.value, activeFilter.value);
  } else {
    circuitStore.filteredCircuits = circuitStore.circuits;
  }
};

const setFilter = (filter) => {
  activeFilter.value = filter;
  if (searchTerm.value) handleSearch();
};

const clearSearch = () => {
  searchTerm.value = '';
  hasSearched.value = false;
  circuitStore.filteredCircuits = circuitStore.circuits;
};
</script>

<style lang="scss" scoped>
.search {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search__bar {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;

  &:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
}

.search__icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.search__input {
  flex: 1;
  padding: 0.625rem 2.5rem 0.625rem 2.25rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #0f172a;

  &::placeholder {
    color: #94a3b8;
  }
}

.search__clear,
.search__filter {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 0.875rem;
    height: 0.875rem;
    color: #64748b;
  }
}

.search__clear {
  background: #f1f5f9;
  margin-right: 0.25rem;

  &:hover {
    background: #e2e8f0;
  }

  &:active {
    transform: scale(0.95);
  }
}

.search__filter {
  background: transparent;
  margin-right: 0.375rem;

  &:hover {
    background: #f8fafc;
  }

  &--active {
    background: #2563eb;

    svg {
      color: white;
    }
  }
}

.chips {
  display: flex;
  gap: 0.5rem;
}

.chip {
  flex: 1;
  padding: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &--active {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
  }
}

.results {
  padding: 0.625rem 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
}

.results__found {
  color: #0f172a;

  strong {
    color: #2563eb;
    font-weight: 600;
  }
}

.results__empty {
  color: #64748b;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>