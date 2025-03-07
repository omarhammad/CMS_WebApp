import { HttpStatus } from "../util/httpStatus.js"
import { Toast } from "bootstrap"
import { getCurrentUser } from "../util/currentUser.js"
import { formatDate, formatTime } from "../util/date_time_formatter.js"

async function getOneDoctor(doctor_id) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/doctors/${doctor_id}`,
    )
    if (response.status === 404) {
      console.log("NOT FOUND")
    }
    return await response.json()
  } catch (exc) {
    console.error(exc)
    return null
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  // Add async keyword here
  const pathname = window.location.pathname
  const segments = pathname.split("/")
  const doctor_id = Number(segments.pop())
  const data = await getOneDoctor(doctor_id)
  if (data) {
    document.getElementById("fullName").innerText =
      data.firstName + " " + data.lastName
    document.getElementById("specialization").innerText = data.specialization
    const contactInfo = data.contactInfo.split(",")
    document.getElementById("phone").innerText = contactInfo[0]
    document.getElementById("email").innerText = contactInfo[1]
    const appointments = data.appointments
    const current_user = await getCurrentUser()
    if (!current_user.userRoles.includes("ROLE_PATIENT")) {
      if (appointments.length !== 0) {
        for (const appointment of appointments) {
          const p = document.createElement("p")
          p.classList.add("d-block", "details-text", "text-center")
          const appointment_date_time = new Date(
            appointment.availabilitySlot.slot,
          )
          p.innerText =
            appointment.patient.firstName +
            " " +
            appointment.patient.lastName +
            ", " +
            formatDate(appointment_date_time) +
            " at " +
            formatTime(appointment_date_time)

          document.getElementById("upcoming-appointments").appendChild(p)
        }
      } else {
        const p = document.createElement("p")
        p.classList.add("h4", "m-3")
        p.innerText = "There is No appointments"
        if (document.getElementById("upcoming-appointments")) {
          document.getElementById("upcoming-appointments").appendChild(p)
        }
      }
    }
  } else {
    console.log("No data returned for this doctor.")
  }
  await setCurrenDoctorPrivileges(doctor_id)
})

async function setCurrenDoctorPrivileges(doctor_id) {
  const current_user = await getCurrentUser()
  const card_footer = document.querySelector(".card-footer")
  if (
    current_user.userRoles.includes("ROLE_DOCTOR") &&
    current_user.userId === doctor_id
  ) {
    // Doctor Profile buttons
    const update_btn = document.createElement("a")
    update_btn.className = "btn btn-primary m-2"
    update_btn.innerText = "Update"
    update_btn.href = "/doctors/update"

    const back_btn = document.createElement("a")
    back_btn.className = "btn btn-danger m-2"
    back_btn.innerText = "Back"
    back_btn.href = "/appointments/"
    card_footer.appendChild(update_btn)
    card_footer.appendChild(back_btn)
    document.getElementById("nav_block").className = "d-block"

    // Availability Section
    const availability_section = document.createElement("div")
    availability_section.className = "w-50"

    availability_section.innerHTML =
      '<i class="bi bi bi-clock-fill text-warning me-3 details-icons"></i>' +
      '<p class="d-inline-block details-text"> Availiabilties : </p>'

    const slots_container = document.createElement("div")
    // adding slots section
    const add_slot_btn_component = document.createElement("div")
    add_slot_btn_component.className = "m-auto row w-50"

    const date_time_picker = document.createElement("input")
    date_time_picker.className = "col-lg-10 col-sm-12 rounded-start slot-picker"
    date_time_picker.type = "datetime-local"
    date_time_picker.step = "1800"

    const add_slot_btn = document.createElement("a")
    add_slot_btn.className =
      "btn btn-primary bi bi-plus-circle rounded-start-0 rounded-end col-lg-2 p-2 "

    add_slot_btn.addEventListener("click", async () => {
      const date_time = date_time_picker.value
      if (date_time === undefined || date_time === null || date_time === "") {
        showToast("SLOT MUST BE PROVIDED!", "FAIL")
      } else {
        console.log("SLot Request")
        const csrf_token = document
          .querySelector('meta[name="_csrf"]')
          .getAttribute("content")
        const csrf_header = document
          .querySelector('meta[name="_csrf_header"]')
          .getAttribute("content")

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          [csrf_header]: csrf_token,
        }

        const add_slot_response = await fetch(
          `http://localhost:8080/api/doctors/${doctor_id}/availability`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              slot: date_time,
            }),
          },
        )
        const data = await add_slot_response.json()
        console.log("Add slot log: " + data)
        if (add_slot_response.status === HttpStatus.CREATED) {
          showToast("SLOT ADDED!", "SUCCESS")
          console.log("'Added slot' : " + data)
          add_slot_component(data, slots_container)
        } else if (add_slot_response.status === HttpStatus.BAD_REQUEST) {
          if (Object.prototype.hasOwnProperty.call(data, "exceptionMsg")) {
            showToast(data.exceptionMsg, "FAIL")
          } else {
            showToast(data.slot, "FAIL")
          }
        }
      }
    })

    add_slot_btn_component.appendChild(date_time_picker)
    add_slot_btn_component.appendChild(add_slot_btn)

    // slots components section

    const availability_response = await fetch(
      `http://localhost:8080/api/doctors/${doctor_id}/availability`,
    )
    if (availability_response.status === HttpStatus.NO_CONTENT) {
      const no_content = document.createElement("div")
      no_content.innerText = "No availability slots yet!"
      availability_section.appendChild(no_content)
    } else if (availability_response.status === HttpStatus.OK) {
      const slots = await availability_response.json()
      for (const slot of slots) {
        add_slot_component(slot, slots_container)
      }
    }
    const card_body = document.querySelector(".card-body")
    availability_section.appendChild(slots_container)
    availability_section.appendChild(add_slot_btn_component)
    card_body.appendChild(availability_section)
  } else {
    const back_btn = document.createElement("a")
    back_btn.className = "btn btn-danger m-2"
    back_btn.innerText = "Back"
    back_btn.href = "/doctors/"
    card_footer.appendChild(back_btn)
  }
}

