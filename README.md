# Form Design System
A design system and resuable implementation for creating consistent forms

## Design Link
The designs can be found at the link given below.
https://www.figma.com/file/COnqnEwDxmQt9Hi8fDFmcF/Design-Systems?node-id=0%3A1

## Usage
This section describes how the form should be structured in html.

### Structure
All forms must follow the same structure as described bellow with the following emmet.
```
form>(h1.form-name+(.form-input-group))
```
This expands to:
```html
<form action="">
  <h1 class="form-name">Form Title</h1>
  <div class="form-input-group"> ... </div>
  ...
</form>
```
Forms can have any number of `.form-input-group` which holds one input unit. Which may be a text box or option group; structured as described below.
All `.form-input-group` must have the name of their input as their ID like so:
```html
<div class="form-input-group" id="age"> ... </div>
```
Forgetting to add the appropriate id to the `.form-input-group` can lead to a malfunctioning form.

### Input Components
There are three input components that can be used for creating a form. The following code snippet are intended to copied and pasted when developing a form.

#### Input Text
```html
<div id="{input-name}" class="form-input-group">
  <label for="{input-name}-input">{input-name}</label>
  <span class="text-input">
    <input placeholder="{placeholder}" type="text" name="{input-name}" id="{input-name}-input">
  </span>
  <div class="error-text"></div>
</div>
```

Remember to replace:
- {input-name} with the input name (for eg. age)
- {placeholder} witht the placeholder (for eg. Enter your age)
for eg.
```html
<div id="age" class="form-input-group">
  <label for="age-input">Age</label>
  <span class="text-input">
    <input placeholder="Enter your age" type="text" name="age" id="age-input">
  </span>
  <div class="error-text"></div>
</div>
```

#### Radio Button Group
```html
<div id="{input-name}" class="form-input-group">
  <label for="{input-name}-input">{input-name}</label>
  <div class="option-group">
    <input type="radio" name="{input-name}" id="{input-name}-{option-name}" value="{option-name}">
    <label for="{input-name}-{option-name}">{option-name}</label>
  </div>
  <div class="error-text"></div>
</div>
```

Remember to replace:
- {input-name} with the input name (for eg. gender)
- {option-name} with the option name (for eg. male)
It is possible to add as many input/label pair in `.option-group`. for eg.
```html
<div id="gender" class="form-input-group">
  <label for="gender-input">Gender</label>
  <div class="option-group">
    <input type="radio" name="gender" id="gender-male" value="male">
    <label for="gender-male">Male</label>
    <input type="radio" name="gender" id="gender-female" value="female">
    <label for="gender-female">Female</label>
  </div>
  <div class="error-text"></div>
</div>
```

#### Checkbox Button Group
```html
<div id="{input-name}" class="form-input-group">
  <label for="{input-name}-input">{input-name}</label>
  <div class="option-group">
    <input type="checkbox" name="{input-name}" id="{input-name}-{option-name}" value="{option-name}">
    <label for="{input-name}-{option-name}">{option-name}</label>
  </div>
  <div class="error-text"></div>
</div>
```

Remember to replace:
- {input-name} with the input name (for eg. language)
- {option-name} with the option name (for eg. golang)
It is possible to add as many input/label pair in `.option-group`. for eg.
```html
<div id="languages" class="form-input-group">
  <label for="languages-input">Languages</label>
  <div class="option-group">
    <input type="checkbox" name="languages" id="languages-golang" value="golang">
    <label for="languages-golang">Golang</label>
    <input type="checkbox" name="languages" id="languages-javascript" value="javascript">
    <label for="languages-javascript">Javascript</label>
    <input type="checkbox" name="languages" id="languages-typescript" value="typescript">
    <label for="languages-typescript">Typescript</label>
    <input type="checkbox" name="languages" id="languages-kotlin" value="kotlin">
    <label for="languages-kotlin">Kotlin</label>
  </div>
  <div class="error-text">Choose at least one language</div>
</div>
```

#### Submit Button
```html
<div id="submit" class="form-input-group">
  <button type="submit">Submit</button>
</div>
```
There's nothing to be changed in this component, simply put it as the last child in the form element.

---

### Validation
A custom form validation library resides in `js/modules/forms.js`.
The `init()` function is required to be imported and called from within the form's html.
```html
<script type="module">
  import { init } from "./js/modules/forms.js"
  init()
</script>
```

The validation library provides the validator function `validator(...revalidationEvents) => (name, ...validators)`.
To use the validator, we must first supply the revalidation events, this may be any dom event that `input` elements can fire.
Whenever this event is fired for the `input` elements in the `.form-input-group`, the that particular input group will get revalidated against the validator.
Note that all the inputs are always revalidated on the `onsubmit` event.

```js
import { validateOn } from "./js/modules/forms.js"
const validate = validateOn("change") // revalidate every time the onchange event is fired by the input(s)
```
Once we have the `validate` function, we can use that to set validation for any input we want. Inputs are accessed through the `id` set in the html for `.form-input-group`. For eg. to set validation for `.form-input-group#age`, we must do:
```js
validate("age", ...)
```

#### Validators
Validators are asynchrnous function that received the current `value` of the input and its `name`, and can throw an error to signal that the input is invalid.
```js
const validator = async (value, name) => {
  // validation logic
}
```
When `name` represents a `Checkbox Group`, the `value` is an array of selected inputs. Otherwise it is a string representing the input.

For eg. to validate that user has filled a valid age in the input:
```js
validate("age", async (value, _name) => {
  if (!Number.isNaN(Number(value))) {
    throw new Error("Age must be a number")
  }
})
```
The library will validate the user input against the function supplied by the user, if the it throws an error, the message will be shown to the user in the UI.

---

Since making certain fields required is common validation, the library provides a `required` function. It can be used to set a validation with a custom message.
```js
import { required } from "./js/modules/forms.js"
validate("age", required("Please enter your age"))
```

---

It is possible to provide as many validators to the validation library as the need maybe. For eg. to make age required and a number:
```js
validate("age", required("Please enter your age"), async (value, _name) => {
  if (!Number.isNaN(Number(value))) {
    throw new Error("Age must be a number")
  }
})
```

## Sample
The sample usage of the form is documented in `sample.html` which is live at https://forms.pi-club.ml/sample

## Final Thoughts
Before sending the PR ensure that:
- [ ] The form is functional
- [ ] The form has the OpenGraph meta tags, which can be generated at [OpenGraph](https://opengraph.dev)

## Contributing
To help us improve the experience of our forms, we urge you to make contributions to this repo. Here's what you can start with:
- Port the html components to either [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) or [ReactJS](https://reactjs.org)
- Port the css to either [Sass](https://sass-lang.com/) or make the project compatible with [CSS Modules](https://github.com/css-modules/css-modules)
- Refactor `./js/modules/forms.js` to be more ergonomic or port it to [Typescript](https://www.typescriptlang.org/)
