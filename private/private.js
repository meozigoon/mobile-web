import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const db = getFirestore(app);

// 인증 체크 및 화면 표시
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.body.style.display = ""; // 인증 성공 시 본문 표시
        document.getElementById("todoSection").classList.remove("hidden");
        document.getElementById("accountSection").classList.remove("hidden");

        LoadTodos();
        LoadAccounts();

        const userName = user.displayName || user.email;
        const userNameElement = document.getElementById("welcomeMessage");
        userNameElement.textContent = `${userName}`;
    } else {
        window.location.href = "/login/";
    }
});

document.getElementById("todoInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        AddTodo();
    }
});

document.getElementById("sitePw").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        AddAccount();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const activeElement = document.activeElement;

        if (
            activeElement.tagName === "INPUT" &&
            activeElement.closest("li")
        ) {
            const li = activeElement.closest("li");
            const saveBtn = li.querySelector("button:nth-of-type(1)"); // 저장 버튼만 클릭
            if (saveBtn) saveBtn.click();
        } else if (
            activeElement.tagName === "INPUT" &&
            activeElement.closest("tr")
        ) {
            const row = activeElement.closest("tr");
            const saveBtn = row.querySelector("button:first-of-type"); // 저장 버튼만 클릭
            if (saveBtn) saveBtn.click();
        }
    }
});

window.AddTodo = async function () {
    const todoInput = document.getElementById("todoInput");
    const text = todoInput.value.trim();
    if (text === "") return;

    try {
        await addDoc(collection(db, "Private_ToDo"), {
            text,
            timestamp: new Date(), // 추가된 시간 저장
        });
        todoInput.value = "";
    } catch (error) {
        console.error("Error adding ToDo: ", error);
    }
};

function LoadTodos() {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = ""; // Clear existing items

    onSnapshot(
        query(collection(db, "Private_ToDo"), orderBy("timestamp")),
        (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const li = document.createElement("li");
                    li.setAttribute("data-id", change.doc.id);

                    const span = document.createElement("span");
                    span.textContent = change.doc.data().text;

                    const editBtn =
                        document.createElement("button");
                    editBtn.textContent = "수정";
                    editBtn.onclick = function () {
                        EditTodo(li, span);
                    };

                    const delBtn = document.createElement("button");
                    delBtn.textContent = "삭제";
                    delBtn.onclick = function () {
                        DeleteTodo(li);
                    };

                    li.appendChild(span);
                    li.appendChild(editBtn);
                    li.appendChild(delBtn);
                    todoList.appendChild(li);
                }
            });
        }
    );
}

window.EditTodo = async function (li, span) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "저장";
    saveBtn.onclick = async function () {
        const newText = input.value.trim();
        if (!newText) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            const docId = li.getAttribute("data-id");
            const docRef = doc(db, "Private_ToDo", docId);
            await updateDoc(docRef, { text: newText });

            span.textContent = newText;
            li.replaceChild(span, input);
            li.replaceChild(editBtn, saveBtn);
        } catch (error) {
            console.error("Error updating ToDo: ", error);
        }
    };

    const editBtn = li.querySelector("button:first-of-type");
    li.replaceChild(input, span);
    li.replaceChild(saveBtn, editBtn);
};

window.DeleteTodo = async function (li) {
    try {
        const docId = li.getAttribute("data-id");
        const docRef = doc(db, "Private_ToDo", docId);
        await deleteDoc(docRef);
        li.remove();
    } catch (error) {
        console.error("Error deleting ToDo: ", error);
    }
};

window.AddAccount = async function () {
    const siteName = document.getElementById("siteName").value.trim();
    const siteId = document.getElementById("siteId").value.trim();
    const sitePw = document.getElementById("sitePw").value.trim();
    if (!siteName || !siteId || !sitePw) return;

    try {
        await addDoc(collection(db, "Private_Site"), {
            Name: siteName,
            ID: siteId,
            PW: sitePw,
        });

        document.getElementById("siteName").value = "";
        document.getElementById("siteId").value = "";
        document.getElementById("sitePw").value = "";
    } catch (error) {
        console.error("Error adding account: ", error);
    }
};

function LoadAccounts() {
    const tbody = document.getElementById("accountTableBody");
    tbody.innerHTML = ""; // Clear existing rows

    onSnapshot(collection(db, "Private_Site"), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                const tr = document.createElement("tr");
                tr.setAttribute("data-id", change.doc.id);
                tr.innerHTML = `
                    <td>${data.Name}</td>
                    <td>${data.ID}</td>
                    <td>${data.PW}</td>
                    <td>
                        <button onclick="EditAccount(this)">수정</button>
                        <button onclick="DeleteAccount(this)">삭제</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });
    });
}

window.EditAccount = async function (button) {
    const row = button.closest("tr");
    const cells = row.querySelectorAll("td");

    const site = cells[0].textContent;
    const id = cells[1].textContent;
    const pw = cells[2].textContent;

    cells[0].innerHTML = `<input type="text" value="${site}">`;
    cells[1].innerHTML = `<input type="text" value="${id}">`;
    cells[2].innerHTML = `<input type="text" value="${pw}">`;

    button.textContent = "저장";
    button.onclick = async function () {
        const newSite = cells[0].querySelector("input").value.trim();
        const newId = cells[1].querySelector("input").value.trim();
        const newPw = cells[2].querySelector("input").value.trim();

        if (!newSite || !newId || !newPw) {
            alert("빈 칸 없이 입력해주세요.");
            return;
        }

        try {
            const docId = row.getAttribute("data-id");
            const docRef = doc(db, "Private_Site", docId);
            await updateDoc(docRef, {
                Name: newSite,
                ID: newId,
                PW: newPw,
            });

            cells[0].textContent = newSite;
            cells[1].textContent = newId;
            cells[2].textContent = newPw;

            button.textContent = "수정";
            button.onclick = function () {
                window.EditAccount(button);
            };
        } catch (error) {
            console.error("Error updating account: ", error);
        }
    };
};

window.DeleteAccount = async function (button) {
    const row = button.closest("tr");
    const docId = row.getAttribute("data-id");

    try {
        const docRef = doc(db, "Private_Site", docId);
        await deleteDoc(docRef);
        row.remove();
    } catch (error) {
        console.error("Error deleting account: ", error);
    }
};

window.Logout = function () {
    signOut(auth).then(() => {
        window.location.href = "/login/";
    });
};