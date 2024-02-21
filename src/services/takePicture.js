import html2canvas from "html2canvas";

const handleTakePicture = () => {
  html2canvas(document.querySelector("#teams_picture")).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = img;
    link.download = "teams.png";
    link.click();
  });
};

export default handleTakePicture;
