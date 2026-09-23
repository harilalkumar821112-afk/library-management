// ======================================
// BOOK MANAGEMENT
// ======================================

const API_URL = "https://library-management-3nu4.onrender.com/api/books";

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
// GLOBAL BOOK DATA
// ======================================

let allBooks = [];


// ======================================
// LOGOUT / UNAUTHORIZED
// ======================================

function handleUnauthorized() {

    localStorage.removeItem("libraryToken");
    localStorage.removeItem("adminUsername");

    window.location.href = "login.html";

}


// ======================================
// LOAD ALL BOOKS
// ======================================

async function loadBooks() {

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            headers: getAuthHeaders()
        });


        if (response.status === 401) {

            handleUnauthorized();
            return;

        }


        const data = await response.json();


        if (!response.ok) {

            alert(data.message || "Error loading books");
            return;

        }


        allBooks = data.books || [];


        // Category dropdown update
        populateCategories();


        // Display all books
        applyFilters();


    } catch (error) {

        console.error("Error loading books:", error);

    }

}


// ======================================
// DISPLAY BOOKS
// ======================================

function displayBooks(books) {

    const table =
        document.getElementById("booksTable");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (books.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#777;
                    ">
                    📚 No books found
                </td>
            </tr>
        `;

        return;
    }


    books.forEach(book => {

        const row =
            document.createElement("tr");


        const status =
            book.available > 0
                ? `<span class="available-status">
                    ✅ Available
                   </span>`
                : `<span class="issued-status">
                    🔴 Fully Issued
                   </span>`;


        row.innerHTML = `

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.category}</td>

            <td>${book.isbn}</td>

            <td>${book.quantity}</td>

            <td>${book.available}</td>

            <td>${status}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editBook('${book._id}')">
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteBook('${book._id}')">
                    🗑️ Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ======================================
// POPULATE CATEGORY FILTER
// ======================================

function populateCategories() {

    const categoryFilter =
        document.getElementById("categoryFilter");


    if (!categoryFilter) {
        return;
    }


    const currentCategory =
        categoryFilter.value;


    const categories =
        [...new Set(
            allBooks
                .map(book => book.category)
                .filter(category => category)
        )].sort();


    categoryFilter.innerHTML = `
        <option value="">
            📚 All Categories
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = `📖 ${category}`;

        categoryFilter.appendChild(option);

    });


    // Keep selected category
    if (categories.includes(currentCategory)) {

        categoryFilter.value = currentCategory;

    }

}


// ======================================
// SEARCH + FILTER
// ======================================

function applyFilters() {

    const searchInput =
        document.getElementById("bookSearch");


    const categoryFilter =
        document.getElementById("categoryFilter");


    const availabilityFilter =
        document.getElementById("availabilityFilter");


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "";


    const availability =
        availabilityFilter
            ? availabilityFilter.value
            : "";


    const filteredBooks =
        allBooks.filter(book => {


            // Search
            const matchesSearch =

                book.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.author
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.isbn
                    .toLowerCase()
                    .includes(searchText);


            // Category
            const matchesCategory =

                category === ""
                ||
                book.category === category;


            // Availability
            let matchesAvailability = true;


            if (availability === "available") {

                matchesAvailability =
                    book.available > 0;

            }


            if (availability === "issued") {

                matchesAvailability =
                    book.available === 0;

            }


            return (
                matchesSearch &&
                matchesCategory &&
                matchesAvailability
            );

        });


    displayBooks(filteredBooks);

}


// ======================================
// SEARCH EVENT
// ======================================

const bookSearch =
    document.getElementById("bookSearch");


if (bookSearch) {

    bookSearch.addEventListener(
        "input",
        applyFilters
    );

}


// ======================================
// CATEGORY FILTER EVENT
// ======================================

const categoryFilter =
    document.getElementById("categoryFilter");


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ======================================
// AVAILABILITY FILTER EVENT
// ======================================

const availabilityFilter =
    document.getElementById("availabilityFilter");


if (availabilityFilter) {

    availabilityFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ======================================
// ADD BOOK
// ======================================

const bookForm =
    document.getElementById("bookForm");


if (bookForm) {

    bookForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("title")
                    .value.trim();


            const author =
                document
                    .getElementById("author")
                    .value.trim();


            const category =
                document
                    .getElementById("category")
                    .value.trim();


            const isbn =
                document
                    .getElementById("isbn")
                    .value.trim();


            const quantity =
                Number(
                    document
                        .getElementById("quantity")
                        .value
                );


            if (
                !title ||
                !author ||
                !category ||
                !isbn ||
                quantity < 1
            ) {

                alert(
                    "Please enter valid book details."
                );

                return;

            }


            const bookData = {

                title: title,

                author: author,

                category: category,

                isbn: isbn,

                quantity: quantity,

                available: quantity

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
                                    bookData
                                )
                        }
                    );


                if (response.status === 401) {

                    handleUnauthorized();
                    return;

                }


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    bookForm.reset();

                    loadBooks();

                }


            } catch (error) {

                console.error(
                    "Error adding book:",
                    error
                );

            }

        }
    );

}


// ======================================
// EDIT BOOK
// ======================================

async function editBook(bookId) {

    try {

        const book =
            allBooks.find(
                book => book._id === bookId
            );


        if (!book) {

            alert("Book not found");
            return;

        }


        const title =
            prompt(
                "Enter Book Title:",
                book.title
            );


        if (title === null) return;


        const author =
            prompt(
                "Enter Author:",
                book.author
            );


        if (author === null) return;


        const category =
            prompt(
                "Enter Category:",
                book.category
            );


        if (category === null) return;


        const isbn =
            prompt(
                "Enter ISBN:",
                book.isbn
            );


        if (isbn === null) return;


        const quantityInput =
            prompt(
                "Enter Quantity:",
                book.quantity
            );


        if (quantityInput === null) return;


        const quantity =
            Number(quantityInput);


        if (
            quantity < 1 ||
            isNaN(quantity)
        ) {

            alert(
                "Quantity must be at least 1"
            );

            return;

        }


        // Books already issued
        const issuedBooks =
            book.quantity - book.available;


        if (quantity < issuedBooks) {

            alert(
                `Quantity cannot be less than currently issued books (${issuedBooks}).`
            );

            return;

        }


        const available =
            quantity - issuedBooks;


        const updatedBook = {

            title: title.trim(),

            author: author.trim(),

            category: category.trim(),

            isbn: isbn.trim(),

            quantity: quantity,

            available: available

        };


        const response =
            await fetch(
                `${API_URL}/${bookId}`,
                {
                    method: "PUT",

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify(
                            updatedBook
                        )
                }
            );


        if (response.status === 401) {

            handleUnauthorized();
            return;

        }


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            loadBooks();

        }


    } catch (error) {

        console.error(
            "Error updating book:",
            error
        );

    }

}


// ======================================
// DELETE BOOK
// ======================================

async function deleteBook(bookId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${bookId}`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );


        if (response.status === 401) {

            handleUnauthorized();
            return;

        }


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            loadBooks();

        }


    } catch (error) {

        console.error(
            "Error deleting book:",
            error
        );

    }

}


// ======================================
// INITIAL LOAD
// ======================================

loadBooks();