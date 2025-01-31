package com.example.clinicmanagementsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.Interval;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long prescriptionId;
    private LocalDate expireDate;
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.DETACH, CascadeType.MERGE})
    private List<Medication> medications;

    @JsonIgnore
    @OneToOne(mappedBy = "prescription", fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    private Appointment appointment;


    public Prescription() {
    }

    public Prescription(long prescriptionId, LocalDate expireDate, List<Medication> medications, Appointment appointment) {
        this.prescriptionId = prescriptionId;
        this.expireDate = expireDate;
        this.medications = medications;
        this.appointment = appointment;
    }

    public long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public LocalDate getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(LocalDate expireDate) {
        this.expireDate = expireDate;
    }

    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }


    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }
}
