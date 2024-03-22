import { getItems, removeItem } from "./localStorage.js";
import { toastError, toastNeutral, toastSuccess } from "./toast.js";
import jsConfetti from "./confetti.js";

/**
 * Description: Crée des équipes avec des étudiants en générant trois tentatives de groupes différents
 * @param {Object} event - Objet d'événement
 * @param {Number} groups - Nombre de groupes
 * @param {Function} setter - Fonction pour mettre à jour l'état
 * @returns {Array} - Tableau de trois ensembles d'équipes différents
 */
const handleCreateTeams = (event, groups, setter) => {
	event.preventDefault();
	const originalStudents = getItems("students")?.split(",");
	if (originalStudents === undefined)
		return toastError("Herm.. Il n'y a pas d'élèves");
	if (originalStudents.length < groups)
		return toastError(
			"Herm.. Il n'y a pas assez d'élèves pour créer des équipes"
		);

	const allCyclesTeams = [];

	for (let cycle = 0; cycle < 3; cycle++) {
		let teams;
		do {
			const students = [...originalStudents];
			teams = [];

			for (let i = 0; i < groups; i++) {
				teams.push([]);
			}

			while (students.length > 0) {
				for (let i = 0; i < groups; i++) {
					if (students.length === 0) break;
					const randomIndex = Math.floor(
						Math.random() * students.length
					);
					const student = students.splice(randomIndex, 1)[0];
					teams[i].push(student);
				}
			}
		} while (
			allCyclesTeams.some((existingTeams) =>
				areTeamsSimilar(existingTeams, teams)
			)
		);

		allCyclesTeams.push(teams);
	}
	setter(allCyclesTeams);
};

function areTeamsSimilar(teamsA, teamsB) {
	for (let i = 0; i < teamsA.length; i++) {
		if (teamsA[i].sort().join() !== teamsB[i].sort().join()) {
			return false;
		}
	}
	return true;
}

/**
 * Description: Reset all students in list
 * @param {Object} event - Event object
 * @param {String} key
 * @param {Function} setter - Function to update state
 */
const handleReset = (event, key, setter) => {
	event.preventDefault();
	if (
		window.confirm("Êtes-vous sûr de vouloir supprimer tous les élèves ?")
	) {
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
	if (students.length === 0)
		return toastError("Herm.. Il n'y a pas d'élèves");
	toastNeutral();
	setTimeout(() => {
		toastSuccess(`🎉 ${students[randomIndex]} 🤩`);
		jsConfetti.addConfetti();
	}, 1000);
};

export { handleCreateTeams, handleReset, handleGetRandomStudent };
