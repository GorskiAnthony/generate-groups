import { getItems, removeItem, setItems } from "./localStorage.js";
import { toastError, toastNatural, toastSuccess } from "./toast.js";
import jsConfetti from "./confetti.js";

/**
 * Description: Create teams with students
 * @param {Object} event - Event object
 * @param {Number} groups - Number of groups
 * @param {Function} setter - Function to update state
 * @returns {Array} - Array of teams
 */
const handleCreateTeams = (event, groups, setter) => {
  event.preventDefault();
  const students = getItems("students")?.split(",");
  if (students === undefined) return toastError("Herm.. Il n'y a pas d'élèves");
  const teams = [];
  for (let i = 0; i < groups; i++) {
    teams.push([]);
  }

  while (students.length > 0) {
    for (let i = 0; i < groups; i++) {
      const randomIndex = Math.floor(Math.random() * students.length);
      const student = students.splice(randomIndex, 1);
      teams[i].push(student);
      teams[i] = teams[i].flat();
    }
  }
  setter(teams);
};

/**
 * Description: Reset all students in list
 * @param {Object} event - Event object
 * @param {String} key
 * @param {Function} setter - Function to update state
 */
const handleReset = (event, key, setter) => {
  event.preventDefault();
  if (window.confirm("Êtes-vous sûr de vouloir supprimer tous les élèves ?")) {
    toastSuccess("🗑️ Tous les élèves ont été supprimés");
    removeItem(key);
    setter([]);
  } else {
    toastSuccess("👍 Les élèves n'ont pas été supprimés");
  }
};

/**
 * Description: Get a random student
 * @param {Object} event - Event object
 * @param {Array} students - Array of students
 */
const handleGetRandomStudent = (event, students) => {
  event.preventDefault();
  const randomIndex = Math.floor(Math.random() * students.length);
  if (students.length === 0) return toastError("Herm.. Il n'y a pas d'élèves");
  toastNatural();
  setTimeout(() => {
    toastSuccess(`🎉 ${students[randomIndex]} 🤩`);
    jsConfetti.addConfetti();
  }, 1000);
};

export { handleCreateTeams, handleReset, handleGetRandomStudent };
