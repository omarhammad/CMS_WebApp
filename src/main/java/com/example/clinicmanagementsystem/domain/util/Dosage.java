package com.example.clinicmanagementsystem.domain.util;

import com.opencsv.bean.CsvBindByName;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.util.Objects;

@Embeddable
public class Dosage {

    @Enumerated(EnumType.STRING)
    @CsvBindByName(column = "Dosage Unit")
    private Unit unit;

    @CsvBindByName(column = "Dosage Quantity")
    private double quantity;

    public Dosage(Unit unit, double quantity) {
        this.unit = unit;
        this.quantity = quantity;
    }

    public Dosage() {

    }

    public Dosage changeUnit(Unit unit) {
        return new Dosage(unit, this.quantity);
    }

    public Dosage changeQuantity(double quantity) {
        return new Dosage(this.unit, quantity);
    }


    public Unit getUnit() {
        return unit;
    }

    public double getQuantity() {
        return quantity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dosage dosage = (Dosage) o;
        return Double.compare(quantity, dosage.quantity) == 0 && unit == dosage.unit;
    }


    @Override
    public int hashCode() {
        return Objects.hash(unit, quantity);
    }


    @Override
    public String toString() {
        return "%.0f %s".formatted(quantity, unit);
    }
}
