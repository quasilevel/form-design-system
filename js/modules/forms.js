export const init = () => {
  document.querySelectorAll(".option-group > label").forEach(label => {
    label.addEventListener("mouseenter", async () => {
      label.control.classList.add("hover")
    })
    label.addEventListener("mouseleave", async () => {
      label.control.classList.remove("hover")
    })
  })
}

export const validate = (name, ...validators) => console.log(name, validators)

export const required = async () => console.log("required")
