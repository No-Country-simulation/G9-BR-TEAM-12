package br.com.powerpolis.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Resposta do serviço Python de IA (POST /predict) referente ao Contrato interno
 * contrato-api.md v0.7, seção 4: os 4 campos (categoria, probabilidade,
 * recomendacoes, custo_estimado_mensal) são todos calculados pelo Python,
 * não pelo Backend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelPrediction {

    @JsonProperty("categoria")
    private String categoria;
    @JsonProperty("probabilidade")
    private Double probabilidade;
    @JsonProperty("recomendacoes")
    private List<String> recomendacoes;
    @JsonProperty("custo_estimado_mensal")
    private Double custoEstimadoMensal;
}