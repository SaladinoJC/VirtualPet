package com.virtualpet.backend.auth.service;

import com.virtualpet.backend.auth.domain.UserEntity;
import com.virtualpet.backend.auth.domain.UserRole;
import com.virtualpet.backend.auth.repository.UserRepository;
import com.virtualpet.backend.shared.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByEmailIgnoreCase(username)
                .map(u -> new UserPrincipal(
                        u.getId(),
                        u.getEmail(),
                        u.getPasswordHash(),
                        u.getRole().name(),
                        extraerNombre(u) // <-- Delegamos la extracción
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    private String extraerNombre(UserEntity u) {
        if (u.getRole() == UserRole.ROLE_CUSTOMER && u.getCustomerProfile() != null) {
            return u.getCustomerProfile().getName();
        } else if (u.getRole() == UserRole.ROLE_EMPLOYEE && u.getEmployeeProfile() != null) {
            return u.getEmployeeProfile().getName();
        }
        return "ROLE_ADMIN"; // Fallback para tu nuevo rol ADMIN
    }
}
