package com.virtualpet.backend.auth.service;

import com.virtualpet.backend.auth.domain.UserEntity;
import com.virtualpet.backend.auth.domain.UserRole;
import com.virtualpet.backend.auth.dto.AuthDtos.AuthResponse;
import com.virtualpet.backend.auth.dto.AuthDtos.LoginRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.RegisterRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.UserResponse;
import com.virtualpet.backend.auth.repository.UserRepository;
import com.virtualpet.backend.shared.exception.ApiException;
import com.virtualpet.backend.shared.security.JwtService;
import com.virtualpet.backend.shared.security.SecurityUtils;
import com.virtualpet.backend.shared.security.UserPrincipal;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "El email ya está registrado");
        }
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.CUSTOMER);
        user.setName(request.name());
        user.setAddress(request.address());
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password()));
        UserEntity user = userRepository
                .findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
        return buildAuthResponse(user);
    }

    public UserResponse me() {
        UserPrincipal principal = SecurityUtils.currentUser();
        UserEntity user = userRepository
                .findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return toUserResponse(user);
    }

    public UserEntity getById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    private AuthResponse buildAuthResponse(UserEntity user) {
        String token = jwtService.generate(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(UserEntity user) {
        return new UserResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name(),
                user.getName(),
                user.getAddress());
    }
}
