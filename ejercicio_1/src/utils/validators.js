export function validateName(value) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(value.trim());
  }
  
  export function validateCC(value) {
    return /^[0-9]{6,10}$/.test(value.trim());
  }
  
  export function validatePhone(value) {
    return /^[0-9]{7,10}$/.test(value.trim());
  }