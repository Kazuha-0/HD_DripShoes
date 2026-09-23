package com.dripshoes.backend.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class UtilJwt {

    // En producción esta clave va en una variable de entorno, nunca en el código
    @Value("${jwt.secret:CAMBIA_ESTA_CLAVE_POR_UNA_LARGA_Y_SEGURA_1234567890}")
    private String claveSecreta;

    @Value("${jwt.expiration:86400000}") // 24 horas
    private long expiracionMs;

    private SecretKey obtenerClave() {
        return Keys.hmacShaKeyFor(claveSecreta.getBytes());
    }

    public String generarToken(UserDetails userDetails) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expiracionMs);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(obtenerClave())
                .compact();
    }

    public String extraerEmail(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean esTokenValido(String token, UserDetails userDetails) {
        String email = extraerEmail(token);
        return email.equals(userDetails.getUsername()) && !estaExpirado(token);
    }

    private boolean estaExpirado(String token) {
        return extraerClaims(token).getExpiration().before(new Date());
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(obtenerClave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}