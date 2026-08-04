package br.com.powerpolis.model.dto;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Valores aceitos para tipo_imovel levando em conta o contrato-api.md v0.7.
 * 3 valores canônicos (Residencia, Comercial, Industria). "Casa" e
 * "Apartamento" são aceitos como sinônimos de Residencia, por
 * compatibilidade com o exemplo oficial do Hackatown.
 */
public enum TipoImovel {
    Residencia,
    Comercial,
    Industria;

    @JsonCreator
    public static TipoImovel fromValor(String valor) {
        if (valor == null) {
            return null;
        }
        return switch (valor) {
            case "Casa", "Apartamento", "Residencia" -> Residencia;
            case "Comercial" -> Comercial;
            case "Industria" -> Industria;
            default -> throw new IllegalArgumentException("tipo_imovel inválido: " + valor);
        };
    }
}