import { getItems, removeItem } from "./localStorage.js";
import { toastError, toastNeutral, toastSuccess } from "./toast.js";
import jsConfetti from "./confetti.js";

/**
 * Mélange les éléments d'un tableau
 * @param {Array} array - Le tableau à mélanger
 * @returns {Array} - Le tableau mélangé
 */
function shuffleArray(array) {
	let currentIndex = array.length,
		randomIndex;

	// Tant qu'il reste des éléments à mélanger...
	while (currentIndex != 0) {
		// Prendre un élément restant...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// Et l'échanger avec l'élément actuel.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

/**
 * Crée des équipes avec des étudiants en générant trois tentatives de groupes différents,
 * en s'assurant que les étudiants ne se retrouvent pas dans les mêmes groupes.
 * @param {Object} event - Objet d'événement
 * @param {Number} groups - Nombre de groupes
 * @param {Function} setter - Fonction pour mettre à jour l'état
 */
const handleCreateTeams = (event, groups, setter) => {
	event.preventDefault();
	const originalStudents = getItems("students")?.split(",");
	const threshold = Math.floor(originalStudents.length / groups) - 1;

	if (originalStudents === undefined)
		return toastError("Herm.. Il n'y a pas d'élèves");
	if (originalStudents.length < groups)
		return toastError(
			"Herm.. Il n'y a pas assez d'élèves pour créer des équipes"
		);

	let previousTeams = [];
	const allCyclesTeams = [];
	let attempts = 0; // Pour éviter une boucle infinie

	for (let cycle = 0; cycle < 3; cycle++) {
		// Mettre une limite aux tentatives
		if (attempts > 10) {
			toastError(
				"Impossible de créer des équipes uniques après plusieurs tentatives."
			);
			break;
		}

		let teams = [];
		let students = shuffleArray([...originalStudents]);

		for (let i = 0; i < groups; i++) {
			teams.push([]);
		}

		students.forEach((student, index) => {
			teams[index % groups].push(student);
		});

		if (areTeamsUnique(previousTeams, teams, threshold)) {
			// Autoriser un coéquipier identique
			allCyclesTeams.push(teams);
			previousTeams.push(...teams.map((team) => [...team])); // Copier les équipes pour référence future
		} else {
			// Réessayer si les équipes sont trop similaires
			cycle--;
			attempts++;
		}
	}

	if (allCyclesTeams.length === 3) {
		// Vérifier si 3 ensembles d'équipes ont été créés avec succès
		setter(allCyclesTeams);
	}
};

/**
 * Vérifie si les nouvelles équipes sont uniques par rapport aux équipes précédentes
 * @param {Array} previousTeams - Les équipes des cycles précédents
 * @param {Array} newTeams - Les nouvelles équipes à vérifier
 * @returns {Boolean} - Vrai si les équipes sont uniques, faux autrement
 */
function areTeamsUnique(previousTeams, newTeams, threshold) {
	// S'il n'y a pas d'équipes précédentes, toutes les nouvelles équipes sont considérées comme uniques
	if (previousTeams.length === 0) return true;

	// Vérifiez l'unicité des équipes par rapport aux équipes précédentes
	for (const newTeam of newTeams) {
		let uniqueCount = 0;

		// Vérifiez l'équipe actuelle par rapport à toutes les équipes précédentes
		for (const prevTeam of previousTeams) {
			const commonMembers = newTeam.filter((student) =>
				prevTeam.includes(student)
			).length;

			// Si cette équipe a plus de [threshold] membres en commun avec une équipe précédente, augmentez le compteur
			if (commonMembers > threshold) {
				uniqueCount++;
			}

			// Si l'équipe actuelle n'est pas unique par rapport à suffisamment d'équipes précédentes, retournez faux
			if (uniqueCount > previousTeams.length - threshold) {
				return false;
			}
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
