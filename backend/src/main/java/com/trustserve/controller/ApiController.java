
package com.trustserve.controller;

import com.trustserve.model.*;
import com.trustserve.service.*;

import jakarta.validation.Valid;

import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final BookingService bookings;
    private final BookingFileService files;

    public ApiController(
            BookingService bookings,
            BookingFileService files) {
        this.bookings = bookings;
        this.files = files;
    }

    // Backend health check
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "application", "TrustServe API"
        );
    }

    // Available services
    @GetMapping("/services")
    public List<ServiceItem> services() {
        return List.of(
                new ServiceItem("cleaning", "Home Cleaning",
                        "Deep cleaning and home care", 799),
                new ServiceItem("plumbing", "Plumbing",
                        "Repairs, leaks and fittings", 399),
                new ServiceItem("electrical", "Electrical Work",
                        "Installation and repairs", 499),
                new ServiceItem("tutoring", "Tutoring",
                        "Personal subject tutoring", 599)
        );
    }

    // Admin: Get all bookings
    @GetMapping("/bookings")
    public List<Booking> all() {
        return bookings.all();
    }

    // Customer: Get only their own bookings
    @GetMapping("/bookings/my")
    public List<Booking> myBookings(Authentication authentication) {

        String customerEmail = authentication.getName();

        return bookings.findByCustomerEmail(customerEmail);
    }

    // Create a booking
    @PostMapping("/bookings")
public ResponseEntity<Booking> create(
        @Valid @RequestBody Booking booking,
        Authentication authentication) {

    // Always use the logged-in customer's email
    booking.setEmail(authentication.getName());

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(bookings.create(booking));
}

    // Admin: Update booking status
    @PatchMapping("/bookings/{id}/status")
    public Booking status(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return bookings.updateStatus(
                id,
                body.getOrDefault("status", "REQUESTED")
        );
    }

    // Admin: Booking count
    @GetMapping("/metrics/bookings")
    public Map<String, Integer> count() throws Exception {
        return Map.of(
                "total",
                bookings.countBookingsAsync().get()
        );
    }

    // Admin: Export bookings
    @PostMapping("/admin/export")
    public Map<String, String> export() {
        return Map.of(
                "file",
                files.export(bookings.all()).toString()
        );
    }
}
