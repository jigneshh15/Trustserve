
package com.trustserve.service;

import com.trustserve.exception.BookingException;
import com.trustserve.model.Booking;
import com.trustserve.repository.BookingRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.*;

@Service
public class BookingService {

    private final BookingRepository repository;

    private final ExecutorService executor =
            Executors.newFixedThreadPool(2);

    public BookingService(BookingRepository repository) {
        this.repository = repository;
    }

    // Create a booking
    public Booking create(Booking booking) {

        if (booking.getPreferredDate() != null &&
                booking.getPreferredDate().isBefore(java.time.LocalDate.now())) {

            throw new BookingException(
                    "Preferred date cannot be in the past."
            );
        }

        return repository.save(booking);
    }

    // Get all bookings (Admin)
    public List<Booking> all() {
        return repository.findAll();
    }

    // Get bookings belonging to one customer
    public List<Booking> findByCustomerEmail(String email) {
        return repository.findByEmailIgnoreCase(email);
    }

    // Update booking status (Admin)
    public Booking updateStatus(Long id, String status) {

        Booking booking = repository.findById(id)
                .orElseThrow(() ->
                        new BookingException("Booking not found: " + id)
                );

        booking.setStatus(status.toUpperCase());

        return repository.save(booking);
    }

    // Background task for counting bookings
    public CompletableFuture<Integer> countBookingsAsync() {

        return CompletableFuture
                .supplyAsync(repository::findAll, executor)
                .thenApply(List::size);
    }

    public void shutdown() {
        executor.shutdown();
    }
}
