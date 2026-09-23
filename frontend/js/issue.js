// ======================================
// ISSUE / RETURN MANAGEMENT
// ======================================

const ISSUE_API = "http://localhost:5000/api/issues";
const STUDENT_API = "http://localhost:5000/api/students";
const BOOK_API = "http://localhost:5000/api/books";

const token = localStorage.getItem("libraryToken");

if (!token) {
    window.location.href = "login.html";
}


// ======================================
// AUTH HEADERS
// ======================================

function getAuthHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// ======================================
// AUTH ERROR HANDLER
// ======================================

function checkAuth(response) {

    if (response.status === 401) {

        localStorage.removeItem("libraryToken");
        localStorage.removeItem("adminUsername");

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// ======================================
// LOAD STUDENTS
// ======================================

async function loadStudents() {

    try {

        const response = await fetch(
            STUDENT_API,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        if (!checkAuth(response)) return;


        const data = await response.json();


        const studentSelect =
            document.getElementById("studentSelect");


        studentSelect.innerHTML =
            `<option value="">👨‍🎓 Select Student</option>`;


        data.students.forEach(student => {

            const option =
                document.createElement("option");


            option.value = student._id;


            option.textContent =
                `${student.name} (${student.studentId})`;


            studentSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );

    }

}


// ======================================
// LOAD BOOKS
// ======================================

async function loadBooks() {

    try {

        const response = await fetch(
            BOOK_API,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        if (!checkAuth(response)) return;


        const data = await response.json();


        const bookSelect =
            document.getElementById("bookSelect");


        bookSelect.innerHTML =
            `<option value="">📚 Select Book</option>`;


        data.books.forEach(book => {

            const option =
                document.createElement("option");


            option.value = book._id;


            if (book.available > 0) {

                option.textContent =
                    `${book.title} — Available: ${book.available}`;

            } else {

                option.textContent =
                    `${book.title} — ❌ Not Available`;

                option.disabled = true;

            }


            bookSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Error loading books:",
            error
        );

    }

}


// ======================================
// SET MINIMUM DUE DATE
// ======================================

function setMinimumDueDate() {

    const dueDate =
        document.getElementById("dueDate");


    if (!dueDate) return;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    dueDate.min = today;

}


// ======================================
// ISSUE BOOK
// ======================================

const issueForm =
    document.getElementById("issueForm");


if (issueForm) {

    issueForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const studentId =
                document
                    .getElementById("studentSelect")
                    .value;


            const bookId =
                document
                    .getElementById("bookSelect")
                    .value;


            const dueDate =
                document
                    .getElementById("dueDate")
                    .value;


            if (!studentId) {

                alert("Please select a student.");
                return;

            }


            if (!bookId) {

                alert("Please select a book.");
                return;

            }


            if (!dueDate) {

                alert("Please select due date.");
                return;

            }


            const issueData = {

                studentId: studentId,

                bookId: bookId,

                dueDate: dueDate

            };


            try {

                const response =
                    await fetch(
                        `${ISSUE_API}/issue`,
                        {
                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify(issueData)
                        }
                    );


                if (!checkAuth(response)) return;


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    issueForm.reset();

                    loadStudents();

                    loadBooks();

                    loadIssues();

                }


            } catch (error) {

                console.error(
                    "Issue Book Error:",
                    error
                );

            }

        }
    );

}


// ======================================
// LOAD ISSUE HISTORY
// ======================================

async function loadIssues() {

    try {

        const response =
            await fetch(
                ISSUE_API,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        if (!checkAuth(response)) return;


        const data =
            await response.json();


        window.allIssues =
            data.issues || [];


        displayIssues(
            window.allIssues
        );


    } catch (error) {

        console.error(
            "Issue History Error:",
            error
        );

    }

}


// ======================================
// DISPLAY ISSUES
// ======================================

function displayIssues(issues) {

    const table =
        document.getElementById(
            "issuesTable"
        );


    table.innerHTML = "";


    if (issues.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#777;
                    ">
                    📖 No issue records found
                </td>
            </tr>
        `;

        return;

    }


    issues.forEach(issue => {

        const row =
            document.createElement("tr");


        const studentName =
            issue.student
                ? issue.student.name
                : "Unknown";


        const bookTitle =
            issue.book
                ? issue.book.title
                : "Unknown";


        const issueDate =
            issue.issueDate
                ? new Date(
                    issue.issueDate
                  ).toLocaleDateString()
                : "-";


        const dueDateObject =
            issue.dueDate
                ? new Date(issue.dueDate)
                : null;


        const dueDate =
            dueDateObject
                ? dueDateObject.toLocaleDateString()
                : "-";


        const returnDate =
            issue.returnDate
                ? new Date(
                    issue.returnDate
                  ).toLocaleDateString()
                : "-";


        // =================================
        // STATUS
        // =================================

        let statusHTML = "";


        if (issue.status === "Returned") {

            statusHTML = `
                <span class="status-returned">
                    🔵 Returned
                </span>
            `;

        } else {

            const today = new Date();


            if (
                dueDateObject &&
                dueDateObject < today
            ) {

                statusHTML = `
                    <span class="status-overdue">
                        🔴 Overdue
                    </span>
                `;

            } else {

                statusHTML = `
                    <span class="status-issued">
                        🟢 Issued
                    </span>
                `;

            }

        }


        // =================================
        // ACTION
        // =================================

        let action = "";


        if (issue.status === "Issued") {

            action = `
                <button
                    class="return-btn"
                    onclick="returnBook('${issue._id}')">
                    ↩️ Return
                </button>
            `;

        } else {

            action = `
                <span class="completed-text">
                    ✓ Completed
                </span>
            `;

        }


        row.innerHTML = `

            <td>${studentName}</td>

            <td>${bookTitle}</td>

            <td>${issueDate}</td>

            <td>${dueDate}</td>

            <td>${returnDate}</td>

            <td>₹${issue.fine || 0}</td>

            <td>${statusHTML}</td>

            <td>${action}</td>

        `;


        table.appendChild(row);

    });

}


// ======================================
// ISSUE SEARCH
// ======================================

const issueSearch =
    document.getElementById(
        "issueSearch"
    );


if (issueSearch) {

    issueSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const filteredIssues =
                (window.allIssues || [])
                    .filter(issue => {

                        const studentName =
                            issue.student
                                ? issue.student.name
                                : "";


                        const studentId =
                            issue.student
                                ? issue.student.studentId
                                : "";


                        const bookTitle =
                            issue.book
                                ? issue.book.title
                                : "";


                        return (

                            studentName
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            studentId
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            bookTitle
                                .toLowerCase()
                                .includes(searchText)

                        );

                    });


            displayIssues(
                filteredIssues
            );

        }
    );

}


// ======================================
// RETURN BOOK
// ======================================

async function returnBook(issueId) {

    const confirmReturn =
        confirm(
            "Are you sure you want to return this book?"
        );


    if (!confirmReturn) {
        return;
    }


    try {

        const response =
            await fetch(
                `${ISSUE_API}/return/${issueId}`,
                {
                    method: "PUT",

                    headers:
                        getAuthHeaders()
                }
            );


        if (!checkAuth(response)) return;


        const data =
            await response.json();


        alert(
            `${data.message}\nFine: ₹${data.fine || 0}`
        );


        if (response.ok) {

            loadIssues();

            loadBooks();

        }


    } catch (error) {

        console.error(
            "Return Book Error:",
            error
        );

    }

}


// ======================================
// INITIAL LOAD
// ======================================

setMinimumDueDate();

loadStudents();

loadBooks();

loadIssues();