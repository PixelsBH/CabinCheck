// Update the date dynamically
document.addEventListener('DOMContentLoaded', () => {
  const dateElement = document.querySelector('.text-neutral-400.mb-2');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  dateElement.textContent = currentDate;
});