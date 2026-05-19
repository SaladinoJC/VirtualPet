package com.virtualpet.backend.auth.service;

import com.virtualpet.backend.auth.domain.PasswordResetTokenEntity;
import com.virtualpet.backend.auth.domain.UserEntity;
import com.virtualpet.backend.auth.dto.AuthDtos.ForgotPasswordRequest;
import com.virtualpet.backend.auth.dto.AuthDtos.MessageResponse;
import com.virtualpet.backend.auth.dto.AuthDtos.ResetPasswordRequest;
import com.virtualpet.backend.auth.repository.PasswordResetTokenRepository;
import com.virtualpet.backend.auth.repository.UserRepository;
import com.virtualpet.backend.shared.config.VirtualPetProperties;
import com.virtualpet.backend.shared.exception.ApiException;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final String GENERIC_MESSAGE =
            "Si el email está registrado, recibirás un enlace para restablecer la contraseña.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetMailService mailService;
    private final VirtualPetProperties properties;

    @Transactional
    public MessageResponse requestReset(ForgotPasswordRequest request) {
        String email = request.email().toLowerCase();
        userRepository.findByEmailIgnoreCase(email).ifPresent(this::createAndSendToken);
        return new MessageResponse(GENERIC_MESSAGE);
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetTokenEntity tokenEntity = tokenRepository
                .findByTokenAndUsedAtIsNull(request.token())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "El enlace no es válido o ya fue usado"));

        if (tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El enlace expiró. Solicitá uno nuevo.");
        }

        UserEntity user = tokenEntity.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        tokenEntity.setUsedAt(Instant.now());
        invalidateActiveTokens(user.getId());
        return new MessageResponse("Contraseña actualizada. Ya podés iniciar sesión.");
    }

    private void createAndSendToken(UserEntity user) {
        invalidateActiveTokens(user.getId());

        String tokenValue = UUID.randomUUID().toString().replace("-", "");
        PasswordResetTokenEntity token = new PasswordResetTokenEntity();
        token.setId(UUID.randomUUID());
        token.setUser(user);
        token.setToken(tokenValue);
        token.setExpiresAt(Instant.now().plusSeconds(3600));
        tokenRepository.save(token);

        String resetUrl = properties.getApp().getFrontendUrl() + "/reset-password?token=" + tokenValue;
        mailService.sendResetLink(user.getEmail(), resetUrl);
    }

    private void invalidateActiveTokens(UUID userId) {
        Instant now = Instant.now();
        for (PasswordResetTokenEntity active : tokenRepository.findByUser_IdAndUsedAtIsNull(userId)) {
            active.setUsedAt(now);
        }
    }
}
