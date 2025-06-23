function myMenuFunction() {
        var i = document.getElementById("navMenu");
        if (i.className === "nav-menu") {
          i.className += " responsive";
        } else {
          i.className = "nav-menu";
        }
      }
   
// Toggle login/register
const loginContainer = document.getElementById("login");
const registerContainer = document.getElementById("register");
// const loginBtn = document.getElementById("loginBtn");
// const registerBtn = document.getElementById("registerBtn");
const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

function showLogin() {
  loginContainer.style.left = "4px";
  registerContainer.style.right = "-520px";
  loginContainer.style.opacity = 1;
  registerContainer.style.opacity = 0;
  // loginBtn.classList.add("white-btn");
  // registerBtn.classList.remove("white-btn");
}

function showRegister() {
  loginContainer.style.left = "-510px";
  registerContainer.style.right = "5px";
  loginContainer.style.opacity = 0;
  registerContainer.style.opacity = 1;
  // registerBtn.classList.add("white-btn");
  // loginBtn.classList.remove("white-btn");
}

// loginBtn.addEventListener("click", showLogin);
// registerBtn.addEventListener("click", showRegister);
toRegister.addEventListener("click", function (e) {
  e.preventDefault();
  showRegister();
});

toLogin.addEventListener("click", function (e) {
  e.preventDefault();
  showLogin();
});

// LOGIN
document.getElementById("login-submit").addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Server error during login.");
  }
});

// SIGNUP
document.getElementById("signup-submit").addEventListener("click", async (e) => {
  e.preventDefault();

  const firstname = document.getElementById("signup-firstname").value.trim();
  const lastname = document.getElementById("signup-lastname").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!firstname || !lastname || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert("Signup successful! You can now login.");
      showLogin();
    }
  } catch (err) {
    console.error(err);
    alert("Server error during registration.");
  }
});
