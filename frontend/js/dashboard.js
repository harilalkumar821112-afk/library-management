// ======================================
// DASHBOARD
// ======================================

const API_URL =
    "https://library-management-3nu4.onrender.com/api/dashboard";


const token =
    localStorage.getItem("libraryToken");


if (!token) {

    window.location.href =
        "login.html";

}


// ======================================
// AUTH HEADERS
// ======================================

function getAuthHeaders() {

    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


// ======================================
// AUTH ERROR
// ======================================

function logoutUser() {

    localStorage.removeItem(
        "libraryToken"
    );

    localStorage.removeItem(
        "adminUsername"
    );

    window.location.href =
        "login.html";

}


// ======================================
// LOAD DASHBOARD
// ======================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );


        // Unauthorized

        if (response.status === 401) {

            logoutUser();

            return;

        }


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Dashboard Error:",
                data.message
            );

            return;

        }


        const dashboard =
            data.dashboard;


        // =================================
        // BASIC STATISTICS
        // =================================

        document
            .getElementById("totalBooks")
            .innerText =
                dashboard.totalBooks ?? 0;


        document
            .getElementById("availableBooks")
            .innerText =
                dashboard.availableBooks ?? 0;


        document
            .getElementById("issuedBooks")
            .innerText =
                dashboard.issuedBooks ?? 0;


        document
            .getElementById("returnedBooks")
            .innerText =
                dashboard.returnedBooks ?? 0;


        document
            .getElementById("totalStudents")
            .innerText =
                dashboard.totalStudents ?? 0;


        document
            .getElementById("totalFine")
            .innerText =
                dashboard.totalFine ?? 0;


        // =================================
        // OVERDUE
        // =================================

        document
            .getElementById("overdueBooks")
            .innerText =
                dashboard.overdueBooks ?? 0;


        // =================================
        // RECENT ISSUES
        // =================================

        displayRecentIssues(
            dashboard.recentIssues || []
        );


        // =================================
        // MOST ISSUED BOOKS
        // =================================

        displayMostIssuedBooks(
            dashboard.mostIssuedBooks || []
        );


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// ======================================
// DISPLAY RECENT ISSUES
// ======================================

function displayRecentIssues(issues) {

    const table =
        document.getElementById(
            "recentIssuesTable"
        );


    table.innerHTML = "";


    if (issues.length === 0) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#777;
                    "
                >
                    📋 No recent issue records
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


        const studentId =
            issue.student
                ? issue.student.studentId
                : "-";


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


        const dueDate =
            issue.dueDate
                ? new Date(
                    issue.dueDate
                  ).toLocaleDateString()
                : "-";


        let statusHTML;


        if (issue.status === "Returned") {

            statusHTML = `
                <span class="status-returned">
                    🔵 Returned
                </span>
            `;

        } else {

            const today =
                new Date();

            const due =
                new Date(issue.dueDate);


            today.setHours(
                0,
                0,
                0,
                0
            );

            due.setHours(
                0,
                0,
                0,
                0
            );


            if (due < today) {

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


        row.innerHTML = `

            <td>
                ${studentName}
            </td>

            <td>
                ${studentId}
            </td>

            <td>
                ${bookTitle}
            </td>

            <td>
                ${issueDate}
            </td>

            <td>
                ${dueDate}
            </td>

            <td>
                ${statusHTML}
            </td>

        `;


        table.appendChild(row);

    });

}


// ======================================
// DISPLAY MOST ISSUED BOOKS
// ======================================

function displayMostIssuedBooks(books) {

    const table =
        document.getElementById(
            "mostIssuedBooksTable"
        );


    table.innerHTML = "";


    if (books.length === 0) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#777;
                    "
                >
                    📚 No issue data available
                </td>

            </tr>
        `;

        return;

    }


    books.forEach(
        (book, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        #${index + 1}
                    </strong>
                </td>

                <td>
                    ${book.title || "Unknown"}
                </td>

                <td>
                    ${book.author || "Unknown"}
                </td>

                <td>
                    <strong>
                        ${book.issueCount}
                    </strong>
                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ======================================
// INITIAL LOAD
// ======================================

loadDashboard();