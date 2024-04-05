// Interface - kursinfo kontrakt
interface CourseInfo {
  code: string; 
  name: string;
  progression: 'A' | 'B' | 'C'; // Progressionsnivå, begränsad till A, B, eller C
  syllabus: string;
}

// Variabler/HTML-elementreferenser
const saveBtnEl = document.getElementById('saveBtn') as HTMLButtonElement; 
const courseListEl = document.getElementById('courseList') as HTMLDivElement; 
const clearAllBtnEl = document.getElementById('clearAllBtn') as HTMLButtonElement;

// Eventlyssnare för knapparna
saveBtnEl.addEventListener('click', saveCourse, false); 
clearAllBtnEl.addEventListener('click', clearAllCourses, false); 

// Hanterar klick på kurslistan för uppdatering av kurser 
courseListEl.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const prefix = 'update-';
  if (target.id.substring(0, prefix.length) === prefix) { // Jämför prefixen med en del av id-strängen
      const courseCode = target.id.replace(prefix, ''); 
      const course = findCourseByCode(courseCode);
      if (course) {
          fillFormWithCourse(course); 
      }
  }
});

// Funktion för att spara en kurs
function saveCourse(): void {
  // Hittar och validerar formulärelementen
  const codeElement = document.getElementById("code") as HTMLInputElement | null;
  const nameElement = document.getElementById("name") as HTMLInputElement | null;
  const syllabusElement = document.getElementById("syllabus") as HTMLInputElement | null;
  const progressionElement = document.querySelector('input[name="progression"]:checked') as HTMLInputElement | null;

  // Säkerställer att inget fält är tomt
  if (!codeElement || !nameElement || !progressionElement || !syllabusElement) {
      return; // Avbryter funktionen om något fält saknas
  }

  // Skapar ett kursobjekt från formulärets data
  const newCourse: CourseInfo = {
      code: codeElement.value,
      name: nameElement.value,
      syllabus: syllabusElement.value,
      progression: progressionElement.value as 'A' | 'B' | 'C',
  };

  saveCoursesToLocalStorage(newCourse); // Sparar kursen till localStorage
  (document.getElementById("courseForm") as HTMLFormElement).reset(); // Återställer formuläret
}

// Funktion för att lägga till kursinformation i kurslistan och uppdatera DOM
function addCourseToList(course: CourseInfo): void {
  const updateButtonId = `update-${course.code}`; // Skapar ett unikt ID för uppdateringsknappen baserat på kurskoden
  // Lägger till kursinformation och en uppdateringsknapp till kurslistan
  courseListEl.innerHTML += `
  <div class='course'>
      <ul>
          <li>Kurskod: ${course.code}</li>
          <li>Kursnamn: ${course.name}</li>
          <li>Progression: ${course.progression}</li>
          <li><a href="${course.syllabus}" target="_blank">Länk till kursplan</a></li>
      </ul>
      <button id="${updateButtonId}">Uppdatera Kurs</button>
  </div>
  `;
}

// Funktion för att fylla i formuläret med en kurs information för redigering
function fillFormWithCourse(course: CourseInfo): void {
  // Fyller i varje fält i formuläret med motsvarande värde från kursobjektet
  (document.getElementById("code") as HTMLInputElement).value = course.code;
  (document.getElementById("name") as HTMLInputElement).value = course.name;
  (document.getElementById("syllabus") as HTMLInputElement).value = course.syllabus;
  // Markerar den korrekta progression-radioknappen
  document.querySelectorAll('input[name="progression"]').forEach((element) => {
      if ((element as HTMLInputElement).value === course.progression) {
          (element as HTMLInputElement).checked = true;
      }
  });
}

// Funktion för att spara kurser till localStorage och hantera dubbletter
function saveCoursesToLocalStorage(newCourse: CourseInfo): void {
  let courses = JSON.parse(localStorage.getItem('courses') || '[]'); // Hämtar befintliga kurser från localStorage
  const existingCourseIndex = courses.findIndex((course: CourseInfo) => course.code === newCourse.code); // Söker efter en kurs med samma kod

  // Hanterar dubbletter
  if (existingCourseIndex !== -1) {
      const overwrite = confirm("Denna kurs finns redan. Vill du ersätta den?");
      if (overwrite) {
          courses[existingCourseIndex] = newCourse; // Ersätter befintlig kurs med den nya 
      } else {
          return; 
      }
  } else {
      courses.push(newCourse); // Lägger till den nya kursen till listan om den inte redan finns
  }
  localStorage.setItem('courses', JSON.stringify(courses)); // Sparar den uppdaterade kurslistan till localStorage
  courseListEl.innerHTML = ''; // Rensar kurslistan i DOM
  courses.forEach(addCourseToList); // Lägger till varje kurs till DOM på nytt
}

// Funktion för att rensa alla kurser från både DOM och localStorage
function clearAllCourses(): void {
  courseListEl.innerHTML = ''; // Rensar kurslistan i DOM
  localStorage.removeItem('courses'); // Rensar alla kurser från localStorage
}

// Funktion för att hitta en kurs baserat på kurskod
function findCourseByCode(code: string): CourseInfo | undefined {
  let courses = JSON.parse(localStorage.getItem('courses') || '[]'); 
  return courses.find((course: CourseInfo) => course.code === code); 
}

// Funktion för att läsa in kurser från localStorage när sidan laddas
function loadCoursesFromLocalStorage(): void {
  let courses = JSON.parse(localStorage.getItem('courses') || '[]');
  courseListEl.innerHTML = '';
  courses.forEach(addCourseToList); 
}

document.addEventListener('DOMContentLoaded', loadCoursesFromLocalStorage);
