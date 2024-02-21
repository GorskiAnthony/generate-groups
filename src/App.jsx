import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import JSConfetti from "js-confetti";

import style from "./assets/css/app.module.css";

function toastError(message) {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
function toastSuccess(message) {
  toast(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    emoji: "🎉",
  });
}

function App() {
  const jsConfetti = new JSConfetti();

  const getStudents = localStorage.getItem("students");

  const [file, setFile] = useState([]);
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState(
    getStudents ? getStudents.split(",") : [],
  );
  const nbTeams = useRef(4);
  const name = useRef("");

  const fileReader = new FileReader();

  const handleTakePicture = () => {
    html2canvas(document.querySelector("#teams_picture")).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = img;
      link.download = "teams.png";
      link.click();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create random teams from students
    const students = localStorage.getItem("students").split(",");
    const teams = [];
    const groups = nbTeams.current.value;
    for (let i = 0; i < groups; i++) {
      teams.push([]);
    }

    // now, we need to distribute the students randomly
    while (students.length > 0) {
      for (let i = 0; i < groups; i++) {
        const randomIndex = Math.floor(Math.random() * students.length);
        const student = students.splice(randomIndex, 1);
        // add the student to the team
        teams[i].push(student);
        teams[i] = teams[i].flat();
      }
    }
    setTeams(teams);
  };

  const handleReset = (event) => {
    event.preventDefault();
    localStorage.removeItem("students");
    setStudents([]);
  };

  const handleGetRandomStudent = (event) => {
    event.preventDefault();
    const randomIndex = Math.floor(Math.random() * students.length);
    if (students.length === 0)
      return toastError("Herm.. Il n'y a pas d'élèves");
    toast("🥁 And the winner is...", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => {
      toastSuccess(`🎉 ${students[randomIndex]} 🤩`);
      jsConfetti.addConfetti();
    }, 1000);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    if (!name.current.value) return;
    localStorage.setItem("students", [...students, name.current.value]);
    setStudents([...students, name.current.value]);
    name.current.value = "";
  };

  const handleDelete = (event) => {
    event.preventDefault();
    const index = event.target.parentNode.dataset.index;
    const newStudents = students.filter((student, i) => i !== +index);
    localStorage.setItem("students", newStudents);
    setStudents(newStudents);
  };

  const handleCSV = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmitCSV = (event) => {
    event.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        // now get only the first column and get values to an array
        const students = csvOutput
          .split("\n")
          .map((row) => row.split(",")[0])
          .filter((name) => name)
          .slice(1);
        setStudents(students);
        localStorage.setItem("students", students);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <main className="container-fluid">
      <h1>Générateur de groupe aléatoire</h1>
      <section className={style.section}>
        <div>
          <h2>Équipes</h2>
          <p>
            Il vous suffit de saisir le nombre d'équipes souhaitées et de
            cliquer sur le bouton ci-dessous.
          </p>
          <div>
            <ul className={style.grid_teams} id="teams_picture">
              {teams.map((team, index) => (
                <li
                  key={index}
                  className={style.li}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h3>Équipe {index + 1}</h3>
                  <ul>
                    {team.map((student, index) => (
                      <li key={index}>{student}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          {
            // if there are no teams, we don't show the button
            teams.length === 0 ? (
              <p>Il n'y a pas d'équipes pour le moment.</p>
            ) : (
              <button onClick={handleTakePicture}>sauvegarder</button>
            )
          }
          <hr />
          <form onSubmit={handleSubmit}>
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
            Vous pouvez saisir le nom des élèves, un par ligne, et cliquer sur
            le bouton ci-dessous pour les ajouter à la liste.
          </p>
          <ul className={style.grid_students}>
            {students.map((student, index) => (
              <li key={index} className={style.li} data-index={index}>
                {student}
                <button className={style.button_delete} onClick={handleDelete}>
                  X
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAdd}>
            <input type="text" placeholder="Bob l'éponge" ref={name} />
            <fieldset className="grid">
              <button type="submit" className="outline">
                Ajouter un élève
              </button>
              <button
                type="reset"
                className="outline contrast"
                onClick={handleReset}
              >
                Vider la liste
              </button>
            </fieldset>
          </form>
          <hr />
          <details>
            <summary>ℹ️ Syntaxe</summary>
            <p>
              Le fichier CSV doit contenir une colonne <code>firstname</code>{" "}
              avec le nom des personnes de la team
            </p>
          </details>
          <hr />
          <form onSubmit={(e) => handleSubmitCSV(e)}>
            <label htmlFor="file">Importer un fichier csv</label>
            <input type="file" accept={".csv"} onChange={handleCSV} />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      </section>
      <section>
        <h2>Tirage au sort</h2>
        <p>
          Une personne sera tirée au sort parmi les élèves, qui ? Le hasard va
          nous le dire !{" "}
        </p>
        <button onClick={handleGetRandomStudent}>And the winner is ! 🥁</button>
      </section>
    </main>
  );
}

export default App;
