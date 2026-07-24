package br.com.powerpolis.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


/**
 * Corpo de saída de POST /analise-energetica.
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnaliseEnergeticaResponse {

    private String categoria;

    private Double probabilidade;

    private List<String> recomendacoes;

    @JsonProperty("custo_estimado_mensal")
    private Double custoEstimadoMensal;
}