function add_slot_component(slot, slots_container) {
  const slot_component = document.createElement("div")
  slot_component.className = "row mb-2 bg-info rounded w-50 m-auto"
  slot_component.id = slot.id

  const slot_text = document.createElement("div")
  slot_text.className = "text-center p-2 col-lg-10 col-sm-12 fw-bold p-0"

  const slot_date_time = new Date(slot.slot)
  slot_text.innerText =
    formatDate(slot_date_time) + " " + formatTime(slot_date_time)

  const slot_delete = document.createElement("a")
  slot_delete.className =
    "btn btn-danger bi bi-trash col-lg-2 col-sm-12 rounded-start-0"
  slot_delete.addEventListener("click", async () => {
    const csrf_token = document
      .querySelector('meta[name="_csrf"]')
      .getAttribute("content")
    const csrf_header = document
      .querySelector('meta[name="_csrf_header"]')
      .getAttribute("content")

    const headers = {
      [csrf_header]: csrf_token,
    }
    const slot_delete_response = await fetch(
      `http://localhost:8080/api/doctors/availability/${slot.id}`,
      {
        method: "DELETE",
        headers: headers,
      },
    )
    if (slot_delete_response.status === HttpStatus.NOT_FOUND) {
      showToast("SLOT NOT FOUND !", "FAIL")
    } else if (slot_delete_response.status === HttpStatus.NO_CONTENT) {
      slots_container.removeChild(slot_component)
      showToast("SLOT DELETED !", "SUCCESS")
    }
  })

  slot_component.appendChild(slot_text)
  slot_component.appendChild(slot_delete)
  slots_container.appendChild(slot_component)
}

function showToast(message, bg_color) {
  let toastElement = document.querySelector(".toast")
  let toastBody = toastElement.querySelector(".toast-body")
  if (bg_color === "FAIL") {
    toastElement.classList.add("text-bg-danger")
    toastElement.classList.remove("text-bg-success")
  } else if (bg_color === "SUCCESS") {
    toastElement.classList.remove("text-bg-danger")
    toastElement.classList.add("text-bg-success")
  }
  toastBody.innerText = message

  let toast = new Toast(toastElement, {
    autohide: false,
  })
  toast.show()
}
