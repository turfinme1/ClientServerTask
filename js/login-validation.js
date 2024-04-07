import { setInputError, setInputSuccess } from "../js/input-change.js";

const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateInputs()) {
    // form.submit();
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/login";
        }
        return res.json();
      })
      .then((res) => {
        sessionStorage.setItem("sessionToken", res.sessionToken);
        window.location.href = "/";
      })
      .catch((err) => console.log(err));
  }
});

const validateInputs = () => {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  let isValid = true;

  if (emailValue === "") {
    setInputError(email, "Email is required");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setInputError(email, "Email is not valid");
    isValid = false;
  } else {
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
};
