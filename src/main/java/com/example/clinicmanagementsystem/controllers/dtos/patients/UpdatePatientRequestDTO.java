package com.example.clinicmanagementsystem.controllers.dtos.patients;

import jakarta.validation.constraints.Email;
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

    @NotBlank(message = "Phone Number must be provided!")
    @Pattern(regexp = "(^\\+|00)\\d{1,3}[\\s-]?\\d{1,4}[\\s-]?\\d{1,4}[\\s-]?\\d{1,4}$", message = "Phone number format should be '+32xxx xxxxxx' ")
    private String phoneNumber;

    @NotBlank(message = "Email must be provided!")
    @Email(message = "Email format should be 'example@email.com' ")
    private String email;

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


    public @NotBlank(message = "Phone Number must be provided!") @Pattern(regexp = "(^\\+|00)\\d{1,3}[\\s-]?\\d{1,4}[\\s-]?\\d{1,4}[\\s-]?\\d{1,4}$", message = "Phone number format should be '+32xxx xxxxxx' ") String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(@NotBlank(message = "Phone Number must be provided!") @Pattern(regexp = "(^\\+|00)\\d{1,3}[\\s-]?\\d{1,4}[\\s-]?\\d{1,4}[\\s-]?\\d{1,4}$", message = "Phone number format should be '+32xxx xxxxxx' ") String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public @NotBlank(message = "Email must be provided!") @Email(message = "Email format should be 'example@email.com' ") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email must be provided!") @Email(message = "Email format should be 'example@email.com' ") String email) {
        this.email = email;
    }
}
