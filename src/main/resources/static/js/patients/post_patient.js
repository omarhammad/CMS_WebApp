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
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', addNewPatient);

async function addNewPatient() {

    const patientJson = getFormData();
    const csrf_token = document.querySelector('meta[name="_csrf"]').getAttribute('content')
    const csrf_header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        [csrf_header]: csrf_token
    }
    const response = await fetch('http://localhost:8080/api/patients',
        {
            method: 'POST',
            headers: headers,
            body: patientJson
        });


    if (response.status === HttpStatus.BAD_REQUEST) {
        const data = await response.json();
        if (data.hasOwnProperty('exceptionMsg')) {
            showToast(data.exceptionMsg);
        } else {
            handleFieldsError(data);
        }
    } else if (response.status === HttpStatus.CREATED) {
        window.location.href = "/patients?created=true"
    }

}


function getFormData() {

    const form = document.getElementById('form');
    const formData = new FormData(form);
    const formJson = {};
    for (const [key, value] of formData.entries()) {
        formJson[key] = value;
    }
    return JSON.stringify(formJson);
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

function handleFieldsError(fieldsErrors) {

    const ulElements = document.querySelectorAll('ul');
    ulElements.forEach(ul => {
        ul.innerHTML = null;
    })


    if (fieldsErrors.hasOwnProperty('firstName')) {
        document.getElementById('first_name')
            .parentElement.appendChild(getFieldsErrorElementList(fieldsErrors.firstName));

    }
    if (fieldsErrors.hasOwnProperty('lastName')) {
        document.getElementById('last_name')
            .parentElement.appendChild(getFieldsErrorElementList(fieldsErrors.lastName));

    }

    if (fieldsErrors.hasOwnProperty('nationalNumber')) {
        document.getElementById('national_num')
            .parentElement.appendChild(getFieldsErrorElementList(fieldsErrors.nationalNumber));

    }


}

function getFieldsErrorElementList(errors) {

    const ulElement = document.createElement('ul');
    ulElement.className = "custom-bullet";
    errors = errors.split(';');
    for (const error of errors) {
        const ilElement = document.createElement('il');
        ilElement.className = 'form-error';
        ilElement.innerText = '* ' + error;
        ulElement.appendChild(ilElement);

        ulElement.appendChild(document.createElement('br'))
    }

    return ulElement;

}


