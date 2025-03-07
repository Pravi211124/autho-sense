
document.addEventListener('DOMContentLoaded', function() {
  // Load the footer component
  fetch('components/footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('footer-container').innerHTML = html;
      
      // Set current year in footer
      const footerYearElement = document.getElementById('footer-year');
      if (footerYearElement) {
        footerYearElement.textContent = new Date().getFullYear();
      }
    })
    .catch(error => {
      console.error('Error loading footer component:', error);
    });
});
