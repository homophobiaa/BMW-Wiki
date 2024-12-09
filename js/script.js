function toggleModels(seriesId) {
    const models = document.getElementById(seriesId);
    
    // Check if the current display is 'none' or an empty string, then set to 'flex' or 'none' accordingly
    if (models.style.display === 'none' || models.style.display === '') {
        models.style.display = 'flex'; // Show the models section
    } else {
        models.style.display = 'none'; // Hide the models section
    }
}