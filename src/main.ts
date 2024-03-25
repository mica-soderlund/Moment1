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
        return;
    }

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

// Funktion för att spara kurser till localStorage och hantera dubbletter
function saveCoursesToLocalStorage(newCourse: CourseInfo): void {
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const existingCourseIndex = courses.findIndex((course: CourseInfo) => course.code === newCourse.code);
  
    if (existingCourseIndex !== -1) {
      const overwrite = confirm("Denna kurs finns redan. Vill du ersätta den?");
      if (overwrite) {
        courses[existingCourseIndex] = newCourse;
      } else {
        return;
      }
    } else {
      courses.push(newCourse);
    }
    localStorage.setItem('courses', JSON.stringify(courses));
    courseListEl.innerHTML = ''; 
    courses.forEach(addCourseToList); 
  }

// Funktion för att rensa kurser från både DOM och localStorage
function clearAllCourses(): void {
    courseListEl.innerHTML = '';
    localStorage.removeItem('courses');
  }

// Funktion för att läsa in kurser från localStorage vid sidans laddning
function loadCoursesFromLocalStorage(): void {
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courseListEl.innerHTML = '';
    courses.forEach(addCourseToList);
}

// Ladda kurser när sidan laddas
document.addEventListener('DOMContentLoaded', loadCoursesFromLocalStorage);