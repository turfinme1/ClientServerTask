const setInputError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDiv = inputControl.querySelector(".error");

  errorDiv.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setInputSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDiv = inputControl.querySelector(".error");

  errorDiv.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

export { setInputError, setInputSuccess };