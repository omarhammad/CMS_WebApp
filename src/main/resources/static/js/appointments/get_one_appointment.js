const HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};
window.addEventListener('DOMContentLoaded', loadAppointmentData)
const appointment_id = window.location.pathname.split('/').pop();

async function loadAppointmentData() {

    const params = new URLSearchParams(window.location.search);
    if (params.has('created')) {
        removeQueryParam('created')
        showToast('Prescription added  !')
    }

    try {
        const response = await fetch(`http://localhost:8080/api/appointments/${appointment_id}`);
        if (response.status === HttpStatus.NOT_FOUND) {
            console.log("NOT FOUND !");
        } else if (response.ok) {
            const appointment = await response.json();
            const appointmentDateTime = new Date(appointment.appointmentDateTime)
            document.getElementById('appointment_date').innerText = formatDate(appointmentDateTime)
            document.getElementById('appointment_time').innerText = formatTime(appointmentDateTime);
            document.getElementById('purpose').innerText = appointment.purpose
            document.getElementById('appointment_type').innerText = appointment.appointmentType;
            document.getElementById('doctor_fullname').innerText = appointment.doctor.firstName + ' ' + appointment.doctor.lastName;
            document.getElementById('patient_fullname').innerText = appointment.patient.firstName + ' ' + appointment.patient.lastName;
            const prescription_body = document.getElementById('prescription_body');
            prescription_body.innerHTML = null;
            if (appointment.prescription !== null) {
                const prescription_header = document.getElementById('prescription_section');
                const delete_button = document.createElement('a');
                delete_button.className = ' text-danger h4 bi bi-trash d-inline position-absolute end-0 mt-3 me-3';
                delete_button.addEventListener('click', event => {
                    deletePrescription(appointment.prescription.prescriptionId);
                });
                prescription_header.appendChild(delete_button);
                console.log(appointment.prescription.medications)
                for (const medication of appointment.prescription.medications) {
                    const medications_body = document.createElement('div');
                    medications_body.className = 'bg-body-tertiary rounded-3 p-2 m-2';
                    const med_name = document.createElement('p');
                    med_name.className = 'h5';
                    med_name.innerHTML = `<strong>${medication.name.toUpperCase()} (<i>${medication.dosage.quantity + ' ' + medication.dosage.unit}</i>)</strong>`;

                    const med_details = document.createElement('p');
                    med_details.className = 'h6';
                    med_details.innerText = `${medication.frequencies}X a day for ${medication.daysDuration} days`;
                    //th:utext="${#strings.concat('Note:<br>&nbsp;&nbsp;',medication.getNotes())}"></p>
                    const med_notes = document.createElement('p');
                    med_notes.className = 'h6';
                    med_notes.innerHTML = `Note:<br>&nbsp;&nbsp;${medication.notes}`


                    medications_body.appendChild(med_name)
                    medications_body.appendChild(med_details);
                    medications_body.appendChild(med_notes);
                    prescription_body.appendChild(medications_body)

                }
                const prescription_expire = document.createElement('h5');
                prescription_expire.className = 'm-3 text-center';
                const expireDate = new Date(appointment.prescription.expireDate);
                prescription_expire.innerText = `Expire Date : ${formatDate(expireDate)}`;
                prescription_body.appendChild(prescription_expire);


            } else {
                const noContent = document.createElement('div');
                noContent.className = 'text-center';
                const add_button = document.createElement('a')
                add_button.className = 'btn btn-primary';
                add_button.innerHTML = '<i class="bi bi-plus-circle-fill"> Add Prescription</i>';
                add_button.addEventListener('click', event => {
                    window.location.href = `/prescriptions/add/${appointment.appointmentId}`
                });
                noContent.appendChild(add_button);
                prescription_body.appendChild(noContent);

            }
        }
    } catch (err) {
        console.error(err)
    }


}

function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesFormatted} ${ampm}`;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

async function deletePrescription(prescriptionId) {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        [csrfHeader]: csrfToken
    });
    const response = await fetch(`http://localhost:8080/api/appointments/${appointment_id}/prescription/${prescriptionId}`,
        {
            method: 'DELETE',
            headers: headers
        });

    if (response.status === HttpStatus.NOT_FOUND) {
        console.log(response.statusText);
    } else if (response.status === HttpStatus.NO_CONTENT) {
        await loadAppointmentData();
        showToast("Prescription deleted!");
    }

}


function showToast(message) {
    let toastElement = document.querySelector('.toast');
    let toastBody = toastElement.querySelector('.toast-body');
    toastBody.innerText = message;

    let toast = new bootstrap.Toast(toastElement, {
        autohide: false
    });
    toast.show();

}

function removeQueryParam(paramToRemove) {
    // Create a URL object based on the current location
    const url = new URL(window.location);

    // Use URLSearchParams to work with the query string easily
    const queryParams = url.searchParams;

    // Remove the specified query parameter
    queryParams.delete(paramToRemove);

    // Update the URL without reloading the page
    history.pushState(null, '', url.pathname + '?' + queryParams.toString() + url.hash);
}





