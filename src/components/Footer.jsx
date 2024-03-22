import { PeopleTag, Heart } from "iconoir-react";
function Footer() {
	return (
		<footer style={{ textAlign: "center", marginTop: "2rem" }}>
			<p>
				Ce petit projet vous est proposé par{" "}
				<a href="https://github.com/GorskiAnthony">Moi-même</a>{" "}
				<PeopleTag />
			</p>
			<p>
				Merci à <a href="https://ioayoub.fr/">Ayoub</a> pour l'idée{" "}
				<Heart /> sur toi{" "}
			</p>
		</footer>
	);
}

export default Footer;
