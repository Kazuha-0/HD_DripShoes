package com.dripshoes.backend.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class RespuestaAutenticacion {
    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String nombre;
    private String email;
    private List<String> roles;

    public RespuestaAutenticacion(String token, Long id, String nombre, String email, List<String> roles) {
        this.token = token;
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.roles = roles;
    }
}