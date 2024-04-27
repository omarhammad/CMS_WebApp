package com.example.clinicmanagementsystem.controllers.dtos.patients;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdatePatientRequestDTO {


    private int patientId;
    @NotBlank(message = "First Name must be provided!")
    private String firstName;
    @NotBlank(message = "Last Name must be provided!")
    private String lastName;
    private String gender;

    @NotBlank(message = "National Number must be provided!")
    @Pattern(regexp = "^\\d{2}\\.\\d{2}\\.\\d{2}-\\d{3}\\.\\d{2}$", message = "National Number must be provided e.g 'yy.mm.dd-xxx.cd' ")
    private String nationalNumber;

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNationalNumber() {
        return nationalNumber;
    }

    public void setNationalNumber(String nationalNumber) {
        this.nationalNumber = nationalNumber;
    }
}