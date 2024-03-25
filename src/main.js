//TYPESCRIPT
//Varibler/HTML-elementreferenser
var saveBtnEl = document.getElementById('saveBtn');
var courseListEl = document.getElementById('courseList');
var clearAllBtnEl = document.getElementById('clearAllBtn');
//Eventlyssnare
saveBtnEl.addEventListener('click', saveCourse, false);
clearAllBtnEl.addEventListener('click', clearAllCourses, false);
//Function - spara kurs - säkerställer att varje element inte är 'null' innan 'value'
function saveCourse() {
    var codeElement = document.getElementById("code");
    var nameElement = document.getElementById("name");
    var syllabusElement = document.getElementById("syllabus");
    var progressionElement = document.querySelector('input[name="progression"]:checked');
    if (!codeElement || !nameElement || !progressionElement || !syllabusElement) {
        return;
    }
    //  lägger till .value på de säkert typkonverterade elementen
    var codeInput = codeElement.value;
    var nameInput = nameElement.value;
    var syllabusInput = syllabusElement.value;
    var progressionInput = progressionElement.value;
    var newCourse = {
        code: codeInput,
        name: nameInput,
        syllabus: syllabusInput,
        progression: progressionInput,
    };
    addCourseToList(newCourse);
    saveCoursesToLocalStorage(newCourse);
    document.getElementById("courseForm").reset();
}
// Funktion för att lägga till kursinformation i listan och uppdatera DOM
function addCourseToList(course) {
    courseListEl.innerHTML += "\n    <div class='course'>\n        <ul>\n            <li>Kurskod: ".concat(course.code, "</li>\n            <li>Kursnamn: ").concat(course.name, "</li>\n            <li>Progression: ").concat(course.progression, "</li>\n            <li><a href=\"").concat(course.syllabus, "\" target=\"_blank\">L\u00E4nk till kursplan</a></li>\n        </ul>\n    </div>\n    ");
}
// Funktion för att spara kurser till localStorage
function saveCoursesToLocalStorage(course) {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
}
// Funktion för att läsa in kurser från localStorage vid sidans laddning
function loadCoursesFromLocalStorage() {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.forEach(function (course) {
        addCourseToList(course);
    });
}
// Funktion för att rensa kurser från både DOM och localStorage
function clearAllCourses() {
    courseListEl.innerHTML = '';
    localStorage.removeItem('courses');
}
// Ladda kurser när sidan laddas
document.addEventListener('DOMContentLoaded', loadCoursesFromLocalStorage);
