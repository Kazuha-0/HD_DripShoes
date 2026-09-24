package com.dripshoes.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudLogin {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}