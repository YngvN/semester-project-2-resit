import { hideElement, revealElement } from '../../animation/fade.mjs';
import { registerUser, loginUser } from './user.mjs';

export function createRegistrationForm() {
    const formContainer = document.querySelector('.form-container');

    // Create form element
    const createUserForm = document.createElement('form');
    createUserForm.id = 'create-user-form';
    createUserForm.classList.add('container', 'mt-4');
    createUserForm.style.display = 'none';

    // Username field
    const usernameDiv = document.createElement('div');
    usernameDiv.classList.add('mb-3');
    const usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for', 'inputUsername');
    usernameLabel.classList.add('form-label');
    usernameLabel.textContent = 'Username';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.classList.add('form-control');
    usernameInput.id = 'inputUsername';
    usernameInput.placeholder = 'Enter username';
    usernameInput.required = true;
    usernameDiv.appendChild(usernameLabel);
    usernameDiv.appendChild(usernameInput);

    // Email field
    const emailDiv = document.createElement('div');
    emailDiv.classList.add('mb-3');
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'inputEmail');
    emailLabel.classList.add('form-label');
    emailLabel.textContent = 'Email address';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.classList.add('form-control');
    emailInput.id = 'inputEmail';
    emailInput.placeholder = 'Enter email';
    emailInput.required = true;
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(emailInput);

    // Password field
    const passwordDiv = document.createElement('div');
    passwordDiv.classList.add('mb-3');
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'inputPassword');
    passwordLabel.classList.add('form-label');
    passwordLabel.textContent = 'Password';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.classList.add('form-control');
    passwordInput.id = 'inputPassword';
    passwordInput.placeholder = 'Enter password';
    passwordInput.required = true;
    passwordDiv.appendChild(passwordLabel);
    passwordDiv.appendChild(passwordInput);

    // Confirm Password field
    const confirmPasswordDiv = document.createElement('div');
    confirmPasswordDiv.classList.add('mb-3');
    const confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.setAttribute('for', 'inputRepeatPassword');
    confirmPasswordLabel.classList.add('form-label');
    confirmPasswordLabel.textContent = 'Confirm Password';
    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.classList.add('form-control');
    confirmPasswordInput.id = 'inputRepeatPassword';
    confirmPasswordInput.placeholder = 'Confirm password';
    confirmPasswordInput.required = true;
    confirmPasswordDiv.appendChild(confirmPasswordLabel);
    confirmPasswordDiv.appendChild(confirmPasswordInput);

    // Register button
    const registerButton = document.createElement('button');
    registerButton.type = 'submit';
    registerButton.classList.add('btn', 'btn-primary', 'w-100');
    registerButton.textContent = 'Register';

    // Append elements to form
    createUserForm.appendChild(usernameDiv);
    createUserForm.appendChild(emailDiv);
    createUserForm.appendChild(passwordDiv);
    createUserForm.appendChild(confirmPasswordDiv);
    createUserForm.appendChild(registerButton);

    // Append registration form to form container
    formContainer.appendChild(createUserForm);

    // Form submission event listener
    createUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Call the registerUser function with form inputs
        registerUser(name, email, password).then((result) => {
            if (result.success) {
                alert("Registration successful!");
            } else {
                alert(`Registration failed: ${result.message}`);
            }
        });
    });
    const createUserButton = document.createElement('button');
    createUserButton.type = 'button';
    createUserButton.classList.add('btn', 'btn-secondary', 'w-100', 'mt-3');
    createUserButton.textContent = 'Create User';
    createUserButton.addEventListener('click', () => {
        console.log('Btn clicked');
        loginForm.style.display = 'none';          // Hide the login form
        console.log(createUserForm)
        revealElement(createUserForm);    // Reveal the create user form
    });
}