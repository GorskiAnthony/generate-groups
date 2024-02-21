import { useRef, useState } from "react";
import style from "./assets/css/app.module.css";

function App() {
  const getStudents = localStorage.getItem("students");

  const [file, setFile] = useState([]);
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState(
    getStudents ? getStudents.split(",") : [],
  );
  const nbTeams = useRef(4);
  const name = useRef("");

  const fileReader = new FileReader();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(nbTeams.current.value);
  };

  const handleReset = (event) => {
    event.preventDefault();
    localStorage.removeItem("students");
    setStudents([]);
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
      <h1>Générateur de groupe</h1>
      <section className={style.section}>
        <div>
          <h2>Équipes</h2>
          <p>
            Il vous suffit de saisir le nombre d'équipes souhaitées et de
            cliquer sur le bouton ci-dessous.
          </p>
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
      </section>
    </main>
  );
}

export default App;
