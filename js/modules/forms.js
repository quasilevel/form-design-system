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

const setInvalid = (name, message) => {
  const inputGroup = document.querySelector(`#${name}`)
  inputGroup.classList.add("invalid")

  inputGroup.querySelector(".error-text").innerText = message
}

const unsetInvalid = name => document.querySelector(`#${name}`).classList.remove("invalid")

const runValidators = async (name, ...validators) => {
  const value = collectValue(name)
  let errFlag = false
  for (const validator of validators) {
    try {
      await validator(value, name)
    } catch(err) {
      errFlag = true
      setInvalid(name, err.message)
      break
    }
  }
  !errFlag && unsetInvalid(name)
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

export const validator = (...revalidateOn) => (name, ...validators) => {
  if (validityMap.has(name)) {
    throw new Error(`Validator: re-adding validtors for ${name}`)
  }
  validityMap.set(name, validators)
  const input = document.querySelector(`#${name} input[type=text]`)
  input?.addEventListener("blur", async () => await runValidators(name, ...validators))


  // bad code, but something to get us started
  revalidateOn.map(event => {
    document.querySelectorAll(`#${name} input`).forEach(input => {
      input.addEventListener(event, async () => await runValidators(name, ...validators))
    })
  })
}

export const required = (message) => async (value) => {
  if (value.length === 0) {
    throw new Error(message)
  }
}
