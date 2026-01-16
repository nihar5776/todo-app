// ===================== LOAD USERS & TASKS FROM LOCAL STORAGE =====================
const users = JSON.parse(localStorage.getItem("users")) || [];
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===================== DOM CONTENT LOADED =====================
document.addEventListener("DOMContentLoaded", function () {

    // ---------- Signup Page Elements ----------
    const Name = document.getElementById("name");
    const Password = document.getElementById("New-password");
    const reEnterPassword = document.getElementById("Conform-password");
    const submit = document.getElementById("submit-btn");

    // ---------- Login Page Elements ----------
    const LName = document.getElementById("name-login");
    const LPassword = document.getElementById("New-password-login");
    const Lsubmit = document.getElementById("submit-btn-login");

    // ===================== SIGNUP CREDENTIAL VALIDATION =====================
    function credValidate(username, password, reEnterPassword) {

        const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/;

        // Check if user already exists
        if (users.find(user => user.username === username)) {
            alert("User Already Exists");
            return false;
        }

        // Validate username format
        if (!usernameRegex.test(username)) {
            alert("Please A Valid UserName : Which conatins a number,letters,underscore");
            return false;
        }

        // Check password match
        if (password !== reEnterPassword) {
            alert("Please Ensusre Both Passwords are Same");
            return false;
        }

        // Validate password strength
        if (!passwordRegex.test(password)) {
            alert("Please Enter a Valid Password");
            return false;
        }

        return true;
    }

    // ===================== SIGNUP SUBMIT HANDLER =====================
    if (submit) {
        submit.addEventListener("click", function () {

            console.log(
                Name.value + " " +
                Password.value + " " +
                reEnterPassword.value
            );

            if (credValidate(Name.value, Password.value, reEnterPassword.value)) {

                users.push({
                    username: Name.value,
                    password: Password.value
                });

                localStorage.setItem("users", JSON.stringify(users));

                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }

    // ===================== LOGIN CREDENTIAL VALIDATION =====================
    function validateLoginCred(Lusername, Lpassword) {
        return users.find(
            user => user.username === Lusername && user.password === Lpassword
        );
    }

    // ===================== DISPLAY TASKS FUNCTION =====================
    function displayTasks(username, tasks) {

        const tasksSection = document.querySelector(".tasks-section");
        tasksSection.innerHTML = "";

        tasks
            .filter(t => t.username === username)
            .forEach((t, index) => {

                const taskDiv = document.createElement("div");
                taskDiv.className = "task-item";

                // ----- Mark as Done Button -----
                const markBtn = document.createElement("button");
                markBtn.className = "mark-btn";
                markBtn.textContent = "InProgress";

                markBtn.addEventListener("click", () => {
                    if (markBtn.textContent === "Done") {
                        markBtn.textContent = "InProgress";
                    } else {
                        markBtn.textContent = "Done";
                    }
                });

                // ----- Task Title -----
                const titleEl = document.createElement("div");
                titleEl.className = "task-title";
                titleEl.textContent = t.task;

                // ----- Task Description -----
                const descEl = document.createElement("div");
                descEl.className = "task-desc";
                descEl.textContent = t.description || "";

                // ----- Delete Button -----
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "Delete";

                deleteBtn.addEventListener("click", () => {
                    deleteTask(username, index);
                });

                // Append elements in required order
                taskDiv.appendChild(markBtn);
                taskDiv.appendChild(titleEl);
                taskDiv.appendChild(descEl);
                taskDiv.appendChild(deleteBtn);

                tasksSection.appendChild(taskDiv);
            });
    }

    // ===================== DELETE TASK FUNCTION =====================
    function deleteTask(username, index) {

        let count = -1;

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].username === username) {
                count++;
                if (count === index) {
                    tasks.splice(i, 1);
                    break;
                }
            }
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks(username, tasks);
    }

    // ===================== LOGIN SUBMIT HANDLER =====================
    if (Lsubmit) {
        Lsubmit.addEventListener("click", function () {

            console.log(users);

            if (validateLoginCred(LName.value, LPassword.value)) {

                alert("Successfully Logged");

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", LName.value);

                // Redirect to task page
                window.location.href = "task.html";

            } else {
                alert("Invalid credentials");
            }
        });
    }

    // ===================== TASK PAGE LOGIC (ONLY IF LOGGED IN) =====================
    if (localStorage.getItem("isLoggedIn") === "true") {

        const TaskTittle = document.querySelector(".add-title");
        const TaskDes = document.querySelector(".add-desc");
        const add = document.querySelector(".add-btn");
        const LogoutIn = document.getElementById("logout-btn");

        if (add) {

            const currentUser = localStorage.getItem("currentUser");

            // Display tasks on page load
            displayTasks(currentUser, tasks);

            // Add new task
            add.addEventListener("click", function () {

                const task = TaskTittle.value.trim();
                const desc = TaskDes.value.trim();

                if (!task) return;
                if (!desc) return;

                tasks.push({
                    username: currentUser,
                    task: task,
                    description: desc
                });

                localStorage.setItem("tasks", JSON.stringify(tasks));
                displayTasks(currentUser, tasks);

                // Clear input fields
                TaskTittle.value = "";
                TaskDes.value = "";
            });
        }

        // Logout handler
        if (LogoutIn) {
            LogoutIn.addEventListener('click', function () {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.href = "home.html";
            });
        }
    }

});
