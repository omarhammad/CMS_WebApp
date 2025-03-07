import { HttpStatus } from "../util/httpStatus.js"
import { showToast } from "../util/toast.js"
import { getCurrentUser } from "../util/currentUser.js"
const pathname = window.location.pathname
const segments = pathname.split("/")
const doctor_id = segments.pop()
window.addEventListener("DOMContentLoaded", async () => {
  const doctor = await getOneDoctor(doctor_id)
  const form = document.getElementById("updateForm")

  for (const key in doctor) {
    if (key === "contactInfo") {
      const contactInfo = doctor[key].split(",")
      form.elements["phoneNumber"].value = contactInfo[0]
      form.elements["email"].value = contactInfo[1]
      continue
    } else if (key === "hisPatients") {
      continue
    }
    const input = form.elements[key]
    input.value = doctor[key]
  }
})

export async function getOneDoctor(doctor_id) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/doctors/${doctor_id}`,
    )
    if (response.status === HttpStatus.NOT_FOUND) {
      console.log("NOT FOUND")
    }
    return await response.json()
  } catch (exc) {
    console.error(exc)
    return null
  }
}

document.getElementById("submit_btn").addEventListener("click", updateDoctor)

async function updateDoctor(event) {
  event.preventDefault()
  const doctorJson = getFormData()

  try {
    const csrfToken = document
      .querySelector('meta[name="_csrf"]')
      .getAttribute("content")
    const csrfHeader = document
      .querySelector('meta[name="_csrf_header"]')
      .getAttribute("content")
    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      [csrfHeader]: csrfToken,
    })
    const response = await fetch(
      `http://localhost:8080/api/doctors/${doctor_id}`,
      {
        method: "PUT",
        headers: headers,
        body: doctorJson,
      },
    )

    let data = {}
    if (response.status === HttpStatus.BAD_REQUEST) {
      data = await response.json()
      if (Object.prototype.hasOwnProperty.call(data, "exceptionMsg")) {
        console.log("Exception Msg")
        showToast(data.exceptionMsg)
      } else {
        console.log("Fields Errors")
        handleFieldsError(data)
      }
    } else if (response.status === HttpStatus.CONFLICT) {
      showToast("CONFLICT IN THE REQUEST!")
    } else if (response.status === HttpStatus.NOT_FOUND) {
      showToast("DOCTOR NOT FOUND!")
    } else if (response.status === HttpStatus.NO_CONTENT) {
      const current_user = await getCurrentUser()
      if (current_user.userRoles.includes("ROLE_DOCTOR")) {
        window.location.href = "/doctors/details"
      } else {
        window.location.href = "/doctors/"
      }
    } else {
      console.error("Error : ", response.status)
    }
  } catch (exc) {
    console.error("SYS ERROR : ", exc)
  }
}

function getFormData() {
  const form = document.getElementById("updateForm")
  const formData = new FormData(form)

  const dataJson = {}

  dataJson["id"] = parseInt(doctor_id)

  for (const [key, value] of formData) {
    dataJson[key] = value
  }
  return JSON.stringify(dataJson)
}

function handleFieldsError(fieldsError) {
  const ulElementsList = document.querySelectorAll("ul")
  ulElementsList.forEach((ul) => {
    ul.innerHTML = null
  })

  if (Object.prototype.hasOwnProperty.call(fieldsError, "firstName")) {
    document
      .getElementById("first_name")
      .parentElement.appendChild(
        getFieldsErrorElementList(fieldsError.firstName),
      )
  }

  if (Object.prototype.hasOwnProperty.call(fieldsError, "lastName")) {
    document
      .getElementById("last_name")
      .parentElement.appendChild(
        getFieldsErrorElementList(fieldsError.lastName),
      )
  }

  if (Object.prototype.hasOwnProperty.call(fieldsError, "specialization")) {
    document
      .getElementById("spec")
      .parentElement.appendChild(
        getFieldsErrorElementList(fieldsError.specialization),
      )
  }
  if (Object.prototype.hasOwnProperty.call(fieldsError, "phoneNumber")) {
    document
      .getElementById("phone_number")
      .parentElement.appendChild(
        getFieldsErrorElementList(fieldsError.phoneNumber),
      )
  }
  if (Object.prototype.hasOwnProperty.call(fieldsError, "email")) {
    document
      .getElementById("email")
      .parentElement.appendChild(getFieldsErrorElementList(fieldsError.email))
  }
}

function getFieldsErrorElementList(errors) {
  const ulElement = document.createElement("ul")
  ulElement.className = "custom-bullet"
  errors = errors.split(";")
  for (const error of errors) {
    const ilElement = document.createElement("il")
    ilElement.className = "form-error"
    ilElement.innerText = "* " + error
    ulElement.appendChild(ilElement)

    ulElement.appendChild(document.createElement("br"))
  }

  return ulElement
}
