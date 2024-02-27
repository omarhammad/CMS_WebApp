package com.example.clinicmanagementsystem.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor extends Stakeholder {


    @Column(nullable = false)
    private String specialization;
    @Column(nullable = false, unique = true)
    private String contactInfo;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "doctor")
    private List<Appointment> appointment;


    public Doctor() {
        appointment = new ArrayList<>();
    }

    public Doctor(int id) {
        super(id);
    }

    public Doctor(int id, String firstName, String lastName, String specialization, String contactInfo) {
        super(id);
        super.setFirstName(firstName);
        super.setLastName(lastName);
        this.specialization = specialization;
        this.contactInfo = contactInfo;
    }

    public Doctor(String firstName, String lastName, String specialization, String contactInfo) {
        super.setFirstName(firstName);
        super.setLastName(lastName);
        this.specialization = specialization;
        this.contactInfo = contactInfo;
    }


    public String getFirstName() {
        return super.getFirstName();
    }

    public void setFirstName(String firstName) {
        super.setFirstName(firstName);
    }

    public String getLastName() {
        return super.getLastName();
    }

    public void setLastName(String lastName) {
        super.setLastName(lastName);
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }


    public List<Appointment> getAppointment() {
        return appointment;
    }

    public void setAppointment(List<Appointment> appointment) {
        this.appointment = appointment;
    }

    @Override
    public String toString() {
        return "Doctor{" +
                ", firstName='" + this.getFirstName() + '\'' +
                ", lastName='" + this.getLastName() + '\'' +
                ", specialization='" + specialization + '\'' +
                ", contactInfo='" + contactInfo + '\'' +
                '}';
    }
}