const serverSideRegisterValidation = (name, username, email, password) => {
  let isValid = true;
  if (name === "" || username === "" || email === "" || password === "") {
    isValid = false;
  }
  if (username.length < 8) {
    isValid = false;
  }

  if (!isValidEmail(email)) {
    isValid = false;
  }

  return isValid;
};

const serverSideLoginValidation = (email, password) => {
  let isValid = true;
  if (email === "" || password === "") {
    isValid = false;
  }

  if (!isValidEmail(email)) {
    isValid = false;
  }

  return isValid;
};

const isValidEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

exports.serverSideLoginValidation = serverSideLoginValidation;
exports.serverSideRegisterValidation = serverSideRegisterValidation;
exports.isValidEmail = isValidEmail;

