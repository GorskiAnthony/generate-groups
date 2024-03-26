// Packages
import { useRef, useState } from "react";
import GithubCorner from "react-github-corner";
import { DownloadCircle, InfoCircle, XmarkSquare } from "iconoir-react";

// Local
import handleTakePicture from "./services/takePicture.js";
import { getItems, setItems } from "./services/localStorage.js";
import {
	handleCreateTeams,
	handleReset,
	handleGetRandomStudent,
} from "./services/handlers.js";

// Style
import style from "./assets/css/app.module.css";
import Footer from "./components/Footer.jsx";
import { toastError, toastSuccess } from "./services/toast.js";

function App() {
	// Get students from local storage
	const getStudents = getItems("students")
		? getItems("students").split(",")
		: [];

	// States
	const [file, setFile] = useState([]);
	const [teams, setTeams] = useState([]);
	const [students, setStudents] = useState(getStudents);

	// Refs
	const nbTeams = useRef(4);
	const name = useRef("");

	// File reader (for CSV file)
	const fileReader = new FileReader();

	const handleAdd = (event) => {
		event.preventDefault();
		if (!name.current.value) return;
		setItems("students", [...students, name.current.value]);
		setStudents([...students, name.current.value]);
		name.current.value = "";
	};

	const handleDelete = (event) => {
		event.preventDefault();
		const index = event.target.parentNode.parentNode.dataset.index;
		const newStudents = students.filter((student, i) => i !== +index);
		setItems("students", newStudents);
		setStudents(newStudents);
	};

	const handleCSV = (event) => {
		setFile(event.target.files[0]);
	};
	const handleSubmitCSV = (event) => {
		event.preventDefault();
		if (file.length === 0) {
			toastError("Herm.. Il n'y a pas de fichier");
			return;
		}

		if (file) {
			fileReader.onload = function (event) {
				const csvOutput = event.target.result;
				const students = csvOutput
					.split("\n")
					.map((row) => row.split(",")[0])
					.filter((name) => name)
					.slice(1);
				setStudents(students);
				setItems("students", students);
			};

			fileReader.readAsText(file);
			toastSuccess("📂 CSV importé avec succès");
		}
	};

	return (
		<>
			<main className={`container-fluid ${style.main}`}>
				<h1>Générateur de groupe</h1>
				<section className={style.section}>
					<div>
						<h2>Équipes</h2>
						<p>
							Il vous suffit de saisir le nombre d'équipes
							souhaitées et de cliquer sur le bouton ci-dessous.
						</p>
						<div>
							<ul className={style.projects} id="teams_picture">
								{teams.map((projet, index) => (
									<div key={index}>
										<h3>Projet {index + 1}</h3>
										<ul className={style.project}>
											{projet.map((team, index) => (
												<li key={index}>
													<h4>Team {index + 1}</h4>
													<ul
														className={
															style.flex_teams
														}
													>
														{team.map(
															(
																student,
																index
															) => (
																<li key={index}>
																	{student}
																</li>
															)
														)}
													</ul>
												</li>
											))}
										</ul>
									</div>
								))}
							</ul>
						</div>
						{
							// If there are no teams, display a message, else display the button
							teams.length === 0 ? (
								<p>Il n'y a pas d'équipes pour le moment.</p>
							) : (
								<button onClick={handleTakePicture}>
									<DownloadCircle /> Sauvegarder
								</button>
							)
						}
						<hr />
						<form
							onSubmit={(e) =>
								handleCreateTeams(
									e,
									nbTeams.current.value,
									setTeams
								)
							}
						>
							<div className="form-group">
								<fieldset className="grid">
									<label htmlFor="nbTeams">
										Nombre d'équipes
										<input
											type="number"
											id="nbTeams"
											className="form-control"
											min="1"
											max="10"
											ref={nbTeams}
											defaultValue={nbTeams.current}
											required
										/>
									</label>
									<button type="submit" className="outline">
										Générer des équipes
									</button>
								</fieldset>
							</div>
						</form>
					</div>
					<div>
						<h2>Listes des élèves</h2>
						<p>
							Vous pouvez saisir le nom des élèves un par un, et
							cliquer sur le bouton <code>Ajouter un élève</code>{" "}
							pour les ajouter à la liste.
						</p>
						<ul className={style.grid_students}>
							{students.map((student, index) => (
								<li
									key={index}
									className={style.li}
									data-index={index}
								>
									{student}
									<button
										className={style.button_delete}
										onClick={handleDelete}
									>
										<XmarkSquare color="red" />
									</button>
								</li>
							))}
						</ul>

						<form onSubmit={handleAdd}>
							<input
								type="text"
								placeholder="Bob l'éponge"
								ref={name}
							/>
							<fieldset className="grid">
								<button type="submit" className="outline">
									Ajouter un élève
								</button>
								<button
									type="reset"
									className="outline contrast"
									onClick={(e) =>
										handleReset(e, "students", setStudents)
									}
								>
									Vider la liste
								</button>
							</fieldset>
						</form>
						<hr />
						<details>
							<summary>
								<InfoCircle />️ Syntaxe
							</summary>
							<p>
								Le fichier CSV doit contenir une colonne{" "}
								<code>firstname</code> avec le nom des personnes
								de la team
							</p>
						</details>
						<hr />
						<form onSubmit={(e) => handleSubmitCSV(e)} role="group">
							<label htmlFor="file">
								Importer un fichier csv
								<input
									type="file"
									accept={".csv"}
									onChange={handleCSV}
								/>
							</label>
							<button type="submit">Importer le CSV</button>
						</form>
					</div>
				</section>
				<section>
					<h2>Tirage au sort</h2>
					<p>
						Une personne sera tirée au sort parmi les élèves, mais
						qui ? Le hasard nous le dira !{" "}
					</p>
					<button
						onClick={(e) => handleGetRandomStudent(e, students)}
					>
						And the winner is ! 🥁
					</button>
				</section>
			</main>
			<Footer />
			<GithubCorner
				href="https://github.com/GorskiAnthony/generate-groups"
				bannerColor="#151513"
				octoColor="#fff"
				size={80}
				direction="right"
			/>
		</>
	);
}

export default App;
