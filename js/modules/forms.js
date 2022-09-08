const validityMap = new Map()

const collectValue = name => {
  const textInput = document.querySelector(`#${name} input[type=text]`)
  if (textInput !== null) {
    return textInput.value
  }

  const checkboxes = document.querySelectorAll(`#${name} input[type=checkbox]`)
  if (checkboxes.length !== 0) {
    return (
      Array.from(checkboxes)
      .filter(box => box.checked)
      .map(box => box.value)
    )
  }

  const radios = document.querySelectorAll(`#${name} input[type=radio]`)
  if (radios.length !== 0) {
    return Array.from(radios).find(radio => radio.checked)?.value ?? ""
  }

  console.warn(`there's no supported input element in #${name}. Did you mistype the element ID?`)
}

const runValidators = async (name, ...validators) => {
  const value = collectValue(name)
  console.log(value)
}

export const init = () => {
  document.querySelectorAll(".option-group > label").forEach(label => {
    label.addEventListener("mouseenter", async () => {
      label.control.classList.add("hover")
    })
    label.addEventListener("mouseleave", async () => {
      label.control.classList.remove("hover")
    })
  })

  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault()
    for (const [name, validators] of validityMap) {
      runValidators(name, ...validators)
    }
  })
}

export const validate = (name, ...validators) => {
  validityMap.set(name, validators)
  const input = document.querySelector(`#${name} input[type=text]`)
  input?.addEventListener("blur", async () => await runValidators(name, ...validators))
}

export const required = async () => console.log("required")
