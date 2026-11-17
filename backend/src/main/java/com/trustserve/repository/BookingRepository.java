
package com.trustserve.repository;

import com.trustserve.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings belonging to a particular customer
    List<Booking> findByEmailIgnoreCase(String email);

}
