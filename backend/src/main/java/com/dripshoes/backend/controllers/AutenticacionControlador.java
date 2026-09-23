package com.dripshoes.backend.controllers;

import com.dripshoes.backend.dto.RespuestaAutenticacion;
import com.dripshoes.backend.dto.SolicitudLogin;
import com.dripshoes.backend.dto.SolicitudRegistro;
import com.dripshoes.backend.models.Usuario;
import com.dripshoes.backend.repositories.UsuarioRepository;
import com.dripshoes.backend.seguridad.UtilJwt;
import com.dripshoes.backend.services.UsuarioServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AutenticacionControlador {

    private final AuthenticationManager authenticationManager;
    private final UsuarioServicio usuarioServicio;
    private final UsuarioRepository usuarioRepositorio;
    private final UtilJwt utilJwt;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@Valid @RequestBody SolicitudRegistro solicitud) {
        try {
            Usuario usuario = usuarioServicio.registrar(solicitud);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Usuario registrado correctamente: " + usuario.getEmail());
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody SolicitudLogin solicitud) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(solicitud.getEmail(), solicitud.getPassword()));

            Usuario usuario = usuarioRepositorio.findByEmail(solicitud.getEmail())
                    .orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));

            User userDetails = (User) auth.getPrincipal();
            String token = utilJwt.generarToken(userDetails);

            List<String> roles = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            RespuestaAutenticacion respuesta = new RespuestaAutenticacion(
                    token, usuario.getId(), usuario.getNombre(), usuario.getEmail(), roles);

            return ResponseEntity.ok(respuesta);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }
    }
}