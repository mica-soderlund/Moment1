// Variabler/HTML-elementreferenser
var saveBtnEl = document.getElementById('saveBtn');
var courseListEl = document.getElementById('courseList');
var clearAllBtnEl = document.getElementById('clearAllBtn');
// Eventlyssnare för knapparna
saveBtnEl.addEventListener('click', saveCourse, false);
clearAllBtnEl.addEventListener('click', clearAllCourses, false);
// Hanterar klick på kurslistan för uppdatering av kurser 
courseListEl.addEventListener('click', function (event) {
    var target = event.target;
    var prefix = 'update-';
    if (target.id.substring(0, prefix.length) === prefix) { // Jämför prefixen med en del av id-strängen
        var courseCode = target.id.replace(prefix, '');
        var course = findCourseByCode(courseCode);
        if (course) {
            fillFormWithCourse(course);
        }
    }
});
// Funktion för att spara en kurs
function saveCourse() {
    // Hittar och validerar formulärelementen
    var codeElement = document.getElementById("code");
    var nameElement = document.getElementById("name");
    var syllabusElement = document.getElementById("syllabus");
    var progressionElement = document.querySelector('input[name="progression"]:checked');
    // Säkerställer att inget fält är tomt
    if (!codeElement || !nameElement || !progressionElement || !syllabusElement) {
        return; // Avbryter funktionen om något fält saknas
    }
    // Skapar ett kursobjekt från formulärets data
    var newCourse = {
        code: codeElement.value,
        name: nameElement.value,
        syllabus: syllabusElement.value,
        progression: progressionElement.value,
    };
    saveCoursesToLocalStorage(newCourse); // Sparar kursen till localStorage
    document.getElementById("courseForm").reset(); // Återställer formuläret
}
// Funktion för att lägga till kursinformation i kurslistan och uppdatera DOM
function addCourseToList(course) {
    var updateButtonId = "update-".concat(course.code); // Skapar ett unikt ID för uppdateringsknappen baserat på kurskoden
    // Lägger till kursinformation och en uppdateringsknapp till kurslistan
    courseListEl.innerHTML += "\n  <div class='course'>\n      <ul>\n          <li>Kurskod: ".concat(course.code, "</li>\n          <li>Kursnamn: ").concat(course.name, "</li>\n          <li>Progression: ").concat(course.progression, "</li>\n          <li><a href=\"").concat(course.syllabus, "\" target=\"_blank\">L\u00E4nk till kursplan</a></li>\n      </ul>\n      <button id=\"").concat(updateButtonId, "\">Uppdatera Kurs</button>\n  </div>\n  ");
}
// Funktion för att fylla i formuläret med en kurs information för redigering
function fillFormWithCourse(course) {
    // Fyller i varje fält i formuläret med motsvarande värde från kursobjektet
    document.getElementById("code").value = course.code;
    document.getElementById("name").value = course.name;
    document.getElementById("syllabus").value = course.syllabus;
    // Markerar den korrekta progression-radioknappen
    document.querySelectorAll('input[name="progression"]').forEach(function (element) {
        if (element.value === course.progression) {
            element.checked = true;
        }
    });
}
// Funktion för att spara kurser till localStorage och hantera dubbletter
function saveCoursesToLocalStorage(newCourse) {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]'); // Hämtar befintliga kurser från localStorage
    var existingCourseIndex = courses.findIndex(function (course) { return course.code === newCourse.code; }); // Söker efter en kurs med samma kod
    // Hanterar dubbletter
    if (existingCourseIndex !== -1) {
        var overwrite = confirm("Denna kurs finns redan. Vill du ersätta den?");
        if (overwrite) {
            courses[existingCourseIndex] = newCourse; // Ersätter befintlig kurs med den nya 
        }
        else {
            return;
        }
    }
    else {
        courses.push(newCourse); // Lägger till den nya kursen till listan om den inte redan finns
    }
    localStorage.setItem('courses', JSON.stringify(courses)); // Sparar den uppdaterade kurslistan till localStorage
    courseListEl.innerHTML = ''; // Rensar kurslistan i DOM
    courses.forEach(addCourseToList); // Lägger till varje kurs till DOM på nytt
}
// Funktion för att rensa alla kurser från både DOM och localStorage
function clearAllCourses() {
    courseListEl.innerHTML = ''; // Rensar kurslistan i DOM
    localStorage.removeItem('courses'); // Rensar alla kurser från localStorage
}
// Funktion för att hitta en kurs baserat på kurskod
function findCourseByCode(code) {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]');
    return courses.find(function (course) { return course.code === code; });
}
// Funktion för att läsa in kurser från localStorage när sidan laddas
function loadCoursesFromLocalStorage() {
    var courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courseListEl.innerHTML = '';
    courses.forEach(addCourseToList);
}
document.addEventListener('DOMContentLoaded', loadCoursesFromLocalStorage);
