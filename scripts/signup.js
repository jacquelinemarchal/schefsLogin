
var switchSignUp = true;
const showSignUp = () => {
  const signupForm = document.getElementById("signup-form");
  if (switchSignUp){
    if (switchLogIn = true){
      switchLogIn=false;
      showLogIn()
    }
    signupForm.setAttribute("style", "display:inline");
    switchSignUp = false;
  }
  else{
    signupForm.setAttribute("style", "display:none");
    switchSignUp = true;
  }
  return false;
}
var switchLogIn = true;
const showLogIn = () => {
  if (switchSignUp = true){
    switchSignUp=false;
    showSignUp()
  }
  const loginForm = document.getElementById("login-form");
  if (switchLogIn){
    loginForm.setAttribute("style", "display:inline");
    switchLogIn = false;
  }
  else{
    loginForm.setAttribute("style", "display:none");
    switchLogIn = true;
  }
  return false;
}

const hideExpandedContent = () => {
  loginForm.setAttribute("style", "display:none");
  signupForm.setAttribute("style", "display:none");
}
