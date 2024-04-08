<script setup>
import { ref, watch } from 'vue'
import { usePlantStore } from '@/stores/list'
import { PlantService } from '@/service/getAllPlants'
import { generateCSV, downloadCSV, parseCSV } from '@/helpers/utils'
import { tableHeaders } from '@/constants'

const store = usePlantStore()
const isLoading = ref(true)
const errorMessage = ref('')

PlantService.fetchPlants(store)
  .then(() => {
    isLoading.value = false
  })
  .catch((error) => {
    isLoading.value = false
    errorMessage.value = error.message
  })

const searchQuery = ref('')
const selectedName = ref(null)
const selectedPetFriendly = ref(null)
const selectedLight = ref(null)

const filterParams = ref({
  searchQuery,
  selectedName,
  selectedPetFriendly,
  selectedLight
})

const applyFilters = () => {
  store.filterList(filterParams)
}

watch(
  filterParams,
  () => {
    applyFilters()
  },
  { deep: true }
)

const exportToCSV = () => {
  const csvContent = generateCSV(store.filteredPlants)
  downloadCSV(csvContent)
}

const importSVG = (event, action) => {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const csvData = e.target.result

    if (action === 'update') {
      store.clearPlants()
    }

    const parsedCSV = parseCSV(csvData)
    store.addPlants(parsedCSV)
  }

  reader.readAsText(file)
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <h2 :class="$style.table_header">Plant Table</h2>
        <v-row justify="start">
          <v-col cols="3">
            <v-btn color="primary" @click="exportToCSV">
              <v-icon left>mdi-download</v-icon>
              Export to CSV
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn color="primary">
              <v-icon left>mdi-import</v-icon>
              <input
                type="file"
                @change="(event) => importSVG(event, 'add')"
                style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
              />
              Add CSV To Table
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn color="primary">
              <v-icon left>mdi-import</v-icon>
              <input
                type="file"
                @change="(event) => importSVG(event, 'update')"
                style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
              />
              Import New CSV
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Name, desc..."
              single-line
              hide-details
              variant="solo"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="selectedName"
              variant="solo"
              label="Name"
              :items="store.plants.map((plant) => plant.name)"
              clearable
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="selectedPetFriendly"
              variant="solo"
              label="Pet Friendly"
              :items="[...new Set(store.plants.map((plant) => plant.petFriendly))]"
              clearable
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="selectedLight"
              variant="solo"
              label="Light"
              :items="[...new Set(store.plants.map((plant) => plant.light))]"
              clearable
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="isLoading">
          <v-col :class="$style.progress">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <v-data-table
              :class="$style.table"
              :items="store.filteredPlants"
              :headers="tableHeaders"
              :items-per-page="5"
              :items-per-page-options="[5, 10]"
              class="elevation-1"
            >
            </v-data-table>
          </v-col>
        </v-row>
        <v-snackbar v-if="errorMessage" :timeout="2000" color="error" v-model="errorMessage">
          {{ errorMessage }}
          <template #action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="errorMessage = ''"> Close </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<style module lang="scss">
.table_header {
  margin-bottom: 30px;
  margin-top: 100px;
  color: $color-primary;
}

.table {
  thead {
    background-color: $color-surface-gray;
  }
}
.progress {
  margin-top: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
