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
    saveCoursesToLocalStorage(newCourse);
    document.getElementById("courseForm").reset();
}
// Funktion för att lägga till kursinformation i listan och uppdatera DOM
function addCourseToList(course) {
    courseListEl.innerHTML += "\n    <div class='course'>\n        <ul>\n            <li>Kurskod: ".concat(course.code, "</li>\n            <li>Kursnamn: ").concat(course.name, "</li>\n            <li>Progression: ").concat(course.progression, "</li>\n            <li><a href=\"").concat(course.syllabus, "\" target=\"_blank\">L\u00E4nk till kursplan</a></li>\n        </ul>\n    </div>\n    ");
}
// Funktion för att spara kurser till localStorage och hantera dubbletter
function saveCoursesToLocalStorage(newCourse) {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]');
    var existingCourseIndex = courses.findIndex(function (course) { return course.code === newCourse.code; });
    if (existingCourseIndex !== -1) {
        var overwrite = confirm("Denna kurs finns redan. Vill du ersätta den?");
        if (overwrite) {
            courses[existingCourseIndex] = newCourse;
        }
        else {
            return;
        }
    }
    else {
        courses.push(newCourse);
    }
    localStorage.setItem('courses', JSON.stringify(courses));
    courseListEl.innerHTML = '';
    courses.forEach(addCourseToList);
}
// Funktion för att rensa kurser från både DOM och localStorage
function clearAllCourses() {
    courseListEl.innerHTML = '';
    localStorage.removeItem('courses');
}
// Funktion för att läsa in kurser från localStorage vid sidans laddning
function loadCoursesFromLocalStorage() {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courseListEl.innerHTML = '';
    courses.forEach(addCourseToList);
}
// Ladda kurser när sidan laddas
document.addEventListener('DOMContentLoaded', loadCoursesFromLocalStorage);
