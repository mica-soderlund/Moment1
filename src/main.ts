//TYPESCRIPT

//Interface - kursinfo kontrakt
interface CourseInfo {
    code: string;
    name: string;
    progression: 'A' | 'B' | 'C'; // Begränsar värden till abc
    syllabus: string;
}

//Varibler/HTML-elementreferenser
const saveBtnEl = document.getElementById('saveBtn') as HTMLButtonElement;
const courseListEl = document.getElementById('courseList') as HTMLDivElement;
const clearAllBtnEl = document.getElementById('clearAllBtn') as HTMLButtonElement;

//Eventlyssnare
saveBtnEl.addEventListener('click', saveCourse, false);
clearAllBtnEl.addEventListener('click', clearAllCourses, false);

//Function - spara kurs - säkerställer att varje element inte är 'null' innan 'value'
function saveCourse(): void {
    const codeElement = document.getElementById("code") as HTMLInputElement | null;
    const nameElement = document.getElementById("name") as HTMLInputElement | null;
    const syllabusElement = document.getElementById("syllabus") as HTMLInputElement | null;
    const progressionElement = document.querySelector('input[name="progression"]:checked') as HTMLInputElement | null;

    if (!codeElement || !nameElement || !progressionElement || !syllabusElement) {
        alert('Fyll i samtliga fält innan du sparar!');
        return;
    }

    //  lägger till .value på de säkert typkonverterade elementen
    const codeInput: string = codeElement.value;
    const nameInput: string = nameElement.value;
    const syllabusInput: string = syllabusElement.value;
    const progressionInput: string = progressionElement.value;

    const newCourse: CourseInfo = {
        code: codeInput,
        name: nameInput,
        syllabus: syllabusInput,
        progression: progressionInput as 'A' | 'B' | 'C',
    };

    addCourseToList(newCourse);
    saveCoursesToLocalStorage(newCourse);
    (document.getElementById("courseForm") as HTMLFormElement).reset();
}


// Funktion för att lägga till kursinformation i listan och uppdatera DOM
function addCourseToList(course: CourseInfo): void {
    courseListEl.innerHTML += `
    <div class='course'>
        <ul>
            <li>Kurskod: ${course.code}</li>
            <li>Kursnamn: ${course.name}</li>
            <li>Progression: ${course.progression}</li>
            <li><a href="${course.syllabus}" target="_blank">Länk till kursplan</a></li>
        </ul>
    </div>
    `;
}

// Funktion för att spara kurser till localStorage
function saveCoursesToLocalStorage(course: CourseInfo): void {
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Funktion för att läsa in kurser från localStorage vid sidans laddning
function loadCoursesFromLocalStorage(): void {
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.forEach((course: CourseInfo) => {
        addCourseToList(course);
    });
}

// Funktion för att rensa kurser från både DOM och localStorage
function clearAllCourses(): void {
    courseListEl.innerHTML = '';
    localStorage.removeItem('courses');
}

// Ladda kurser när sidan laddas
document.addEventListener('DOMContentLoaded', loadCoursesFromLocalStorage);