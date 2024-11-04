import { hideElement, revealElement } from '../../animation/fade.mjs';
import { displayErrorModal } from '../url.mjs';
import { registerUser, loginUser } from './user.mjs';

/**
 * Helper function to create a form field
 * @param {string} type - The input type (e.g., 'text', 'email', 'password')
 * @param {string} id - The ID of the input field
 * @param {string} labelText - The label text for the field
 * @param {string} placeholder - Placeholder text for the input
 * @returns {HTMLDivElement} - A div containing the label and input elements
 */
function createFormField(type, id, labelText, placeholder) {
    const fieldDiv = document.createElement('div');
    fieldDiv.classList.add('mb-3');

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.classList.add('form-label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = type;
    input.classList.add('form-control');
    input.id = id;
    input.placeholder = placeholder;
    input.required = true;

    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    return fieldDiv;
}

export function createRegistrationForm() {
    const formContainer = document.querySelector('.form-container');

    // Create registration form element
    const createUserForm = document.createElement('form');
    createUserForm.id = 'create-user-form';
    createUserForm.classList.add('container', 'mt-4', 'flex-column');
    createUserForm.style.display = 'none';

    // Form title
    const createUserTitle = document.createElement('h2');
    createUserTitle.classList.add('text-center', 'mb-4');
    createUserTitle.textContent = 'Create User';

    // Username, Email, Password, Confirm Password fields
    const usernameField = createFormField('text', 'inputUsername', 'Username', 'Enter username');
    const emailField = createFormField('email', 'inputEmail', 'Email address', 'Enter email');
    const passwordField = createFormField('password', 'inputPassword', 'Password', 'Enter password');
    const confirmPasswordField = createFormField('password', 'inputRepeatPassword', 'Confirm Password', 'Confirm password');

    // Register button
    const registerButton = document.createElement('button');
    registerButton.type = 'submit';
    registerButton.classList.add('btn', 'btn-primary', 'w-100');
    registerButton.textContent = 'Register';

    // Switch to Login button
    const createUserButton = document.createElement('button');
    createUserButton.type = 'button';
    createUserButton.classList.add('btn', 'btn-secondary', 'w-100', 'mt-3');
    createUserButton.textContent = 'Already have an account? Log In';
    createUserButton.addEventListener('click', () => {
        hideElement(createUserForm);
        revealElement(document.getElementById('login-form'));
    });

    // Append elements to form
    createUserForm.append(createUserTitle, usernameField, emailField, passwordField, confirmPasswordField, registerButton, createUserButton);

    // Append registration form to form container
    formContainer.appendChild(createUserForm);

    // Form submission event listener with email validation
    createUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = createUserForm.querySelector('#inputUsername').value;
        const email = createUserForm.querySelector('#inputEmail').value;
        const password = createUserForm.querySelector('#inputPassword').value;
        const confirmPassword = createUserForm.querySelector('#inputRepeatPassword').value;

        // Validate email format to ensure it ends with @stud.noroff.no
        const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
        if (!emailPattern.test(email)) {
            displayErrorModal("Email must end with @stud.noroff.no");
            return;
        }

        if (password !== confirmPassword) {
            displayErrorModal("Passwords do not match. Please try again.");
            return;
        }

        // Call registerUser
        const result = await registerUser(name, email, password);
        if (result.success) {
            displayErrorModal("Registration successful! Please log in.");

            // Prepopulate login form with email and reset password
            const loginForm = document.getElementById('login-form');
            loginForm.querySelector('#loginEmail').value = email;
            loginForm.querySelector('#loginPassword').value = "";

            hideElement(createUserForm);
            revealElement(loginForm);
        } else {
            displayErrorModal(result.message || "Registration failed. Please try again.");
        }
    });
}

export function createLoginForm() {
    const formContainer = document.querySelector('.form-container');

    // Create login form element
    const loginForm = document.createElement('form');
    loginForm.id = 'login-form';
    loginForm.classList.add('container', 'mt-4', 'flex-column');

    // Form title
    const loginTitle = document.createElement('h2');
    loginTitle.classList.add('text-center', 'mb-4');
    loginTitle.textContent = 'Log In';

    // Email and Password fields
    const emailField = createFormField('email', 'loginEmail', 'Email address', 'Enter email');
    const passwordField = createFormField('password', 'loginPassword', 'Password', 'Enter password');

    // Remember Me checkbox
    const rememberMeDiv = document.createElement('div');
    rememberMeDiv.classList.add('mb-3', 'form-check');
    const rememberMeCheckbox = document.createElement('input');
    rememberMeCheckbox.type = 'checkbox';
    rememberMeCheckbox.classList.add('form-check-input');
    rememberMeCheckbox.id = 'rememberMe';
    const rememberMeLabel = document.createElement('label');
    rememberMeLabel.classList.add('form-check-label');
    rememberMeLabel.setAttribute('for', 'rememberMe');
    rememberMeLabel.textContent = 'Remember Me';
    rememberMeDiv.append(rememberMeCheckbox, rememberMeLabel);

    // Login button
    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.classList.add('btn', 'btn-primary', 'w-100');
    loginButton.textContent = 'Login';

    // Switch to Register button
    const switchToRegisterButton = document.createElement('button');
    switchToRegisterButton.type = 'button';
    switchToRegisterButton.classList.add('btn', 'btn-secondary', 'w-100', 'mt-3');
    switchToRegisterButton.textContent = 'New here? Create an account';
    switchToRegisterButton.addEventListener('click', () => {
        hideElement(loginForm);
        revealElement(document.getElementById('create-user-form'));
    });

    // Append elements to login form
    loginForm.append(loginTitle, emailField, passwordField, rememberMeDiv, loginButton, switchToRegisterButton);

    // Append login form to form container
    formContainer.appendChild(loginForm);

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = loginForm.querySelector('#loginEmail').value;
        const password = loginForm.querySelector('#loginPassword').value;
        const rememberMe = rememberMeCheckbox.checked;

        const result = await loginUser(email, password, rememberMe);
        if (result.success) {
            window.location.href = 'src/pages/index.html';
        } else {
            displayErrorModal(`Login failed: ${result.message}`);
        }
    });
}

// Call functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    createRegistrationForm();
    createLoginForm();
    hideElement(document.getElementById('create-user-form'));
    revealElement(document.getElementById('login-form'));
});
