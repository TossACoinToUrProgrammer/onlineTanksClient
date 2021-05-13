export default class GameAnimation {
  constructor(canvas) {
    this.canvas = canvas
  }

  drawAnimation(gifURL, xPos, yPos, w, h, lifetime, bulletID) {
    this.canvas.insertAdjacentHTML(
      "afterend",
      `<img id="s${bulletID}" src="${gifURL}" style="
          position: absolute;
          top: ${yPos}px;
          left: ${xPos}px;
          width: ${w}px;
          height: ${h}px;
        " />`
    )

    setTimeout(() => {
      try {
        const parent = this.canvas.closest("div")
        const img = document.querySelector(`#s${bulletID}`)
        parent.removeChild(img)
      } catch (e) {
        console.log(e)
      }
    }, lifetime)
  }
}
