package lk.ijse.springauthenticaton.dto;

import lk.ijse.springauthenticaton.Role.Role;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;

import java.util.Set;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank private String fullName;
    @Email @NotBlank private String email;
    @Size(min = 6) @NotBlank private String password;
    private Set<Role> roles; // optional; default USER if null
}
