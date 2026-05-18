package com.virtualpet.backend.auth.api;

import com.virtualpet.backend.auth.dto.AuthDtos.AuthResponse;
import com.virtualpet.backend.auth.dto.AuthDtos.ForgotPasswordRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.LoginRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.MessageResponse;
import com.virtualpet.backend.auth.dto.AuthDtos.RegisterRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.ResetPasswordRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.UserResponse;
import com.virtualpet.backend.auth.service.AuthService;
import com.virtualpet.backend.auth.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        return authService.me();
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return passwordResetService.requestReset(request);
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return passwordResetService.resetPassword(request);
    }
}
