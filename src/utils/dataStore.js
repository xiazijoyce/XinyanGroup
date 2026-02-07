const storeKey = 'xinyan-erp-store'

const defaultData = {
  requirements: [],
  quotes: []
}

export const getStore = () => {
  const raw = localStorage.getItem(storeKey)
  if (!raw) return { ...defaultData }
  try {
    return JSON.parse(raw)
  } catch (error) {
    return { ...defaultData }
  }
}

export const saveStore = (data) => {
  localStorage.setItem(storeKey, JSON.stringify(data))
}

export const addRequirement = (requirement) => {
  const store = getStore()
  store.requirements.unshift(requirement)
  saveStore(store)
}

export const updateRequirement = (requirement) => {
  const store = getStore()
  const index = store.requirements.findIndex((item) => item.id === requirement.id)
  if (index !== -1) store.requirements[index] = requirement
  saveStore(store)
}

export const addQuote = (quote) => {
  const store = getStore()
  store.quotes.unshift(quote)
  saveStore(store)
}

export const updateQuote = (quote) => {
  const store = getStore()
  const index = store.quotes.findIndex((item) => item.id === quote.id)
  if (index !== -1) store.quotes[index] = quote
  saveStore(store)
}
