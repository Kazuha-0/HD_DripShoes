package com.dripshoes.backend.services;

import com.dripshoes.backend.dto.SolicitudRegistro;
import com.dripshoes.backend.models.Rol;
import com.dripshoes.backend.models.Usuario;
import com.dripshoes.backend.repositories.RolRepository;
import com.dripshoes.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UsuarioServicio {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public Usuario registrar(SolicitudRegistro solicitud) {
        if (usuarioRepository.existsByEmail(solicitud.getEmail())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(solicitud.getNombre());
        usuario.setApellido(solicitud.getApellido());
        usuario.setCelular(solicitud.getCelular());
        usuario.setEmail(solicitud.getEmail());
        usuario.setPassword(passwordEncoder.encode(solicitud.getPassword()));

        Rol rolUsuario = rolRepository.findByNombre("ROLE_USUARIO")
                .orElseThrow(() -> new IllegalStateException("Rol ROLE_USUARIO no existe. Revisa el SembradorDatos."));

        Set<Rol> roles = new HashSet<>();
        roles.add(rolUsuario);
        usuario.setRoles(roles);

        return usuarioRepository.save(usuario);
    }
}