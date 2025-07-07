import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyARGW_mHhw5A8S2ImeNW3fEXrxBExgcxGg",
    authDomain: "toyotech-web.firebaseapp.com",
    projectId: "toyotech-web",
    storageBucket: "toyotech-web.appspot.com",
    messagingSenderId: "132249097383",
    appId: "1:132249097383:web:f7e07df7bcfa6c2c3cf848",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.Login = async function () {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/private/";
    } catch (error) {
        alert("로그인 실패: " + error.message);
    }
};

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        Login();
    }
});