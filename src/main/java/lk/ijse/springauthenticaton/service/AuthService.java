package lk.ijse.springauthenticaton.service;

import lk.ijse.springauthenticaton.JwtUtil.JwtUtil;
import lk.ijse.springauthenticaton.Role.Role;
import lk.ijse.springauthenticaton.dto.JwtResponse;
import lk.ijse.springauthenticaton.dto.LoginRequest;
import lk.ijse.springauthenticaton.dto.RefreshTokenRequest;
import lk.ijse.springauthenticaton.dto.RegisterRequest;
import lk.ijse.springauthenticaton.entity.User;
import lk.ijse.springauthenticaton.repo.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Map;
import java.util.Set;


@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;


    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository; this.passwordEncoder = passwordEncoder;
        this.authManager = authManager; this.jwtUtil = jwtUtil;
    }


    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .roles((req.getRoles()==null || req.getRoles().isEmpty()) ? Set.of(Role.ROLE_USER) : req.getRoles())
                .enabled(true)
                .build();
        userRepository.save(user);
    }


    public JwtResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        var principal = auth.getName(); // email
        String access = jwtUtil.generateAccessToken(principal, Map.of("scope", "api"));
        String refresh = jwtUtil.generateRefreshToken(principal);
        return new JwtResponse(access, refresh);
    }


    public JwtResponse refresh(RefreshTokenRequest req) {
        if (!jwtUtil.validate(req.getRefreshToken())) throw new IllegalArgumentException("Invalid refresh token");
        String email = jwtUtil.getSubject(req.getRefreshToken());
        String access = jwtUtil.generateAccessToken(email, Map.of("scope", "api"));
        String refresh = jwtUtil.generateRefreshToken(email); // rotate refresh token
        return new JwtResponse(access, refresh);
    }
}
