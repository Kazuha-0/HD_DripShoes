package com.dripshoes.backend.configuracion;

import com.dripshoes.backend.models.Rol;
import com.dripshoes.backend.models.Usuario;
import com.dripshoes.backend.repositories.RolRepository;
import com.dripshoes.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class SembradorDatos implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Crear roles si no existen
        Rol rolAdmin = rolRepository.findByNombre("ROLE_ADMIN")
                .orElseGet(() -> rolRepository.save(new Rol("ROLE_ADMIN")));

        if (rolRepository.findByNombre("ROLE_USUARIO").isEmpty()) {
            rolRepository.save(new Rol("ROLE_USUARIO"));
        }

        // 2. Crear usuario administrador si no existe
        String emailAdmin = "admin@dripshoes.com";

        if (usuarioRepository.findByEmail(emailAdmin).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("DripShoes");
            admin.setCelular("987654321");
            admin.setEmail(emailAdmin);
            admin.setPassword(passwordEncoder.encode("1234"));

            Set<Rol> roles = new HashSet<>();
            roles.add(rolAdmin);
            admin.setRoles(roles);

            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado: " + emailAdmin + " / 1234");
        }
    }
}