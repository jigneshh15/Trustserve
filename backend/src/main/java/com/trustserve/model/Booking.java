package com.trustserve.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="bookings")
public class Booking {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @NotBlank private String customerName;
    @NotBlank @Email private String email;
    @NotBlank private String phone;
    @NotBlank private String service;
    @NotBlank private String address;
    private LocalDate preferredDate;
    @Column(length=1000) private String details;
    private String status = "REQUESTED";
    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}
    public Booking(String customerName,String email,String phone,String service,String address,LocalDate preferredDate,String details) {
        this.customerName=customerName;this.email=email;this.phone=phone;this.service=service;this.address=address;this.preferredDate=preferredDate;this.details=details;
    }
    public Long getId(){return id;} public String getCustomerName(){return customerName;}
    public String getEmail(){return email;} public String getPhone(){return phone;}
    public String getService(){return service;} public String getAddress(){return address;}
    public LocalDate getPreferredDate(){return preferredDate;} public String getDetails(){return details;}
    public String getStatus(){return status;} public LocalDateTime getCreatedAt(){return createdAt;}
    public void setStatus(String status){this.status=status;}
    public void setEmail(String email) {
    this.email = email;
    }
}
