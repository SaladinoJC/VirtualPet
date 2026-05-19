package com.virtualpet.backend.auth.service;

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
                        u.getId(), u.getEmail(), u.getPasswordHash(), u.getRole().name(), u.getName()))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}
