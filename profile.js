// Get elements
const profileForm = document.getElementById('profile-form');
const editPictureButton = document.querySelector('.edit-picture');
const profilePictureImg = document.getElementById('profile-img');
const pictureInput = document.getElementById('picture-input');
const usernameElement = document.getElementById('username');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email-input');

// Load profile data from local storage (if any)
let profileData = JSON.parse(localStorage.getItem('profileData')) || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'default-avatar.jpg'
};

// Update UI with profile data
usernameElement.textContent = profileData.name;
nameInput.value = profileData.name;
emailInput.value = profileData.email;
profilePictureImg.src = profileData.picture;

// Handle edit picture button click
editPictureButton.addEventListener('click', () => {
    pictureInput.click();
});

// Handle image upload
pictureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            profilePictureImg.src = reader.result;
            profileData.picture = reader.result; // Save base64 image to profileData
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedProfileData = {
        name: nameInput.value,
        email: emailInput.value,
        picture: profileData.picture // Include updated picture
    };
    // Save to local storage
    localStorage.setItem('profileData', JSON.stringify(updatedProfileData));
    // Update UI
    usernameElement.textContent = updatedProfileData.name;
    alert('Profile updated successfully!');
});