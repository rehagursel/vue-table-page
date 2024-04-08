import { defineStore } from 'pinia'
import { filterPlants } from '@/helpers/utils'
import { PlantService } from '@/service/getAllPlants'

export const usePlantStore = defineStore('list', {
  state: () => ({
    plants: [],
    filteredPlants: []
  }),
  actions: {
    async fetchPlants() {
      try {
        const data = await PlantService.fetchPlants()
        this.plants = data
        this.filteredPlants = data
      } catch (error) {
        console.error('Error fetching plants:', error.message)
      }
    },
    filterList(filterParams) {
      this.filteredPlants = filterPlants(this.plants, filterParams)
    },
    addPlants(newPlants) {
      this.plants.push(newPlants)
      this.filteredPlants.push(newPlants)
    },
    clearPlants() {
      this.plants = []
      this.filteredPlants = []
    },
    loadPlants(plantsData) {
      this.plants = plantsData
      this.filteredPlants = plantsData
    }
  }
})
