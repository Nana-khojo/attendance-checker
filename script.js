function loadStudentMap () {
    return JSON.parse(localStorage.getItem('studentMap')) || {
        "2425400999": "ISAAC ABEKA",
        "2425401208": "BRIGHT AMPOMAH",
        "2425401177": "EBENEZER YAMOAH JONAH"
    };
}

function saveStudentMap(map) {
    localStorage.setItem('studentMap', JSON.stringify(map));
}

let studentMap = loadStudentMap()

const form = document.getElementById('attendance-form');
const tableBody = document.querySelector("#attendanceTable tbody");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('studentID').value.trim();
    const name = studentMap[id];

    if (!id || !name) {
        alert ("ID not found! Please use registered ID.");
        return;
    }

    const now = new Date();
    const record = {
        name,
        id,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    };

    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    records.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(records))

    form.reset();
    loadAttendnace();

});

function loadAttendnace() {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    tableBody.innerHTML = "";

    records.forEach((r, i) => {
        const row = `<tr>
        <td>${i + 1}</td>
        <td>${r.name}</td>
        <td>${r.id}</td>
        <td>${r.date}</td>
        <td>${r.time}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
loadAttendnace();

document.getElementById('exportCVS').addEventListener('click', () => {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const today = new Date().toLocaleDateString();
    const todaysRecords = records.filter(r => r.date === today);

    if (todaysRecords.length === 0) {
        alert('No attendance records for today!');
        return;
    }

    let csvContent = "date.text/csv;charset=utf-8, ";
    csvContent += "Name, Id, Date. Time\n";
    todaysRecords.forEach(row => {
        csvContent += `${row.name}, ${row.id}, ${row.date}, ${row.time}\n`
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri); 
    link.setAttribute("download", `attendance_${today.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link);
});

document.getElementById('clearData').addEventListener('click', () => {
    if (confirm ("Are you  sure you want to delete all attendance records?")) {
        localStorage.removeItem('attendanceRecords');
        loadAttendnace();
    }
});

const adminPanel = document.getElementById("adminPanel");
const toggleAdmin = document.getElementById("toggleAdmin");
const tableList = document.getElementById("attendance-list");

toggleAdmin.addEventListener("click", () => {
    const password = prompt("Enter Admin Password");
    if (password === "admin123") {
        adminPanel.style.display = "block";

        tableList.style.display = "block";
        
        toggleAdmin.textContent = "Lock Panel";
    }else{
        alert("Incorrect Password!");
    }
});

document.getElementById('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newStudentName').value.trim();
    const id = document.getElementById('newStudentID').value.trim();

    if (!name || !id) {
        alert("Please enter both name and ID.");
        return;
    }

    if (studentMap[name]) {
        alert("Student already exists!");
        return;
    }

    studentMap[name] = id;
    saveStudentMap(studentMap);
    alert("Student registered");
    e.target.reset();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log("Service Worker registered"))
        .catch(err => console.error("Service Worker registration failed", err))
    });
}