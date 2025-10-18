export const setComma = (value: string | number) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
