package com.dripshoes.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudRegistro {

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @Pattern(regexp = "\\d{9}", message = "El celular debe tener 9 dígitos")
    private String celular;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
}