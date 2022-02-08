
    // Get from Session
    userId = localStorage.getItem("userId");
    firstName = localStorage.getItem("fName");
    lastName = localStorage.getItem("lName");

    document.getElementById("headerName").innerHTML = "Logged in as " + firstName + " " + lastName;

    if(userId < 0) {
        window.location.href = "index.html";
    }
    else {
        document.getElementById("headerName").innerHTML = "Logged in as " + firstname + " " + lastName;
    }

    

// function myFunction() {
//     // Declare variables
//     var input, filter, table, tr, td, i, txtValue;
//     input = document.getElementById("myInput");
//     filter = input.value.toUpperCase();
//     table = document.getElementById("myTable");
//     tr = table.getElementsByTagName("tr");

//     // Loop through all table rows, and hide those who don't match the search query
//     for (i = 0; i < tr.length; i++) {
//         td = tr[i].getElementsByTagName("td")[0];
//         if (td) {
//             txtValue = td.textContent || td.innerText;
//             if (txtValue.toUpperCase().indexOf(filter) > -1) {
//                 tr[i].style.display = "";
//             } else {
//                 tr[i].style.display = "none";
//             }
//         }
//     }
// }