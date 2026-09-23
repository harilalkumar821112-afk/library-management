const API_URL = "https://library-management-3nu4.onrender.com/api/students";

const token = localStorage.getItem("libraryToken");

if (!token) {
    window.location.href = "login.html";
}

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}


// =====================================
// LOAD STUDENTS
// =====================================

async function loadStudents() {

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (response.status === 401) {

            localStorage.removeItem("libraryToken");
            localStorage.removeItem("adminUsername");

            window.location.href = "login.html";

            return;
        }

        const data = await response.json();

        displayStudents(data.students);

    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );

    }
}


// =====================================
// DISPLAY STUDENTS
// =====================================

function displayStudents(students) {

    const table =
        document.getElementById("studentsTable");

    table.innerHTML = "";

    students.forEach(student => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${student.studentId}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.phone}</td>

            <td>${student.course}</td>

            <td>${student.semester}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent('${student._id}')">
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent('${student._id}')">
                    🗑️ Delete
                </button>

            </td>

        `;

        table.appendChild(row);

    });

}


// =====================================
// ADD STUDENT
// =====================================

document
    .getElementById("studentForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const studentData = {

                studentId:
                    document
                        .getElementById("studentId")
                        .value,

                name:
                    document
                        .getElementById("name")
                        .value,

                email:
                    document
                        .getElementById("email")
                        .value,

                phone:
                    document
                        .getElementById("phone")
                        .value,

                course:
                    document
                        .getElementById("course")
                        .value,

                semester:
                    Number(
                        document
                            .getElementById("semester")
                            .value
                    )

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/add`,
                        {
                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify(
                                    studentData
                                )
                        }
                    );


                if (response.status === 401) {

                    localStorage.removeItem(
                        "libraryToken"
                    );

                    localStorage.removeItem(
                        "adminUsername"
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    document
                        .getElementById("studentForm")
                        .reset();

                    loadStudents();

                }

            } catch (error) {

                console.error(
                    "Error adding student:",
                    error
                );

            }

        }
    );


// =====================================
// EDIT STUDENT
// =====================================

async function editStudent(studentId) {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "libraryToken"
            );

            localStorage.removeItem(
                "adminUsername"
            );

            window.location.href =
                "login.html";

            return;
        }


        const data =
            await response.json();


        const student =
            data.students.find(
                student =>
                    student._id === studentId
            );


        if (!student) {

            alert("Student not found");

            return;
        }


        const studentIdValue =
            prompt(
                "Enter Student ID:",
                student.studentId
            );

        if (studentIdValue === null) return;


        const name =
            prompt(
                "Enter Student Name:",
                student.name
            );

        if (name === null) return;


        const email =
            prompt(
                "Enter Email:",
                student.email
            );

        if (email === null) return;


        const phone =
            prompt(
                "Enter Phone:",
                student.phone
            );

        if (phone === null) return;


        const course =
            prompt(
                "Enter Course:",
                student.course
            );

        if (course === null) return;


        const semesterInput =
            prompt(
                "Enter Semester:",
                student.semester
            );

        if (semesterInput === null) return;


        const semester =
            Number(semesterInput);


        if (
            !semester ||
            semester < 1
        ) {

            alert(
                "Semester must be at least 1"
            );

            return;
        }


        const updatedStudent = {

            studentId:
                studentIdValue,

            name:
                name,

            email:
                email,

            phone:
                phone,

            course:
                course,

            semester:
                semester

        };


        const updateResponse =
            await fetch(
                `${API_URL}/${studentId}`,
                {
                    method: "PUT",

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify(
                            updatedStudent
                        )
                }
            );


        if (updateResponse.status === 401) {

            localStorage.removeItem(
                "libraryToken"
            );

            localStorage.removeItem(
                "adminUsername"
            );

            window.location.href =
                "login.html";

            return;
        }


        const updateData =
            await updateResponse.json();


        alert(updateData.message);


        if (updateResponse.ok) {

            loadStudents();

        }


    } catch (error) {

        console.error(
            "Error updating student:",
            error
        );

    }

}


// =====================================
// DELETE STUDENT
// =====================================

async function deleteStudent(studentId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${studentId}`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "libraryToken"
            );

            localStorage.removeItem(
                "adminUsername"
            );

            window.location.href =
                "login.html";

            return;
        }


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            loadStudents();

        }

    } catch (error) {

        console.error(
            "Error deleting student:",
            error
        );

    }

}




// =====================================
// SEARCH STUDENT
// =====================================

document
    .getElementById("studentSearch")
    .addEventListener(
        "input",
        async function () {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "GET",
                            headers:
                                getAuthHeaders()
                        }
                    );


                if (response.status === 401) {

                    localStorage.removeItem(
                        "libraryToken"
                    );

                    localStorage.removeItem(
                        "adminUsername"
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                const data =
                    await response.json();


                const filteredStudents =
                    data.students.filter(
                        student =>

                            student.studentId
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            student.name
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            student.email
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            student.course
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            student.phone
                                .includes(searchText)
                    );


                displayStudents(
                    filteredStudents
                );


            } catch (error) {

                console.error(
                    "Search Error:",
                    error
                );

            }

        }
    );


// Load students initially
loadStudents();