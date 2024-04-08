export const filterPlants = (plants, filterParams) => {
  return plants.filter((plant) => {
    const { searchQuery, selectedName, selectedPetFriendly, selectedLight } = filterParams.value
    const searchMatch =
      !searchQuery ||
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      !searchQuery ||
      plant.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const selectedNameMatch = !selectedName || plant.name === selectedName
    const selectedPetFriendlyMatch =
      !selectedPetFriendly || plant.petFriendly === selectedPetFriendly
    const selectedLightMatch = !selectedLight || plant.light === selectedLight
    return searchMatch && selectedNameMatch && selectedPetFriendlyMatch && selectedLightMatch
  })
}

export const generateCSV = (data) => {
  const csvRows = []
  const headers = Object.keys(data[0])
  csvRows.push(headers.join(','))

  data.forEach((item) => {
    const values = headers.map((header) => {
      const escaped = ('' + item[header]).replace(/"/g, '\\"')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}

export const downloadCSV = (csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  const filename = 'plant_table.csv'
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export const parseCSV = (csvData) => {
  const rows = csvData.split('\n')

  // rows beyond header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const values = row.split(',')

    // create a plant obj with removing strings
    const plant = {
      name: values[0].replace(/^"(.+(?="$))"$/, '$1'),
      light: values[1].replace(/^"(.+(?="$))"$/, '$1'),
      height: parseInt(values[2].replace(/^"(.+(?="$))"$/, '$1')),
      petFriendly: values[3].replace(/^"(.+(?="$))"$/, '$1'),
      price: parseFloat(values[4].replace(/^"(.+(?="$))"$/, '$1')),
      desc: values
        .slice(5)
        .join(',')
        .replace(/^"(.+(?="$))"$/, '$1')
    }
    return plant
  }
}
