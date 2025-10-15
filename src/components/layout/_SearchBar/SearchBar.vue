<template>
  <div class="search">
    <!-- Barre de recherche principale contenant l'input et les boutons -->
    <div class="search__bar">
      <!-- Icône de loupe positionnée à gauche de l'input -->
      <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      
      <!-- Input de recherche avec binding bidirectionnel et trim automatique -->
      <input 
        type="search" 
        class="search__input" 
        placeholder="Rechercher..." 
        v-model.trim="searchTerm"
        @input="handleSearch"
      />
      
      <!-- Bouton pour effacer la recherche, visible uniquement si searchTerm existe -->
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
      
      <!-- Bouton toggle pour afficher/masquer les filtres, actif visuellement si showFilters est true -->
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

    <!-- Transition slide pour animer l'apparition/disparition des filtres -->
    <transition name="slide">
      <!-- Container des chips de filtrage, visible selon showFilters -->
      <div v-if="showFilters" class="chips">
        <!-- Chip pour filtrer par nom, actif si activeFilter === 'name' -->
        <button 
          class="chip"
          :class="{ 'chip--active': activeFilter === 'name' }"
          @click="setFilter('name')"
        >
          Nom
        </button>
        
        <!-- Chip pour filtrer par mission, actif si activeFilter === 'mission' -->
        <button 
          class="chip"
          :class="{ 'chip--active': activeFilter === 'mission' }"
          @click="setFilter('mission')"
        >
          Mission
        </button>
      </div>
    </transition>

    <!-- Transition fade pour animer l'apparition/disparition des résultats -->
    <transition name="fade">
      <!-- Zone de résultats, visible uniquement si une recherche a été effectuée et qu'il y a un terme -->
      <div v-if="searchTerm && hasSearched" class="results">
        <!-- Message de succès si des circuits ont été trouvés -->
        <div v-if="circuitStore.filteredCircuits.length" class="results__found">
          <strong>{{ circuitStore.filteredCircuits.length }}</strong>
          {{ circuitStore.filteredCircuits.length > 1 ? 'circuits' : 'circuit' }}
        </div>
        
        <!-- Message d'erreur si aucun circuit n'a été trouvé -->
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

// Props reçues du composant parent : liste des circuits
defineProps({
  circuits: {
    type: Array,
    required: true
  }
});

// Terme de recherche saisi par l'utilisateur
const searchTerm = ref('');

// Filtre actif : 'name' ou 'mission'
const activeFilter = ref('name');

// État d'affichage des chips de filtrage
const showFilters = ref(false);

// Indique si une recherche a déjà été effectuée (pour afficher les résultats)
const hasSearched = ref(false);

// Store Pinia contenant la logique de recherche et les circuits filtrés
const circuitStore = useCircuitStore();

// Fonction déclenchée à chaque modification de l'input
const handleSearch = () => {
  hasSearched.value = true; // Marque qu'une recherche a été effectuée
  
  if (searchTerm.value) {
    // Si un terme existe, lance la recherche dans le store
    circuitStore.searchCircuit(searchTerm.value, activeFilter.value);
  } else {
    // Si l'input est vide, réinitialise les résultats avec tous les circuits
    circuitStore.filteredCircuits = circuitStore.circuits;
  }
};

// Fonction pour changer le filtre actif (name ou mission)
const setFilter = (filter) => {
  activeFilter.value = filter;
  // Si un terme de recherche existe, relance la recherche avec le nouveau filtre
  if (searchTerm.value) handleSearch();
};

// Fonction pour réinitialiser complètement la recherche
const clearSearch = () => {
  searchTerm.value = ''; // Vide l'input
  hasSearched.value = false; // Réinitialise l'état de recherche
  circuitStore.filteredCircuits = circuitStore.circuits; // Restaure tous les circuits
};
</script>

<style lang="scss" scoped>
// Container principal de la barre de recherche
.search {
  padding: 0.75rem; // 12px de padding
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // 8px d'espacement entre les éléments
}

// Barre de recherche contenant l'input et les boutons
.search__bar {
  position: relative; // Pour positionner les éléments absolus (icône)
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0; // Gris clair
  border-radius: 0.625rem; // 10px de border-radius
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); // Ombre légère
  transition: all 0.2s; // Animation fluide sur tous les changements

  // État focus : change la bordure et ajoute un ring bleu
  &:focus-within {
    border-color: #2563eb; // Bleu primaire
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); // Ring bleu transparent
  }
}

// Icône de loupe à gauche de l'input
.search__icon {
  position: absolute;
  left: 0.75rem; // 12px depuis la gauche
  width: 1rem; // 16px
  height: 1rem; // 16px
  color: #94a3b8; // Gris moyen
  pointer-events: none; // Ne bloque pas les clics sur l'input
}

// Champ input de recherche
.search__input {
  flex: 1; // Prend tout l'espace disponible
  padding: 0.625rem 2.5rem 0.625rem 2.25rem; // Padding adapté pour les icônes
  border: none;
  outline: none; // Supprime l'outline par défaut
  font-size: 0.875rem; // 14px
  color: #0f172a; // Noir foncé

  // Style du placeholder
  &::placeholder {
    color: #94a3b8; // Gris moyen
  }
}

// Styles communs pour les boutons clear et filter
.search__clear,
.search__filter {
  width: 1.75rem; // 28px
  height: 1.75rem; // 28px
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.375rem; // 6px
  cursor: pointer;
  transition: all 0.2s;

  // Taille des icônes SVG
  svg {
    width: 0.875rem; // 14px
    height: 0.875rem; // 14px
    color: #64748b; // Gris
  }
}

// Bouton pour effacer la recherche
.search__clear {
  background: #f1f5f9; // Gris très clair
  margin-right: 0.25rem; // 4px d'espacement

  &:hover {
    background: #e2e8f0; // Gris légèrement plus foncé au hover
  }

  &:active {
    transform: scale(0.95); // Légère réduction au clic
  }
}

// Bouton toggle pour les filtres
.search__filter {
  background: transparent;
  margin-right: 0.375rem; // 6px d'espacement

  &:hover {
    background: #f8fafc; // Fond gris très léger au hover
  }

  // État actif : fond bleu et icône blanche
  &--active {
    background: #2563eb; // Bleu primaire

    svg {
      color: white;
    }
  }
}

// Container des chips de filtrage
.chips {
  display: flex;
  gap: 0.5rem; // 8px entre les chips
}

// Bouton chip individuel
.chip {
  flex: 1; // Prend une part égale de l'espace
  padding: 0.5rem; // 8px
  background: #f8fafc; // Gris très clair
  border: 1px solid #e2e8f0; // Bordure grise
  border-radius: 0.5rem; // 8px
  font-size: 0.8125rem; // 13px
  font-weight: 500; // Semi-bold
  color: #475569; // Gris foncé
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98); // Légère réduction au clic
  }

  // État actif : fond bleu et texte blanc
  &--active {
    background: #2563eb; // Bleu primaire
    border-color: #2563eb;
    color: white;
  }
}

// Zone d'affichage des résultats
.results {
  padding: 0.625rem 0.75rem; // 10px 12px
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem; // 8px
  font-size: 0.8125rem; // 13px
}

// Message quand des résultats sont trouvés
.results__found {
  color: #0f172a; // Noir foncé

  strong {
    color: #2563eb; // Nombre en bleu
    font-weight: 600; // Semi-bold
  }
}

// Message quand aucun résultat n'est trouvé
.results__empty {
  color: #64748b; // Gris
}

// Animation slide pour les chips
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem); // Glisse depuis le haut
}

// Animation fade pour les résultats
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0; // Simple fondu
}
</style>