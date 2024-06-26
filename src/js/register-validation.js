import { setInputError, setInputSuccess } from "../js/input-change.js";

const form = document.getElementById("form");

const nameInput = document.getElementById("name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateInputs()) {
    form.submit();
  }
});

const validateInputs = () => {
  const nameValue = nameInput.value.trim();
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  let isValid = true;
  if (nameValue === "") {
    setInputError(nameInput, "Name is required");
    isValid = false;
  } else if (nameValue.length < 3) {
    setInputError(nameInput, "Name must be at least 3 characters");
    isValid = false;
  } 
  else {
    setInputSuccess(nameInput);
  }

  if (usernameValue === "") {
    setInputError(username, "Username is required");
    isValid = false;
  }
  else if (usernameValue.length < 8) {
    setInputError(username, "Username must be at least 8 characters");
    isValid = false;
  }  
  else {
    setInputSuccess(username);
  }

  if (emailValue === "") {
    setInputError(email, "Email is required");
    isValid = false;
  } 
  else if (!isValidEmail(emailValue)) {
    setInputError(email, "Email is not valid");
    isValid = false;
  }
  else {
    setInputSuccess(email);
  }

  if (passwordValue === "") {
    setInputError(password, "Password is required");
    isValid = false;
  } else {
    setInputSuccess(password);
  }

  return isValid;
};

const isValidEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
}