package com.trustserve.service;
import com.trustserve.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.List;

@Service
public class BookingFileService {
    @Value("${app.export-dir:./data}") private String exportDir;
    public Path export(List<Booking> bookings) {
        try {
            Path dir=Paths.get(exportDir); Files.createDirectories(dir);
            Path file=dir.resolve("bookings-export.csv");
            try(BufferedWriter w=Files.newBufferedWriter(file)) {
                w.write("id,customer,email,service,status"); w.newLine();
                for(Booking b:bookings) {
                    w.write(String.join(",",safe(String.valueOf(b.getId())),safe(b.getCustomerName()),safe(b.getEmail()),safe(b.getService()),safe(b.getStatus())));
                    w.newLine();
                }
            }
            return file;
        } catch(IOException e){throw new UncheckedIOException("Could not export bookings",e);}
    }
    private String safe(String value){return "\""+value.replace("\"","\"\"")+"\"";}
}
