const useAddCommasToNumber = (value: number) => {
    const numberValue = value?.toString().replace(/\D/g, '');
    return numberValue?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export { useAddCommasToNumber };
