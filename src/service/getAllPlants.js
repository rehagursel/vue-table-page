import axios from 'axios'

export const PlantService = {
  async fetchPlants(store) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/plants`)
      store.loadPlants(response.data)
    } catch (error) {
      throw new Error(error.response.data.message || 'Beklenmeyen bir hata olustu')
    }
  }
}
