package lk.ijse.springauthenticaton.controller;



import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
public class AdminOnlyController {
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public String secureStats() {
        return "Only admins can see this";
    }
}
